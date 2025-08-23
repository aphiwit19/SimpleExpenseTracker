import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

export class ExpenseService {
  //เพิ่มรายจ่ายใหม่
  static async addExpense(expenseData) {
    try {
      const newExpense = {
        amount: parseFloat(expenseData.amount),
        description: expenseData.description,
        category: expenseData.category,
        createdAt: new Date(),
        date: new Date(expenseData.date),
      };

      const docRef = await addDoc(collection(db, "expenses"), newExpense);
      return docRef;
    } catch (error) {
      console.error("Error adding expense: ", error);
      throw new Error("ไม่สามารถเพิ่มรายจ่ายได้ กรุณาลองใหม่อีกครั้ง");
    }
  }
  // ฟังข้อมูลแบบ Real-time
  static subscribeToExpenses(callback, refreshTrigger = 0) {
    const q = query(collection(db, "expenses"));

    return onSnapshot(q, function (querySnapshot) {
      const expenses = [];
      querySnapshot.forEach(function (doc) {
        const data = doc.data();
        const expense = {
          id: doc.id,
          amount: data.amount,
          description: data.description,
          category: data.category,
          createdAt: data.createdAt,
          date:
            data.date && data.date.toDate
              ? data.date.toDate()
              : new Date(data.date),
        };
        expenses.push(expense);
      });
      callback(expenses);
    });
  }
  //ฟังข้อมูลแบบเรียงลำดับ
  static subscribeToExpensesSorted(callback, refreshTrigger = 0) {
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));

    return onSnapshot(q, function (querySnapshot) {
      const expenses = [];
      querySnapshot.forEach(function (doc) {
        const data = doc.data();
        const expense = {
          id: doc.id,
          amount: data.amount,
          description: data.description,
          category: data.category,
          createdAt: data.createdAt,
          date:
            data.date && data.date.toDate
              ? data.date.toDate()
              : new Date(data.date),
        };
        expenses.push(expense);
      });
      callback(expenses);
    });
  }
  //ลบรายจ่าย
  static async deleteExpense(expenseId) {
    try {
      await deleteDoc(doc(db, "expenses", expenseId));
    } catch (error) {
      console.error("Error deleting expense: ", error);
      throw new Error("ไม่สามารถลบรายจ่ายได้ กรุณาลองใหม่อีกครั้ง");
    }
  }
}
