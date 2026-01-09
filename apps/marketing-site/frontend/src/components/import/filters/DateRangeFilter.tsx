
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';

interface DateRange {
  start?: Date;
  end?: Date;
}

interface DateRangeFilterProps {
  filterDateRange: DateRange;
  setFilterDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ 
  filterDateRange, 
  setFilterDateRange 
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full flex justify-between">
          <span>Intervalo de datas</span>
          <Calendar className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 w-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data inicial</label>
            <DatePicker 
              selected={filterDateRange.start}
              onSelect={(date) => setFilterDateRange(prev => ({ ...prev, start: date }))}
              placeholder="Data inicial"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data final</label>
            <DatePicker 
              selected={filterDateRange.end}
              onSelect={(date) => setFilterDateRange(prev => ({ ...prev, end: date }))}
              placeholder="Data final"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setFilterDateRange({})}
            >
              Limpar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeFilter;
