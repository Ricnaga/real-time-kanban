export default function BoardLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 gap-4 p-6 overflow-x-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="shrink-0 w-72 h-64 bg-zinc-100 rounded-lg animate-pulse dark:bg-zinc-800"
          />
        ))}
      </main>
    </div>
  );
}
