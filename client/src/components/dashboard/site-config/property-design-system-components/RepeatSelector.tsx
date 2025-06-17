import { useState, useEffect, useRef } from "react";
import { Repeat, Check, Calendar } from "lucide-react";
import { RepeatSelectorProps, RepeatConfig } from "./types";

// Repeat patterns
const REPEAT_OPTIONS = [
  { value: 'none', label: 'Does not repeat', description: 'This is a one-time event' },
  { value: 'daily', label: 'Daily', description: 'Repeats every day' },
  { value: 'weekly', label: 'Weekly', description: 'Repeats weekly on selected days' },
  { value: 'monthly', label: 'Monthly', description: 'Repeats monthly on specific day' },
  { value: 'annually', label: 'Annually', description: 'Repeats yearly on same date' },
  { value: 'weekdays', label: 'Every weekday (Monday to Friday)', description: 'Repeats Monday through Friday' },
  { value: 'custom', label: 'Custom...', description: 'Define custom repeat pattern' },
];

const WEEKDAYS = [
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
  { value: 'sunday', label: 'Sunday', short: 'Sun' },
];

const ORDINALS = ['first', 'second', 'third', 'fourth', 'last'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function RepeatSelector({ value, onChange, startDate }: RepeatSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState<RepeatConfig>(value || { type: 'none' });
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setTempConfig(value || { type: 'none' }); // Reset to original value
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  const getDisplayText = () => {
    if (!value || value.type === 'none') {
      return 'Does not repeat';
    }

    switch (value.type) {
      case 'daily':
        return 'Daily';
      case 'weekly':
                 if (value.weekdays && value.weekdays.length > 0) {
           const selectedDays = value.weekdays.map((day: string) => 
             WEEKDAYS.find(w => w.value === day)?.short
           ).join(', ');
           return `Weekly on ${selectedDays}`;
         }
        return 'Weekly';
      case 'monthly':
        if (value.ordinal && value.weekday) {
          const ordinal = value.ordinal;
          const weekday = WEEKDAYS.find(w => w.value === value.weekday)?.label;
          return `Monthly on the ${ordinal} ${weekday}`;
        }
        return 'Monthly';
      case 'annually':
        if (startDate) {
          const date = new Date(startDate);
          const month = MONTHS[date.getMonth()];
          const day = date.getDate();
          return `Annually on ${month} ${day}`;
        }
        return 'Annually';
      case 'weekdays':
        return 'Every weekday (Monday to Friday)';
      case 'custom':
        if (value.interval && value.intervalUnit) {
          let text = `Every ${value.interval} ${value.intervalUnit}${value.interval > 1 ? 's' : ''}`;
          if (value.intervalUnit === 'week' && value.weekdays && value.weekdays.length > 0) {
            const selectedDays = value.weekdays.map((day: string) => 
              WEEKDAYS.find(w => w.value === day)?.short
            ).join(', ');
            text += ` on ${selectedDays}`;
          }
          return text;
        }
        return 'Custom...';
      default:
        return 'Does not repeat';
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    let newConfig: any = { type: optionValue };

    switch (optionValue) {
      case 'none':
        newConfig = { type: 'none' };
        break;
      case 'daily':
        newConfig = { type: 'daily' };
        break;
      case 'weekly':
        // Default to same day as start date
        if (startDate) {
          const dayOfWeek = new Date(startDate).getDay();
          const weekdayValue = WEEKDAYS[(dayOfWeek === 0 ? 6 : dayOfWeek - 1)].value;
          newConfig = { type: 'weekly', weekdays: [weekdayValue] };
        } else {
          newConfig = { type: 'weekly', weekdays: ['monday'] };
        }
        break;
      case 'monthly':
        if (startDate) {
          const date = new Date(startDate);
          const dayOfWeek = date.getDay();
          const weekNumber = Math.ceil(date.getDate() / 7);
          const ordinal = weekNumber <= 4 ? ORDINALS[weekNumber - 1] : 'last';
          const weekdayValue = WEEKDAYS[(dayOfWeek === 0 ? 6 : dayOfWeek - 1)].value;
          newConfig = { type: 'monthly', ordinal, weekday: weekdayValue };
        } else {
          newConfig = { type: 'monthly', ordinal: 'first', weekday: 'monday' };
        }
        break;
      case 'annually':
        newConfig = { type: 'annually' };
        break;
      case 'weekdays':
        newConfig = { type: 'weekdays' };
        break;
      case 'custom':
        newConfig = { 
          type: 'custom', 
          interval: 1, 
          intervalUnit: 'week', 
          endsType: 'never',
          weekdays: startDate ? [WEEKDAYS[(new Date(startDate).getDay() === 0 ? 6 : new Date(startDate).getDay() - 1)].value] : ['monday']
        };
        break;
    }

    setTempConfig(newConfig);
    
    // Auto-apply for non-custom options
    if (optionValue !== 'custom') {
      onChange(newConfig);
      setIsOpen(false);
    }
  };

  const handleWeekdayToggle = (weekday: string) => {
    if (!tempConfig || tempConfig.type !== 'weekly') return;
    
    const currentWeekdays = tempConfig.weekdays || [];
    const newWeekdays = currentWeekdays.includes(weekday)
      ? currentWeekdays.filter((d: string) => d !== weekday)
      : [...currentWeekdays, weekday];
    
    setTempConfig({
      ...tempConfig,
      weekdays: newWeekdays
    });
  };

  const handleMonthlyChange = (field: 'ordinal' | 'weekday', value: string) => {
    if (!tempConfig || tempConfig.type !== 'monthly') return;
    
    setTempConfig({
      ...tempConfig,
      [field]: value
    });
  };

  const handleApply = () => {
    onChange(tempConfig);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempConfig(value || { type: 'none' });
    setIsOpen(false);
  };

  const isEmpty = !value || value.type === 'none';

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setTempConfig(value || { type: 'none' });
        }}
        className="w-full h-6 text-sm bg-transparent border-none outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-right flex items-center justify-end gap-1.5"
      >
        <div className="flex items-center gap-1.5">
          <Repeat className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <span className={`text-sm ${isEmpty ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'}`}>
            {getDisplayText()}
          </span>
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[99999]">
          <div className="py-1.5 max-h-48 overflow-y-auto">
            {REPEAT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionSelect(option.value)}
                className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-start gap-2.5 group ${
                  tempConfig?.type === option.value 
                    ? 'bg-primary-50/50 dark:bg-primary-900/10' 
                    : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium leading-4 ${
                    tempConfig?.type === option.value 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {option.label}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-3 opacity-75">
                    {option.description}
                  </div>
                </div>
                {tempConfig?.type === option.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 flex-shrink-0 mt-1.5" />
                )}
              </button>
            ))}
          </div>

          {/* Weekly Configuration */}
          {tempConfig?.type === 'weekly' && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Repeat on
              </div>
              <div className="flex flex-wrap gap-1">
                {WEEKDAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleWeekdayToggle(day.value)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      tempConfig.weekdays?.includes(day.value)
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-150 dark:hover:bg-gray-600'
                    }`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Configuration */}
          {tempConfig?.type === 'monthly' && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Repeat on the
              </div>
              <div className="flex gap-2">
                <select
                  value={tempConfig.ordinal || 'first'}
                  onChange={(e) => handleMonthlyChange('ordinal', e.target.value)}
                  className="px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded outline-none text-gray-900 dark:text-gray-100"
                >
                  {ORDINALS.map(ordinal => (
                    <option key={ordinal} value={ordinal}>
                      {ordinal}
                    </option>
                  ))}
                </select>
                <select
                  value={tempConfig.weekday || 'monday'}
                  onChange={(e) => handleMonthlyChange('weekday', e.target.value)}
                  className="px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded outline-none text-gray-900 dark:text-gray-100"
                >
                  {WEEKDAYS.map(day => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Custom Configuration */}
          {tempConfig?.type === 'custom' && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {/* Repeat every */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 dark:text-gray-400 min-w-fit">Every</span>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={tempConfig.interval || 1}
                  onChange={(e) => setTempConfig({ ...tempConfig, interval: parseInt(e.target.value) || 1 })}
                  className="w-12 h-6 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1 outline-none text-gray-900 dark:text-gray-100 text-center"
                />
                <select
                  value={tempConfig.intervalUnit || 'week'}
                  onChange={(e) => setTempConfig({ ...tempConfig, intervalUnit: e.target.value as any })}
                  className="h-6 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1 outline-none text-gray-900 dark:text-gray-100"
                >
                  <option value="day">day{(tempConfig.interval || 1) > 1 ? 's' : ''}</option>
                  <option value="week">week{(tempConfig.interval || 1) > 1 ? 's' : ''}</option>
                  <option value="month">month{(tempConfig.interval || 1) > 1 ? 's' : ''}</option>
                  <option value="year">year{(tempConfig.interval || 1) > 1 ? 's' : ''}</option>
                </select>
              </div>

              {/* Repeat on (for weekly) */}
              {tempConfig.intervalUnit === 'week' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 min-w-fit">On</span>
                  <div className="flex gap-1">
                    {WEEKDAYS.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => {
                          const currentWeekdays = tempConfig.weekdays || [];
                          const newWeekdays = currentWeekdays.includes(day.value)
                            ? currentWeekdays.filter(d => d !== day.value)
                            : [...currentWeekdays, day.value];
                          setTempConfig({ ...tempConfig, weekdays: newWeekdays });
                        }}
                        className={`w-6 h-6 text-xs rounded transition-colors ${
                          tempConfig.weekdays?.includes(day.value)
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-150 dark:hover:bg-gray-600'
                        }`}
                      >
                        {day.short.charAt(0)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ends */}
              <div className="space-y-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">Ends</span>
                
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="endsType"
                    value="never"
                    checked={tempConfig.endsType === 'never' || !tempConfig.endsType}
                    onChange={(e) => setTempConfig({ ...tempConfig, endsType: 'never' })}
                    className="w-3 h-3 text-primary-600"
                  />
                  <span className="text-xs text-gray-900 dark:text-gray-100">Never</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="endsType"
                    value="on"
                    checked={tempConfig.endsType === 'on'}
                    onChange={(e) => setTempConfig({ ...tempConfig, endsType: 'on' })}
                    className="w-3 h-3 text-primary-600"
                  />
                  <span className="text-xs text-gray-900 dark:text-gray-100">On</span>
                  <input
                    type="date"
                    value={tempConfig.endsOn || ''}
                    onChange={(e) => setTempConfig({ ...tempConfig, endsOn: e.target.value, endsType: 'on' })}
                    className="h-6 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1 outline-none text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="endsType"
                    value="after"
                    checked={tempConfig.endsType === 'after'}
                    onChange={(e) => setTempConfig({ ...tempConfig, endsType: 'after' })}
                    className="w-3 h-3 text-primary-600"
                  />
                  <span className="text-xs text-gray-900 dark:text-gray-100">After</span>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={tempConfig.endsAfter || 10}
                    onChange={(e) => setTempConfig({ ...tempConfig, endsAfter: parseInt(e.target.value) || 10, endsType: 'after' })}
                    className="w-12 h-6 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1 outline-none text-gray-900 dark:text-gray-100 text-center"
                  />
                  <span className="text-xs text-gray-900 dark:text-gray-100">times</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {tempConfig?.type === 'custom' && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-2 py-1 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 