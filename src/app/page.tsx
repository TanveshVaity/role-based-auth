import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center text-center gap-10 max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold">Simple Goods</h1>
      <p>
        <Button asChild>
          <Link href="/sign-up" className="text-white font-bold">Get Started</Link>
        </Button>
      </p>
    </main>
  );
}
