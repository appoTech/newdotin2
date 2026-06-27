import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const TimedProductCard = ({ product, onDecision, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(9);
  const { toast } = useToast();

  useEffect(() => {
    setTimeLeft(9);
  }, [product.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 9;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout, product.id]);

  const handleDecision = (decision) => {
    onDecision(decision, product);
    setTimeLeft(9);
    const messages = {
      yay: "Added to cart!",
      nay: "Maybe next time!",
      hmm: "Saved for later with special discount!",
    };
    toast({
      title: messages[decision],
      description: product.name,
    });
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="relative w-full max-w-md mx-auto"
    >
      <Card className="bg-black/30 backdrop-blur-sm border-purple-500/20">
        <CardContent className="p-0">
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
              <span className="text-white font-bold">{timeLeft}s</span>
            </div>
          </div>

          <div className="relative">
            <img 
              src={product.image_url || '/placeholder.svg'} 
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-purple-500">
                  <AvatarImage src="/placeholder.svg" alt={product.creator} />
                  <AvatarFallback>{product.creator[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold text-white">{product.name}</h3>
                  <p className="text-purple-200">${product.price}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <p className="text-gray-300 mb-4">Type: {product.type}</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => handleDecision("nay")}
                className="bg-red-500/20 hover:bg-red-500/40 text-red-300"
              >
                <X className="w-6 h-6" />
                Nay
              </Button>
              <Button
                onClick={() => handleDecision("hmm")}
                className="bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300"
              >
                <Clock className="w-6 h-6" />
                Hmm
              </Button>
              <Button
                onClick={() => handleDecision("yay")}
                className="bg-green-500/20 hover:bg-green-500/40 text-green-300"
              >
                <Check className="w-6 h-6" />
                Yay
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TimedProductCard;