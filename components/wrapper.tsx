import { cn } from "@/lib/utils";
import React from "react";

export const Wrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("max-w-6xl mx-auto", className)}>{children}</div>;
};
