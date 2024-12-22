import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const ShoppingListDetailChart = ({ items = [] }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  const solvedCount = items.filter(item => item.is_solved).length;
  const unsolvedCount = items.filter(item => !item.is_solved).length;

  const data = items.length === 0 
    ? [{ name: t('noItems'), value: 1 }]
    : [
        { name: t('solvedItems'), value: solvedCount },
        { name: t('unsolvedItems'), value: unsolvedCount }
      ];

  const COLORS = ['#4ade80', '#fb923c']; // Green for solved, Orange for unsolved

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`bg-${isDarkMode ? 'dark' : 'light'} p-2 rounded border-0`}>
          <p className="mb-0">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={0}
            endAngle={360}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={items.length === 0 ? '#6b7280' : COLORS[index]}
                stroke={isDarkMode ? '#1f2937' : '#fff'}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            align="center"
            verticalAlign="bottom"
            formatter={(value) => value} // Now using translated values from data
            wrapperStyle={{
              color: isDarkMode ? '#fff' : '#000'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShoppingListDetailChart;