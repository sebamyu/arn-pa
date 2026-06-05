import { useEffect, useState } from "react";

type Bubble = {
  id: number;
  size: number;
  left: string;
  delay: string;
  duration: string;
};

export function FloatingEffects() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // สร้างบับเบิ้ลสุ่มจำนวน 20 ลูก
    const generateBubbles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 40 + 15, // สุ่มขนาด 15px ถึง 55px
      left: `${Math.random() * 100}%`, // สุ่มตำแหน่งหน้าจอแนวนอน
      delay: `${Math.random() * 8}s`, // สุ่มเวลาหน่วงก่อนลอย
      duration: `${Math.random() * 12 + 12}s`, // สุ่มความเร็วในการลอย (12 ถึง 24 วินาที)
    }));
    setBubbles(generateBubbles);
  }, []);

  return (
    <>
      {/* pointer-events-none เพื่อให้ลูกค้ากดทะลุบับเบิ้ลไปคลิกหนังสือได้ปกติ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute bottom-0 rounded-full bg-gradient-to-tr from-pink-300/15 to-purple-400/20 backdrop-blur-[0.5px] border border-white/10"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: bubble.left,
              animationName: "riseAndSway",
              animationDuration: bubble.duration,
              animationDelay: bubble.delay,
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            }}
          />
        ))}
      </div>

      {/* แอนิเมชันสั่งให้ลอยขึ้นและส่ายไปมานุ่มๆ */}
      <style>{`
        @keyframes riseAndSway {
          0% {
            transform: translateY(110vh) translateX(0) scale(0.8) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-10vh) translateX(80px) scale(1.2) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}