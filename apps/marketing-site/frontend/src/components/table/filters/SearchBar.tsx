
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  theme: 'light' | 'dark';
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder,
  onKeyUp,
  theme
}) => {
  return (
    <div className="relative flex-1">
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyUp={onKeyUp}
        placeholder={placeholder}
        className={`pl-10 pr-10 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}`}
      />
      {searchTerm && (
        <button 
          onClick={() => setSearchTerm('')}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
