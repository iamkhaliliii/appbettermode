import { useState, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({ 
  value, 
  onChange, 
  placeholder = "0", 
  min = 0, 
  max = 999999,
  step = 1 
}: NumberInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);
    
    // Allow empty string for better UX while typing
    if (inputVal === '') {
      onChange(0);
      return;
    }
    
    const numVal = parseInt(inputVal, 10);
    if (!isNaN(numVal)) {
      const clampedValue = Math.max(min, Math.min(max, numVal));
      onChange(clampedValue);
    }
  };

  const handleInputBlur = () => {
    // Ensure the display value matches the actual value
    setInputValue(value.toString());
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);
  };

  const isEmpty = value === 0;
  
  const getDisplayContent = () => {
    if (isOpen) {
      return (
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded px-1 py-0.5">
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min={min}
            max={max}
            className="w-12 text-center text-sm bg-transparent border-none outline-none text-gray-900 dark:text-gray-100"
            placeholder={placeholder}
          />
          
          <div className="flex flex-col">
            <button
              type="button"
              onClick={handleIncrement}
              disabled={value >= max}
              className="w-4 h-3 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 rounded-sm"
            >
              <ChevronUp className="w-2.5 h-2.5 text-gray-500" />
            </button>
            
            <button
              type="button"
              onClick={handleDecrement}
              disabled={value <= min}
              className="w-4 h-3 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 rounded-sm"
            >
              <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <span className={`text-sm ${isEmpty ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'}`}>
        {isEmpty ? 'Unlimited' : value.toLocaleString()}
      </span>
    );
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleButtonClick}
        className="w-full h-6 text-sm bg-transparent border-none outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-right flex items-center justify-end gap-1.5"
      >
        {getDisplayContent()}
      </button>
    </div>
  );
} 