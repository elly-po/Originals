interface SimpleLineChartProps {
  data: Array<{ label: string; value: number }>;
  width?: number;
  height?: number;
  color?: string;
}

export function SimpleLineChart({ data, width = 280, height = 150, color = '#8B7355' }: SimpleLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <p className="font-sans-clean text-charcoal-500 text-sm">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + (1 - item.value / maxValue) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative bg-oatmeal-25 border border-oatmeal-300 p-2">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5D5BE" strokeWidth="0.5" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />
        
        {/* Chart line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth;
          const y = padding + (1 - item.value / maxValue) * chartHeight;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className="hover:r-4 transition-all"
            />
          );
        })}
      </svg>
      
      {/* Value labels */}
      <div className="mt-2 flex justify-between text-xs font-sans-clean text-charcoal-600">
        {data.length > 0 && (
          <>
            <span>{data[0].label}</span>
            <span>Max: {maxValue}</span>
            <span>{data[data.length - 1].label}</span>
          </>
        )}
      </div>
    </div>
  );
}

interface SimpleBarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  width?: number;
  height?: number;
}

export function SimpleBarChart({ data, width = 280, height = 200 }: SimpleBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <p className="font-sans-clean text-charcoal-500 text-sm">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const barWidth = chartWidth / data.length * 0.7;
  const barSpacing = chartWidth / data.length * 0.3;

  return (
    <div className="relative bg-oatmeal-25 border border-oatmeal-300 p-2">
      <svg width={width} height={height}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
          const y = padding + chartHeight - barHeight;
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color || '#8B7355'}
                className="hover:opacity-80 transition-opacity"
              />
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="font-sans-clean text-xs fill-charcoal-700"
              >
                {item.value}
              </text>
            </g>
          );
        })}
        
        {/* X-axis labels */}
        {data.map((item, index) => {
          const x = padding + index * (barWidth + barSpacing) + barSpacing / 2 + barWidth / 2;
          const y = height - 5;
          
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              className="font-sans-clean text-xs fill-charcoal-600"
            >
              {item.label.length > 8 ? item.label.substring(0, 8) + '...' : item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}