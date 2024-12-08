import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-white p-4 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);
