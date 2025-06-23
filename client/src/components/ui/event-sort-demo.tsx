"use client";

import { Button } from "@/components/ui/primitives/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/forms/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/primitives/popover";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import * as React from "react";
import { AnimateChangeInHeight } from "@/components/ui/event-sort";
import EventSort from "@/components/ui/event-sort";
import {
  Sort,
  SortField,
  SortDirection,
  SortOption,
  sortFieldOptions,
} from "@/components/ui/event-sort";

export function EventSortDemo({
  sorts,
  setSorts,
}: {
  sorts?: Sort[];
  setSorts?: React.Dispatch<React.SetStateAction<Sort[]>>;
} = {}) {
  const [open, setOpen] = React.useState(false);
  const [commandInput, setCommandInput] = React.useState("");
  const commandInputRef = React.useRef<HTMLInputElement>(null);
  const [internalSorts, setInternalSorts] = React.useState<Sort[]>([
    {
      id: 'default-date',
      field: SortField.DATE,
      direction: SortDirection.DESC
    }
  ]);
  
  // Use external sorts if provided, otherwise use internal state
  const currentSorts = sorts ?? internalSorts;
  const currentSetSorts = setSorts ?? setInternalSorts;

  const handleAddSort = (field: string) => {
    const newSort: Sort = {
      id: `sort-${Date.now()}`,
      field: field as SortField,
      direction: SortDirection.ASC,
    };
    currentSetSorts((prev) => [...prev, newSort]);
  };

  const selectedFields = currentSorts.map((sort) => sort.field);
  const availableFields = sortFieldOptions.filter(
    (option) => !selectedFields.includes(option.name)
  );

  return (
    <div className="flex gap-1 flex-wrap items-center">
      {/* EventSort component now handles its own display logic */}
      <EventSort sorts={currentSorts} setSorts={currentSetSorts} />
      
      {/* Add new sort button - only show when no sorts */}
      {currentSorts.length === 0 && (
        <Popover
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              setTimeout(() => {
                setCommandInput("");
              }, 200);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              size="sm"
              className="transition group h-6 text-xs items-center rounded-sm flex gap-1.5 px-2"
            >
              <ArrowUpDown className="size-3 shrink-0 transition-all text-muted-foreground group-hover:text-primary" />
              Sort
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[180px] p-0">
            <AnimateChangeInHeight>
              <Command>
                <CommandInput
                  placeholder="Sort by..."
                  className="h-9"
                  value={commandInput}
                  onInputCapture={(e) => {
                    setCommandInput(e.currentTarget.value);
                  }}
                  ref={commandInputRef}
                />
                <CommandList>
                  <CommandEmpty>No fields found.</CommandEmpty>
                  <CommandGroup>
                    {availableFields.map((option: SortOption) => (
                      <CommandItem
                        className="group text-muted-foreground flex gap-2 items-center"
                        key={option.name}
                        value={option.name}
                        onSelect={(currentValue) => {
                          handleAddSort(currentValue);
                          setTimeout(() => {
                            setCommandInput("");
                          }, 200);
                          setOpen(false);
                        }}
                      >
                        {option.icon}
                        <span className="text-accent-foreground">
                          {option.name}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </AnimateChangeInHeight>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
} 