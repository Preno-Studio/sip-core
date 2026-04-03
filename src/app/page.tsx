export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center p-6">
      <section className="w-full rounded-3xl border border-black/5 bg-white/70 p-8 shadow-lg backdrop-blur">
        <h1 className="text-3xl font-bold">Sip Core MVP</h1>
        <p className="mt-3 text-base text-black/75">
          Guest-first party flow is now bootstrapped with ephemeral rooms, round progression, skip support,
          and anti-spam baseline.
        </p>
        <ul className="mt-6 list-disc space-y-1 pl-6 text-sm text-black/80">
          <li>POST /api/rooms</li>
          <li>POST /api/rooms/[code]/join</li>
          <li>POST /api/rooms/[code]/start</li>
          <li>POST /api/rooms/[code]/rounds/next</li>
          <li>POST /api/rooms/[code]/rounds/skip</li>
        </ul>
      </section>
    </main>
  );
}