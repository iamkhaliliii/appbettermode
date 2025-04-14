import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp } from "lucide-react";

interface ChartCardProps {
  title: string;
  type: "bar" | "line";
}

export function ChartCard({ title, type }: ChartCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm font-medium"
            >
              Weekly
            </Button>
            <Button 
              variant="subtle" 
              size="sm" 
              className="text-sm font-medium"
            >
              Monthly
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm font-medium"
            >
              Yearly
            </Button>
          </div>
        </div>
        
        <div className="h-64 w-full">
          {/* Chart placeholder */}
          <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-center">
              {type === "bar" ? (
                <BarChart3 className="mx-auto h-10 w-10 text-gray-400" />
              ) : (
                <TrendingUp className="mx-auto h-10 w-10 text-gray-400" />
              )}
              <p className="mt-2 text-sm text-gray-500">
                {title} visualization
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
