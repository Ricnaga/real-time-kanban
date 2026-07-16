export default function BoardLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="h-6 w-32 bg-zinc-200 rounded animate-pulse dark:bg-zinc-800" />
      </header>
      <main className="flex flex-1 gap-4 p-6 overflow-x-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-72 h-64 bg-zinc-100 rounded-lg animate-pulse dark:bg-zinc-800"
          />
        ))}
      </main>
    </div>
  );
}
