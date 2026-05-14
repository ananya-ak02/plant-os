import Link from "next/link";
import { ArrowRight, Camera, CloudSun, Sprout } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative grid min-h-[92vh] place-items-center px-6 py-10">
        <div className="float-leaf absolute left-[8%] top-[18%] h-16 w-10 rounded-full bg-leaf/50 blur-[1px]" />
        <div className="float-leaf absolute right-[12%] top-[28%] h-20 w-12 rounded-full bg-earth/20 blur-[1px]" style={{ animationDelay: "1.4s" }} />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-leaf/20 px-4 py-2 text-sm font-semibold text-forest">Built for Indian homes, balconies, terraces, and gardens</p>
            <h1 className="font-display text-5xl leading-tight text-forest md:text-7xl">Aapke plants ko samajhne wala AI</h1>
            <p className="mt-4 font-display text-3xl text-earth md:text-5xl">The AI that understands your plants</p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-forest/75">Photograph a leaf, diagnose disease, generate today’s care plan from real weather, and let every plant grow a living memory over time.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-2xl bg-forest px-6 py-4 font-semibold text-cream shadow-organic"><Sprout className="h-5 w-5" />Open PlantOS<ArrowRight className="h-5 w-5" /></Link>
              <Link href="/community" className="inline-flex items-center gap-2 rounded-2xl bg-cream px-6 py-4 font-semibold text-forest shadow-organic"><Camera className="h-5 w-5" />Community diagnosis</Link>
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md rounded-[2rem] bg-forest p-8 shadow-organic">
            <svg viewBox="0 0 360 440" className="h-full w-full">
              <path className="plant-stem" d="M180 390 C170 310 196 260 176 205 C158 154 180 100 206 52" fill="none" stroke="#4ade80" strokeWidth="10" strokeLinecap="round" />
              <path className="plant-stem" d="M180 286 C118 260 82 218 68 168" fill="none" stroke="#4ade80" strokeWidth="8" strokeLinecap="round" style={{ animationDelay: "0.6s" }} />
              <path className="plant-stem" d="M184 228 C245 206 278 165 294 112" fill="none" stroke="#4ade80" strokeWidth="8" strokeLinecap="round" style={{ animationDelay: "0.9s" }} />
              <ellipse cx="76" cy="158" rx="50" ry="22" fill="#fefce8" opacity="0.95" transform="rotate(-28 76 158)" />
              <ellipse cx="294" cy="110" rx="58" ry="24" fill="#fefce8" opacity="0.95" transform="rotate(-32 294 110)" />
              <ellipse cx="207" cy="54" rx="42" ry="20" fill="#4ade80" opacity="0.95" transform="rotate(-42 207 54)" />
              <circle cx="180" cy="388" r="26" fill="#92400e" />
            </svg>
            <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-cream/95 p-5">
              <div className="flex items-center gap-3">
                <CloudSun className="h-6 w-6 text-earth" />
                <p className="font-semibold text-forest">Today: water Tulsi 150ml, avoid harsh noon sun.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
