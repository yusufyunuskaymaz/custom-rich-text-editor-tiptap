import React from "react";

type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  variant?: "default" | "ghost";
};

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
  variant = "default",
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={[
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200",
      "h-8 w-8 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none",
      isActive
        ? "bg-gray-900 text-white shadow-sm"
        : "text-gray-600 hover:text-gray-900",
      variant === "ghost" ? "hover:bg-gray-50" : "",
    ].join(" ")}
  >
    {children}
  </button>
);