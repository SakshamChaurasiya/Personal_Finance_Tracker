import React, { useState, useEffect } from "react";
import { IndianRupee, Tag, Type, Calendar, Plus, Edit3 } from "lucide-react";

const TransactionForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    type: "income", 
    createdAt: ""
  });

  const toLocalDateTime = (utcDate) => {
    if (!utcDate) return "";
    const date = new Date(utcDate);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        amount: initialData.amount,
        category: initialData.category,
        type: initialData.amount < 0 ? "expense" : "income",
        createdAt: toLocalDateTime(initialData.createdAt)
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category) {
      return alert("Title, amount, and category are required");
    }

    
    const payload = {
      ...form,
      amount: form.type === "expense" ? -Math.abs(form.amount) : Math.abs(form.amount),
      createdAt: form.createdAt ? new Date(form.createdAt) : undefined
    };

    onSubmit(payload);

    setForm({ title: "", amount: "", category: "", type: "income", createdAt: "" });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        {initialData ? (
          <>
            <Edit3 className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">Edit Transaction</h3>
          </>
        ) : (
          <>
            <Plus className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800">Add New Transaction</h3>
          </>
        )}
      </div>

      {/* Income / Expense Toggle */}
      <div className="flex space-x-4 mb-6">
        {["income", "expense"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setForm({ ...form, type: t })}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 ${
              form.type === t
                ? t === "income"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Title
          </label>
          <div className="relative">
            <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter transaction title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Amount Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Category Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="e.g., Food, Transport, Entertainment"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Optional Date/Time field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date & Time (Optional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="datetime-local"
              value={form.createdAt}
              onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 ${
            initialData
              ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
              : form.type === "income"
              ? "bg-green-500 hover:bg-green-600 focus:ring-green-500"
              : "bg-red-500 hover:bg-red-600 focus:ring-red-500"
          } focus:ring-2 focus:ring-offset-2`}
        >
          {initialData ? (
            <>
              <Edit3 className="h-5 w-5" />
              <span>Update Transaction</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              <span>Add Transaction</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
