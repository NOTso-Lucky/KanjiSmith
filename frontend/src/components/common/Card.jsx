function Card({ children, className = "" }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
      className={`rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;