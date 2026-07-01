export default function HomeLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[var(--background)]">
      <div
        className="loader-ring h-14 w-14 rounded-full border-4"
        style={{
          borderColor: "var(--muted)",
          borderTopColor: "var(--primary)",
        }}
      />
      <div className="flex items-center gap-1.5">
        <span className="loader-dot h-2 w-2 rounded-full bg-[var(--primary)]" />
        <span className="loader-dot h-2 w-2 rounded-full bg-[var(--secondary)]" />
        <span className="loader-dot h-2 w-2 rounded-full bg-[var(--sky)]" />
      </div>
      <p className="font-serif text-sm text-[var(--muted-foreground)]">
        Loading your dashboard…
      </p>
    </div>
  );
}