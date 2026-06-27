import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const DealsSection = ({ onAddToCart }) => {
  const [deals, setDeals] = useState([]);
  const [currentOnlineIndex, setCurrentOnlineIndex] = useState(0);
  const [currentIRLIndex, setCurrentIRLIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeals();
    const interval = setInterval(() => {
      setCurrentOnlineIndex(prev => prev + 1);
      setCurrentIRLIndex(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('is_active', true)
        .eq('is_quick_deal', false)
        .order('position');

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast({
        title: "Error",
        description: "Failed to load deals. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const onlineDeals = deals.filter(deal => deal.type === 'ONLINE').slice(0, 3);
  const irlDeals = deals.filter(deal => deal.type === 'IRL').slice(0, 3);

  const normalizedOnlineIndex = currentOnlineIndex % onlineDeals.length;
  const normalizedIRLIndex = currentIRLIndex % irlDeals.length;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white mb-8">Special Deals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Online Deals Column */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Online Products</h3>
          <div className="relative h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={normalizedOnlineIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full"
              >
                {onlineDeals[normalizedOnlineIndex] && (
                  <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
                    <CardContent className="p-6">
                      {onlineDeals[normalizedOnlineIndex].image_url && (
                        <img 
                          src={onlineDeals[normalizedOnlineIndex].image_url} 
                          alt={onlineDeals[normalizedOnlineIndex].name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-xl font-bold text-white mb-2">
                        {onlineDeals[normalizedOnlineIndex].name}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        By {onlineDeals[normalizedOnlineIndex].creator}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-white">
                          ${onlineDeals[normalizedOnlineIndex].price}
                        </span>
                        <Button
                          variant="secondary"
                          onClick={() => onAddToCart(onlineDeals[normalizedOnlineIndex])}
                          className="flex items-center gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* IRL Deals Column */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">IRL Products</h3>
          <div className="relative h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={normalizedIRLIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full"
              >
                {irlDeals[normalizedIRLIndex] && (
                  <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
                    <CardContent className="p-6">
                      {irlDeals[normalizedIRLIndex].image_url && (
                        <img 
                          src={irlDeals[normalizedIRLIndex].image_url} 
                          alt={irlDeals[normalizedIRLIndex].name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-xl font-bold text-white mb-2">
                        {irlDeals[normalizedIRLIndex].name}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        By {irlDeals[normalizedIRLIndex].creator}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-white">
                          ${irlDeals[normalizedIRLIndex].price}
                        </span>
                        <Button
                          variant="secondary"
                          onClick={() => onAddToCart(irlDeals[normalizedIRLIndex])}
                          className="flex items-center gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};