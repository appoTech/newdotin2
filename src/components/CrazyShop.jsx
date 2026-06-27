import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Bot, Rocket } from "lucide-react";
/* import StickyHeader from "./StickyHeader"; */
import CartSheet from "./shop/CartSheet";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
 import { ShoppingBag } from "lucide-react"; 

const CrazyShop = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleScroll = () => {
    const creatorStats = document.getElementById("creator-stats");
    if (creatorStats) {
      const rect = creatorStats.getBoundingClientRect();
      setShowCheckout(rect.bottom < 0);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const groupedCartItems = cartItems.reduce((acc, item) => {
    const creator = item.creator;
    if (!acc[creator]) {
      acc[creator] = [];
    }
    acc[creator].push(item);
    return acc;
  }, {});

  return (
    <div className="relative">
     {/*  {showCheckout && (
        <StickyHeader
          totalAmount={totalAmount}
          cartItemsCount={cartItems.length}
        />
      )} */}

      <CartSheet 
        cartItems={cartItems} 
        groupedCartItems={groupedCartItems}
        totalAmount={totalAmount}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-pulse">
          <Star className="w-6 h-6 text-yellow-300" />
        </div>
        <div className="absolute top-20 right-20 animate-bounce">
          <Bot className="w-8 h-8 text-green-400" />
        </div>
        <div className="absolute bottom-10 left-20 animate-float">
          <Rocket className="w-8 h-8 text-blue-400" />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-1/4 right-1/4 text-sm text-white/40 rotate-[-15deg]"
        >
          Dream big, code bigger!
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
          className="absolute bottom-1/4 left-1/4 text-sm text-white/40 rotate-[15deg]"
        >
          Your creativity knows no bounds
        </motion.p>
      </div>
    </div>
  );
};

export default CrazyShop;