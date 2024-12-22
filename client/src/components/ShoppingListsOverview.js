import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const ShoppingListsOverview = ({ shoppingLists = [] }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  // Filter out archived lists and prepare data
  const chartData = shoppingLists
    .filter(list => !list.isArchived)
    .map(list => ({
      name: list.name,
      total: list.items?.length || 0,
      solved: list.items?.filter(item => item.is_solved).length || 0
    }));

  const textColor = isDarkMode ? '#fff' : '#000';

  return (
    <div className="mb-4">
      <h4 className="text-center mb-3">Shopping Lists Overview</h4>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#e5e7eb'}
            />
            <XAxis 
              dataKey="name"
              tick={{ fill: textColor }}
            />
            <YAxis 
              tick={{ fill: textColor }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#2d3748' : '#fff',
                border: 'none',
                borderRadius: '8px',
                color: textColor
              }}
            />
            <Legend
              wrapperStyle={{
                color: textColor
              }}
            />
            <Bar dataKey="total" fill="#94a3b8" name={t('totalItems')} />
            <Bar dataKey="solved" fill="#4ade80" name={t('solvedItems')} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ShoppingListsOverview;