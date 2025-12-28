import React from "react";

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-6xl mx-auto">{children}</div>;
};
