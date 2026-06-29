function Input(props) {
  return (
    <input
      {...props}
      style={{
        background: "var(--background)",
        border: "1px solid var(--border)",
        color: "var(--foreground)",
      }}
      className="
        h-11
        w-full
        rounded-xl
        px-4
        outline-none
        transition
        focus:ring-2
      "
    />
  );
}

export default Input;