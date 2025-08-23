import React from 'react';
import { useExpenseForm } from '../hooks/useExpenseForm';
// import './ExpenseForm.css';

function ExpenseForm(props) {
  const onExpenseAdded = props.onExpenseAdded;
  const {
    expense,
    loading,
    error,
    categories,
    handleChange,
    handleSubmit,
    resetForm
  } = useExpenseForm(onExpenseAdded);

  return (
    <div className="expense-form-container">
      <h2>Add New Expense</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="amount">Amount (฿)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={expense.description}
            onChange={handleChange}
            placeholder="Enter expense description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={expense.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(function(category) {
              return (
                <option key={category} value={category}>
                  {category}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;