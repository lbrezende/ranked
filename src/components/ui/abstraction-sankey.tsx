"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AbstractionRow {
  aiExample: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  color: string;
}

interface AbstractionSankeyProps {
  data?: AbstractionRow[];
  className?: string;
}

interface AbstractionSankeySimpleProps {
  selectedExamples?: string[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Color palette (Level 4 categories)
// ---------------------------------------------------------------------------

const CATEGORY_COLORS: Record<string, string> = {
  Forecast: "#FCE4EC",
  Prever: "#FCE4EC",
  Discover: "#FFF9C4",
  Descobrir: "#FFF9C4",
  Identify: "#E8F5E9",
  Identificar: "#E8F5E9",
  Detect: "#E0F7FA",
  Detectar: "#E0F7FA",
  Estimate: "#FFF3E0",
  Estimar: "#FFF3E0",
  Generate: "#F3E5F5",
  Gerar: "#F3E5F5",
  Act: "#FFFDE7",
  Agir: "#FFFDE7",
  Compare: "#E3F2FD",
  Comparar: "#E3F2FD",
};

// Slightly darker versions for hover
const CATEGORY_COLORS_HOVER: Record<string, string> = {
  Forecast: "#F8BBD0",
  Prever: "#F8BBD0",
  Discover: "#FFF176",
  Descobrir: "#FFF176",
  Identify: "#C8E6C9",
  Identificar: "#C8E6C9",
  Detect: "#B2EBF2",
  Detectar: "#B2EBF2",
  Estimate: "#FFE0B2",
  Estimar: "#FFE0B2",
  Generate: "#E1BEE7",
  Gerar: "#E1BEE7",
  Act: "#FFF9C4",
  Agir: "#FFF9C4",
  Compare: "#BBDEFB",
  Comparar: "#BBDEFB",
};

// Left border accent for grouping
const CATEGORY_BORDERS: Record<string, string> = {
  Forecast: "#E91E63",
  Prever: "#E91E63",
  Discover: "#F9A825",
  Descobrir: "#F9A825",
  Identify: "#4CAF50",
  Identificar: "#4CAF50",
  Detect: "#00BCD4",
  Detectar: "#00BCD4",
  Estimate: "#FF9800",
  Estimar: "#FF9800",
  Generate: "#9C27B0",
  Gerar: "#9C27B0",
  Act: "#FFC107",
  Agir: "#FFC107",
  Compare: "#2196F3",
  Comparar: "#2196F3",
};

// ---------------------------------------------------------------------------
// Default data from the CMU AI Design Kit paper
// ---------------------------------------------------------------------------

const DEFAULT_DATA: AbstractionRow[] = [
  // Stock Trading Recommendations
  {
    aiExample: "Stock Trading Recommendations",
    level1: "Forecast peak price of stock",
    level2: "Forecast peak point",
    level3: "Forecast time",
    level4: "Forecast",
    color: CATEGORY_COLORS.Forecast,
  },
  {
    aiExample: "Stock Trading Recommendations",
    level1: "Forecast price of stocks",
    level2: "Forecast financial attribute",
    level3: "Forecast attribute",
    level4: "Forecast",
    color: CATEGORY_COLORS.Forecast,
  },
  {
    aiExample: "Stock Trading Recommendations",
    level1: "Discover relationships between news & stock prices",
    level2: "Discover correlations",
    level3: "Discover relationship",
    level4: "Discover",
    color: CATEGORY_COLORS.Discover,
  },

  // Medical Imaging Analysis
  {
    aiExample: "Medical Imaging Analysis",
    level1: "Discover medical anomaly in image",
    level2: "Discover visual anomaly",
    level3: "Discover anomaly",
    level4: "Discover",
    color: CATEGORY_COLORS.Discover,
  },
  {
    aiExample: "Medical Imaging Analysis",
    level1: "Identify anomaly as tumor in image",
    level2: "Identify visual anomaly",
    level3: "Identify anomaly",
    level4: "Identify",
    color: CATEGORY_COLORS.Identify,
  },
  {
    aiExample: "Medical Imaging Analysis",
    level1: "Identify malignant tumor in image",
    level2: "Identify class",
    level3: "Identify attribute",
    level4: "Identify",
    color: CATEGORY_COLORS.Identify,
  },
  {
    aiExample: "Medical Imaging Analysis",
    level1: "Identify tumor type in image",
    level2: "Identify class",
    level3: "Identify attribute",
    level4: "Identify",
    color: CATEGORY_COLORS.Identify,
  },
  {
    aiExample: "Medical Imaging Analysis",
    level1: "Detect medical anomaly in image",
    level2: "Detect visual anomaly",
    level3: "Detect anomaly",
    level4: "Detect",
    color: CATEGORY_COLORS.Detect,
  },
  {
    aiExample: "Medical Imaging Analysis",
    level1: "Estimate size of tumor",
    level2: "Identify user intent",
    level3: "Detect anomaly",
    level4: "Detect",
    color: CATEGORY_COLORS.Detect,
  },

  // Autonomous Parking
  {
    aiExample: "Autonomous Parking",
    level1: "Identify driver's intent to park in vehicle telemetry",
    level2: "Identify object",
    level3: "Identify activity",
    level4: "Identify",
    color: CATEGORY_COLORS.Identify,
  },
  {
    aiExample: "Autonomous Parking",
    level1: "Identify objects in sensor stream",
    level2: "Estimate entity size",
    level3: "Identify world",
    level4: "Detect",
    color: CATEGORY_COLORS.Detect,
  },
  {
    aiExample: "Autonomous Parking",
    level1: "Detect objects in sensor stream",
    level2: "Detect object",
    level3: "Detect world",
    level4: "Detect",
    color: CATEGORY_COLORS.Detect,
  },
  {
    aiExample: "Autonomous Parking",
    level1: "Detect parking space in image",
    level2: "Detect space",
    level3: "Detect world",
    level4: "Detect",
    color: CATEGORY_COLORS.Detect,
  },
  {
    aiExample: "Autonomous Parking",
    level1: "Estimate size of parking space",
    level2: "Estimate spatial size",
    level3: "Estimate world",
    level4: "Estimate",
    color: CATEGORY_COLORS.Estimate,
  },
  {
    aiExample: "Autonomous Parking",
    level1: "Generate motion path to parking space",
    level2: "Generate motion plan",
    level3: "Generate plan",
    level4: "Generate",
    color: CATEGORY_COLORS.Generate,
  },
  {
    aiExample: "Autonomous Parking",
    level1: "Act motion path to park by minimum moves",
    level2: "Act motion plan",
    level3: "Act plan",
    level4: "Act",
    color: CATEGORY_COLORS.Act,
  },

  // Text Generation
  {
    aiExample: "Text Generation",
    level1: "Generate next word of sentence",
    level2: "Generate word",
    level3: "Generate text",
    level4: "Generate",
    color: CATEGORY_COLORS.Generate,
  },
  {
    aiExample: "Text Generation",
    level1: "Generate ending of sentence",
    level2: "Generate sentence",
    level3: "Act plan",
    level4: "Act",
    color: CATEGORY_COLORS.Act,
  },
  {
    aiExample: "Text Generation",
    level1: "Compare phrases by partial sentence fit",
    level2: "Compare phrases",
    level3: "Compare entities",
    level4: "Compare",
    color: CATEGORY_COLORS.Compare,
  },
];

// ---------------------------------------------------------------------------
// Helpers: compute row spans for merged cells
// ---------------------------------------------------------------------------

interface SpanInfo {
  text: string;
  rowSpan: number;
  color: string;
  borderColor: string;
  isFirst: boolean;
}

/**
 * For a given column within an AI example group, compute which rows share
 * the same value so we can visually merge them with rowSpan.
 */
function computeSpans(
  rows: AbstractionRow[],
  levelKey: "level2" | "level3" | "level4"
): SpanInfo[] {
  const spans: SpanInfo[] = [];
  let i = 0;
  while (i < rows.length) {
    const current = rows[i];
    let count = 1;
    while (
      i + count < rows.length &&
      rows[i + count][levelKey] === current[levelKey]
    ) {
      count++;
    }
    for (let j = 0; j < count; j++) {
      spans.push({
        text: current[levelKey],
        rowSpan: count,
        color: current.color,
        borderColor: CATEGORY_BORDERS[current.level4] || "#9E9E9E",
        isFirst: j === 0,
      });
    }
    i += count;
  }
  return spans;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function AbstractionSankey({
  data = DEFAULT_DATA,
  className,
}: AbstractionSankeyProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredExample, setHoveredExample] = useState<string | null>(null);

  // Group data by AI Example (preserving order)
  const grouped = useMemo(() => {
    const map = new Map<string, AbstractionRow[]>();
    for (const row of data) {
      const existing = map.get(row.aiExample);
      if (existing) {
        existing.push(row);
      } else {
        map.set(row.aiExample, [row]);
      }
    }
    return map;
  }, [data]);

  // Precompute spans for levels 2-4 within each example group
  const spanMaps = useMemo(() => {
    const result = new Map<
      string,
      {
        level2: SpanInfo[];
        level3: SpanInfo[];
        level4: SpanInfo[];
      }
    >();
    for (const [name, rows] of grouped) {
      result.set(name, {
        level2: computeSpans(rows, "level2"),
        level3: computeSpans(rows, "level3"),
        level4: computeSpans(rows, "level4"),
      });
    }
    return result;
  }, [grouped]);

  // Flat index counter for hover
  let globalIndex = 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table
          className="w-full min-w-[900px] text-sm"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr className="bg-gray-50">
              <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200 min-w-[180px]">
                Exemplo de IA
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200 min-w-[220px]">
                <div>Nivel 1</div>
                <div className="font-normal normal-case tracking-normal text-gray-400 mt-0.5">
                  Acao + Inferencia + Dados
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200 min-w-[170px]">
                <div>Nivel 2</div>
                <div className="font-normal normal-case tracking-normal text-gray-400 mt-0.5">
                  Acao + Inferencia
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200 min-w-[150px]">
                <div>Nivel 3</div>
                <div className="font-normal normal-case tracking-normal text-gray-400 mt-0.5">
                  Acao + Inferencia
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200 min-w-[110px]">
                <div>Nivel 4</div>
                <div className="font-normal normal-case tracking-normal text-gray-400 mt-0.5">
                  Acao
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from(grouped.entries()).map(
              ([exampleName, rows]) => {
                const spans = spanMaps.get(exampleName)!;
                const startIndex = globalIndex;
                globalIndex += rows.length;

                return rows.map((row, rowIdx) => {
                  const absoluteIdx = startIndex + rowIdx;
                  const isHovered = hoveredRow === absoluteIdx;
                  const isExampleHovered = hoveredExample === exampleName;
                  const isFirstOfGroup = rowIdx === 0;
                  const isLastOfGroup = rowIdx === rows.length - 1;
                  const span2 = spans.level2[rowIdx];
                  const span3 = spans.level3[rowIdx];
                  const span4 = spans.level4[rowIdx];
                  const borderColor =
                    CATEGORY_BORDERS[row.level4] || "#9E9E9E";

                  return (
                    <tr
                      key={`${exampleName}-${rowIdx}`}
                      className={cn(
                        "transition-all duration-150",
                        isHovered && "relative z-[1]",
                        isLastOfGroup && "border-b border-gray-300"
                      )}
                      style={{
                        backgroundColor: isHovered
                          ? CATEGORY_COLORS_HOVER[row.level4] || "#F5F5F5"
                          : isExampleHovered
                            ? mixColor(row.color, "#FFFFFF", 0.5)
                            : row.color,
                      }}
                      onMouseEnter={() => {
                        setHoveredRow(absoluteIdx);
                        setHoveredExample(exampleName);
                      }}
                      onMouseLeave={() => {
                        setHoveredRow(null);
                        setHoveredExample(null);
                      }}
                    >
                      {/* AI Example - spans all rows of its group */}
                      {isFirstOfGroup && (
                        <td
                          rowSpan={rows.length}
                          className="sticky left-0 z-[5] px-4 py-2 align-top font-medium text-gray-800 border-r border-gray-200"
                          style={{
                            backgroundColor: isExampleHovered
                              ? "#F9FAFB"
                              : "#FFFFFF",
                            borderLeft: `4px solid ${borderColor}`,
                          }}
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold leading-snug">
                              {exampleName}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {rows.length} capacidade
                              {rows.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Level 1 - always unique per row */}
                      <td
                        className="px-4 py-2 text-xs text-gray-700 border-r border-gray-100"
                        style={{
                          borderBottom:
                            !isLastOfGroup
                              ? "1px solid rgba(0,0,0,0.06)"
                              : undefined,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: borderColor }}
                          />
                          {row.level1}
                        </div>
                      </td>

                      {/* Level 2 - with row span merging */}
                      {span2.isFirst && (
                        <td
                          rowSpan={span2.rowSpan}
                          className="px-4 py-2 text-xs text-gray-700 align-middle border-r border-gray-100"
                          style={{
                            borderLeft: `3px solid ${span2.borderColor}`,
                            backgroundColor:
                              span2.rowSpan > 1
                                ? mixColor(span2.color, "#FFFFFF", 0.3)
                                : undefined,
                          }}
                        >
                          <span className="font-medium">{span2.text}</span>
                          {span2.rowSpan > 1 && (
                            <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/60 text-[9px] text-gray-500">
                              {span2.rowSpan}
                            </span>
                          )}
                        </td>
                      )}

                      {/* Level 3 - with row span merging */}
                      {span3.isFirst && (
                        <td
                          rowSpan={span3.rowSpan}
                          className="px-4 py-2 text-xs text-gray-700 align-middle border-r border-gray-100"
                          style={{
                            borderLeft: `3px solid ${span3.borderColor}`,
                            backgroundColor:
                              span3.rowSpan > 1
                                ? mixColor(span3.color, "#FFFFFF", 0.2)
                                : undefined,
                          }}
                        >
                          <span className="font-medium">{span3.text}</span>
                          {span3.rowSpan > 1 && (
                            <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/60 text-[9px] text-gray-500">
                              {span3.rowSpan}
                            </span>
                          )}
                        </td>
                      )}

                      {/* Level 4 - with row span merging */}
                      {span4.isFirst && (
                        <td
                          rowSpan={span4.rowSpan}
                          className="px-4 py-2 text-xs font-semibold text-gray-800 align-middle"
                          style={{
                            borderLeft: `3px solid ${span4.borderColor}`,
                            backgroundColor: mixColor(
                              span4.color,
                              "#FFFFFF",
                              0.1
                            ),
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block h-3 w-3 rounded"
                              style={{ backgroundColor: span4.borderColor }}
                            />
                            <span className="text-sm">{span4.text}</span>
                          </div>
                          {span4.rowSpan > 1 && (
                            <span className="mt-0.5 block text-[9px] font-normal text-gray-400">
                              {span4.rowSpan} capacidades convergem
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                });
              }
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-3 px-1">
        <span className="text-xs font-medium text-gray-500">Legenda:</span>
        {Object.entries(CATEGORY_COLORS)
          .filter(([key]) => /^[A-Z]/.test(key))
          .map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded"
                style={{
                  backgroundColor: CATEGORY_BORDERS[name] || "#9E9E9E",
                }}
              />
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-medium text-gray-700"
                style={{ backgroundColor: color }}
              >
                {name}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Simple version - filter by selected examples
// ---------------------------------------------------------------------------

export function AbstractionSankeySimple({
  selectedExamples,
  className,
}: AbstractionSankeySimpleProps) {
  const filteredData = useMemo(() => {
    if (!selectedExamples || selectedExamples.length === 0) {
      return DEFAULT_DATA;
    }
    const selected = new Set(
      selectedExamples.map((s) => s.toLowerCase().trim())
    );
    return DEFAULT_DATA.filter((row) =>
      selected.has(row.aiExample.toLowerCase().trim())
    );
  }, [selectedExamples]);

  const [highlightedLevel4, setHighlightedLevel4] = useState<string | null>(
    null
  );

  // Group data by AI Example
  const grouped = useMemo(() => {
    const map = new Map<string, AbstractionRow[]>();
    for (const row of filteredData) {
      const existing = map.get(row.aiExample);
      if (existing) {
        existing.push(row);
      } else {
        map.set(row.aiExample, [row]);
      }
    }
    return map;
  }, [filteredData]);

  const toggleHighlight = (level4: string) => {
    setHighlightedLevel4((prev) => (prev === level4 ? null : level4));
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table
          className="w-full min-w-[800px] text-sm"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr className="bg-gray-50">
              <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                Exemplo de IA
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                Nivel 1
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                Nivel 2
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                Nivel 3
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                Nivel 4
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from(grouped.entries()).map(([exampleName, rows]) =>
              rows.map((row, rowIdx) => {
                const isFirstOfGroup = rowIdx === 0;
                const isLastOfGroup = rowIdx === rows.length - 1;
                const borderColor =
                  CATEGORY_BORDERS[row.level4] || "#9E9E9E";
                const isDimmed =
                  highlightedLevel4 !== null &&
                  row.level4 !== highlightedLevel4;

                return (
                  <tr
                    key={`${exampleName}-${rowIdx}`}
                    className={cn(
                      "transition-all duration-200",
                      isLastOfGroup && "border-b border-gray-300",
                      isDimmed && "opacity-25"
                    )}
                    style={{
                      backgroundColor: row.color,
                    }}
                  >
                    {isFirstOfGroup && (
                      <td
                        rowSpan={rows.length}
                        className="sticky left-0 z-[5] px-4 py-2 align-top font-semibold text-sm text-gray-800 border-r border-gray-200 bg-white"
                        style={{
                          borderLeft: `4px solid ${borderColor}`,
                        }}
                      >
                        {exampleName}
                      </td>
                    )}
                    <td
                      className="px-4 py-2 text-xs text-gray-700 border-r border-gray-100"
                      style={{
                        borderBottom: !isLastOfGroup
                          ? "1px solid rgba(0,0,0,0.06)"
                          : undefined,
                      }}
                    >
                      {row.level1}
                    </td>
                    <td
                      className="px-4 py-2 text-xs text-gray-700 border-r border-gray-100"
                      style={{
                        borderLeft: `2px solid ${borderColor}`,
                        borderBottom: !isLastOfGroup
                          ? "1px solid rgba(0,0,0,0.06)"
                          : undefined,
                      }}
                    >
                      {row.level2}
                    </td>
                    <td
                      className="px-4 py-2 text-xs text-gray-700 border-r border-gray-100"
                      style={{
                        borderLeft: `2px solid ${borderColor}`,
                        borderBottom: !isLastOfGroup
                          ? "1px solid rgba(0,0,0,0.06)"
                          : undefined,
                      }}
                    >
                      {row.level3}
                    </td>
                    <td
                      className="px-4 py-2 text-xs font-semibold text-gray-800 cursor-pointer"
                      style={{
                        borderLeft: `3px solid ${borderColor}`,
                      }}
                      onClick={() => toggleHighlight(row.level4)}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded"
                          style={{ backgroundColor: borderColor }}
                        />
                        {row.level4}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Selected examples indicator */}
      {selectedExamples && selectedExamples.length > 0 && (
        <div className="mt-3 flex items-center gap-2 px-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Filtrado:
          </span>
          {selectedExamples.map((name) => (
            <span
              key={name}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-600"
            >
              {name}
            </span>
          ))}
          {highlightedLevel4 && (
            <button
              onClick={() => setHighlightedLevel4(null)}
              className="ml-auto rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 hover:bg-gray-200 transition-colors"
            >
              Limpar destaque
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utility: simple color mixing (no external deps)
// ---------------------------------------------------------------------------

function mixColor(hex1: string, hex2: string, weight: number): string {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    ];
  };
  const c1 = parse(hex1);
  const c2 = parse(hex2);
  const mix = c1.map((v, i) =>
    Math.round(v * (1 - weight) + c2[i] * weight)
  );
  return `#${mix.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

// ---------------------------------------------------------------------------
// Re-export data and types for external use
// ---------------------------------------------------------------------------

export { DEFAULT_DATA, CATEGORY_COLORS, CATEGORY_BORDERS };
