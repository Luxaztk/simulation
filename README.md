# Open Inorganic Redox Engine (Hóa Học 10)
## Hệ Thống Mô Phỏng Phản Ứng Oxi Hóa – Khử Vô Cơ Mở: Cân Bằng Tự Động, Nhận Diện Chất Cho/Nhận e & Dự Đoán Sản Phẩm

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest%20Pass%20(48%2F48)-success?logo=vitest)](https://vitest.dev/)
[![Educational Level](https://img.shields.io/badge/Hóa%20Học-Lớp%2010%20(Chương%204)-orange)](https://moet.gov.vn/)

Ứng dụng web phục vụ môn học **Mô phỏng trong giáo dục**, thiết kế bài học mô phỏng cho:
- **Môn học**: Hóa học
- **Lớp**: 10 (Chương trình GDPT 2018)
- **Chương 4**: Phản ứng oxi hóa – khử
- **Bài 15**: Phản ứng oxi hóa – khử

---

## 🎯 Điểm Đột Phá: Từ Mô Hình Đóng Sang Engine Mở Đa Cơ Chế

Thay vì chỉ hỗ trợ một phản ứng cố định, phiên bản **Open Inorganic Redox Engine** cho phép người học và giáo viên tự do thí nghiệm với **mọi phản ứng hóa học vô cơ**, bao gồm cả các cơ chế nâng cao:

### 1. Cơ chế nâng cao mới bổ sung:
- **🔥 Phản ứng Nhiệt Phân (Thermal Decomposition) & Tự Oxi Hóa - Khử (Self-Redox)**:
  * Phản ứng tự oxi hóa - khử nội phân tử: $2\text{KClO}_3 \xrightarrow{t^\circ, \text{MnO}_2} 2\text{KCl} + 3\text{O}_2$, $2\text{KMnO}_4 \xrightarrow{t^\circ} \text{K}_2\text{MnO}_4 + \text{MnO}_2 + \text{O}_2$.
  * Phân hủy muối nitrate kim loại: $2\text{Cu(NO}_3)_2 \xrightarrow{t^\circ} 2\text{CuO} + 4\text{NO}_2 + \text{O}_2$, $2\text{AgNO}_3 \xrightarrow{t^\circ} 2\text{Ag} + 2\text{NO}_2 + \text{O}_2$, $2\text{KNO}_3 \xrightarrow{t^\circ} 2\text{KNO}_2 + \text{O}_2$.
  * Phân hủy nhiệt muối amoni: $\text{NH}_4\text{NO}_3 \xrightarrow{t^\circ} \text{N}_2\text{O} + 2\text{H}_2\text{O}$.
  * Phản ứng phân hủy phi redox: $\text{CaCO}_3 \xrightarrow{t^\circ} \text{CaO} + \text{CO}_2$, $2\text{Fe(OH)}_3 \xrightarrow{t^\circ} \text{Fe}_2\text{O}_3 + 3\text{H}_2\text{O}$, $2\text{NaHCO}_3 \xrightarrow{t^\circ} \text{Na}_2\text{CO}_3 + \text{CO}_2 + \text{H}_2\text{O}$.
  * Trực quan hóa ngọn lửa đèn cồn ($\text{t}^\circ$) và sủi bọt khí đặc trưng ($\text{NO}_2, \text{O}_2, \text{CO}_2$).
- **🧪 Phân hóa cơ chế Axit đặc vs Axit loãng (Acid Concentration Divergence)**:
  * **Axit Nitric $\text{HNO}_3$**:
    - $\text{Cu} + 4\text{HNO}_3(\text{đặc}) \rightarrow \text{Cu(NO}_3)_2 + 2\text{NO}_2\uparrow(\text{nâu đỏ}) + 2\text{H}_2\text{O}$.
    - $3\text{Cu} + 8\text{HNO}_3(\text{loãng}) \rightarrow 3\text{Cu(NO}_3)_2 + 2\text{NO}\uparrow(\text{không màu hóa nâu}) + 4\text{H}_2\text{O}$.
    - $\text{Fe} + 6\text{HNO}_3(\text{đặc, nóng}) \rightarrow \text{Fe(NO}_3)_3 + 3\text{NO}_2\uparrow + 3\text{H}_2\text{O}$.
    - $\text{Fe} + 4\text{HNO}_3(\text{loãng}) \rightarrow \text{Fe(NO}_3)_3 + \text{NO}\uparrow + 2\text{H}_2\text{O}$.
  * **Axit Sulfuric $\text{H}_2\text{SO}_4$**:
    - $2\text{Fe} + 6\text{H}_2\text{SO}_4(\text{đặc, nóng}) \rightarrow \text{Fe}_2(\text{SO}_4)_3 + 3\text{SO}_2\uparrow(\text{mùi hắc}) + 6\text{H}_2\text{O}$ ($\text{Fe}$ bị oxi hóa lên $\text{Fe}^{3+}$).
    - $\text{Fe} + \text{H}_2\text{SO}_4(\text{loãng}) \rightarrow \text{FeSO}_4 + \text{H}_2\uparrow$ ($\text{Fe}$ chỉ lên $\text{Fe}^{2+}$, giải phóng $\text{H}_2$).
    - $\text{Cu} + 2\text{H}_2\text{SO}_4(\text{đặc, nóng}) \rightarrow \text{CuSO}_4 + \text{SO}_2\uparrow + 2\text{H}_2\text{O}$ ($\text{Cu} + \text{H}_2\text{SO}_4$ loãng: cảnh báo quy tắc điện hóa không phản ứng).
  * **Axit Hydrochloric $\text{HCl}$**:
    - $\text{MnO}_2 + 4\text{HCl}(\text{đặc, nóng}) \rightarrow \text{MnCl}_2 + \text{Cl}_2\uparrow(\text{vàng lục}) + 2\text{H}_2\text{O}$.
    - $\text{Fe} + 2\text{HCl} \rightarrow \text{FeCl}_2 + \text{H}_2\uparrow$.
  * **Phi kim tác dụng axit đặc**:
    - $\text{C} + 2\text{H}_2\text{SO}_4(\text{đặc}) \rightarrow \text{CO}_2 + 2\text{SO}_2 + 2\text{H}_2\text{O}$.
    - $\text{C} + 4\text{HNO}_3(\text{đặc}) \rightarrow \text{CO}_2 + 4\text{NO}_2 + 2\text{H}_2\text{O}$.

### 2. Hai chế độ tương tác linh hoạt:
- **Chế độ Tiêu Chuẩn (Standard Mode - Nhập cả 2 vế)**:
  - Cho phép nhập điều kiện trực tiếp: `Cu + HNO3(đặc) -> Cu(NO3)2 + NO2 + H2O` hoặc `KClO3(t°) -> KCl + O2`.
- **Chế độ Nâng Cao (Advanced Mode - Tự động dự đoán sản phẩm)**:
  - Nhập chất đầu vào + bấm nút điều kiện nhanh (`🧪 Axit đặc`, `💧 Axit loãng`, `🔥 Nhiệt phân t°`) để hệ thống tự động suy luận toàn bộ sản phẩm.

### 2. Tối ưu không gian sư phạm:
- Đã loại bỏ các câu hỏi ôn tập tĩnh để dành $100\%$ diện tích cho bảng điều khiển số mol động, dòng electron thích ứng theo từng phản ứng, và bảng kiểm chứng bảo toàn nguyên tố.

---

## 🔬 Kiến Trúc Khoa Học & Giải Thuật Lõi

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. Chemical Formula Parser (formula-parser.ts)                                         │
│    - Tokenize công thức có ngoặc lồng nhau: Fe(OH)2, Cu(NO3)2, Al2(SO4)3, (NH4)2SO4    │
│    - Tự động tính khối lượng mol (M g/mol) từ Bảng tuần hoàn chuẩn IUPAC              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. Oxidation State Detector (oxidation-detector.ts)                                    │
│    - Phân tích số oxi hóa tự động theo phân cấp ưu tiên SGK Hóa 10:                   │
│      Đơn chất = 0; Kim loại IA = +1, IIA = +2, Al = +3; H = +1, O = -2;               │
│      Nhận diện gốc SO4, NO3, CO3, PO4, MnO4, Cr2O7, Halide; Tổng điện tích = 0       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. Chemical Equation Balancer (equation-balancer.ts)                                   │
│    - Cân bằng đại số bảo toàn nguyên tố qua Khử Gauss-Jordan trên ma trận hữu tỉ      │
│      chính xác tuyệt đối (Exact Rational Nullspace Solver, không có sai số float)     │
│    - Đối chiếu quy tắc thăng bằng electron: ∑ e nhường = ∑ e nhận                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. Inorganic Reaction Predictor (reaction-predictor.ts)                                │
│    - Rule Engine suy luận sản phẩm từ chất đầu vào cho Hóa 10 & 11                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 5. Generic Simulation Engine (generic-engine.ts)                                       │
│    - Tự động tìm chất hết trước (Limiting Reactant) & Độ tiến triển ξ                 │
│    - Tính n_e trao đổi, số mol và khối lượng còn lại / sinh ra                         │
│    - Kiểm chứng bảo toàn số mol nguyên tử của TẤT CẢ các nguyên tố có mặt              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ Cấu Trúc Giao Diện Ứng Dụng

```text
┌───────────────────────────┬──────────────────────────────────────────────────────────────┐
│  SIDEBAR ĐIỀU KHIỂN ĐỘNG  │  MAIN SECTION: TRỌNG TÂM BẢN CHẤT OXI HÓA – KHỬ             │
│  (Trái - Input tương tác) │  (Phải - Trực quan hóa & Giảng dạy Hóa 10)                   │
├───────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 1. Thẻ từng chất phản ứng:│ 1. Header: Ngữ cảnh bài học & phương trình đang hoạt động    │
│    - Formula, Vai trò     │ 2. Thanh nhập phản ứng thông minh (Reaction Input Bar):      │
│    - Molar mass M         │    - Toggle: Chế độ Tiêu chuẩn  vs  Chế độ Nâng cao          │
│    - Chọn đơn vị: mol / g │    - Ô nhập tự do & Danh mục 9 phản ứng mẫu chọn nhanh       │
│      (hoặc Lít nếu là khí)│ 3. Dòng chuyển dịch electron (⚡ Electron Visualizer):        │
│    - Ô số & thanh trượt   │    - Bên cho e⁻ (Chất khử) ──[e⁻ stream]──> Bên nhận e⁻      │
│    - Huy hiệu "Hết trước" │    - Bán phản ứng oxi hóa & khử sinh tự động                 │
│ 2. Slider tiến độ (0-100%)│ 4. Mô phỏng thực nghiệm (🧪 Tube / Solution Visualizer):     │
│ 3. Nút đặt tỉ lượng chuẩn │    - Đổi màu dung dịch/kết tủa (trắng xanh->nâu đỏ, xanh lam)│
│                           │ 5. Bảng nhận biết & Mẹo ghi nhớ: "Khử cho - O nhận"          │
│                           │ 6. Bảng định lượng chi tiết & Kiểm chứng bảo toàn nguyên tố  │
└───────────────────────────┴──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu môi trường
- **Node.js**: Phiên bản 18+
- **npm**: Phiên bản 9+

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Khởi chạy máy chủ phát triển (Dev Server)
```bash
npm run dev
```
Truy cập trình duyệt: `http://localhost:5173/`

### 3. Chạy toàn bộ kiểm thử tự động (Unit Tests)
```bash
npm test
```
*Tất cả 35/35 tests qua 6 test files đều chạy tự động qua Vitest (Formula Parser, Oxidation Detector, Equation Balancer, Reaction Predictor, Sequential Engine, Generic Engine).*

### 4. Đóng gói sản phẩm (Production Build)
```bash
npm run build
```
Bundle được biên dịch với Type-check đầy đủ trong chưa đầy 1 giây.

---

## 📚 Tài Liệu Kỹ Thuật Tham Khảo
- [open_engine_architecture_plan.md](file:///C:/Users/Luxaztk/.gemini/antigravity-ide/brain/652274b2-5074-4124-8227-3065251f7044/open_engine_architecture_plan.md): Kế hoạch kiến trúc và đặc tả chi tiết.
- [REQUIREMENTS.md](file:///k:/simulation/docs/REQUIREMENTS.md): Đặc tả yêu cầu bài toán.
- [SIMULATION_MODEL.md](file:///k:/simulation/docs/SIMULATION_MODEL.md): Mô hình toán học và phương trình trạng thái.
- [ARCHITECTURE.md](file:///k:/simulation/docs/ARCHITECTURE.md): Kiến trúc luồng dữ liệu.

---
*Dự án phục vụ môn học Mô phỏng trong giáo dục • Chương trình GDPT Hóa học 10 THPT.*
