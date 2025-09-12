import React, { useContext, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";
import TransactionForm from "../components/TransactionForm";
import { BarChart3, Edit2, Trash2, Calendar, IndianRupee, Tag, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const { transactions, addNewTransaction, removeTransaction, updateTransaction } = useContext(TransactionContext);
  const [editData, setEditData] = useState(null);

  const handleEdit = (transaction) => setEditData(transaction);

  const handleSubmit = (form) => {
    if (editData) {
      updateTransaction(editData._id, form);
      setEditData(null);
    } else {
      addNewTransaction(form);
    }
  };

  
  const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const positiveTransactions = transactions.filter(t => parseFloat(t.amount) > 0);
  const negativeTransactions = transactions.filter(t => parseFloat(t.amount) < 0);
  const totalIncome = positiveTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpenses = Math.abs(negativeTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex items-center space-x-3 mb-8">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">Financial Dashboard</h2>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Balance */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className={`text-2xl font-bold ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(totalAmount).toFixed(2)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${totalAmount >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {totalAmount >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </div>

          {/* Total Income */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">₹{totalExpenses.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Form - Left Column */}
          <div className="lg:col-span-1">
            <TransactionForm onSubmit={handleSubmit} initialData={editData} />
          </div>

          {/* Transaction List - Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <IndianRupee className="h-6 w-6 text-blue-600" />
                  <span>Recent Transactions</span>
                </h3>
              </div>

              <div className="p-6">
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No transactions found</p>
                    <p className="text-gray-400 text-sm mt-2">Add your first transaction to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((t) => {
                      const date = new Date(t.createdAt).toLocaleString();
                      const amount = parseFloat(t.amount);
                      const isPositive = amount > 0;
                      
                      return (
                        <div key={t._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold text-gray-900">{t.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  isPositive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {isPositive ? '+' : ''}{amount.toFixed(2)}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Tag className="h-4 w-4" />
                                  <span>{t.category}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{date}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              <button 
                                onClick={() => handleEdit(t)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                title="Edit transaction"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => removeTransaction(t._id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                title="Delete transaction"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;