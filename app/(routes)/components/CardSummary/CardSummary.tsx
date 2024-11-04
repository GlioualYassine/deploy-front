import React from "react";
import { CardSummaryProps } from "./CardSummary.types";
import CustomIcon from "@/components/CustomIcon/CustomIcon";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import { cn } from "@/lib/utils";
import { MoveDownRight, MoveUpRight, TrendingUp } from "lucide-react";

const CardSummary = (props: CardSummaryProps) => {
  const { icon: Icon, total, average, title, tooltipText } = props;

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 rounded-xl p-6 hover:shadow-lg transition-transform transform hover:scale-105 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <CustomIcon icon={Icon} />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
        <CustomTooltip content={tooltipText} />
      </div>
      <div className="flex items-center gap-6 mt-4">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{total}</p>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white rounded-lg",
            average < 20 ? "bg-red-500" : average < 70 ? "bg-yellow-500" : "bg-green-500"
          )}
        >
          {average}%
          {average < 20 && <MoveDownRight strokeWidth={2} className="h-4 w-4" />}
          {average >= 20 && average < 70 && <MoveUpRight strokeWidth={2} className="h-4 w-4" />}
          {average >= 70 && <TrendingUp strokeWidth={2} className="h-4 w-4" />}
        </div>
      </div>
    </div>
  );
};

export default CardSummary;
