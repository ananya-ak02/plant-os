"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HealthSparkline } from "./HealthSparkline";

type PlantCardProps = {
  id: string;
  nickname: string;
  species: string;
  location: string;
  healthScore: number;
  photoUrl?: string;
  history?: { date: string; score: number }[];
};

export function PlantCard({ id, nickname, species, location, healthScore, photoUrl, history = [] }: PlantCardProps) {
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (healthScore / 100) * circumference;
  return (
    <motion.article whileHover={{ y: -4 }} className="overflow-hidden rounded-3xl border border-forest/10 bg-cream shadow-organic">
      <Link href={`/plants/${id}`} className="block">
        <div className="relative h-44 bg-leaf-texture">
          {photoUrl ? <img src={photoUrl} alt={nickname} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-6xl">🌿</div>}
          <div className="absolute right-4 top-4 rounded-full bg-cream/90 p-2">
            <svg width="68" height="68" viewBox="0 0 68 68">
              <circle cx="34" cy="34" r="28" stroke="#d9f99d" strokeWidth="7" fill="none" />
              <motion.circle cx="34" cy="34" r="28" stroke="#4ade80" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.1 }} transform="rotate(-90 34 34)" />
              <text x="34" y="39" textAnchor="middle" className="fill-forest text-sm font-bold">{healthScore}</text>
            </svg>
          </div>
        </div>
        <div className="space-y-3 p-5">
          <div>
            <h3 className="font-display text-2xl text-forest">{nickname}</h3>
            <p className="text-sm text-forest/70">{species} · {location}</p>
          </div>
          <HealthSparkline data={history} />
        </div>
      </Link>
    </motion.article>
  );
}
