param(
  [int]$Seconds = 60,
  [int]$IntervalSeconds = 1,
  [string]$OutputDir = "perf-reports",
  [string[]]$RootProcessNames = @("Vibe Time", "vibe-time", "app"),
  [switch]$IncludeAllWebView2
)

$ErrorActionPreference = "Stop"

if ($Seconds -lt 1) {
  throw "Seconds must be at least 1."
}

if ($IntervalSeconds -lt 1) {
  throw "IntervalSeconds must be at least 1."
}

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$outputPath = Join-Path $root $OutputDir
New-Item -ItemType Directory -Force -Path $outputPath | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$csvPath = Join-Path $outputPath "tauri-dev-$timestamp.csv"
$summaryPath = Join-Path $outputPath "tauri-dev-$timestamp.summary.txt"
$logicalProcessors = [Math]::Max(1, [Environment]::ProcessorCount)

function Get-TargetProcessIds {
  $allProcesses = Get-Process
  $childrenByParentId = @{}

  foreach ($processInfo in $allProcesses) {
    $parentProcess = try { $processInfo.Parent } catch { $null }
    if ($null -eq $parentProcess) {
      continue
    }

    $parentId = [int]$parentProcess.Id
    if (-not $childrenByParentId.ContainsKey($parentId)) {
      $childrenByParentId[$parentId] = New-Object System.Collections.Generic.List[int]
    }
    $childrenByParentId[$parentId].Add([int]$processInfo.Id)
  }

  $rootIds = @(
    $allProcesses |
      Where-Object {
        $candidateName = $_.ProcessName
        $RootProcessNames | Where-Object { $candidateName -eq $_ }
      } |
      ForEach-Object { [int]$_.Id }
  )

  $targetIds = New-Object System.Collections.Generic.HashSet[int]
  $queue = New-Object System.Collections.Generic.Queue[int]

  foreach ($rootId in $rootIds) {
    [void]$targetIds.Add($rootId)
    $queue.Enqueue($rootId)
  }

  while ($queue.Count -gt 0) {
    $parentId = $queue.Dequeue()
    if (-not $childrenByParentId.ContainsKey($parentId)) {
      continue
    }

    foreach ($childId in $childrenByParentId[$parentId]) {
      if ($targetIds.Add($childId)) {
        $queue.Enqueue($childId)
      }
    }
  }

  if ($IncludeAllWebView2) {
    $allProcesses |
      Where-Object { $_.ProcessName -eq "msedgewebview2" } |
      ForEach-Object { [void]$targetIds.Add([int]$_.Id) }
  }

  $targetIds
}

function Get-MatchingProcesses {
  $targetIds = Get-TargetProcessIds
  if ($targetIds.Count -eq 0) {
    return @()
  }

  $targetIdSet = @{}
  foreach ($targetId in $targetIds) {
    $targetIdSet[[int]$targetId] = $true
  }

  Get-Process |
    Where-Object { $targetIdSet.ContainsKey([int]$_.Id) } |
    Sort-Object Id
}

function New-SampleRows {
  param(
    [hashtable]$PreviousCpuById,
    [double]$ElapsedSeconds
  )

  $now = Get-Date
  $rows = @()

  foreach ($process in Get-MatchingProcesses) {
    $cpuSeconds = if ($null -eq $process.CPU) { 0.0 } else { [double]$process.CPU }
    $previousCpu = if ($PreviousCpuById.ContainsKey($process.Id)) { $PreviousCpuById[$process.Id] } else { $cpuSeconds }
    $cpuPercent = (($cpuSeconds - $previousCpu) / [Math]::Max(0.001, $ElapsedSeconds) / $logicalProcessors) * 100

    $rows += [PSCustomObject]@{
      Timestamp = $now.ToString("o")
      Id = $process.Id
      ProcessName = $process.ProcessName
      CpuPercent = [Math]::Round([Math]::Max(0, $cpuPercent), 2)
      CpuSecondsTotal = [Math]::Round($cpuSeconds, 3)
      WorkingSetMB = [Math]::Round($process.WorkingSet64 / 1MB, 1)
      PrivateMemoryMB = [Math]::Round($process.PrivateMemorySize64 / 1MB, 1)
      PagedMemoryMB = [Math]::Round($process.PagedMemorySize64 / 1MB, 1)
      StartTime = try { $process.StartTime.ToString("o") } catch { "" }
    }
  }

  $rows
}

Write-Host "Sampling Tauri/WebView processes for $Seconds seconds..."
Write-Host "Root process names: $($RootProcessNames -join ', ')"
Write-Host "WebView2 mode: $(if ($IncludeAllWebView2) { 'all msedgewebview2 processes' } else { 'root process descendants only' })"
Write-Host "Output: $csvPath"
Write-Host ""
Write-Host "Start the app separately with: bun run tauri dev"
Write-Host ""

