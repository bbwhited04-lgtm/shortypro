import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white grid place-items-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold">Welcome to The Dream</h1>
        <p className="text-white/70">
          Your subscription is active. You now own the stack.
        </p>

        <Link
          href="/dashboard"
          className="inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
