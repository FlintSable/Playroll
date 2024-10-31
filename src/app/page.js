"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen">
      <Button onClick={() => router.push('/dashboard')}>Start Rolling</Button>
    </div>
  );
}
