//ervice สำหรับจัดการ logic ของ Dashboard

export class DashboardService {
  /**
   * กรองข้อมูลรายจ่ายตามช่วงเวลา
   * @param {Array} expenses - รายการรายจ่าย
   * @param {string} timeFilter - ตัวกรองเวลา (week, month, year, all)
   * @returns {Array} รายการรายจ่ายที่ถูกกรอง
   */
  static filterExpensesByTime(expenses, timeFilter) {
    if (timeFilter === 'all') {
      return expenses;
    }

    const now = new Date();
    let startDate;

    switch (timeFilter) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return expenses;
    }

    return expenses.filter(expense => new Date(expense.date) >= startDate);
  }

  /**
   * คำนวณยอดรวมรายจ่าย
   * @param {Array} expenses - รายการรายจ่าย
   * @returns {number} ยอดรวม
   */
  static calculateTotalExpenses(expenses) {
    let total = 0;
    for (let i = 0; i < expenses.length; i++) {
      total += expenses[i].amount;
    }
    return total;
  }

  /**
   * จัดกลุ่มรายจ่ายตามหมวดหมู่
   * @param {Array} expenses - รายการรายจ่าย
   * @returns {Array} รายการหมวดหมู่พร้อมยอดรวม
   */
  static getCategoryBreakdown(expenses) {
    const breakdown = {};
    
    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i];
      if (breakdown[expense.category]) {
        breakdown[expense.category] += expense.amount;
      } else {
        breakdown[expense.category] = expense.amount;
      }
    }

    // แปลง object เป็น array
    const result = [];
    const categories = Object.keys(breakdown);
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      result.push({
        category: category,
        amount: breakdown[category]
      });
    }

    // เรียงจากมากไปน้อย
    for (let i = 0; i < result.length - 1; i++) {
      for (let j = 0; j < result.length - 1 - i; j++) {
        if (result[j].amount < result[j + 1].amount) {
          const temp = result[j];
          result[j] = result[j + 1];
          result[j + 1] = temp;
        }
      }
    }

    return result;
  }

  /**
   * เตรียมข้อมูลสำหรับ Pie Chart
   * @param {Array} categoryBreakdown - ข้อมูลแบ่งตามหมวดหมู่
   * @returns {Array} ข้อมูลสำหรับ Pie Chart
   */
  static preparePieChartData(categoryBreakdown) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f', '#bb8fce'];
    
    const result = [];
    for (let i = 0; i < categoryBreakdown.length; i++) {
      const item = categoryBreakdown[i];
      const colorIndex = i % colors.length; // หมุนเวียนสี
      
      result.push({
        name: item.category,
        value: item.amount,
        color: colors[colorIndex]
      });
    }
    
    return result;
  }

  /**
   * เตรียมข้อมูลสำหรับ Progress Chart (แสดงเฉพาะ 5 อันดับแรก)
   * @param {Array} categoryBreakdown - ข้อมูลแบ่งตามหมวดหมู่
   * @param {number} totalExpenses - ยอดรวมทั้งหมด
   * @returns {Array} ข้อมูลสำหรับ Progress Chart
   */
  static prepareProgressChartData(categoryBreakdown, totalExpenses) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    
    const result = [];
    const maxItems = 5; // แสดงแค่ 5 อันดับแรก
    
    for (let i = 0; i < categoryBreakdown.length && i < maxItems; i++) {
      const item = categoryBreakdown[i];
      const colorIndex = i % colors.length;
      
      let percentage = 0;
      if (totalExpenses > 0) {
        percentage = (item.amount / totalExpenses) * 100;
      }
      
      result.push({
        category: item.category,
        amount: item.amount,
        percentage: percentage,
        color: colors[colorIndex]
      });
    }
    
    return result;
  }

  /**
   * คำนวณเปอร์เซ็นต์สำหรับหมวดหมู่
   * @param {number} amount - ยอดเงินของหมวดหมู่
   * @param {number} totalExpenses - ยอดรวมทั้งหมด
   * @returns {number} เปอร์เซ็นต์
   */
  static calculatePercentage(amount, totalExpenses) {
    if (totalExpenses > 0) {
      return (amount / totalExpenses) * 100;
    } else {
      return 0;
    }
  }

  /**
   * ได้ label สำหรับ time filter
   * @param {string} timeFilter - ตัวกรองเวลา
   * @returns {string} label
   */
  static getTimeFilterLabel(timeFilter) {
    switch (timeFilter) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'All Time';
    }
  }
}