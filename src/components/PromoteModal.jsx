// src/components/PromoteModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import LoadingScreen from "./Loader";

const PromoteModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    linkUrl: "",
    file: null,
    imagePreview: "",
    amount: 999,
    name: "",
    mobile: "",
    acceptPrivacy: false,
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        file: file,
        imagePreview: URL.createObjectURL(file),
      }));
      setFile(file);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    if (key !== "file") formData.append(key, value); // skip file here
  });
  if (file) formData.append("file", file); // append file only once

  try {
    const response = await fetch("http://localhost:5001/promote", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log(result);

    alert(result.message || "Submitted!");
  } catch (error) {
    console.error("Error submitting promotion:", error);
    alert("Failed to submit. Try again later.");
  }

  setLoading(false);
};


  if (!open) return null;

  return (
    <div className="fixed mt-10 inset-0 z-50 max-h-[90vh] bg-black/70 backdrop-blur-sm flex items-center justify-center">
        <LoadingScreen isLoading={loading} />
      <div className="bg-[#1b012c] text-white p-6 rounded-2xl w-full max-w-lg relative shadow-[0_0_20px_#9D4EDD]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-1 text-[#FFFF33]">
          Promote Your Link
        </h2>
        <p className="text-gray-400 mb-4 text-sm">
          Fill in your link details below to get featured.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Link Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="w-full p-2 rounded-md bg-[#25023e] border border-[#9D4EDD] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Destination Link</label>
            <input
              type="url"
              name="linkUrl"
              value={form.linkUrl}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full p-2 rounded-md bg-[#25023e] border border-[#9D4EDD] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Upload Image</label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#9D4EDD] file:text-white hover:file:bg-[#FF00A0]"
            />
            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="Preview"
                className="mt-2 w-24 h-24 rounded-md object-cover border border-[#9D4EDD]"
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-[#25023e] border border-[#9D4EDD]"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Mobile</label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-[#25023e] border border-[#9D4EDD]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#25023e] border border-[#9D4EDD]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="acceptPrivacy"
              checked={form.acceptPrivacy}
              onChange={handleChange}
              className="w-4 h-4 accent-[#9D4EDD]"
            />
            <label className="text-sm text-gray-300">
              I accept the{" "}
              <a href="/privacy" className="text-[#00F5FF] underline">
                privacy policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={!form.acceptPrivacy}
            className="w-full py-2 bg-[#9D4EDD] hover:bg-[#FF00A0] rounded-md font-bold text-white transition disabled:opacity-50"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromoteModal;
