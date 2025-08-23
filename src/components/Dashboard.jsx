import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardService } from '../services/dashboardService';
import './Dashboard.css';

// Utility function
function formatAmount(amount) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount);
}

const Dashboard = function({ refreshTrigger }) {
  const {
    filteredExpenses,
    totalExpenses,
    categoryBreakdown,
    pieChartData,
    progressChartData,
    timeFilter,
    setTimeFilter,
    timeFilterLabel,
    loading,
    error
  } = useDashboard(refreshTrigger);

  const CustomTooltip = function({ active, payload }) {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = DashboardService.calculatePercentage(data.value, totalExpenses);
      return (
        <div className="custom-tooltip">
          <p className="tooltip-category">{data.payload.name}</p>
          <p className="tooltip-amount">{formatAmount(data.value)}</p>
          <p className="tooltip-percentage">{`${percentage.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Expense Dashboard</h2>
        <div className="time-filter">
          <select 
            value={timeFilter} 
            onChange={function(e) { setTimeFilter(e.target.value); }}
            className="filter-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card total">
          <h3>Total Expenses</h3>
          <p className="amount">{formatAmount(totalExpenses)}</p>
          <p className="period">{timeFilterLabel}</p>
        </div>
        
        <div className="summary-card count">
          <h3>Transaction Count</h3>
          <p className="amount">{filteredExpenses.length}</p>
          <p className="period">{timeFilterLabel}</p>
        </div>
      </div>
      
      {/* Dashboard Charts */}
      {categoryBreakdown.length > 0 && (
        <div className="dashboard-charts">
          {/* Pie Chart with Recharts */}
          <div className="chart-section">
            <h3>Expenses by Category</h3>
            <div className="pie-chart-container" style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieChartData.map(function(entry, index) {
                      return (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      );
                    })}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    formatter={function(value) { return value; }}
                    wrapperStyle={{ fontSize: '14px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Bars Chart */}
          <div className="chart-section">
            <h3>Category Progress</h3>
            <div className="progress-chart">
              {progressChartData.map(function(item) {
                return (
                  <div key={item.category} className="progress-item">
                  <div className="progress-header">
                    <span className="progress-category">{item.category}</span>
                    <span className="progress-amount">{formatAmount(item.amount)}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                        height: '25px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;