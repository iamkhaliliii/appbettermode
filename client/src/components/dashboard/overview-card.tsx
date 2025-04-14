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
            <div className="text-sm font-medium text-gray-500 truncate">{title}</div>
            <div className="text-lg font-semibold text-gray-900">{value}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Button variant="link" className="p-0 h-auto font-medium text-primary-700 hover:text-primary-900">
            View all
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
