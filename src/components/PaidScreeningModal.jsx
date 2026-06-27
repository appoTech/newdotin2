import React, { useState } from "react";

const PaidScreeningModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    amount: 99,
    OrderType: "paid_screening",
    roomCategory: "2 player",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) {
      alert("All fields required");
      return;
    }

    onSubmit({
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      amount: Number(form.amount),
      OrderType: form.OrderType,
      roomCategory: form.roomCategory,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md border border-indigo-600">
        <h2 className="text-xl font-semibold text-white mb-4">
          Create Payment
        </h2>

        <div className="space-y-3">
          <input
            name="name"
            placeholder="Customer Name"
            className="w-full p-2 rounded bg-slate-800 text-white"
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Customer Email"
            className="w-full p-2 rounded bg-slate-800 text-white"
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Customer Phone"
            className="w-full p-2 rounded bg-slate-800 text-white"
            onChange={handleChange}
          />
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs text-slate-400 ml-1">Room Category</label>
            <select
              name="roomCategory"
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
              value={form.roomCategory}
              onChange={handleChange}
            >
              <option value="2 player">2 Player</option>
              <option value="4-8 experts">4-8 Experts</option>
              <option value="100 members">100 Members</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs text-slate-400 ml-1">Amount</label>
            <input
              name="amount"
              type="number"
              className="w-full p-2 rounded bg-slate-800 text-white"
              value={form.amount}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 rounded text-white"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaidScreeningModal;