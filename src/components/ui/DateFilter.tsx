'use client';

import { useState } from 'react';
import { Calendar, X } from 'lucide-react';

interface DateFilterProps {
  onApplyFilter: (startDate: string, endDate: string) => void;
  onClearFilter: () => void;
  className?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({
  onApplyFilter,
  onClearFilter,
  className = '',
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleApplyFilter = () => {
    onApplyFilter(startDate, endDate);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    onClearFilter();
  };

  return (
    <div className={`date-filter bg-white rounded-md border border-[#E4E7EB] p-3 ${className}`}>
      <div className="date-filter__header mb-2 flex justify-between items-center">
        <h3 className="date-filter__title text-[#2B4F60] font-semibold">Date Filter</h3>
      </div>
      
      <div className="date-filter__body flex flex-col sm:flex-row gap-3">
        <div className="date-filter__field relative">
          <label htmlFor="start-date" className="date-filter__label text-xs font-medium text-[#49617E] mb-1 block">
            Start Date
          </label>
          <div className="date-filter__input-wrapper relative">
            <Calendar size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#6F8591]" />
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-filter__input w-full pl-8 pr-3 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-sm text-[#333333]"
            />
          </div>
        </div>
        
        <div className="date-filter__field relative">
          <label htmlFor="end-date" className="date-filter__label text-xs font-medium text-[#49617E] mb-1 block">
            End Date
          </label>
          <div className="date-filter__input-wrapper relative">
            <Calendar size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#6F8591]" />
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-filter__input w-full pl-8 pr-3 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-sm text-[#333333]"
            />
          </div>
        </div>
        
        <div className="date-filter__actions flex items-end gap-2">
          <button
            onClick={handleApplyFilter}
            className="date-filter__apply-btn bg-[#007BF9] hover:bg-[#0063cc] text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Apply Filter
          </button>
          
          <button
            onClick={handleClearFilter}
            className="date-filter__clear-btn border border-[#E4E7EB] hover:bg-[#F5F5F5] text-[#49617E] px-3 py-2 rounded-md text-sm transition flex items-center"
          >
            <X size={16} className="mr-1" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateFilter;