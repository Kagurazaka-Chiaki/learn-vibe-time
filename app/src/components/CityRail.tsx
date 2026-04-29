import { CITIES, type City } from "../data/cities";
import { formatCityTime } from "../domain/timeFormat";

type CityRailProps = {
  activeCity: City;
  now: Date;
  onSelectCity: (cityKey: string) => void;
};

export default function CityRail({ activeCity, now, onSelectCity }: CityRailProps) {
  return (
    <nav className="city-rail" aria-label="城市时间">
      {CITIES.map((city) => {
        const active = city.key === activeCity.key;
        const cityTime = formatCityTime(now, city.timeZone);

        return (
          <button
            key={city.key}
            type="button"
            className={`city-card${active ? " city-card-active" : ""}`}
            onClick={() => onSelectCity(city.key)}
            aria-pressed={active}
            aria-label={`${city.label} 当前时间 ${cityTime}`}
            title={`${city.label} ${cityTime}`}
          >
            <span className="city-label">{city.label}</span>
            <span className="city-time">{cityTime}</span>
          </button>
        );
      })}
    </nav>
  );
}
