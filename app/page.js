import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';


export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Button onClic={() => router.push('/dashboard')}>Start Rolling</Button>
    </div>
  );
}
