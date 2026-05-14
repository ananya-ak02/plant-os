"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export function MilestoneToast({ message }: { message: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-forest px-5 py-4 text-cream shadow-organic">
      <Trophy className="h-5 w-5 text-leaf" />
      <span>{message}</span>
    </motion.div>
  );
}
