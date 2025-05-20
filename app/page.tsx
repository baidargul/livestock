import SiteLogo from "@/components/website/logo/SiteLogo";
import SessionProtection from "@/components/website/profile/SessionProtection";

export default function Home() {
  return (
    <div className="w-full select-none min-h-[100dvh] flex justify-center items-center">
      <SessionProtection />
      <SiteLogo size="lg" />
      <div>Hey man! Hold up</div>
    </div>
  );
}
