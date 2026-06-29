function Button({
  children,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        rounded-xl
        px-5
        py-3
        font-medium
        transition-all
        duration-200
        hover:scale-[1.02]
        active:scale-[0.98]
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;