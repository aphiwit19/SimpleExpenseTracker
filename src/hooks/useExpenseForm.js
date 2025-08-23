import { useState } from 'react';
import { ExpenseService } from '../services/expenseService';

// Utility functions
function dateToInputFormat(date = new Date()) {
  return date.toISOString().split('T')[0];
}

function validateFormData(formData, requiredFields) {
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    const value = formData[field];
    
    if (value === null || value === undefined || value === '') {
      return false;
    }
  }
  return true;
}

function showAlert(message, type = 'info') {
  alert(message);
}

/**
 * Custom hook สำหรับจัดการ Expense Form
 * @param {Function} onExpenseAdded - callback เมื่อเพิ่มรายจ่ายสำเร็จ
 * @returns {Object} form state และฟังก์ชันจัดการ
 */
export const useExpenseForm = function(onExpenseAdded) {
  const [expense, setExpense] = useState({
    amount: '',
    description: '',
    category: '',
    date: dateToInputFormat()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'Food & Dining',
    'Transportation', 
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Others'
  ];

  const handleChange = function(e) {
    const name = e.target.name;
    const value = e.target.value;
    const newExpense = {};
    const expenseKeys = Object.keys(expense);
    for (let i = 0; i < expenseKeys.length; i++) {
      const key = expenseKeys[i];
      newExpense[key] = expense[key];
    }
    newExpense[name] = value;
    setExpense(newExpense);
    
    // Clear error เมื่อผู้ใช้เริ่มแก้ไข
    if (error) setError(null);
  };

  const resetForm = function() {
    setExpense({
      amount: '',
      description: '',
      category: '',
      date: dateToInputFormat()
    });
    setError(null);
  };

  const validateForm = function() {
    const requiredFields = ['amount', 'description', 'category'];
    if (!validateFormData(expense, requiredFields)) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return false;
    }

    if (parseFloat(expense.amount) <= 0) {
      setError('จำนวนเงินต้องมากกว่า 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await ExpenseService.addExpense(expense);
      
      resetForm();
      
      if (onExpenseAdded) {
        onExpenseAdded();
      }
      
      showAlert('เพิ่มรายจ่ายสำเร็จ!', 'success');
    } catch (error) {
      setError(error.message);
      showAlert(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    expense,
    loading,
    error,
    categories,
    handleChange,
    handleSubmit,
    resetForm
  };
};