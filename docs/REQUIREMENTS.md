# Đặc Tả Yêu Cầu Dự Án: Mô Phỏng Phản Ứng Oxi Hóa – Khử 1 Nấc (Hóa Học 10)
## $4\text{Fe(OH)}_2 + \text{O}_2 + 2\text{H}_2\text{O} \longrightarrow 4\text{Fe(OH)}_3$

## 1. Giới Thiệu & Bối Cảnh Sư Phạm
- **Môn học**: Hóa học 10 (Chương trình GDPT 2018).
- **Chương 4**: Phản ứng oxi hóa – khử.
- **Bài 15**: Phản ứng oxi hóa – khử.
- **Mục tiêu giáo dục**: 
  - Khắc phục khó khăn của người học khi tiếp cận các phản ứng đa nấc phức tạp.
  - Sử dụng phản ứng 1 nấc kinh điển dễ tiếp cận và quan sát trực quan nhất: Oxi hóa kết tủa $\text{Fe(OH)}_2$ trắng xanh trong không khí ẩm thành kết tủa $\text{Fe(OH)}_3$ màu nâu đỏ.
  - Giúp học sinh nắm vững:
    1. Bản chất phản ứng oxi hóa – khử là sự chuyển dịch electron giữa các chất phản ứng.
    2. Nhận biết chính xác **Chất khử** (chất nhường e) và **Chất oxi hóa** (chất nhận e).
    3. Phân biệt **Quá trình oxi hóa** (sự oxi hóa) và **Quá trình khử** (sự khử).
    4. Khắc sâu định luật **Bảo toàn electron**: $\sum n(e^- \text{ cho}) = \sum n(e^- \text{ nhận})$.
    5. Liên hệ giữa sự biến đổi số oxi hóa ở cấp độ vi mô với hiện tượng đổi màu kết tủa ở cấp độ vĩ mô.

---

## 2. Functional Requirements (Yêu Cầu Chức Năng)

### FR-01: Mô hình hóa phản ứng 1 nấc chính xác
- Phương trình phản ứng:
  $$4\text{Fe(OH)}_2 + \text{O}_2 + 2\text{H}_2\text{O} \longrightarrow 4\text{Fe(OH)}_3$$
- Tỉ lệ tỉ lượng: Cứ $4\text{ mol } \text{Fe(OH)}_2$ phản ứng với $1\text{ mol } \text{O}_2$ và $2\text{ mol } \text{H}_2\text{O}$ tạo thành $4\text{ mol } \text{Fe(OH)}_3$.
- Tính toán mức độ tiến triển phản ứng $\xi$ dựa trên chất phản ứng hết trước (limiting reactant).

### FR-02: Hỗ trợ đa dạng kịch bản thí nghiệm (Scenarios & Presets)
Hệ thống hỗ trợ các tình huống thí nghiệm thực tế:
1. **Chuẩn tỉ lượng hoàn toàn**: Đủ lượng $\text{Fe(OH)}_2$ và $\text{O}_2$ theo đúng tỉ lệ $4 : 1$, chuyển hóa $100\%$ sang $\text{Fe(OH)}_3$ nâu đỏ.
2. **Thiếu Oxygen (Ống nghiệm kín/nắp đậy)**: Lượng $\text{O}_2$ hạn chế, phản ứng dừng khi $\text{O}_2$ cạn kiệt, còn dư $\text{Fe(OH)}_2$ trắng xanh tạo nên màu xanh rêu ngả vàng đất.
3. **Dư Oxygen (Sục khí O₂ dư thừa)**: Toàn bộ $\text{Fe(OH)}_2$ bị oxi hóa hoàn toàn, còn dư $\text{O}_2$ tự do.
4. **Môi trường trơ ($N_2$ hoặc chân không)**: Lượng $\text{O}_2 = 0$, không xảy ra phản ứng, kết tủa giữ nguyên màu trắng xanh $100\%$.

