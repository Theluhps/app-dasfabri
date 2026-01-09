
"use client";

import React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartProps {
  data: any[];
  categories?: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  startEndOnly?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showCartesianGrid?: boolean;
  className?: string;
}

export const LineChart = ({
  data,
  categories = ["value"],
  index,
  colors = ["#2563eb"],
  valueFormatter = (value) => value.toString(),
  startEndOnly = false,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  showTooltip = true,
  showCartesianGrid = true,
  className,
}: ChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          {showCartesianGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {showXAxis && (
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (startEndOnly) {
                  const index = data.findIndex((item: any) => item[index] === value);
                  if (index === 0 || index === data.length - 1) {
                    return value;
                  }
                  return "";
                }
                return value;
              }}
            />
          )}
          {showYAxis && <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />}
          {showTooltip && (
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-sm">
                      <div className="font-bold">{label}</div>
                      {payload.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <span
                              className="block h-2 w-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-gray-500">
                              {item.name}:
                            </span>
                          </div>
                          <span className="font-semibold">
                            {valueFormatter(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={40}
              content={({ payload }) => {
                if (payload && payload.length) {
                  return (
                    <div className="flex items-center justify-center gap-4">
                      {payload.map((entry: any, index: number) => (
                        <div key={`item-${index}`} className="flex items-center gap-1">
                          <span
                            className="block h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm text-gray-500">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          {categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, style: { fill: colors[index % colors.length] } }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChart = ({
  data,
  categories = ["value"],
  index,
  colors = ["#2563eb"],
  valueFormatter = (value) => value.toString(),
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  showTooltip = true,
  showCartesianGrid = true,
  className,
}: ChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          {showCartesianGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {showXAxis && (
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
          )}
          {showYAxis && <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />}
          {showTooltip && (
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-sm">
                      <div className="font-bold">{label}</div>
                      {payload.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <span
                              className="block h-2 w-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-gray-500">
                              {item.name}:
                            </span>
                          </div>
                          <span className="font-semibold">
                            {valueFormatter(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={40}
              content={({ payload }) => {
                if (payload && payload.length) {
                  return (
                    <div className="flex items-center justify-center gap-4">
                      {payload.map((entry: any, index: number) => (
                        <div key={`item-${index}`} className="flex items-center gap-1">
                          <span
                            className="block h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm text-gray-500">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AreaChart = ({
  data,
  categories = ["value"],
  index,
  colors = ["#2563eb"],
  valueFormatter = (value) => value.toString(),
  startEndOnly = false,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  showTooltip = true,
  showCartesianGrid = true,
  className,
}: ChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          {showCartesianGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {showXAxis && (
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (startEndOnly) {
                  const index = data.findIndex((item: any) => item[index] === value);
                  if (index === 0 || index === data.length - 1) {
                    return value;
                  }
                  return "";
                }
                return value;
              }}
            />
          )}
          {showYAxis && <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />}
          {showTooltip && (
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-sm">
                      <div className="font-bold">{label}</div>
                      {payload.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <span
                              className="block h-2 w-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-gray-500">
                              {item.name}:
                            </span>
                          </div>
                          <span className="font-semibold">
                            {valueFormatter(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={40}
              content={({ payload }) => {
                if (payload && payload.length) {
                  return (
                    <div className="flex items-center justify-center gap-4">
                      {payload.map((entry: any, index: number) => (
                        <div key={`item-${index}`} className="flex items-center gap-1">
                          <span
                            className="block h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm text-gray-500">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          {categories.map((category, index) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.1}
              strokeWidth={2}
              activeDot={{ r: 6, style: { fill: colors[index % colors.length] } }}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PieChartProps {
  data: any[];
  index: string;
  valueFormatter?: (value: number) => string;
  className?: string;
}

export const PieChart = ({
  data,
  index,
  valueFormatter = (value) => value.toString(),
  className,
}: PieChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey={index}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-white p-2 shadow-sm">
                    <div className="font-bold">{data[index]}</div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-500">Valor:</span>
                      <span className="font-semibold">
                        {valueFormatter(data.value)}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            content={({ payload }) => {
              if (payload && payload.length) {
                return (
                  <div className="flex flex-col gap-2">
                    {payload.map((entry: any, index: number) => (
                      <div key={`item-${index}`} className="flex items-center gap-1">
                        <span
                          className="block h-3 w-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-gray-500">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
