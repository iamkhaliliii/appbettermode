import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface OverviewCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
}

export function OverviewCard({ title, value, icon, bgColor }: OverviewCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{value}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
        <div className="text-sm">
          <Button variant="link-color" className="p-0 h-auto font-medium text-primary-700 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300">
            View all
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
