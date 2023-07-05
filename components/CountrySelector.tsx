import React, { useState } from 'react';
import { Country, State, City } from 'country-state-city';
import InputSelector from './InputSelect';
import CitySelector from './CitySelector';

interface CountrySelectorProps {
  onCoordinatesChange: (country: string, latitude: string, longitude: string) => void;
}

const CountrySelector = ({ onCoordinatesChange }: CountrySelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    console.log(`Selected country: ${country}`);
  }

  const handleCityChange = (city: string, latitude: string, longitude: string) => {
    // Access the latitude and longitude values here
    console.log(`Selected city: ${city}`);
    console.log(`Latitude: ${latitude}`);
    console.log(`Longitude: ${longitude}`);
    setSelectedCity(city);
    onCoordinatesChange(city, latitude, longitude);
  }

  const countries = Country.getAllCountries().map((country) => ({ label: country.name, value: `${country.name} (${country.isoCode})` })) || [];

  return (
    <>
      <InputSelector locations={countries} onSelect={handleCountryChange} />
      <CitySelector country={selectedCountry} onCityChange={handleCityChange} />
    </>
  );
}

export default CountrySelector;
