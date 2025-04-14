interface ActivityItemProps {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
  time: string;
}

export function ActivityItem({ 
  icon, 
  iconBgColor, 
  title, 
  description, 
  time 
}: ActivityItemProps) {
  return (
    <li>
      <div className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`h-10 w-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
              {icon}
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">{time}</div>
          </div>
        </div>
      </div>
    </li>
  );
}
