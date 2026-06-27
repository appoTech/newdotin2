import React,{useState} from "react";
import { Swords, Cast, FileText, Megaphone, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
// import promoteModel from "../../../appopener-backend/src/models/promoteModel";

const API_URL = process.env.REACT_APP_API_URL;

const PromotionsModal = ({ open, onOpenChange }) => {
//   const options = [
//     {
//       name: "Promote",
//       icon: <Swords size={32} className="text-red-500" />,
//       description: "Start a challenge",
//       onClick: () => console.log("Challenge clicked"),
//     },
//     {
//       name: "Brand",
//       icon: <Cast size={32} className="text-blue-500" />,
//       description: "Create a channel",
//       onClick: () => console.log("Channel clicked"),
//     },
//     {
//       name: "Challan",
//       icon: <FileText size={32} className="text-yellow-500" />,
//       description: "Issue a challan",
//       onClick: () => console.log("Challan clicked"),
//     },
//     {
//       name: "Complain",
//       icon: <Megaphone size={32} className="text-orange-500" />,
//       description: "Register a complaint",
//       onClick: () => console.log("Complain clicked"),
//     },
//   ];

const [formData, setFormData] = useState({
    title: "",
    description: "",
    email: "",
    mobile: "",
    type: "",
    socialMediaHandle: "",
});

const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
};

const handleSubmit = async (e) => {
    // e.preventDefault();
    console.log(formData);
    try{
        const res = await fetch(`${API_URL}promtequerry`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log(data);
    }catch(error){
        console.log(error);
    }
    onOpenChange(false);
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="w-[92vw] sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-black/50 border border-white/20 text-white shadow-2xl rounded-2xl">
    <DialogHeader>
      <DialogTitle className="text-center text-lg sm:text-xl md:text-2xl font-bold">
        Add Your Promotion/Brand
      </DialogTitle>
      <button
        onClick={() => onOpenChange(false)}
        className="absolute right-4 top-4 opacity-70 hover:opacity-100"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    </DialogHeader>
    <div className="flex flex-col gap-2 sm:gap-3 py-2 sm:py-4">
      {/* Brand Name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm sm:text-base font-medium">
          Brand/Promotion Name
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Your Campaign/Brand Name"
          className="rounded-lg px-3 py-2 sm:py-3 bg-white/10 border border-white/10 focus:border-white/30 outline-none text-sm sm:text-base"
        />
      </div>
      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-sm sm:text-base font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Add Description"
          className="rounded-lg px-3 py-2 sm:py-3 bg-white/10 border border-white/10 focus:border-white/30 outline-none text-sm sm:text-base resize-none"
        />
      </div>
      {/* Social Handle */}
      <div className="flex flex-col gap-1">
        <label className="text-sm sm:text-base font-medium">
          Social Media Handle
        </label>
        <input
          type="text"
          id="socialMediaHandle"
          value={formData.socialMediaHandle}
          onChange={handleChange}
          placeholder="Your Social Media Handle"
          className="rounded-lg px-3 py-2 sm:py-3 bg-white/10 border border-white/10 focus:border-white/30 outline-none text-sm sm:text-base"
        />
      </div>
      {/* Platform Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-sm sm:text-base font-medium">
          Platform
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {["Instagram", "Linkedin", "Snapchat"].map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 border border-white/10 rounded-lg px-3 py-2 cursor-pointer bg-white/5 hover:bg-white/10 transition"
            >
              <input
                type="radio"
                name="type"
                value={item}
                onChange={handleChange}
              />
              <span className="text-sm sm:text-base">{item}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="text-sm sm:text-base font-medium">Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email to Contact"
          className="rounded-lg px-3 py-2 sm:py-3 bg-white/10 border border-white/10 focus:border-white/30 outline-none text-sm sm:text-base"
        />
      </div>
      {/* Mobile */}
      <div className="flex flex-col gap-1">
        <label className="text-sm sm:text-base font-medium">
          Mobile Number
        </label>
        <input
          type="tel"
          id="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Enter Mobile Number to Contact"    
          className="rounded-lg px-3 py-2 sm:py-3 bg-white/10 border border-white/10 focus:border-white/30 outline-none text-sm sm:text-base"
        />
      </div>
      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="mt-2 w-full bg-white text-black py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-200 transition"
      >
        Submit
      </button>
    </div>
  </DialogContent>
</Dialog>
  );
};

export default PromotionsModal;