$previousCpuById = @{}
foreach ($process in Get-MatchingProcesses) {
  $previousCpuById[$process.Id] = if ($null -eq $process.CPU) { 0.0 } else { [double]$process.CPU }
}

$allRows = @()
$sampleCount = [Math]::Ceiling($Seconds / $IntervalSeconds)
$lastSampleAt = Get-Date

for ($index = 1; $index -le $sampleCount; $index++) {
  Start-Sleep -Seconds $IntervalSeconds

  $now = Get-Date
  $elapsed = ($now - $lastSampleAt).TotalSeconds
  $rows = New-SampleRows -PreviousCpuById $previousCpuById -ElapsedSeconds $elapsed

  foreach ($process in Get-MatchingProcesses) {
    $previousCpuById[$process.Id] = if ($null -eq $process.CPU) { 0.0 } else { [double]$process.CPU }
  }

  $lastSampleAt = $now
  $allRows += $rows

  $totalCpu = [Math]::Round(($rows | Measure-Object CpuPercent -Sum).Sum, 2)
  $totalMemory = [Math]::Round(($rows | Measure-Object WorkingSetMB -Sum).Sum, 1)
  Write-Host ("{0,3}/{1}: processes={2}, cpu={3}%, workingSet={4}MB" -f $index, $sampleCount, $rows.Count, $totalCpu, $totalMemory)
}

if ($allRows.Count -eq 0) {
  "No matching processes found. Start the app with `bun run tauri dev`, then run this script again." | Set-Content -Path $summaryPath -Encoding utf8
  Write-Host ""
  Write-Host "No matching processes found."
  exit 1
}

$allRows | Export-Csv -Path $csvPath -NoTypeInformation -Encoding utf8

$summaryRows = $allRows |
  Group-Object ProcessName |
  ForEach-Object {
    $items = $_.Group
    [PSCustomObject]@{
      ProcessName = $_.Name
      Samples = $items.Count
      AvgCpuPercent = [Math]::Round(($items | Measure-Object CpuPercent -Average).Average, 2)
      MaxCpuPercent = [Math]::Round(($items | Measure-Object CpuPercent -Maximum).Maximum, 2)
      AvgWorkingSetMB = [Math]::Round(($items | Measure-Object WorkingSetMB -Average).Average, 1)
      MaxWorkingSetMB = [Math]::Round(($items | Measure-Object WorkingSetMB -Maximum).Maximum, 1)
      MaxPrivateMemoryMB = [Math]::Round(($items | Measure-Object PrivateMemoryMB -Maximum).Maximum, 1)
    }
  } |
  Sort-Object ProcessName

$totalsByTimestamp = $allRows |
  Group-Object Timestamp |
  ForEach-Object {
    [PSCustomObject]@{
      Timestamp = $_.Name
      TotalCpuPercent = ($_.Group | Measure-Object CpuPercent -Sum).Sum
      TotalWorkingSetMB = ($_.Group | Measure-Object WorkingSetMB -Sum).Sum
      TotalPrivateMemoryMB = ($_.Group | Measure-Object PrivateMemoryMB -Sum).Sum
    }
  }

$summary = @()
$summary += "Tauri dev resource summary"
$summary += "Generated: $(Get-Date -Format o)"
$summary += "DurationSeconds: $Seconds"
$summary += "IntervalSeconds: $IntervalSeconds"
$summary += "LogicalProcessors: $logicalProcessors"
$summary += "RootProcessNames: $($RootProcessNames -join ', ')"
$summary += "IncludeAllWebView2: $IncludeAllWebView2"
$summary += "CSV: $csvPath"
$summary += ""
$summary += "Per-process:"
$summary += ($summaryRows | Format-Table -AutoSize | Out-String).TrimEnd()
$summary += ""
$summary += "Totals:"
$summary += "AvgTotalCpuPercent: $([Math]::Round(($totalsByTimestamp | Measure-Object TotalCpuPercent -Average).Average, 2))"
$summary += "MaxTotalCpuPercent: $([Math]::Round(($totalsByTimestamp | Measure-Object TotalCpuPercent -Maximum).Maximum, 2))"
$summary += "AvgTotalWorkingSetMB: $([Math]::Round(($totalsByTimestamp | Measure-Object TotalWorkingSetMB -Average).Average, 1))"
$summary += "MaxTotalWorkingSetMB: $([Math]::Round(($totalsByTimestamp | Measure-Object TotalWorkingSetMB -Maximum).Maximum, 1))"
$summary += "MaxTotalPrivateMemoryMB: $([Math]::Round(($totalsByTimestamp | Measure-Object TotalPrivateMemoryMB -Maximum).Maximum, 1))"

$summary -join [Environment]::NewLine | Set-Content -Path $summaryPath -Encoding utf8

Write-Host ""
Write-Host ($summary -join [Environment]::NewLine)
