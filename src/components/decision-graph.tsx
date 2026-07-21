"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { GraphNodeCard, getStatusColor } from "@/components/graph-node";
import type { GraphNode, Edge } from "@/lib/types";

interface DecisionGraphProps {
  nodes: GraphNode[];
  edges: Edge[];
}

interface EdgeCoords {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  status: GraphNode["status"];
}

/** Returns the stroke color for an edge based on target node status */
export function getEdgeStrokeColor(status: GraphNode["status"]): string {
  switch (status) {
    case "aligned":
      return "#10b981"; // emerald-500
    case "drift-detected":
      return "#f43f5e"; // rose-500
    case "patch-ready":
      return "#f59e0b"; // amber-500
    default:
      return "#64748b"; // slate-500
  }
}

export function DecisionGraph({ nodes, edges }: DecisionGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [edgeCoords, setEdgeCoords] = useState<EdgeCoords[]>([]);

  const requirementNodes = nodes.filter((n) => n.type === "requirement");
  const codeFileNodes = nodes.filter((n) => n.type === "code-file");

  const setNodeRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      nodeRefs.current.set(id, el);
    } else {
      nodeRefs.current.delete(id);
    }
  }, []);

  const computeEdges = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const coords: EdgeCoords[] = [];

    for (const edge of edges) {
      const sourceEl = nodeRefs.current.get(edge.source);
      const targetEl = nodeRefs.current.get(edge.target);

      if (!sourceEl || !targetEl) continue;

      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      // Source connects from the right side, target from the left side
      const x1 = sourceRect.right - containerRect.left;
      const y1 = sourceRect.top + sourceRect.height / 2 - containerRect.top;
      const x2 = targetRect.left - containerRect.left;
      const y2 = targetRect.top + targetRect.height / 2 - containerRect.top;

      // Determine edge color from target node status
      const targetNode = nodes.find((n) => n.id === edge.target);
      const status = targetNode?.status ?? "aligned";

      coords.push({ x1, y1, x2, y2, status });
    }

    setEdgeCoords(coords);
  }, [edges, nodes]);

  useEffect(() => {
    // Initial computation after mount
    const timer = setTimeout(computeEdges, 50);

    // Observe resize to recompute edges
    const observer = new ResizeObserver(() => {
      computeEdges();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [computeEdges]);

  if (nodes.length === 0) {
    return (
      <section className="h-full overflow-y-auto p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          Live Decision Graph
        </h2>
        <p className="text-slate-400 text-sm">No graph data available</p>
      </section>
    );
  }

  return (
    <section className="h-full overflow-y-auto p-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">
        Live Decision Graph
      </h2>
      <div ref={containerRef} className="relative min-h-[400px]">
        {/* SVG overlay for edges */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
          aria-hidden="true"
        >
          {edgeCoords.map((coord, i) => {
            const dx = Math.abs(coord.x2 - coord.x1) * 0.4;
            const path = `M ${coord.x1} ${coord.y1} C ${coord.x1 + dx} ${coord.y1}, ${coord.x2 - dx} ${coord.y2}, ${coord.x2} ${coord.y2}`;
            return (
              <path
                key={i}
                d={path}
                fill="none"
                stroke={getEdgeStrokeColor(coord.status)}
                strokeWidth={2}
                strokeOpacity={0.7}
                data-testid="edge-path"
              />
            );
          })}
        </svg>

        {/* Node layout: bipartite graph */}
        <div className="relative flex justify-between gap-8" style={{ zIndex: 2 }}>
          {/* Left column: requirement nodes */}
          <div className="flex flex-col gap-3 w-[45%]">
            {requirementNodes.map((node) => (
              <GraphNodeCard
                key={node.id}
                ref={setNodeRef(node.id)}
                id={node.id}
                label={node.label}
                type={node.type}
                status={node.status}
              />
            ))}
          </div>

          {/* Right column: code-file nodes */}
          <div className="flex flex-col gap-3 w-[45%]">
            {codeFileNodes.map((node) => (
              <GraphNodeCard
                key={node.id}
                ref={setNodeRef(node.id)}
                id={node.id}
                label={node.label}
                type={node.type}
                status={node.status}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
