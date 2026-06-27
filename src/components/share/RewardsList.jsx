import { Trophy, Star, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RewardsList = ({ shares, challenges }) => {
  const getRewardStatus = (requiredShares) => {
    return shares >= requiredShares ? "text-yellow-400" : "text-gray-400";
  };

  const icons = {
    "🌟": Star,
    "👑": Crown,
    "🦋": Trophy
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-white">Rewards</h4>
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence>
          {challenges.map((challenge, index) => {
            const Icon = icons[challenge.icon] || Trophy;
            return (
              <motion.div
                key={challenge.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg border border-gray-700 ${
                  shares >= challenge.shares ? 'bg-gradient-to-r from-yellow-900/20 to-yellow-600/20' : ''
                }`}
              >
                <Icon className={`h-5 w-5 ${getRewardStatus(challenge.shares)}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{challenge.title}</p>
                  <p className="text-xs text-gray-400"> {challenge.Description} </p>
                </div>
                <div className="bg-indigo-600 px-3 py-2 rounded-md font-bold text-white">⭐ {challenge.reward}</div>
                {shares >= challenge.shares && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-yellow-400"
                  >
                    ✨
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RewardsList;