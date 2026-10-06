# Lộ Trình Phát Triển Dự Án (Project Milestones)

Dự án mô phỏng giáo dục "Khử oxide sắt bằng CO" (Hóa học 10) được quy hoạch theo các milestone sau:

---

## Milestone V1 – Core Reaction Simulation & Test Dashboard (Hiện Tại)
- **Mục tiêu**: Xây dựng Core Simulation Engine chính xác, quy tắc hóa học tách rời giao diện, bảo toàn nguyên tố/khối lượng, có unit tests bao phủ toàn bộ các trường hợp và dashboard trực quan phục vụ kiểm thử.
- **Deliverables**:
  - Domain models (Species, Reactions, Chemical Constants).
  - Pure Sequential Simulation Engine.
  - Temperature rule configuration.
  - Mass balance & element conservation validator (Fe, C, O).
  - Educational interpretation layer (chất khử, chất oxi hóa, số oxi hóa).
  - Comprehensive unit test suite (Vitest).
  - Interactive Web Dashboard (React + TypeScript + Vite).
  - Đầy đủ tài liệu `docs/` (`REQUIREMENTS.md`, `ARCHITECTURE.md`, `SIMULATION_MODEL.md`, `ASSUMPTIONS.md`, `MILESTONES.md`).

---

## Milestone V1.x – Dashboard & Pedagogical UX Improvements
- **Mục tiêu**: Nâng cấp trải nghiệm sư phạm cho giáo viên và học sinh lớp 10.
- **Dự kiến tính năng**:
  - Hỗ trợ thêm đơn vị nhập thể tích khí $CO$ ở điều kiện chuẩn ($298\text{ K}, 1\text{ bar} \Rightarrow 24.79\text{ L/mol}$ theo CT GDPT 2018 hoặc $22.4\text{ L/mol}$ đktc cũ với nhãn chú thích rõ ràng).
  - Trắc nghiệm kiểm tra độ hiểu bài ngay sau khi chạy mô phỏng (interactive comprehension check).
  - Xuất báo cáo kết quả thực nghiệm mô phỏng dưới dạng PDF/Markdown cho học sinh nộp bài.

---

## Milestone V2 – Heat / Energy Model
- **Mục tiêu**: Bổ sung mô hình nhiệt động học và cân bằng năng lượng vào simulation engine.
- **Dự kiến tính năng**:
  - Enthalpy phản ứng ($\Delta H^\circ_{298}$) của 3 stage:
    - $3Fe_2O_3 + CO \rightarrow 2Fe_3O_4 + CO_2 \quad (\Delta H < 0\text{ - tỏa nhiệt})$
    - $Fe_3O_4 + CO \rightarrow 3FeO + CO_2 \quad (\Delta H > 0\text{ - thu nhiệt nhẹ})$
    - $FeO + CO \rightarrow Fe + CO_2 \quad (\Delta H < 0\text{ - tỏa nhiệt nhẹ})$
  - Dung nhiệt đẳng áp ($C_p$) của các cấu tử rắn và khí theo nhiệt độ.
  - Tính toán nhiệt độ khí thải thực tế $T_{\text{out}}$ rời buồng phản ứng.

---

## Milestone V2.x – Heat Recovery Simulation (Thu Hồi Nhiệt Lò Phản Ứng)
- **Mục tiêu**: Mô hình hóa hệ thống trao đổi nhiệt tiết kiệm năng lượng.
- **Kiến trúc luồng**:
  $$\text{Hot exhaust } (T_{\text{out}}) \rightarrow \text{Heat Exchanger } (\eta) \rightarrow \text{Preheated incoming } CO \rightarrow \text{Auxiliary Heater } (Q_{\text{heater}}) \rightarrow \text{Reactor}$$
- **Dự kiến tính năng**:
  - Tính nhiệt lượng thu hồi $Q_{\text{recovered}}$.
  - Tính công suất bổ sung của lò phụ $Q_{\text{heater}}$ để dòng khí đạt nhiệt độ mục tiêu $T_{\text{target}}$.
  - Đánh giá tỉ lệ tiết kiệm nhiên liệu/năng lượng và giảm phát thải.

---

## Milestone V3 – Interactive 2D Educational Visualization
- **Mục tiêu**: Trực quan hóa 2D sinh động về cấu trúc lò phản ứng và lớp hạt oxide.
- **Dự kiến tính năng**:
  - Mô phỏng mặt cắt lò phản ứng dạng cột (Shaft Reactor / Blast Furnace Column).
  - Hiển thị các tầng nhiệt độ khác nhau trong cột lò.
  - Hoạt họa hạt oxide chuyển màu tương ứng:
    - $Fe_2O_3$: Đỏ nâu (Reddish-brown)
    - $Fe_3O_4$: Đen có từ tính (Black)
    - $FeO$: Đen xám (Dark grey)
    - $Fe$: Xám ánh kim (Metallic grey)
  - Dòng khí $CO$ thổi ngược chiều từ dưới lên và $CO_2$ thoát ra ở đỉnh lò.
