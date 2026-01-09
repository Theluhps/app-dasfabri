
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FilterOption } from '../AdvancedSearch';

interface FilterOptionsProps {
  filterOptions: FilterOption[];
  getFilterValue: (id: string) => string | string[] | boolean | null;
  handleFilterChange: (id: string, value: string | string[] | boolean | null) => void;
  theme: 'light' | 'dark';
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  filterOptions,
  getFilterValue,
  handleFilterChange,
  theme
}) => {
  return (
    <>
      {filterOptions.map((option) => (
        <div key={option.id} className="space-y-2">
          <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {option.label}
          </h4>
          
          {option.type === 'text' && (
            <Input
              value={(getFilterValue(option.id) as string) || ''}
              onChange={(e) => handleFilterChange(option.id, e.target.value || null)}
              className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
            />
          )}
          
          {option.type === 'checkbox' && option.options && (
            <div className="space-y-2">
              {option.options.map((opt) => {
                const currentValues = getFilterValue(option.id) as string[] || [];
                return (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${option.id}-${opt.value}`}
                      checked={currentValues.includes(opt.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleFilterChange(option.id, [...currentValues, opt.value]);
                        } else {
                          handleFilterChange(
                            option.id, 
                            currentValues.filter(v => v !== opt.value)
                          );
                        }
                      }}
                    />
                    <Label 
                      htmlFor={`${option.id}-${opt.value}`}
                      className={theme === 'dark' ? 'text-gray-300' : ''}
                    >
                      {opt.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          )}
          
          {option.type === 'select' && option.options && (
            <select
              value={(getFilterValue(option.id) as string) || ''}
              onChange={(e) => handleFilterChange(option.id, e.target.value || null)}
              className={`w-full rounded-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300'} px-3 py-2 text-sm`}
            >
              <option value="">Selecione...</option>
              {option.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
          
          {option.type === 'date' && (
            <Input
              type="date"
              value={(getFilterValue(option.id) as string) || ''}
              onChange={(e) => handleFilterChange(option.id, e.target.value || null)}
              className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default FilterOptions;
