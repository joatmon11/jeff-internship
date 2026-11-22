import {useState, useEffect } from "react";

const getTimeLeft = (expiryDate) => {
  if (!expiryDate) return "";
  const remaining = expiryDate - Date.now();
  if (remaining <= 0) return "Expired";

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
};

const Countdown = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(expiryDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(expiryDate));
    }, 1000);

    return () => clearInterval(id);
  }, [expiryDate]);

  if (!timeLeft) return null;
  return <div className="de_countdown">{timeLeft}</div>;
};

export default Countdown;