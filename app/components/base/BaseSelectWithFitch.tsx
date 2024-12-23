"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axiosInstance from "@/lib/axiosInstance";

interface BaseSelectWithFetchProps {
  label?: string;
  placeholder?: string;
  labelOption?: string;
  valueOption?: string;
  fetchUrl?: string;
  data?: any;
  value: any;
  setValue: (value: any) => void;
}

export function BaseSelectWithFetch({
  label,
  placeholder,
  labelOption = "name",
  valueOption = "id",
  fetchUrl,
  value,
  data = [],
  setValue,
}: BaseSelectWithFetchProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Record<string, string>[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch data from the API or dynamic source
  React.useEffect(() => {
    async function fetchData() {
      try {
        if (!fetchUrl || fetchUrl === "") {
          if (data?.length > 0) {
            setOptions(data);
          }
          return;
        }
        const response = await axiosInstance.get(fetchUrl);
        setOptions(response.data);
      } catch (error) {
        setOptions([]);
        console.error("Failed to fetch options:", error);
      }
    }

    fetchData();
  }, [fetchUrl]);

  // Update options when `data` prop changes
  React.useEffect(() => {
    if (!fetchUrl || fetchUrl === "") {
      if (data?.length > 0) {
        setOptions(data);
      } else {
        setOptions([]);
      }
    }
  }, [data]);

  const filteredOptions = options.filter((option) =>
    option[labelOption]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full min-w-[200px]  justify-between"
          >
            {value
              ? options.find(
                  (option) => option[valueOption].toString() === value
                )?.[labelOption]
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search..."
              className="h-9"
              onInput={(e) =>
                setSearchQuery((e.target as HTMLInputElement).value)
              }
            />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option[valueOption]}
                    value={option[valueOption].toString()}
                    onSelect={(currentValue) => {
                      const newValue =
                        currentValue === value ? null : currentValue;

                      setValue(newValue);
                      setOpen(false);
                    }}
                  >
                    {option[labelOption]}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === option[valueOption]
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              {/* Add a "Clear Selection" option */}
              {value && (
                <CommandGroup>
                  <CommandItem
                    value=""
                    onSelect={() => {
                      setValue(null);
                      setOpen(false);
                    }}
                    className="text-red-500"
                  >
                    Effacer la sélection
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
