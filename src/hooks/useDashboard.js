import { useState, useMemo } from 'react';
import { useExpenses } from './useExpenses';
import { DashboardService } from '../services/dashboardService';

/**
 * Custom hook สำหรับจัดการ logic ของ Dashboard
 * @param {number} refreshTrigger - trigger สำหรับ refresh ข้อมูล
 * @returns {Object} ข้อมูลและฟังก์ชันสำหรับ Dashboard
 */
export const useDashboard = function(refreshTrigger) {
  if (refreshTrigger === undefined) refreshTrigger = 0;
  const [timeFilter, setTimeFilter] = useState('all');
  const { expenses, loading, error } = useExpenses(refreshTrigger);

  // คำนวณข้อมูลต่างๆ ด้วย useMemo เพื่อ optimize performance
  const dashboardData = useMemo(function() {
    if (loading || expenses.length === 0) {
      return {
        filteredExpenses: [],
        totalExpenses: 0,
        categoryBreakdown: [],
        pieChartData: [],
        progressChartData: []
      };
    }

    const filteredExpenses = DashboardService.filterExpensesByTime(expenses, timeFilter);
    const totalExpenses = DashboardService.calculateTotalExpenses(filteredExpenses);
    const categoryBreakdown = DashboardService.getCategoryBreakdown(filteredExpenses);
    const pieChartData = DashboardService.preparePieChartData(categoryBreakdown);
    const progressChartData = DashboardService.prepareProgressChartData(categoryBreakdown, totalExpenses);

    return {
      filteredExpenses: filteredExpenses,
      totalExpenses: totalExpenses,
      categoryBreakdown: categoryBreakdown,
      pieChartData: pieChartData,
      progressChartData: progressChartData
    };
  }, [expenses, timeFilter, loading]);

  const timeFilterLabel = DashboardService.getTimeFilterLabel(timeFilter);

  return {
    filteredExpenses: dashboardData.filteredExpenses,
    totalExpenses: dashboardData.totalExpenses,
    categoryBreakdown: dashboardData.categoryBreakdown,
    pieChartData: dashboardData.pieChartData,
    progressChartData: dashboardData.progressChartData,
    timeFilter: timeFilter,
    setTimeFilter: setTimeFilter,
    timeFilterLabel: timeFilterLabel,
    loading: loading,
    error: error
  };
};