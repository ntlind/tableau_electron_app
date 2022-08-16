import { motion } from "framer-motion";
import { useState } from "react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";

interface IProps {
  isOn: boolean;
  setIsOn: any;
}

export default function Switch({ isOn, setIsOn }: IProps) {
  const toggleSwitch = () => setIsOn(!isOn);

  return (
    <div
      className={isOn ? "bg-zinc-600 justify-end" : "bg-zinc-200"}
      style={{
        width: "3.2rem",
        padding: "0.25rem",
        display: "flex",
        borderRadius: 9999,
        cursor: "pointer",
      }}
      onClick={toggleSwitch}
    >
      {/* Switch knob */}
      <motion.div
        className={
          isOn
            ? "flex items-center justify-center text-center bg-zinc-900"
            : "flex items-center justify-center text-center bg-zinc-50"
        }
        style={{
          width: "1.5rem",
          height: "1.5rem",
          borderRadius: "100%",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {isOn ? (
          <BsMoonFill className="p-1 text-white" />
        ) : (
          <BsSunFill className="text-zinc-900" />
        )}
      </motion.div>
    </div>
  );
}
