import { useState, useEffect } from "react";
import { ExpenseService } from "../services/expenseService";

/**
 * Custom hook สำหรับจัดการข้อมูลรายจ่าย
 * @param {number} refreshTrigger - trigger สำหรับ refresh ข้อมูล
 * @param {boolean} sorted - เรียงลำดับตามวันที่หรือไม่
 * @returns {Object} { expenses, loading, error }
 */
export const useExpenses = function (refreshTrigger, sorted) {
  if (refreshTrigger === undefined) refreshTrigger = 0;
  if (sorted === undefined) sorted = false;
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    //ดึงข้อมูลจาก Firebase
  useEffect(
    function () {
      setLoading(true);
      setError(null);

      let subscribeFunction;
      if (sorted) {
        subscribeFunction = ExpenseService.subscribeToExpensesSorted;
      } else {
        subscribeFunction = ExpenseService.subscribeToExpenses;
      }

      const unsubscribe = subscribeFunction(function (expensesData) {
        setExpenses(expensesData);
        setLoading(false);
      }, refreshTrigger);

      // Error handling สำหรับ Firebase subscription
      const handleError = function (error) {
        console.error("Error in useExpenses:", error);
        setError("ไม่สามารถโหลดข้อมูลรายจ่ายได้");
        setLoading(false);
      };

      return function () {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    },
    [refreshTrigger, sorted]
  );

  return { expenses, loading, error };
};
