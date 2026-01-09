
import React from 'react';

interface CountryFlagProps {
  country: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ country }) => {
  const countryCode = getCountryCode(country);
  
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block w-4 h-3 bg-no-repeat bg-cover bg-center opacity-70" 
            style={{ 
              backgroundImage: `url('https://flagcdn.com/w20/${countryCode}.png')` 
            }}>
      </span>
      {country}
    </div>
  );
};

// Helper function to get country code for flags
const getCountryCode = (country: string): string => {
  const countryMap: Record<string, string> = {
    'China': 'cn',
    'Estados Unidos': 'us',
    'Alemanha': 'de',
    'Índia': 'in',
    'Japão': 'jp',
    'Coreia do Sul': 'kr',
    'Taiwan': 'tw',
    'Brasil': 'br'
  };
  
  return countryMap[country] || 'xx'; // xx is a placeholder for "unknown"
};

export default CountryFlag;
