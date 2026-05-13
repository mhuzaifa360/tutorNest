import React from "react";

function Btn({
  variant = "blue",
  children,
  className = "",
  ...props
}) {

  const variantStyle = {
    blue: `
      bg-blueBG 
      text-textWhite 
      hover:opacity-90
    `,

    white: `
      bg-secondary 
      text-textBlack 
      hover:bg-lightGreyBG
      border border-gray-200
    `,
  };

  const baseStyle = `
    font-medium
    text-sm
    px-6
    min-h-10
    rounded-lg
    whitespace-nowrap
    flex
    justify-center
    items-center
    transition-all
    duration-200
    active:scale-95
    disabled:opacity-50
  `;

  return (
    <button
      className={`${baseStyle} ${variantStyle[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Btn;