import React from "react";

function Typography({
  variant = "h4",
  children,
  className = "",
  ...props
}) {

  const tagVariant = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    price: "p",
    small: "span",
  };

  const tagStyle = {
    h1: "text-[36px] md:text-[48px] lg:text-[60px] leading-tight font-bold",
    h2: "text-[30px] md:text-[36px] font-semibold",
    h3: "text-[18px] md:text-[20px] font-medium",
    h4: "text-[18px] font-medium",
    h5: "text-[16px]",
    h6: "text-[14px]",
    price: "text-[24px] font-bold",
    small: "text-[12px]",
  };

  const Tag = tagVariant[variant] || "p";

  return (
    <Tag
      className={`${tagStyle[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Typography;