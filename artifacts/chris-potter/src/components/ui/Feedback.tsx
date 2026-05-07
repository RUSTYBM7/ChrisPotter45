export function LoadingBlock({ label }: { label?: string }) {
  return (
    <div style={blockStyle}>
      <span>{label ?? "Loading…"}</span>
    </div>
  );
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div style={{ ...blockStyle, color: "#f55" }}>
      {message}
    </div>
  );
}

const blockStyle = {
  padding: 32,
  textAlign: "center" as const,
  opacity: 0.8,
};