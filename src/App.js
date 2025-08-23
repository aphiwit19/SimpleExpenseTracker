import React, { useState } from "react";
import Dashboard from "./components/Dashboard.jsx";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 🔄 สัญญาณรีเฟรช

  const handleExpenseAdded = () => {
    setRefreshTrigger((prev) => prev + 1); // เปลี่ยนค่าเพื่อกระตุ้นการรีเฟรช
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <nav className="navigation">
          <button
            className={activeTab === "dashboard" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={activeTab === "add" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("add")}
          >
            Add Expense
          </button>
          <button
            className={activeTab === "list" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("list")}
          >
            Expense List
          </button>
        </nav>
      </header>

      <main className="app-content">
        {activeTab === "dashboard" && (
          <Dashboard refreshTrigger={refreshTrigger} />
        )}
        {activeTab === "add" && (
          <ExpenseForm onExpenseAdded={handleExpenseAdded} />
        )}
        {activeTab === "list" && (
          <ExpenseList refreshTrigger={refreshTrigger} />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Expense Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
