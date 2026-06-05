import { useEffect } from "react";

export function BotnoiChat() {
  useEffect(() => {
    // 1. สร้าง div bn-root (ถ้ายังไม่มี)
    if (!document.getElementById("bn-root")) {
      const rootDiv = document.createElement("div");
      rootDiv.id = "bn-root";
      document.body.appendChild(rootDiv);
    }

    // 2. สร้าง div สำหรับตั้งค่า Botnoi (ถ้ายังไม่มี)
    if (!document.querySelector(".bn-customerchat")) {
      const configDiv = document.createElement("div");
      configDiv.className = "bn-customerchat";
      configDiv.setAttribute("bot_id", "6a2164e64d6ad48247505674");
      configDiv.setAttribute("bot_logo", "https://bn-sme-production-ap-southeast-1.s3.amazonaws.com/profile/f513405f-8ce8-4151-a608-b89fb8c67680.jpg");
      configDiv.setAttribute("bot_name", "อ่านปะ ผู้ช่วย AI");
      configDiv.setAttribute("theme_color", "#c084fc"); // สีม่วงพาสเทลให้เข้ากับเว็บ
      configDiv.setAttribute("locale", "th");
      configDiv.setAttribute("logged_in_greeting", "สวัสดีครับ! อยากจองเรื่องไหนให้ผมช่วยดูแลได้เลยครับ ✨");
      configDiv.setAttribute("greeting_message", "ยินดีต้อนรับสู่ 'อ่านปะ' สนใจจองมังงะหรือนิยายเรื่องไหน พิมพ์บอกผมได้เลยครับ!");
      configDiv.setAttribute("default_open", "false");
      document.body.appendChild(configDiv);
    }

    // 3. เตรียมฟังก์ชันรันแชทบอท
    (window as any).BN = (window as any).BN || { init: function() {} };

    // 4. โหลด Script และสั่งรัน
    if (!document.getElementById("bn-jssdk")) {
      const script = document.createElement("script");
      script.id = "bn-jssdk";
      script.src = "https://console.botnoi.ai/customerchat/index.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).BN && typeof (window as any).BN.init === "function") {
          (window as any).BN.init({ version: "1.0" });
        }
      };
      document.body.appendChild(script);
    } else {
      if ((window as any).BN && typeof (window as any).BN.init === "function") {
        (window as any).BN.init({ version: "1.0" });
      }
    }
  }, []);

  return (
    <>
      {/* แทรกสไตล์ลูกเล่นและการไล่สีให้กับตัวบอท */}
      <style>{`
        /* บับเบิ้ลคำพูดต้อนรับแบบไล่สีสวยๆ เหนือปุ่มแชท */
        .custom-chat-bubble {
          position: fixed;
          bottom: 95px;
          right: 24px;
          background: linear-gradient(135deg, #f472b6 0%, #c084fc 100%);
          color: white;
          padding: 10px 16px;
          border-radius: 20px;
          border-bottom-right-radius: 4px;
          font-family: 'Noto Sans Thai', sans-serif;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 10px 25px -5px rgba(192, 132, 252, 0.5), 
                      0 4px 10px -4px rgba(244, 114, 182, 0.4);
          z-index: 999999;
          animation: bubbleFloat 3s ease-in-out infinite;
          cursor: pointer;
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* หางของบับเบิ้ลคำพูด */
        .custom-chat-bubble::after {
          content: '';
          position: absolute;
          bottom: -6px;
          right: 15px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #c084fc;
        }

        /* แอบแต่งปุ่มวงกลมของ Botnoi ให้เรืองแสงและขยับได้ */
        #bn-root iframe, .bn-customerchat, [id^="botnoi-"] {
          animation: botFloat 3s ease-in-out infinite !important;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.4) !important;
          border-radius: 50% !important;
        }

        /* แอนิเมชันการลอยขึ้นลงของบับเบิ้ล */
        @keyframes bubbleFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.02); }
        }

        /* แอนิเมชันการลอยขึ้นลงของตัวบอท */
        @keyframes botFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      {/* ตัวบับเบิ้ลคำพูดที่จะลอยอยู่บนหน้าเว็บ */}
      <div className="custom-chat-bubble">
        <span>จองหนังสือการ์ตูนตรงนี้ได้เลย!</span>
        <span>✨</span>
      </div>
    </>
  );
}