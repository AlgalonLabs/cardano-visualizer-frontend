import React from "react";

interface CircularDisplayProps {
  value: number | string;
  label: string;
}

const CircularDisplay: React.FC<CircularDisplayProps> = ({ value, label }) => (
  <div className="inline-block rounded-full border-4 border-blue-500 p-8">
    <div className="text-4xl font-bold">{value}</div>
    <div className="text-sm uppercase">{label}</div>
  </div>
);

export default CircularDisplay;