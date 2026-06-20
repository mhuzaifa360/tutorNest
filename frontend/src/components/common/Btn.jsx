function Btn({
  variant = "blue",
  children,
  className = "",
  ...props
}) {

  const variantStyle = {
    blue: `
      bg-blue-600 dark:bg-blue-600
      text-white 
      hover:bg-blue-700 dark:hover:bg-blue-700
      shadow-sm hover:shadow-md
    `,

    white: `
      bg-white dark:bg-slate-800
      text-gray-900 dark:text-white
      hover:bg-gray-50 dark:hover:bg-slate-700
      border border-gray-200 dark:border-slate-700
      shadow-sm hover:shadow-md
    `,
    
    ghost: `
      bg-transparent
      text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-slate-800
    `
  };

  const baseStyle = `
    font-medium
    text-sm
    px-6
    min-h-10
    rounded-xl
    whitespace-nowrap
    flex
    justify-center
    items-center
    transition-all
    duration-300
    active:scale-95
    disabled:opacity-50
    disabled:pointer-events-none
  `;

  return (
    <button
      className={`${baseStyle} ${variantStyle[variant] || variantStyle.blue} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Btn;