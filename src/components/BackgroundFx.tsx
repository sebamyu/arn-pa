export function BackgroundFx() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-pink-200/60 to-purple-200/40 blur-3xl animate-float-bubble" />
      <div
        className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-sky-200/50 to-cyan-200/30 blur-3xl animate-float-bubble"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-yellow-100/50 to-rose-200/30 blur-3xl animate-float-bubble"
        style={{ animationDelay: "-9s" }}
      />
    </div>
  );
}
