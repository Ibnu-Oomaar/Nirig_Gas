import Link from "next/link";
import { Flame } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center mb-6">
        <Flame className="w-8 h-8 text-orange-600" />
      </div>
      <h1 className="text-5xl font-black text-orange-600 mb-2">404</h1>
      <h2 className="text-xl font-bold text-foreground mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/"
        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition">
        Go to Dashboard
      </Link>
    </div>
  );
}
