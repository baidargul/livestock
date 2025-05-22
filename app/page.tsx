import SiteLogo from "@/components/website/logo/SiteLogo";
import SessionProtection from "@/components/website/profile/SessionProtection";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full select-none min-h-[100dvh] flex justify-center items-center">
      <SessionProtection />
      <SiteLogo size="lg" />
      <div className="flex flex-col">
        <div>Hey man! Hold up</div>
        <div className="text-sm -mt-1">Redirecting to <span className="text-red-500 underline"><Link href={'/home'}>Home</Link></span></div>
      </div>
    </div>
  );
}
