import React, { useState } from 'react';
import { Country, State, City } from 'country-state-city';
import InputSelector from './InputSelect';

interface CitySelectorProps {
  country: string;
  onCityChange: (city: string, latitude: string, longitude: string) => void;
}

interface CityInfo {
  name: string;
  countryCode: string;
  stateCode: string;
  latitude: string;
  longitude: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({ country, onCityChange }) => {
  const [selectedCityInfos, setSelectedCityInfos] = useState<CityInfo[] | null>(null);

  const handleCityChange = (citySelect: string) => {
    console.log(`Selected city: ${citySelect}`);

    const cityParts = citySelect.split(" ");
    if (cityParts.length < 2) {
      // Invalid city format, handle the error accordingly
      return;
    }

    const cityName = cityParts[0];
    const stateCode = cityParts[1].replace(/[()]/g, "");

    if (citiesOfCountry) {
      const selectedCityInfo = citiesOfCountry
        .filter(city => city.name === cityName && city.stateCode === stateCode)
        .map(city => ({
          name: city.name,
          countryCode: city.countryCode,
          stateCode: city.stateCode,
          latitude: city.latitude || '',
          longitude: city.longitude || '',
        }));
      setSelectedCityInfos(selectedCityInfo.length > 0 ? selectedCityInfo : null);

      // Retrieve the latitude and longitude of the selected city
      const selectedCity = selectedCityInfo[0];
      const { latitude, longitude } = selectedCity;
      onCityChange(citySelect, latitude, longitude);
    }
  };

  const regex = /\((.*?)\)/;
  const match = country.match(regex);
  const countryCode = match ? match[1] : null;

  const citiesOfCountry = City.getCitiesOfCountry(countryCode || "US");
  const cities = citiesOfCountry?.map((city) => ({ label: `${city.name} (${city.stateCode})`, value: `${city.name} (${city.stateCode})` })) || [];

  return (
    <InputSelector locations={cities} onSelect={handleCityChange} />
  );
};

export default CitySelector;
