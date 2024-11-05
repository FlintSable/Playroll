"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background space-y-6 px-4">
      <h1 className="text-6xl font-bold text-center tracking-tight">
        PLAYROLL
      </h1>
      <h2 className="text-xl text-muted-foreground text-center max-w-md">
        Keep track of the media you consume today and tomorrow
      </h2>
      <div className="relative group">
        <Button 
          onClick={() => router.push('/dashboard')}
          className="mt-8 bg-[#FF5F46] hover:bg-[#FF5F46]/90 text-white border-2 border-black px-8 py-2 text-lg font-medium"
        >
          Make Rolls
        </Button>
        {/* Tooltip */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-12 hidden group-hover:block bg-popover text-popover-foreground p-2 rounded shadow-lg text-sm whitespace-nowrap">
          making choices may require energy
        </div>
      </div>
    </div>
  );
}