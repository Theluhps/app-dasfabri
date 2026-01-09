
import React from 'react';
import { DatePicker } from '@/components/ui/date-picker';

interface DateFilterProps {
  filterDate: Date | undefined;
  setFilterDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

const DateFilter: React.FC<DateFilterProps> = ({ filterDate, setFilterDate }) => {
  return (
    <DatePicker
      selected={filterDate}
      onSelect={setFilterDate}
      placeholder="Filtrar por data"
    />
  );
};

export default DateFilter;
