import { Checkbox } from "@/components/ui/primitives/checkbox";
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/forms/command";
import { nanoid } from "nanoid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/forms/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/primitives/popover";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CalendarPlus,
  Check,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDotDashed,
  ListFilter,
  Plus,
  X,
  MapPin,
  Users,
  Globe,
  Monitor,
  Star,
} from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/primitives/button";
import { AnimatePresence, motion } from "motion/react";

interface AnimateChangeInHeightProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimateChangeInHeight: React.FC<AnimateChangeInHeightProps> = ({
  children,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const observedHeight = entries[0].contentRect.height;
        setHeight(observedHeight);
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <motion.div
      className={cn(className, "overflow-hidden")}
      style={{ height }}
      animate={{ height }}
      transition={{ duration: 0.1, dampping: 0.2, ease: "easeIn" }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
};

export enum FilterType {
  STATUS = "Status",
  CATEGORY = "Category", 
  EVENT_TYPE = "Event Type",
  DATE = "Date",
  FEATURED = "Filter Featured",
}

export enum FilterOperator {
  IS = "is",
  IS_NOT = "is not",
  IS_ANY_OF = "is any of",
  INCLUDE = "include",
  DO_NOT_INCLUDE = "do not include",
  INCLUDE_ALL_OF = "include all of",
  INCLUDE_ANY_OF = "include any of",
  EXCLUDE_ALL_OF = "exclude all of",
  EXCLUDE_IF_ANY_OF = "exclude if any of",
  BEFORE = "before",
  AFTER = "after",
}

export enum EventStatus {
  UPCOMING = "Upcoming",
  ONGOING = "Ongoing", 
  PAST = "Past",
}

export enum EventCategory {
  MEETUP = "Meetup",
  WORKSHOP = "Workshop",
  CONFERENCE = "Conference",
  WEBINAR = "Webinar",
  PITCH = "Pitch",
  NETWORKING = "Networking",
}

export enum EventType {
  ONLINE = "Online",
  OFFLINE = "Offline", 
  HYBRID = "Hybrid",
}

export enum EventDate {
  TODAY = "Today",
  TOMORROW = "Tomorrow", 
  THIS_WEEK = "This week",
  NEXT_WEEK = "Next week",
  THIS_MONTH = "This month",
  NEXT_MONTH = "Next month",
}

export enum Featured {
  FEATURED = "Featured",
  NOT_FEATURED = "Not Featured",
}

export type FilterOption = {
  name: FilterType | EventStatus | EventCategory | EventType | EventDate | Featured;
  icon: React.ReactNode | undefined;
  label?: string;
};

export type Filter = {
  id: string;
  type: FilterType;
  operator: FilterOperator;
  value: string[];
};

const FilterIcon = ({
  type,
}: {
  type: FilterType | EventStatus | EventCategory | EventType | Featured;
}) => {
  switch (type) {
    case FilterType.STATUS:
      return <CircleDashed className="size-3.5" />;
    case FilterType.CATEGORY:
      return <ListFilter className="size-3.5" />;
    case FilterType.EVENT_TYPE:
      return <Globe className="size-3.5" />;
    case FilterType.DATE:
      return <Calendar className="size-3.5" />;
    case FilterType.FEATURED:
      return <Star className="size-3.5" />;
    case EventStatus.UPCOMING:
      return <Circle className="size-3.5 text-blue-500" />;
    case EventStatus.ONGOING:
      return <CircleDotDashed className="size-3.5 text-green-500" />;
    case EventStatus.PAST:
      return <CircleCheck className="size-3.5 text-gray-500" />;
    case EventCategory.MEETUP:
      return <Users className="size-3.5 text-purple-500" />;
    case EventCategory.WORKSHOP:
      return <div className="bg-blue-400 rounded-full size-2.5" />;
    case EventCategory.CONFERENCE:
      return <div className="bg-green-400 rounded-full size-2.5" />;
    case EventCategory.WEBINAR:
      return <div className="bg-orange-400 rounded-full size-2.5" />;
    case EventCategory.PITCH:
      return <div className="bg-red-400 rounded-full size-2.5" />;
    case EventCategory.NETWORKING:
      return <div className="bg-teal-400 rounded-full size-2.5" />;
    case EventType.ONLINE:
      return <Monitor className="size-3.5 text-purple-500" />;
    case EventType.OFFLINE:
      return <MapPin className="size-3.5 text-blue-500" />;
    case EventType.HYBRID:
      return <Globe className="size-3.5 text-green-500" />;
    case Featured.FEATURED:
      return <Star className="size-3.5 text-yellow-500 fill-current" />;
    case Featured.NOT_FEATURED:
      return <Star className="size-3.5 text-gray-400" />;
    default:
      return <Circle className="size-3.5" />;
  }
};

export const filterViewOptions: FilterOption[][] = [
  [
    {
      name: FilterType.STATUS,
      icon: <FilterIcon type={FilterType.STATUS} />,
    },
    {
      name: FilterType.CATEGORY,
      icon: <FilterIcon type={FilterType.CATEGORY} />,
    },
    {
      name: FilterType.EVENT_TYPE,
      icon: <FilterIcon type={FilterType.EVENT_TYPE} />,
    },
  ],
  [
    {
      name: FilterType.DATE,
      icon: <FilterIcon type={FilterType.DATE} />,
    },
    {
      name: FilterType.FEATURED,
      icon: <FilterIcon type={FilterType.FEATURED} />,
    },
  ],
];

export const statusFilterOptions: FilterOption[] = [
  ...Object.values(EventStatus).map((status) => ({
    name: status,
    icon: <FilterIcon type={status} />,
  })),
  // Add "All" option for compatibility  
  {
    name: "All" as any,
    icon: <Circle className="size-3.5 text-gray-400" />,
  }
];

export const categoryFilterOptions: FilterOption[] = Object.values(EventCategory).map(
  (category) => ({
    name: category,
    icon: <FilterIcon type={category} />,
  })
);

export const eventTypeFilterOptions: FilterOption[] = Object.values(EventType).map(
  (eventType) => ({
    name: eventType,
    icon: <FilterIcon type={eventType} />,
  })
);

export const dateFilterOptions: FilterOption[] = Object.values(EventDate).map(
  (date) => ({
    name: date,
    icon: undefined,
  })
);

export const featuredFilterOptions: FilterOption[] = Object.values(Featured).map(
  (featured) => ({
    name: featured,
    icon: <FilterIcon type={featured} />,
  })
);

export const filterViewToFilterOptions: Record<FilterType, FilterOption[]> = {
  [FilterType.STATUS]: statusFilterOptions,
  [FilterType.CATEGORY]: categoryFilterOptions,
  [FilterType.EVENT_TYPE]: eventTypeFilterOptions,
  [FilterType.DATE]: dateFilterOptions,
  [FilterType.FEATURED]: featuredFilterOptions,
};

const filterOperators = ({
  filterType,
  filterValues,
}: {
  filterType: FilterType;
  filterValues: string[];
}) => {
  switch (filterType) {
    case FilterType.STATUS:
    case FilterType.EVENT_TYPE:
    case FilterType.FEATURED:
      if (Array.isArray(filterValues) && filterValues.length > 1) {
        return [FilterOperator.IS_ANY_OF, FilterOperator.IS_NOT];
      } else {
        return [FilterOperator.IS, FilterOperator.IS_NOT];
      }
    case FilterType.CATEGORY:
      if (Array.isArray(filterValues) && filterValues.length > 1) {
        return [
          FilterOperator.INCLUDE_ANY_OF,
          FilterOperator.INCLUDE_ALL_OF,
          FilterOperator.EXCLUDE_ALL_OF,
          FilterOperator.EXCLUDE_IF_ANY_OF,
        ];
      } else {
        return [FilterOperator.INCLUDE, FilterOperator.DO_NOT_INCLUDE];
      }
    case FilterType.DATE:
      return [FilterOperator.IS, FilterOperator.BEFORE, FilterOperator.AFTER];
    default:
      return [];
  }
};

const FilterOperatorDropdown = ({
  filterType,
  operator,
  filterValues,
  setOperator,
}: {
  filterType: FilterType;
  operator: FilterOperator;
  filterValues: string[];
  setOperator: (operator: FilterOperator) => void;
}) => {
  const operators = filterOperators({ filterType, filterValues });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-muted hover:bg-muted/50 px-1.5 py-1 text-muted-foreground hover:text-primary transition shrink-0">
        {operator}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit min-w-fit">
        {operators.map((operator) => (
          <DropdownMenuItem
            key={operator}
            onClick={() => setOperator(operator)}
          >
            {operator}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FilterValueCombobox = ({
  filterType,
  filterValues,
  setFilterValues,
}: {
  filterType: FilterType;
  filterValues: string[];
  setFilterValues: (filterValues: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const commandInputRef = useRef<HTMLInputElement>(null);
  const nonSelectedFilterValues = filterViewToFilterOptions[filterType]?.filter(
    (filter) => !filterValues.includes(filter.name)
  );
  return (
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
      <PopoverTrigger
        className="rounded-none px-1.5 py-1 bg-muted hover:bg-muted/50 transition
  text-muted-foreground hover:text-primary shrink-0"
      >
        <div className="flex gap-1.5 items-center">
          {filterType !== FilterType.FEATURED && (
            <div
              className={cn(
                "flex items-center flex-row",
                filterType === FilterType.CATEGORY ? "-space-x-1" : "-space-x-1.5"
              )}
            >
              <AnimatePresence mode="popLayout">
                {filterValues?.slice(0, 3).map((value) => (
                  <motion.div
                    key={value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FilterIcon type={value as FilterType} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          {filterValues?.length === 1
            ? filterValues?.[0]
            : `${filterValues?.length} selected`}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <AnimateChangeInHeight>
          <Command>
            <CommandInput
              placeholder={filterType}
              className="h-9"
              value={commandInput}
              onInputCapture={(e) => {
                setCommandInput(e.currentTarget.value);
              }}
              ref={commandInputRef}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filterValues.map((value) => (
                  <CommandItem
                    key={value}
                    className="group flex gap-2 items-center"
                    onSelect={() => {
                      setFilterValues(filterValues.filter((v) => v !== value));
                      setTimeout(() => {
                        setCommandInput("");
                      }, 200);
                      setOpen(false);
                    }}
                  >
                    <Checkbox checked={true} />
                    <FilterIcon type={value as FilterType} />
                    {value}
                  </CommandItem>
                ))}
              </CommandGroup>
              {nonSelectedFilterValues?.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    {nonSelectedFilterValues.map((filter: FilterOption) => (
                      <CommandItem
                        className="group flex gap-2 items-center"
                        key={filter.name}
                        value={filter.name}
                        onSelect={(currentValue: string) => {
                          setFilterValues([...filterValues, currentValue]);
                          setTimeout(() => {
                            setCommandInput("");
                          }, 200);
                          setOpen(false);
                        }}
                      >
                        <Checkbox
                          checked={false}
                          className="opacity-0 group-data-[selected=true]:opacity-100"
                        />
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
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </AnimateChangeInHeight>
      </PopoverContent>
    </Popover>
  );
};

const FilterValueDateCombobox = ({
  filterType,
  filterValues,
  setFilterValues,
}: {
  filterType: FilterType;
  filterValues: string[];
  setFilterValues: (filterValues: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const commandInputRef = useRef<HTMLInputElement>(null);
  return (
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
      <PopoverTrigger
        className="rounded-none px-1.5 py-1 bg-muted hover:bg-muted/50 transition
  text-muted-foreground hover:text-primary shrink-0"
      >
        {filterValues?.[0]}
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <AnimateChangeInHeight>
          <Command>
            <CommandInput
              placeholder={filterType}
              className="h-9"
              value={commandInput}
              onInputCapture={(e) => {
                setCommandInput(e.currentTarget.value);
              }}
              ref={commandInputRef}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filterViewToFilterOptions[filterType].map(
                  (filter: FilterOption) => (
                    <CommandItem
                      className="group flex gap-2 items-center"
                      key={filter.name}
                      value={filter.name}
                      onSelect={(currentValue: string) => {
                        setFilterValues([currentValue]);
                        setTimeout(() => {
                          setCommandInput("");
                        }, 200);
                        setOpen(false);
                      }}
                    >
                      <span className="text-accent-foreground">
                        {filter.name}
                      </span>
                      <Check
                        className={cn(
                          "ml-auto",
                          filterValues.includes(filter.name)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </AnimateChangeInHeight>
      </PopoverContent>
    </Popover>
  );
};

export default function EventFilters({
  filters,
  setFilters,
}: {
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showFilterSelector, setShowFilterSelector] = useState(false);
  const [selectedView, setSelectedView] = useState<FilterType | null>(null);
  const [commandInput, setCommandInput] = useState("");
  const commandInputRef = useRef<HTMLInputElement>(null);
  const activeFilters = filters.filter((filter) => filter.value?.length > 0);
  
  if (activeFilters.length === 0) {
    return null;
  }
  
  // If only one active filter, show it directly without clear button
  if (activeFilters.length === 1) {
    const filter = activeFilters[0];
    return (
      <div className="flex gap-[1px] items-center text-xs">
        <div className="flex gap-1.5 shrink-0 rounded-l bg-muted px-1.5 py-1 items-center">
          <FilterIcon type={filter.type} />
          {filter.type}
        </div>
        <FilterOperatorDropdown
          filterType={filter.type}
          operator={filter.operator}
          filterValues={filter.value}
          setOperator={(operator) => {
            setFilters((prev) =>
              prev.map((f) => (f.id === filter.id ? { ...f, operator } : f))
            );
          }}
        />
        {filter.type === FilterType.DATE ? (
          <FilterValueDateCombobox
            filterType={filter.type}
            filterValues={filter.value}
            setFilterValues={(filterValues) => {
              setFilters((prev) =>
                prev.map((f) =>
                  f.id === filter.id ? { ...f, value: filterValues } : f
                )
              );
            }}
          />
        ) : (
          <FilterValueCombobox
            filterType={filter.type}
            filterValues={filter.value}
            setFilterValues={(filterValues) => {
              setFilters((prev) =>
                prev.map((f) =>
                  f.id === filter.id ? { ...f, value: filterValues } : f
                )
              );
            }}
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setFilters((prev) => prev.filter((f) => f.id !== filter.id));
          }}
          className="bg-muted rounded-l-none rounded-r-sm h-6 w-6 text-muted-foreground hover:text-primary hover:bg-muted/50 transition shrink-0"
        >
          <X className="size-3" />
        </Button>
      </div>
    );
  }
  
  // Reset states when popover closes
  const handleOpenChange = (open: boolean) => {
    setPopoverOpen(open);
    if (!open) {
      setTimeout(() => {
        setShowFilterSelector(false);
        setSelectedView(null);
        setCommandInput("");
      }, 200);
    }
  };

  // Multiple filters - show minimal compact display with popover
  return (
    <Popover open={popoverOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-8 p-0 items-center justify-center rounded-sm text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-300 relative"
        >
          <ListFilter className="size-3" />
          <div className="absolute -top-1.5 -right-1.5 px-1 py-0.5 text-[9px] min-w-[16px] h-3 bg-blue-600 text-white rounded-full flex items-center justify-center">
            {activeFilters.length}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <AnimateChangeInHeight>
          {showFilterSelector ? (
            /* Filter Selector Mode */
            <div className="w-[200px]">
              <Command>
                <CommandInput
                  placeholder={selectedView ? selectedView : "Filter..."}
                  className="h-9"
                  value={commandInput}
                  onValueChange={setCommandInput}
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
                              setFilters((prev) => [
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
                              setShowFilterSelector(false);
                              setSelectedView(null);
                              setCommandInput("");
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
                        <div key={index}>
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
                        </div>
                      )
                    )
                  )}
                </CommandList>
              </Command>
            </div>
          ) : (
                         /* Active Filters List Mode */
             <div className="p-2 max-w-md space-y-2">
               {/* Header with Clear All */}
               <div className="flex items-center justify-between pb-1">
                 <span className="text-xs font-medium text-muted-foreground">
                   Active Filters ({activeFilters.length})
                 </span>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => setFilters([])}
                   className="h-5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 px-1"
                 >
                   Clear All
                 </Button>
               </div>
               
               {/* Active Filters */}
               <div className="space-y-1.5 max-h-48 overflow-y-auto">
                 {activeFilters.map((filter) => (
                   <div key={filter.id} className="flex gap-[1px] items-center text-xs">
                     <div className="flex gap-1.5 shrink-0 rounded-l bg-muted px-1.5 py-1 items-center">
                       <FilterIcon type={filter.type} />
                       {filter.type}
                     </div>
                     <FilterOperatorDropdown
                       filterType={filter.type}
                       operator={filter.operator}
                       filterValues={filter.value}
                       setOperator={(operator) => {
                         setFilters((prev) =>
                           prev.map((f) => (f.id === filter.id ? { ...f, operator } : f))
                         );
                       }}
                     />
                     {filter.type === FilterType.DATE ? (
                       <FilterValueDateCombobox
                         filterType={filter.type}
                         filterValues={filter.value}
                         setFilterValues={(filterValues) => {
                           setFilters((prev) =>
                             prev.map((f) =>
                               f.id === filter.id ? { ...f, value: filterValues } : f
                             )
                           );
                         }}
                       />
                     ) : (
                       <FilterValueCombobox
                         filterType={filter.type}
                         filterValues={filter.value}
                         setFilterValues={(filterValues) => {
                           setFilters((prev) =>
                             prev.map((f) =>
                               f.id === filter.id ? { ...f, value: filterValues } : f
                             )
                           );
                         }}
                       />
                     )}
                     <Button
                       variant="ghost"
                       size="icon"
                       onClick={() => {
                         setFilters((prev) => prev.filter((f) => f.id !== filter.id));
                       }}
                       className="bg-muted rounded-l-none rounded-r-sm h-6 w-6 text-muted-foreground hover:text-primary hover:bg-muted/50 transition shrink-0"
                     >
                       <X className="size-3" />
                     </Button>
                   </div>
                 ))}
                 
                 {/* Add Filter Item */}
                 <div 
                   className="flex gap-[1px] items-center text-xs cursor-pointer rounded transition-colors"
                   onClick={() => {
                     setShowFilterSelector(true);
                     setSelectedView(null);
                     setCommandInput("");
                     setTimeout(() => {
                       commandInputRef.current?.focus();
                     }, 100);
                   }}
                 >
                   <div className="flex gap-1.5 shrink-0 rounded border border-primary/30 px-1.5 py-1 items-center text-primary hover:border-primary/60 hover:bg-primary/5 transition-colors">
                     <Plus className="size-3" />
                     Add Filter
                   </div>
                 </div>
                                </div>
             </div>
          )}
        </AnimateChangeInHeight>
      </PopoverContent>
    </Popover>
  );
} 