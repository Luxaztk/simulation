# Kiến Trúc Hệ Thống: Mô Phỏng Phản Ứng Oxi Hóa – Khử 1 Nấc
## $4\text{Fe(OH)}_2 + \text{O}_2 + 2\text{H}_2\text{O} \longrightarrow 4\text{Fe(OH)}_3$

## 1. Nguyên Tắc Thiết Kế (Architectural Principles)

Ứng dụng được xây dựng theo kiến trúc phân tầng độc lập (Layered Clean Architecture):
1. **Domain-Driven & UI-Agnostic**: Logic hóa học và thuật toán mô phỏng là hàm thuần túy (pure functions), hoàn toàn không phụ thuộc React, DOM hay bất kỳ thư viện UI nào.
2. **Pedagogy-First**: Mọi cấu trúc dữ liệu đều ưu tiên trực quan hóa bản chất bài học Hóa học 10 (bên cho e, bên nhận e, bảo toàn e, đổi màu kết tủa).
3. **Deterministic & Strict Conservation**: Đảm bảo $100\%$ tính đúng đắn về mặt bảo toàn nguyên tố và bảo toàn electron.

---

## 2. Mô Hình Phân Tầng (System Layers)

```text
┌────────────────────────────────────────────────────────┐
│                      UI LAYER                          │
│  - SimulationDashboard (Orchestrator)                  │
│  - SidebarControls (Inputs, Units: mol/g/L, Presets)   │
│  - ElectronTransferVisualizer (Donor -> Stream -> Acc) │
│  - PrecipitateTubeVisualizer (Tube Graphic & Color)    │
│  - RedoxRulesTable ("Khử cho - O nhận")                │
│  - InteractiveConceptQuiz (4 MCQ Questions)            │
│  - OutputPanel (Species table & Conservation checks)   │
└───────────────────────────┬────────────────────────────┘
                            │ gọi
┌───────────────────────────▼────────────────────────────┐
│                  SIMULATION ENGINE                     │
│  - simulate(input: SimulationInput): SimulationState   │
│  - mass-balance validation (Fe, O, H balance checks)   │
│  - test suite (Vitest unit tests)                      │
└───────────────────────────┬────────────────────────────┘
                            │ sử dụng
┌───────────────────────────▼────────────────────────────┐
│                    DOMAIN LAYER                        │
│  - species definitions (fe_oh2, o2, h2o, fe_oh3)       │
│  - molar mass & unit converters (mol <-> g <-> L)      │
│  - oxidation states (Fe: +2->+3, O: 0->-2, H: +1)      │
│  - reaction definition (stoichiometric coefficients)   │
│  - IUPAC atomic constants & molar gas volume (24.79 L) │
└────────────────────────────────────────────────────────┘
```

---

## 3. Luồng Dữ Liệu (Data Flow)

1. **User Action**: Người dùng nhập số mol/gam trong `SidebarControls` hoặc chọn Preset.
2. **Unit Conversion**: Giá trị được quy đổi sang `mol` thông qua các hàm tiện ích của domain layer.
3. **Simulation Call**: `SimulationDashboard` gọi hàm `simulate(input)`.
4. **State Computation**:
   - Tính toán $\xi$ (reaction extent).
   - Tính số mol các chất sau phản ứng.
   - Tính lượng electron trao đổi $n_e = 4\xi$.
   - Tính tỷ lệ chuyển hóa kết tủa và mã màu hex tương ứng.
   - Chạy bộ kiểm tra bảo toàn nguyên tố $\text{Fe, O, H}$ và tổng khối lượng.
5. **UI Rendering**: Toàn bộ kết quả phản ánh đồng thời lên:
   - Dòng chuyển dịch electron (Visualizer).
   - Ống nghiệm đổi màu kết tủa (Tube visualizer).
   - Bảng quy tắc sư phạm & bài trắc nghiệm.
   - Bảng số liệu định lượng chi tiết.
