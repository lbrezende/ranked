"use client";

import Gravity, { MatterBody } from "@/components/ui/gravity";

const GRAVITY_WORDS = [
  { word: "forecast", color: "bg-teal-500", x: "15%", y: "8%", angle: -12 },
  { word: "discover", color: "bg-indigo-500", x: "75%", y: "5%", angle: 8 },
  { word: "identify", color: "bg-purple-500", x: "40%", y: "3%", angle: -5 },
  { word: "detect", color: "bg-blue-500", x: "60%", y: "10%", angle: 15 },
  { word: "identify", color: "bg-violet-500", x: "25%", y: "12%", angle: -8 },
  { word: "estimate", color: "bg-amber-500", x: "50%", y: "6%", angle: 10 },
  { word: "generate", color: "bg-emerald-500", x: "85%", y: "15%", angle: -15 },
  { word: "act", color: "bg-red-500", x: "35%", y: "18%", angle: 5 },
  { word: "compare", color: "bg-pink-500", x: "70%", y: "2%", angle: -10 },
];

export function GravityWords() {
  return (
    <Gravity gravity={{ x: 0, y: 1 }} grabCursor={true} addTopWall={false}>
      {GRAVITY_WORDS.map((item, i) => (
        <MatterBody
          key={`${item.word}-${i}`}
          matterBodyOptions={{
            friction: 0.5,
            restitution: 0.3,
            density: 0.002,
          }}
          x={item.x}
          y={item.y}
          angle={item.angle}
        >
          <div
            className={`${item.color} cursor-grab select-none rounded-full px-6 py-3 text-base font-bold text-white shadow-lg transition-shadow hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg md:text-xl`}
          >
            {item.word}
          </div>
        </MatterBody>
      ))}
    </Gravity>
  );
}
