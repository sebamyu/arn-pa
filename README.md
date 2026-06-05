<div align="center">
  
# 📖 Arn Pa | อ่านปะ
### *Internal Book Reservation System @ Botnoi Group*

[![Tech Stack](https://skillicons.dev/icons?i=react,ts,tailwind,supabase,git)](https://skillicons.dev)

---

**"เพราะหนังสือดีๆ ไม่ควรถูกลืม... ระบบจัดการการจองหนังสือที่ออกแบบมาเพื่อความเร็วและความสวยงามในสไตล์ Modern Tech"**

---
</div>

## 📸 Project Showcase
> ![Arn Pa Preview] <img width="1898" height="903" alt="image" src="https://github.com/user-attachments/assets/e25cb19a-d028-4d2a-94ec-07098da5bb29" />

---

## ✨ Key Features
* **Real-time Availability:** เห็นสถานะหนังสือแบบ Real-time ว่าเล่มไหน "ว่าง" หรือ "ถูกจองแล้ว"
* **Visual-First UI:** อินเทอร์เฟซสไตล์ Glassmorphism ที่สวยงามและทันสมัย
* **Smart Fallback UI:** ระบบจัดการรูปภาพอัตโนมัติ ไม่มีการแสดงช่องว่างหรือ Emoji ที่น่ารำคาญ หากโหลดรูปไม่ได้ ระบบจะแสดงชื่อหนังสือแทน
* **Robust Backend:** ข้อมูลแม่นยำ ปลอดภัย จัดการผ่าน Supabase

---

## 🛠 Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Tailwind CSS |
| **Styling** | Framer Motion (Smooth Animations) |
| **Database** | Supabase (PostgreSQL) |
| **Platform** | Lovable / GitHub |

---

## 🧩 Challenges & Solutions
* **Challenge:** รูปภาพจากภายนอกมักจะติดปัญหา Hotlink Protection หรือ API ล่มบ่อย
* **Solution:** ปรับเปลี่ยนมาใช้การจัดเก็บรูปภาพในโฟลเดอร์ Public และการทำ Fallback Logic ที่แข็งแกร่ง เพื่อให้ UI แสดงผลได้อย่างต่อเนื่อง 100%
* **Challenge:** ข้อมูลซ้ำและการจัดหมวดหมู่ที่ไม่ถูกต้องในช่วงเริ่มต้น
* **Solution:** พัฒนา SQL Query เฉพาะจุดเพื่อทำความสะอาดฐานข้อมูล (Data Cleaning) และคุมเข้มการ Insert ข้อมูลใหม่

---

## 🔮 Future Improvements
* **LINE Integration:** พัฒนา Bot เชื่อมต่อกับระบบของ Botnoi เพื่อแจ้งเตือนสถานะการจองผ่าน LINE
* **User Authentication:** เพิ่มระบบ Login เพื่อระบุตัวตนของผู้จอง
* **Analytics Dashboard:** ระบบสรุปสถิติว่าหนังสือเล่มไหนถูกยืมบ่อยที่สุด

---

## 🧠 About this Internship
โปรเจกต์นี้เป็นส่วนหนึ่งของการฝึกงานที่ **Botnoi Group** ศูนย์รวมนวัตกรรม AI ระดับแนวหน้าของไทย มุ่งเน้นการเปลี่ยนปัญหาการจัดการทรัพยากรภายในองค์กรให้เป็นระบบดิจิทัลที่มีคุณภาพ

> *"Code is not just logic, it's an experience."*

---

<div align="center">
  <sub>Built with passion by <b> Orapin Nakoon </b> | Full-Stack Intern @ Botnoi Group</sub>
</div>
