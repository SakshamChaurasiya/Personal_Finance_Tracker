import React,{ createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getAllTransactions, addTransaction, editTransaction, deleteTransaction } from "../api/api";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

 
  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data } = await getAllTransactions();
      setTransactions(data); 
    } catch (err) {
      console.error("Fetch transactions error:", err.response?.data || err.message);
      setTransactions([]);
    }
  };


  const addNewTransaction = async (transaction) => {
    try {
     
      const payload = {
        ...transaction,
        ...(transaction.createdAt ? { createdAt: new Date(transaction.createdAt) } : {})
      };

      const { data } = await addTransaction(payload);
      setTransactions((prev) => [...prev, data.newTransaction]);
    } catch (err) {
      console.error("Add transaction error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error adding transaction");
    }
  };

  const updateTransaction = async (id, updated) => {
    try {
      const payload = {
        ...updated,
        ...(updated.createdAt ? { createdAt: new Date(updated.createdAt) } : {})
      };

      const { data } = await editTransaction(id, payload);
      setTransactions((prev) => prev.map((t) => (t._id === id ? data.transaction : t)));
    } catch (err) {
      console.error("Edit transaction error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error updating transaction");
    }
  };

  const removeTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete transaction error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error deleting transaction");
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addNewTransaction,
        updateTransaction,
        removeTransaction,
        fetchTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
