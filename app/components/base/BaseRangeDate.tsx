"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BaseRangeDateProps {
  label?: string;
  className?: string;
  placeholder?: string;
  value: DateRange | undefined;
  setValue: (value: DateRange | undefined) => void;
}

export function BaseRangeDate({
  className,
  label,
  placeholder,
  value,
  setValue,
}: BaseRangeDateProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState<boolean>(false);

  const handlePopoverClose = () => {
    setIsPopoverOpen(false); // Close popover when submit button is clicked
  };

  return (
    <div className={cn("grid gap-2", className)}>
      
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full min-w-[200px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={setValue}
            numberOfMonths={2}
          />
          <div className="p-2">
            <Button variant="outline" onClick={handlePopoverClose}>
              Fermer
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
