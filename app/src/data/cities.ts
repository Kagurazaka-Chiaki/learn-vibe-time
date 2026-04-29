export type City = {
  key: string;
  label: string;
  displayLabel?: string;
  timeZone: string;
  latitude: number;
  longitude: number;
  tagline?: string;
};

export const DEFAULT_CITY_KEY = "sydney";

export const CITIES: City[] = [
  {
    key: "newyork",
    label: "纽约",
    displayLabel: "美国纽约",
    timeZone: "America/New_York",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    key: "london",
    label: "伦敦",
    displayLabel: "英国伦敦",
    timeZone: "Europe/London",
    latitude: 51.5072,
    longitude: -0.1276,
  },
  {
    key: "paris",
    label: "巴黎",
    displayLabel: "法国巴黎",
    timeZone: "Europe/Paris",
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    key: "perth",
    label: "珀斯",
    displayLabel: "澳大利亚珀斯",
    timeZone: "Australia/Perth",
    latitude: -31.9523,
    longitude: 115.8613,
  },
  {
    key: "beijing",
    label: "北京",
    displayLabel: "中国北京",
    timeZone: "Asia/Shanghai",
    latitude: 39.9042,
    longitude: 116.4074,
  },
  {
    key: "tokyo",
    label: "东京",
    displayLabel: "日本东京",
    timeZone: "Asia/Tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    key: "adelaide",
    label: "阿德莱德",
    displayLabel: "澳大利亚阿德莱德",
    timeZone: "Australia/Adelaide",
    latitude: -34.9285,
    longitude: 138.6007,
  },
  {
    key: "sydney",
    label: "悉尼",
    displayLabel: "澳大利亚悉尼",
    timeZone: "Australia/Sydney",
    latitude: -33.8688,
    longitude: 151.2093,
    tagline: "Bat Appreciation Day",
  },
];

export function getCityByKey(key: string): City {
  return CITIES.find((city) => city.key === key) ?? CITIES[CITIES.length - 1];
}
