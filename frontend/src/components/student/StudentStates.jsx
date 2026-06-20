export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="grid gap-3">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="h-24 animate-pulse rounded-lg border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        />
      ))}
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">
      <p className="font-semibold">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = "No data yet", description = "There is nothing to show here." }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <h3 className="font-bold text-gray-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

export function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Student Workspace</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">{title}</h1>
        {description && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      {children}
    </div>
  );
}
