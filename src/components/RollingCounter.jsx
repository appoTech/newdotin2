import { useEffect, useState } from "react";

const RollingCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    let start = value-1000;
    const end = value;

    if (start === end) return;

    const incrementTime = Math.floor(duration / (end - start));
    let current = start;

    const timer = setInterval(() => {
      current += 3;
      setCount(current);

      if (current >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span className="font-bold">{count}</span>;
};

export default RollingCounter;