### FR-03: Sidebar điều khiển tự do & chuyển đổi đơn vị linh hoạt
- **Fe(OH)₂**: Cho phép nhập tự do theo số mol (`mol`) hoặc theo khối lượng (`gam`) với $M = 89.86\text{ g/mol}$.
- **O₂**: Cho phép nhập tự do theo số mol (`mol`), khối lượng (`gam`, $M = 32.00\text{ g/mol}$), hoặc thể tích khí ở điều kiện chuẩn (`lít`, $24.79\text{ L/mol}$ theo CT GDPT 2018).
- **H₂O**: Dung môi có sẵn hoặc nhập lượng cụ thể.
- **Chế độ Live Mode**: Cập nhật mô phỏng tức thời theo từng thao tác nhập số của người dùng.

### FR-04: Trực quan hóa dòng electron (Electron Transfer Visualizer)
- **Bên cho electron (Chất khử)**: 
  - Thể hiện bán phản ứng nhường e: $\text{Fe}^{+2} \longrightarrow \text{Fe}^{+3} + 1e^-$.
  - Nhãn số oxi hóa tăng từ $+2$ lên $+3$.
  - Thể hiện tên gọi: *Quá trình oxi hóa* (hay *Sự oxi hóa $\text{Fe}^{2+}$*).
- **Dòng chuyển dịch e⁻ (Electron Stream)**:
  - Hiệu ứng chuyển động trực quan của các electron di chuyển từ $\text{Fe}^{2+}$ sang $\text{O}_2$.
  - Bộ đếm bảo toàn electron: $\sum n(e^- \text{ cho}) = \sum n(e^- \text{ nhận}) = 4\xi$.
- **Bên nhận electron (Chất oxi hóa)**:
  - Thể hiện bán phản ứng nhận e: $\text{O}_2^0 + 4e^- \longrightarrow 2\text{O}^{-2}$.
  - Nhãn số oxi hóa giảm từ $0$ xuống $-2$.
  - Thể hiện tên gọi: *Quá trình khử* (hay *Sự khử $\text{O}_2$*).

### FR-05: Trực quan hóa biến đổi màu kết tủa trong ống nghiệm
- Đồ họa ống nghiệm thủy tinh với lớp bọt khí $\text{O}_2$ và dung dịch kết tủa.
- Màu kết tủa chuyển động liên tục dựa theo tỷ lệ chuyển hóa $\text{Conversion} \in [0, 100\%]$:
  - $0\%$: `#6bb596` (Trắng xanh $\text{Fe(OH)}_2$).
  - Giữa chừng: Gam màu chuyển đổi mượt mà sang xanh rêu ngả vàng.
  - $100\%$: `#8B3A2B` (Nâu đỏ $\text{Fe(OH)}_3$).
- Thanh phổ màu (Spectrum pointer) chỉ rõ trạng thái hiện tại.

### FR-06: Bảng quy tắc & Mẹo sư phạm ghi nhớ ("Khử cho - O nhận")
- So sánh trực tiếp chất khử vs chất oxi hóa, cho e vs nhận e, quá trình oxi hóa vs quá trình khử.
- Khắc sâu mẹo: *"Khử cho - O nhận"* và *"Nghịch thuật ngữ"*.

### FR-07: Góc trắc nghiệm tương tác củng cố kiến thức
- Tích hợp 4 câu hỏi trắc nghiệm kiểm tra độ hiểu bài ngay trên dashboard.
- Chấm điểm và đưa ra giải thích sư phạm tức thì khi người học chọn đáp án.

### FR-08: Bảo toàn nguyên tố & khối lượng
- Kiểm tra tính bảo toàn:
  - $\sum \text{Fe}_{\text{in}} = \sum \text{Fe}_{\text{out}}$
  - $\sum \text{O}_{\text{in}} = \sum \text{O}_{\text{out}}$
  - $\sum \text{H}_{\text{in}} = \sum \text{H}_{\text{out}}$
  - Tổng khối lượng hệ trước phản ứng = Tổng khối lượng sau phản ứng ($\Delta < 10^{-5}$).

---

## 3. Non-Functional Requirements (Yêu Cầu Phi Chức Năng)
- **Tốc độ phản hồi**: Kết quả tính toán simulation dưới $5\text{ms}$.
- **Độ tin cậy & Test Coverage**: 100% core logic được kiểm thử tự động với Vitest.
- **Tính khả chuyển**: Chạy thuần client-side trên mọi trình duyệt hiện đại không cần backend server.
- **Thẩm mỹ giao diện**: Thiết kế dark theme hiện đại, màu sắc trực quan, biểu tượng rõ ràng, tối ưu cho học tập.
