import React, { useState, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { ExpenseService } from '../services/expenseService';
import './ExpenseList.css';

// Utility functions
function formatAmount(amount) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB');
}

function showAlert(message) {
  alert(message);
}

function showConfirmation(message) {
  return window.confirm(message);
}

//ดึงรายการจาก firebase
function ExpenseList(props) {
  const refreshTrigger = props.refreshTrigger;
  const { expenses, loading, error } = useExpenses(refreshTrigger, true); // sorted = true
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 items per page
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: ''
  });

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

  useEffect(function() {
    let filtered = [];
    for (let i = 0; i < expenses.length; i++) {
      filtered.push(expenses[i]);
    }

    // กรองตามหมวดหมู่
    if (filters.category) {
      const categoryFiltered = [];
      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i].category === filters.category) {
          categoryFiltered.push(filtered[i]);
        }
      }
      filtered = categoryFiltered;
    }

    // กรองตามวันที่เริ่มต้น
    if (filters.dateFrom) {
      const dateFromFiltered = [];
      for (let i = 0; i < filtered.length; i++) {
        if (new Date(filtered[i].date) >= new Date(filters.dateFrom)) {
          dateFromFiltered.push(filtered[i]);
        }
      }
      filtered = dateFromFiltered;
    }
      // กรองตามวันที่สิ้นสุด
    if (filters.dateTo) {
      const dateToFiltered = [];
      for (let i = 0; i < filtered.length; i++) {
        if (new Date(filtered[i].date) <= new Date(filters.dateTo)) {
          dateToFiltered.push(filtered[i]);
        }
      }
      filtered = dateToFiltered;
    }

    //เรียงลำดับตามวันที่ (ใหม่สุดก่อน) ในหน้ารายการ
    for (let i = 0; i < filtered.length - 1; i++) {
      for (let j = 0; j < filtered.length - 1 - i; j++) {
        if (new Date(filtered[j].date) < new Date(filtered[j + 1].date)) {
          const temp = filtered[j];
          filtered[j] = filtered[j + 1];
          filtered[j + 1] = temp;
        }
      }
    }

    setFilteredExpenses(filtered);
    setCurrentPage(1); // รีเซ็ตกลับหน้า 1 เมื่อกรองใหม่
  }, [expenses, filters]);

  const handleFilterChange = function(e) {
    const name = e.target.name;
    const value = e.target.value;
    const newFilters = {};
    const filterKeys = Object.keys(filters);
    for (let i = 0; i < filterKeys.length; i++) {
      const key = filterKeys[i];
      newFilters[key] = filters[key];
    }
    newFilters[name] = value;
    setFilters(newFilters);
  };

  // ฟังก์ชันเปลี่ยนไปหน้า
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);

  const handlePageChange = function(page) {
    setCurrentPage(page);
    
    const element = document.querySelector('.expense-list-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrevPage = function() {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = function() {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };
  //ฟังก์ชันลบรายการค่าใช้จ่าย
  const handleDelete = async function(id) {
    if (showConfirmation('Are you sure you want to delete this expense?')) {
      try {
        await ExpenseService.deleteExpense(id);
        showAlert('Expense deleted successfully!');
      } catch (error) {
        showAlert(error.message);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="expense-list-container">
      <div className="list-header">
        <h2>Expenses ({filteredExpenses.length})</h2>
        {totalPages > 1 && (
          <div className="pagination-info">
            Page {currentPage} of {totalPages} | Showing {startIndex + 1}-{Math.min(endIndex, filteredExpenses.length)} of {filteredExpenses.length}
          </div>
        )}
      </div>
      
      {/* Filters with Category */}
      <div className="filters">
        <div className="filter-group">
          <label>Category</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            {categories.map(function(category) {
              return (
                <option key={category} value={category}>{category}</option>
              );
            })}
          </select>
        </div>

        <div className="filter-group">
          <label>From Date</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Expense List */}
      <div className="expenses-grid">
        {filteredExpenses.length === 0 ? (
          <div className="no-expenses">No expenses found</div>
        ) : (
          currentExpenses.map(function(expense) {
            return (
              <div key={expense.id} className="expense-item">
                <div className="expense-header">
                  <span className="expense-amount">{formatAmount(expense.amount)}</span>
                  <span className="expense-date">{formatDate(expense.date)}</span>
                </div>
                <div className="expense-description">{expense.description}</div>
                <div className="expense-category">
                  <span className="category-tag">{expense.category}</span>
                  <button 
                    onClick={function() { handleDelete(expense.id); }}
                    className="delete-btn"
                    title="Delete expense"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="pagination-btn prev-btn"
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, function(_, i) { return i + 1; }).map(function(page) {
              return (
                <button
                  key={page}
                  onClick={function() { handlePageChange(page); }}
                  className={currentPage === page ? 'page-btn active' : 'page-btn'}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-btn next-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;