import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { toast } from "../hooks/use-toast";
import { AddMeetRequest } from "../helper/api";
import axios from "axios";

const ContactDialog = ({ open, onOpenChange, Creator1, LInk }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    purpose: "",
    message: "",
    budget: "",
    date: "",
    Creator: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setFormErrors({ ...formErrors, [field]: "" }); // Clear error on change
  };

  const validate = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Full Name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    if (!form.purpose.trim()) errors.purpose = "Meeting Purpose is required.";
    if (!form.message.trim()) errors.message = "Detailed Message is required.";
    if (!form.budget.trim()) errors.budget = "Budget Range is required.";
    return errors;
  };


  const handleSubmit = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Missing Fields",
        description: "Please fill in the highlighted required fields.",
        variant: "destructive",
      });
      return;
    }

    const submitMeetReq = async () => {
      
      let Creator2 = Creator1;
      if(Creator2 === "appø" || Creator2 === undefined || Creator2 === null) {
        Creator2 = LInk;
      }
      try {
        const res = await AddMeetRequest(
          form.fullName,
          form.email,
          form.phone,
          form.purpose,
          form.message,
          form.company,
          Creator2,
          form.budget,
          form.date
        );
        if (res.status === 201 || res.success === 1) {
          alert("Request submitted");
        } else {
          toast({
            title: "Submission Failed",
            description: res.message || "Unknown error occurred.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.log(err);
        toast({
          title: "Submission Failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    };

    submitMeetReq(); // ✅ Now the async function is called

    setForm({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      purpose: "",
      message: "",
      budget: "",
      date: "",
    });
    setFormErrors({});
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] w-[95vw] md:w-auto max-h-[95vh] overflow-y-auto backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-white text-2xl mb-4">
            Meet with {Creator1}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="absolute top-[-20px] right-0 text-white text-2xl font-bold hover:text-red-400 transition-colors"
          >
            <X size={32} />
          </button>
          <p className="text-center text-white text-sm mb-2">
            Fill out this form to request a meeting. All meetings involve a
            consultation fee.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 text-white">
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name *</Label>
              <Input
                className={`text-black placeholder-black ${
                  formErrors.fullName ? "border-red-500" : ""
                }`}
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
              {formErrors.fullName && (
                <p className="text-red-400 text-sm">{formErrors.fullName}</p>
              )}
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                className={`text-black placeholder-black ${
                  formErrors.email ? "border-red-500" : ""
                }`}
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {formErrors.email && (
                <p className="text-red-400 text-sm">{formErrors.email}</p>
              )}
            </div>
          </div>

          {/* Phone & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Phone Number</Label>
              <Input
                className="text-black placeholder-black"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div>
              <Label>Company/Organization</Label>
              <Input
                className="text-black placeholder-black"
                placeholder="Enter your company name"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
              />
            </div>
          </div>

          {/* Meeting Purpose */}
          <div>
            <Label>Meeting Purpose *</Label>
            <Input
              className={`text-black placeholder-black ${
                formErrors.purpose ? "border-red-500" : ""
              }`}
              placeholder="e.g., Business collaboration, Consultation, Interview"
              value={form.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
            />
            {formErrors.purpose && (
              <p className="text-red-400 text-sm">{formErrors.purpose}</p>
            )}
          </div>

          {/* Detailed Message */}
          <div>
            <Label>Detailed Message *</Label>
            <Textarea
              className={`text-black placeholder-black min-h-[100px] ${
                formErrors.message ? "border-red-500" : ""
              }`}
              placeholder="Please describe what you'd like to discuss and why you want to meet..."
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
            />
            {formErrors.message && (
              <p className="text-red-400 text-sm">{formErrors.message}</p>
            )}
          </div>

          {/* Budget & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Maximum Budget *</Label>
              <Input
                className={`text-black placeholder-black ${
                  formErrors.budget ? "border-red-500" : ""
                }`}
                placeholder="e.g., ₹500"
                value={form.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
              />
              {formErrors.budget && (
                <p className="text-red-400 text-sm">{formErrors.budget}</p>
              )}
            </div>
            {/* <div>
              <Label>Preferred Date</Label>
              <Input
                type="date"
                className="text-black placeholder-black"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div> */}
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg"
            >
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
