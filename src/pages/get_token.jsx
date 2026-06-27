import React, { useState } from "react";
import AnimatedTokens from "../components/AnimatedTokens";
import Blogs_header from "../components/blogs_header";
import { SaturnSVG } from "../components/AnimatedTokens";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/ui/card";
import{toast, ToastContainer} from 'react-toastify';
import { Feather, ClipboardCopy, Check } from "lucide-react";
import { Button, Toast } from "react-bootstrap";
import { GetToken } from "../helper/api";
import Footer from "../components/Footer";
/* import Float from "../components/side_button"; */
import Floattwo from "../components/side_button2";
import BottomNav from "../components/bottom";
import G13Ads from "../components/g13ads";
import AdsterraAd from "../components/Adsterads";

const Get_token = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [token, settoken] = useState("");

  const validateForm = () => {

    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return false;
    } else if (formData.name.length < 3) {
      toast.error("Name must be at least 3 characters long.");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required.");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Email is not valid.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    settoken("");
    if (validateForm()) {
      GetToken(formData.name, formData.email).then((res) => {
        const result = res;
        console.log(res);
        if (res.status === 201) {
          settoken(result.token || res.data.token); 
        } else if (res.status === 200){
          toast.info("Already registered! Token sent to your email.");
        }
        else {
          console.error("JWT not found in response:", result);
          toast.error("Error: Token not received from API.");
        }
      });
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div>
        {/* <G13Ads /> */}
        <AdsterraAd/>
        <Blogs_header />
        <ToastContainer />
      </div>

      <AnimatedTokens />

      <div className="pt-[100px] sm:pt-[120px] font-rubik flex flex-col items-center justify-center mb-8 px-4">
        <Card className="w-full max-w-lg sm:max-w-3xl mx-auto animate-scale-in shadow-xl border font-rubik border-gray-200 rounded-2xl backdrop-blur-sm overflow-hidden text-white text-lg">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl flex items-center gap-3">
              <span className="text-red-500">Get</span> Your{" "}
              <span className="text-yellow-400">Token</span>
              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <Feather className="h-4 w-4 sm:h-5 sm:w-5 animate-float" />
                <SaturnSVG className="h-5 w-5 sm:h-6 sm:w-6 animate-float" />
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Author Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 text-black py-2 sm:px-4 sm:py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 sm:px-4 text-black sm:py-3 border rounded-lg shadow-sm focus:outline-none 
            focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div className="pt-4 w-full text-center">
              <Button
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition"
                onClick={handleSubmit}
                hidden={token ? true : false}
              >
                Get Token
              </Button>
            </div>

            {token && (
              <div className="flex flex-col relative w-full break-all p-3 sm:p-4 bg-blue-50 text-black border border-blue-300 rounded-lg shadow-md text-center text-base sm:text-lg md:text-2xl mt-4 sm:mt-6">
                <strong className="text-blue-600">Generated Token</strong>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-blue-100"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <ClipboardCopy className="w-5 h-5 text-blue-600" />
                  )}
                </button>
                {token}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
      <Footer />
     {/*   <Float /> */}
      <Floattwo />
    </>
  );
};

export default Get_token;
