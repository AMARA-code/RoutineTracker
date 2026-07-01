export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fdf6f0]">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-[#f5c6c6]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#e08a8a] animate-spin" />
      </div>
      <p className="font-serif text-sm text-[#8a7a72]">
        Loading your dashboard…
      </p>
    </div>
  );
}