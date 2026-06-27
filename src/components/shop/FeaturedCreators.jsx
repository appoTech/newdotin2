import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const FeaturedCreators = () => {
  const [fusionCards, setFusionCards] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchFusionCards();
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current && fusionCards.length > 0) {
      const root = document.documentElement;
      root.style.setProperty('--card-count', fusionCards.length.toString());
    }
  }, [fusionCards]);

  const fetchFusionCards = async () => {
    try {
      const { data, error } = await supabase
        .from('fusion_shop_cards')
        .select('*')
        .eq('is_active', true)
        .order('position');

      if (error) throw error;
      setFusionCards(data || []);
    } catch (error) {
      console.error('Error fetching fusion cards:', error);
    }
  };

  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Featured Creators of the Month
        </h2>

        <div className="relative overflow-hidden py-10">
          <div ref={scrollContainerRef} className="flex space-x-6 animate-scroll">
            {[...fusionCards, ...fusionCards].map((card, index) => (
              <motion.div
                key={`${card.id}-${index}`}
                className="flex-none w-[250px]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 h-full">
                  <CardContent className="p-6">
                    {card.image_url && (
                      <img
                        src={card.image_url}
                        alt={card.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                    {card.description && (
                      <p className="text-gray-300 mb-4">{card.description}</p>
                    )}
                    {card.link_url && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(card.link_url, '_blank')}
                      >
                        Learn More
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};