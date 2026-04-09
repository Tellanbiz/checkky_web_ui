"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  FolderOpen,
  Plus,
  Trash2,
} from "lucide-react";
import type { GroupTreeNode } from "@/lib/utils/group-tree";

interface DepartmentPanelProps {
  groupTree: GroupTreeNode[];
  expandedGroups: Set<string>;
  onToggleGroup: (groupId: string) => void;
  onCreateSubgroup: (parentGroupId: string) => void;
  onCreateRoot: () => void;
  onClose: () => void;
}

export function DepartmentPanel({
  groupTree,
  expandedGroups,
  onToggleGroup,
  onCreateSubgroup,
  onCreateRoot,
  onClose,
}: DepartmentPanelProps) {
  const pathname = usePathname();
  const router = useRouter();

  const renderGroupNode = (node: GroupTreeNode, depth: number = 0) => {
    const isExpanded = expandedGroups.has(node.group.id);
    const hasChildren = node.children.length > 0;
    const isActive =
      pathname === `/dashboard/checklists?group=${node.group.id}`;

    return (
      <React.Fragment key={node.group.id}>
        <div className="relative group/item">
          <Link
            href={`/dashboard/checklists?group=${node.group.id}`}
            className={cn(
              "flex items-center px-2 py-1.5 text-[12px] rounded-md transition-colors",
              isActive
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-700 hover:bg-gray-50",
            )}
            style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
          >
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleGroup(node.group.id);
                }}
                className="mr-1 hover:bg-gray-200 rounded p-0.5"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                )}
              </button>
            ) : (
              <span className="w-4 mr-1" />
            )}
            <span className="truncate flex-1">{node.group.name}</span>
            {node.group.no_of_checklists > 0 && (
              <span className="ml-2 text-[10px] text-gray-400 tabular-nums">
                {node.group.no_of_checklists}
              </span>
            )}
          </Link>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCreateSubgroup(node.group.id);
              }}
              className="p-0.5 hover:bg-green-50 rounded"
              title="Add Sub-department"
            >
              <Plus className="w-3 h-3 text-green-600" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/dashboard/groups?delete=${node.group.id}`);
              }}
              className="p-0.5 hover:bg-red-50 rounded"
              title="Delete Department"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="space-y-0.5">
            {node.children.map((child) => renderGroupNode(child, depth + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col w-48 bg-white border-r border-gray-200 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-3 border-b border-gray-200">
        <h2 className="text-[12px] font-semibold text-gray-900">Departments</h2>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onCreateRoot}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Create Department"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Close"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Department tree */}
      <div className="flex-1 overflow-y-auto px-1.5 py-2 space-y-0.5">
        {groupTree.length === 0 ? (
          <div className="px-2 py-6 text-center">
            <p className="text-[12px] text-gray-400">No departments yet</p>
            <button
              onClick={onCreateRoot}
              className="mt-2 text-[12px] text-gray-700 hover:underline font-medium"
            >
              Create one
            </button>
          </div>
        ) : (
          <>
            {groupTree.map((node) => renderGroupNode(node))}
            <Link
              href="/dashboard/checklists?group=none"
              className={cn(
                "flex items-center px-2 py-1.5 text-[12px] rounded-md transition-colors",
                pathname === "/dashboard/checklists?group=none"
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800",
              )}
            >
              <FolderOpen className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-gray-400" />
              <span className="truncate flex-1">Ungrouped</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
