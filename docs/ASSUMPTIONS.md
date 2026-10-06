# Toàn Bộ Giả Định & Quy Ước Thiết Kế (Assumptions & Conventions)

Tài liệu này ghi lại toàn bộ các giả định khoa học, đơn giản hóa sư phạm, và các giá trị placeholder được sử dụng trong phiên bản V1. Mọi thay đổi hoặc tinh chỉnh về sau phải đối chiếu với tài liệu này.

---

## 1. Phân Loại Giả Định

### Nhóm A: Dữ liệu Khoa học Đã Xác Nhận (Verified Scientific Values)
- **Khối lượng mol nguyên tử (Atomic Molar Masses - IUPAC Standard)**:
  - $Fe$: $55.845\text{ g/mol}$ (làm tròn tiêu chuẩn $55.85\text{ g/mol}$)
  - $C$: $12.011\text{ g/mol}$ (làm tròn tiêu chuẩn $12.01\text{ g/mol}$)
  - $O$: $15.999\text{ g/mol}$ (làm tròn tiêu chuẩn $16.00\text{ g/mol}$)
- **Khối lượng mol phân tử (Molecular Molar Masses)**:
  - $Fe_2O_3$: $2 \times 55.845 + 3 \times 15.999 = 159.69\text{ g/mol}$
  - $Fe_3O_4$: $3 \times 55.845 + 4 \times 15.999 = 231.53\text{ g/mol}$
  - $FeO$: $55.845 + 15.999 = 71.844\text{ g/mol} \approx 71.84\text{ g/mol}$
  - $Fe$: $55.845\text{ g/mol}$
  - $CO$: $12.011 + 15.999 = 28.01\text{ g/mol}$
  - $CO_2$: $12.011 + 2 \times 15.999 = 44.01\text{ g/mol}$
- **Bảo toàn nguyên tố**:
  - Không có phản ứng phụ tạo $C$ tự do (Boudouard: $2CO \rightleftharpoons C + CO_2$ không được tính trong phạm vi V1 của bài học này).
  - Không có sự rò rỉ khí hoặc thất thoát kim loại khỏi hệ kín.

---

## 2. Nhóm B: Đơn Giản Hóa Sư Phạm Cho Lớp 10 (Educational Pedagogical Simplifications)
- **Chuỗi phản ứng tuần tự (Sequential Disjoint Stages)**:
  - Trong thực tế nhiệt động và động học luyện kim, các phản ứng có thể diễn ra đồng thời ở các bề mặt hạt oxide khác nhau tạo thành các lớp vỏ đồng tâm (unreacted-core model: vỏ ngoài là Fe, tiếp theo là FeO, Fe3O4, lõi là Fe2O3).
  - *Đơn giản hóa cho học sinh Lớp 10*: Mô hình hóa theo chuỗi 3 stage tuần tự lý tưởng:
    Stage 1 ($Fe_2O_3 \rightarrow Fe_3O_4$) phản ứng hết trước $\rightarrow$ Stage 2 ($Fe_3O_4 \rightarrow FeO$) $\rightarrow$ Stage 3 ($FeO \rightarrow Fe$).
    Điều này giúp học sinh theo dõi rõ từng nấc giảm số oxi hóa $+3 \rightarrow +8/3 \rightarrow +2 \rightarrow 0$.
- **Cân bằng hóa học (Equilibrium vs. Stoichiometric Extent)**:
  - Trong lò công nghiệp thực tế, các phản ứng khử với CO là phản ứng thuận nghịch chịu ảnh hưởng của hằng số cân bằng $K_p(T)$ (ví dụ tỉ lệ $CO/CO_2$ tối thiểu để khử $FeO$ thành $Fe$ là khoảng $2:1$ ở $800^\circ\text{C}$).
  - *Đơn giản hóa cho Lớp 10*: Coi phản ứng diễn ra theo chiều thuận hoàn toàn theo tỉ lệ lượng chất (stoichiometric extent) khi nhiệt độ đạt ngưỡng, với hiệu suất cấu hình được (mặc định $100\%$ khi đủ nhiệt độ). Điều này phù hợp với bài tập tính toán định lượng hóa học phổ thông lớp 10.

---

## 3. Nhóm C: Giá Trị Ngưỡng Nhiệt Độ & Placeholder (Configurable & Unverified Flags)

Các ngưỡng nhiệt độ được thiết kế dạng cấu hình mở (`verified: false` đối với giá trị nhiệt động chính xác, nhưng hợp lý về mặt sư phạm):

| Stage | Phản ứng | Ngưỡng Nhiệt Độ Mặc Định ($T_{\min}$) | Trạng Thái Khoa Học | Ghi Chú Sư Phạm |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 1** | $3Fe_2O_3 + CO \rightarrow 2Fe_3O_4 + CO_2$ | $400^\circ\text{C}$ | `verified: false` (Ước tính thực nghiệm) | Khử ở nhiệt độ thấp nhất |
| **Stage 2** | $Fe_3O_4 + CO \rightarrow 3FeO + CO_2$ | $570^\circ\text{C}$ | `verified: true` (Ngưỡng pha Baur-Glaessner) | Dưới $570^\circ\text{C}$, $FeO$ phân hủy thành $Fe + Fe_3O_4$ |
| **Stage 3** | $FeO + CO \rightarrow Fe + CO_2$ | $700^\circ\text{C}$ | `verified: false` (Ước tính lò luyện) | Khử thành Fe kim loại ở nhiệt độ cao |

*Lưu ý*: Engine hoàn toàn cho phép cấu hình lại các ngưỡng này trong file `temperature-rules.ts` mà không làm thay đổi logic lõi.

---

## 4. Nhóm D: Mô Hình Nhiệt Độ Sau Phản Ứng (Thermal Model Placeholder)
- Trong V1, trường dữ liệu nhiệt độ ra được đặt là:
  ```ts
  thermal: {
    inputTemperatureC: number,
    outputTemperatureC: null, // Chưa tính toán, chờ Milestone V2 Heat Recovery
    note: "Thermal calculation will be implemented in the Heat Recovery milestone."
  }
  ```
- **Không tự ý giả định hay bịa đặt một giá trị `outputTemperatureC`** khi chưa có mô hình cân bằng nhiệt năng (Enthalpy, $C_p$, truyền nhiệt và tản nhiệt).
