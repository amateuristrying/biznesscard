import CorporateCard from "@/components/CorporateCard";
import ZoomLock from "@/components/ZoomLock";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[var(--theme-bg)]">
      <ZoomLock>
        <CorporateCard />
      </ZoomLock>
    </main>
  );
}
