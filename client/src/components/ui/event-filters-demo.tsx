"use client";

import { Button } from "@/components/ui/primitives/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/forms/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/primitives/popover";
import { cn } from "@/lib/utils";
import { ListFilter } from "lucide-react";
import { nanoid } from "nanoid";
import * as React from "react";
import { AnimateChangeInHeight } from "@/components/ui/event-filters";
import EventFilters from "@/components/ui/event-filters";
import {
  EventDate,
  Filter,
  FilterOperator,
  FilterOption,
  FilterType,
  filterViewOptions,
  filterViewToFilterOptions,
} from "@/components/ui/event-filters";

export function EventFiltersDemo({
  filters,
  setFilters,
}: {
  filters?: Filter[];
  setFilters?: React.Dispatch<React.SetStateAction<Filter[]>>;
} = {}) {
  const [open, setOpen] = React.useState(false);
  const [selectedView, setSelectedView] = React.useState<FilterType | null>(
    null
  );
  const [commandInput, setCommandInput] = React.useState("");
  const commandInputRef = React.useRef<HTMLInputElement>(null);
  const [internalFilters, setInternalFilters] = React.useState<Filter[]>([]);
  
  // Use external filters if provided, otherwise use internal state
  const currentFilters = filters ?? internalFilters;
  const currentSetFilters = setFilters ?? setInternalFilters;
  
  const activeFiltersCount = currentFilters.filter((filter) => filter.value?.length > 0).length;

  return (
    <div className="flex gap-1 flex-wrap items-center">
      {/* EventFilters component now handles its own display logic */}
      <EventFilters 
        filters={currentFilters} 
        setFilters={currentSetFilters}
      />
      

      
      {/* Add new filter button - only show when no filters or just one filter */}
      {activeFiltersCount < 2 && (
        <Popover
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              setTimeout(() => {
                setSelectedView(null);
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
              <ListFilter className="size-3 shrink-0 transition-all text-muted-foreground group-hover:text-primary" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <AnimateChangeInHeight>
              <Command>
                <CommandInput
                  placeholder={selectedView ? selectedView : "Filter..."}
                  className="h-9"
                  value={commandInput}
                  onInputCapture={(e) => {
                    setCommandInput(e.currentTarget.value);
                  }}
                  ref={commandInputRef}
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {selectedView ? (
                    <CommandGroup>
                      {filterViewToFilterOptions[selectedView].map(
                        (filter: FilterOption) => (
                          <CommandItem
                            className="group text-muted-foreground flex gap-2 items-center"
                            key={filter.name}
                            value={filter.name}
                            onSelect={(currentValue) => {
                              currentSetFilters((prev) => [
                                ...prev,
                                {
                                  id: nanoid(),
                                  type: selectedView,
                                  operator:
                                    selectedView === FilterType.DATE &&
                                    currentValue !== EventDate.TODAY
                                      ? FilterOperator.BEFORE
                                      : FilterOperator.IS,
                                  value: [currentValue],
                                },
                              ]);
                              setTimeout(() => {
                                setSelectedView(null);
                                setCommandInput("");
                              }, 200);
                              setOpen(false);
                            }}
                          >
                            {filter.icon}
                            <span className="text-accent-foreground">
                              {filter.name}
                            </span>
                            {filter.label && (
                              <span className="text-muted-foreground text-xs ml-auto">
                                {filter.label}
                              </span>
                            )}
                          </CommandItem>
                        )
                      )}
                    </CommandGroup>
                  ) : (
                    filterViewOptions.map(
                      (group: FilterOption[], index: number) => (
                        <React.Fragment key={index}>
                          <CommandGroup>
                            {group.map((filter: FilterOption) => (
                              <CommandItem
                                className="group text-muted-foreground flex gap-2 items-center"
                                key={filter.name}
                                value={filter.name}
                                onSelect={(currentValue) => {
                                  setSelectedView(currentValue as FilterType);
                                  setCommandInput("");
                                  commandInputRef.current?.focus();
                                }}
                              >
                                {filter.icon}
                                <span className="text-accent-foreground">
                                  {filter.name}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          {index < filterViewOptions.length - 1 && (
                            <CommandSeparator />
                          )}
                        </React.Fragment>
                      )
                    )
                  )}
                </CommandList>
              </Command>
            </AnimateChangeInHeight>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
} 