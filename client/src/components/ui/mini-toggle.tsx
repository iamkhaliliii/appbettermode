
import { useState } from "react";

interface MiniToggleProps {
  isActive?: boolean;
  onChange: (state: boolean) => void;
}

export function MiniToggle({
  isActive: initialActive = false,
  onChange,
}: MiniToggleProps) {
  const [isActive, setIsActive] = useState(initialActive);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    onChange(newState);
  };

  return (
    <div
      className={`relative h-3 w-6 rounded-full cursor-pointer transition-colors ${isActive ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`}
      onClick={handleToggle}
    >
      <div
        className={`absolute top-0.5 h-2 w-2 rounded-full bg-white transform transition-transform ${isActive ? "translate-x-3" : "translate-x-0.5"}`}
      />
    </div>
  );
}
