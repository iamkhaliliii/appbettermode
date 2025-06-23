import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/forms/command";
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
  Check,
  ChevronDown,
  SortAsc,
  SortDesc,
  Tag,
  Users,
  X,
  ArrowUp,
  ArrowDown,
  Type,
  ArrowUpDown,
  Plus,
  Edit2,
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

export enum SortField {
  DATE = "Date",
  TITLE = "Title",
  CATEGORY = "Category",
  ATTENDEES = "Attendees",
  CREATED = "Created",
  UPDATED = "Updated",
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export type SortOption = {
  name: SortField;
  icon: React.ReactNode;
  label?: string;
};

export type Sort = {
  id: string;
  field: SortField;
  direction: SortDirection;
};

const SortIcon = ({ field }: { field: SortField }) => {
  switch (field) {
    case SortField.DATE:
      return <Calendar className="size-3.5" />;
    case SortField.TITLE:
      return <Type className="size-3.5" />;
    case SortField.CATEGORY:
      return <Tag className="size-3.5" />;
    case SortField.ATTENDEES:
      return <Users className="size-3.5" />;
    case SortField.CREATED:
      return <Calendar className="size-3.5 text-green-500" />;
    case SortField.UPDATED:
      return <Calendar className="size-3.5 text-blue-500" />;
    default:
      return <SortAsc className="size-3.5" />;
  }
};

const DirectionIcon = ({ direction }: { direction: SortDirection }) => {
  return direction === SortDirection.ASC ? (
    <ArrowUp className="size-3 text-gray-600" />
  ) : (
    <ArrowDown className="size-3 text-gray-600" />
  );
};

export const sortFieldOptions: SortOption[] = Object.values(SortField).map(
  (field) => ({
    name: field,
    icon: <SortIcon field={field} />,
  })
);

const SortDirectionDropdown = ({
  direction,
  setDirection,
}: {
  direction: SortDirection;
  setDirection: (direction: SortDirection) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-muted hover:bg-muted/50 px-1.5 py-1 text-muted-foreground hover:text-primary transition shrink-0 flex items-center gap-1">
        <DirectionIcon direction={direction} />
        <span className="text-xs">{direction === SortDirection.ASC ? "A→Z" : "Z→A"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit min-w-fit">
        <DropdownMenuItem onClick={() => setDirection(SortDirection.ASC)}>
          <ArrowUp className="size-3 mr-2 text-gray-600" />
          Ascending (A→Z)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDirection(SortDirection.DESC)}>
          <ArrowDown className="size-3 mr-2 text-gray-600" />
          Descending (Z→A)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SortFieldCombobox = ({
  selectedFields,
  onSelectField,
}: {
  selectedFields: string[];
  onSelectField: (field: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const commandInputRef = useRef<HTMLInputElement>(null);
  
  const availableFields = sortFieldOptions.filter(
    (option) => !selectedFields.includes(option.name)
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
          <SortAsc className="size-3.5" />
          Add Sort
        </div>
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
                    className="group flex gap-2 items-center"
                    key={option.name}
                    value={option.name}
                    onSelect={(currentValue: string) => {
                      onSelectField(currentValue);
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
                    <Check className="ml-auto opacity-0 group-data-[selected=true]:opacity-100" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </AnimateChangeInHeight>
      </PopoverContent>
    </Popover>
  );
};

export default function EventSort({
  sorts,
  setSorts,
}: {
  sorts: Sort[];
  setSorts: Dispatch<SetStateAction<Sort[]>>;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showSortSelector, setShowSortSelector] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const commandInputRef = useRef<HTMLInputElement>(null);

  const handleAddSort = (field: string) => {
    const newSort: Sort = {
      id: `sort-${Date.now()}`,
      field: field as SortField,
      direction: SortDirection.ASC,
    };
    setSorts([newSort]); // Replace existing sort instead of adding
  };

  const handleUpdateDirection = (sortId: string, direction: SortDirection) => {
    setSorts((prev) =>
      prev.map((sort) =>
        sort.id === sortId ? { ...sort, direction } : sort
      )
    );
  };

  const availableFields = sortFieldOptions; // Show all fields since we replace, not add

  if (sorts.length === 0) {
    return null;
  }

  // Reset states when popover closes
  const handleOpenChange = (open: boolean) => {
    setPopoverOpen(open);
    if (!open) {
      setTimeout(() => {
        setShowSortSelector(false);
        setCommandInput("");
      }, 200);
    }
  };

  // Always show minimal compact display with popover for the single sort
  return (
    <Popover open={popoverOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-8 p-0 items-center justify-center rounded-sm text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-300"
        >
          <ArrowUpDown className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <AnimateChangeInHeight>
          {showSortSelector ? (
            /* Sort Selector Mode */
            <div className="w-[180px]">
              <Command>
                <CommandInput
                  placeholder="Sort by..."
                  className="h-9"
                  value={commandInput}
                  onValueChange={setCommandInput}
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
                          setShowSortSelector(false);
                          setCommandInput("");
                        }}
                      >
                        {option.icon}
                        <span className="text-accent-foreground">
                          {option.name}
                        </span>
                        <Check
                          className={cn(
                            "ml-auto",
                            sorts[0].field === option.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          ) : (
            /* Sort Management */
            <div className="p-2 max-w-md space-y-2">
              {/* Header */}
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Sort
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSorts([{
                    id: 'default-date',
                    field: SortField.DATE,
                    direction: SortDirection.DESC
                  }])}
                  className="h-5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 px-1"
                >
                  Reset
                </Button>
              </div>
              
              {/* Current Sort */}
              <div className="space-y-1.5">
                {sorts.map((sort) => (
                  <div key={sort.id} className="flex gap-[1px] items-center text-xs">
                    <div className="flex gap-1 shrink-0 rounded-l bg-muted px-1.5 py-1 items-center">
                      <SortIcon field={sort.field} />
                      <span className="text-xs">{sort.field}</span>
                    </div>
                    <SortDirectionDropdown
                      direction={sort.direction}
                      setDirection={(direction) => handleUpdateDirection(sort.id, direction)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowSortSelector(true);
                        setCommandInput("");
                        setTimeout(() => {
                          commandInputRef.current?.focus();
                        }, 100);
                      }}
                      className="bg-muted rounded-l-none rounded-r-sm h-6 w-6 text-muted-foreground hover:text-primary hover:bg-muted/50 transition shrink-0"
                    >
                      <Edit2 className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AnimateChangeInHeight>
      </PopoverContent>
    </Popover>
  );
} 