import { Progress } from "../ui/progress";
import { motion } from "framer-motion";

const LevelProgress = ({ level, shares }) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="space-y-2"
    >
      <div className="flex justify-between text-sm text-white">
        <span>Level {level}</span>
        <span>{shares} shares</span>
      </div>
      <Progress value={(shares % 5) * 20} className="h-2" />
    </motion.div>
  );
};

export default LevelProgress;