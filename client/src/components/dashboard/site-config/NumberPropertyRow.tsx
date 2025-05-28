interface NumberPropertyRowProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  icon?: any;
}

export function NumberPropertyRow({ 
  label, 
  value, 
  onValueChange,
  min = 1,
  max = 100,
  icon: Icon
}: NumberPropertyRowProps) {
  const handleIncrement = () => {
    if (value < max) {
      onValueChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onValueChange(value - 1);
    }
  };

  return (
    <div className="flex items-center justify-between h-9 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md group transition-colors border-b border-gray-100 dark:border-gray-800">
      <div className="w-2/5 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 pr-2">
        {Icon && <Icon className="h-3 w-3 flex-shrink-0" />}
        <span className="truncate text-left">{label}</span>
      </div>
      <div className="w-3/5 flex justify-end items-center h-full pl-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleDecrement}
            disabled={value <= min}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
          >
            -
          </button>
          <span className="w-8 text-center text-sm text-gray-900 dark:text-gray-100">
            {value}
          </span>
          <button
            onClick={handleIncrement}
            disabled={value >= max}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
} 