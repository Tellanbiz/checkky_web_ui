"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckSquare } from "lucide-react";
import { sidebarNavItems } from "./data";

interface SidebarRailProps {
  activeHref: string | null;
  items: typeof sidebarNavItems;
  onItemClick: (item: (typeof sidebarNavItems)[number]) => void;
}

export function SidebarRail({ activeHref, items, onItemClick }: SidebarRailProps) {
  return (
    <div className="flex h-full min-h-0 flex-col w-[56px] bg-white border-r border-gray-100 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <div className="w-7 h-7 bg-[#16A34A] rounded-lg flex items-center justify-center">
          <CheckSquare className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Nav icons */}
      <nav className="flex-1 py-3 px-1.5 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {items.map((item, idx) => {
          if (item.isDivider) {
            return (
              <div key={`${idx}-${item.name}`} className="py-1.5">
                <div className="mx-1.5 border-t border-gray-100" />
              </div>
            );
          }

          const isActive = item.href === activeHref;

          return (
            <Tooltip key={`${idx}-${item.name}`}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "relative flex items-center justify-center w-full h-9 rounded-md transition-colors cursor-pointer",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
                  )}
                  onClick={() => onItemClick(item)}
                >
                  {item.icon && <item.icon className="w-[18px] h-[18px]" />}
                  {item.badge && (
                    <span className="absolute right-1.5 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[9px] font-semibold leading-none text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={6}>
                <p className="text-xs font-medium">{item.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </div>
  );
}
