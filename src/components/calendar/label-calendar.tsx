'use client';

import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import styles from './label-calendar.module.scss';
import {Button} from '@/components/ui/button';
import {CalendarIcon, ChevronDownIcon} from 'lucide-react';
import {Calendar} from '@/components/ui/calendar';
import {format} from 'date-fns';

interface Props {
  label: string;
  readonly?: boolean;
  selectedDate?: Date; // 추가: 외부에서 들어오는 날짜
  onDateChange?: (date: Date | undefined) => void; // 추가: 날짜가 바뀔 때 호출할 함수
}

// 'PPP': 지역화된 긴 날짜 형식 (예: "May 29th, 2023")

// 'yyyy-MM-dd': 표준 대시 형식 (예: "2023-05-29")

// 'PP': 중간 길이 형식 (예: "May 29, 2023")

function LabelCalendar({label, readonly, selectedDate, onDateChange}: Props) {
  return (
    <div className={styles.inner__container}>
      <span className={styles.inner__conainer__label}>{label}</span>
      {/* Shadcn UI - Calendar */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!selectedDate}
            className="w-[200px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : <span>Pick a date</span>}
            </div>
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        {!readonly && (
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={selectedDate} onSelect={onDateChange} defaultMonth={selectedDate} />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

export default LabelCalendar;
