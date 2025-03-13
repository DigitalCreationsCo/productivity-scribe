
import React from 'react';
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: (number | null)[];
    backgroundColor?: string | string[];
    borderColor?: string;
    fill?: boolean;
    tension?: number;
  }[];
}

interface ChartOptions {
  plugins?: {
    legend?: {
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
  };
}

interface ChartProps {
  data: ChartData;
  options?: ChartOptions;
  className?: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

export const BarChart = ({ data, options, className }: ChartProps) => {
  // Transform the data format from Chart.js-like to Recharts format
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: { [key: string]: string | number } = { name: label };
    
    data.datasets.forEach((dataset, datasetIndex) => {
      const value = dataset.data[index];
      dataPoint[dataset.label || `Dataset ${datasetIndex}`] = value !== null ? value : 0;
    });
    
    return dataPoint;
  });

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={transformedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.datasets.map((dataset, index) => (
            <Bar
              key={index}
              dataKey={dataset.label || `Dataset ${index}`}
              fill={Array.isArray(dataset.backgroundColor) 
                ? dataset.backgroundColor[0] 
                : dataset.backgroundColor || COLORS[index % COLORS.length]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LineChart = ({ data, options, className }: ChartProps) => {
  // Transform the data format from Chart.js-like to Recharts format
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: { [key: string]: string | number } = { name: label };
    
    data.datasets.forEach((dataset, datasetIndex) => {
      const value = dataset.data[index];
      dataPoint[dataset.label || `Dataset ${datasetIndex}`] = value !== null ? value : 0;
    });
    
    return dataPoint;
  });

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={transformedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.datasets.map((dataset, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={dataset.label || `Dataset ${index}`}
              stroke={dataset.borderColor || COLORS[index % COLORS.length]}
              fill={dataset.fill 
                ? dataset.backgroundColor || `${COLORS[index % COLORS.length]}20` 
                : undefined}
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
              strokeWidth={2}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieChart = ({ data, options, className }: ChartProps) => {
  // Since Pie charts typically have only one dataset
  const dataset = data.datasets[0];
  const pieData = data.labels.map((label, index) => ({
    name: label,
    value: dataset.data[index] !== null ? dataset.data[index] : 0,
  }));

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  Array.isArray(dataset.backgroundColor)
                    ? dataset.backgroundColor[index % dataset.backgroundColor.length]
                    : COLORS[index % COLORS.length]
                }
              />
            ))}
          </Pie>
          <Tooltip />
          {options?.plugins?.legend?.position !== 'left' && 
           options?.plugins?.legend?.position !== 'right' && <Legend />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
