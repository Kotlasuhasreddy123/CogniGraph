"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListChecks, FileCode, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlignmentStatus, NodeType } from "@/lib/types";

interface GraphNodeProps {
  id: string;
  label: string;
  type: NodeType;
  status: AlignmentStatus;
}

/** Maps alignment status to its Tailwind color class for badges */
export function getStatusColor(status: AlignmentStatus): string {
  switch (status) {
    case "aligned":
      return "bg-emerald-500 text-white hover:bg-emerald-500/80";
    case "drift-detected":
      return "bg-rose-500 text-white hover:bg-rose-500/80";
    case "patch-ready":
      return "bg-amber-500 text-white hover:bg-amber-500/80";
  }
}

/** Maps alignment status to a readable label */
export function getStatusLabel(status: AlignmentStatus): string {
  switch (status) {
    case "aligned":
      return "Aligned";
    case "drift-detected":
      return "Drift Detected";
    case "patch-ready":
      return "Patch Ready";
  }
}

/** Returns the Lucide icon component for a given node type */
export function getTypeIcon(type: NodeType) {
  switch (type) {
    case "requirement":
      return ListChecks;
    case "code-file":
      return FileCode;
    default:
      return CircleDot;
  }
}

/** Returns the border accent class for a given node type */
export function getTypeBorderClass(type: NodeType): string {
  switch (type) {
    case "requirement":
      return "border-l-4 border-l-emerald-700";
    case "code-file":
      return "border-l-4 border-l-blue-700";
    default:
      return "border-l-4 border-l-slate-700";
  }
}

export const GraphNodeCard = React.forwardRef<HTMLDivElement, GraphNodeProps>(
  ({ id, label, type, status }, ref) => {
    const Icon = getTypeIcon(type);
    const statusColor = getStatusColor(status);
    const borderClass = getTypeBorderClass(type);

    return (
      <Card
        ref={ref}
        data-node-id={id}
        className={cn(
          "p-3 bg-slate-900 border-slate-700",
          borderClass
        )}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-100 truncate flex-1">
            {label}
          </span>
          <Badge className={cn("text-xs shrink-0", statusColor)}>
            {getStatusLabel(status)}
          </Badge>
        </div>
      </Card>
    );
  }
);

GraphNodeCard.displayName = "GraphNodeCard";
