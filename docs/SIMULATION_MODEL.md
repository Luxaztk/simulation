# Mô Hình Mô Phỏng: Phản Ứng Oxi Hóa – Khử 1 Nấc
## $4\text{Fe(OH)}_2 + \text{O}_2 + 2\text{H}_2\text{O} \longrightarrow 4\text{Fe(OH)}_3$

## 1. Phương Trình Hóa Học & Tỉ Lượng (Chemical Reaction & Stoichiometry)

Phản ứng oxi hóa kết tủa sắt(II) hydroxide bằng oxygen trong không khí ẩm:

$$4\text{Fe(OH)}_2 \ (\text{rắn, trắng xanh}) + \text{O}_2 \ (\text{khí}) + 2\text{H}_2\text{O} \ (\text{lỏng}) \longrightarrow 4\text{Fe(OH)}_3 \ (\text{rắn, nâu đỏ})$$

### Hệ số tỉ lượng (Stoichiometric Coefficients):
- $\nu_{\text{Fe(OH)}_2} = -4$
- $\nu_{\text{O}_2} = -1$
- $\nu_{\text{H}_2\text{O}} = -2$
- $\nu_{\text{Fe(OH)}_3} = +4$

---

## 2. Bản Chất Oxi Hóa – Khử & Bán Phản Ứng (Half-Reactions & Electron Transfer)

### 2.1. Quá trình Oxi Hóa (Bên cho electron - Chất khử)
Chất tham gia: $\text{Fe(OH)}_2$, cụ thể là ion sắt $\text{Fe}^{2+}$:
$$\text{Fe}^{+2} \longrightarrow \text{Fe}^{+3} + 1e^-$$
- Mỗi mol $\text{Fe}^{2+}$ **nhường 1 mol electron**.
- Số oxi hóa của $\text{Fe}$ **tăng** từ $+2$ lên $+3$.
- $\text{Fe(OH)}_2$ là **chất khử** (chất bị oxi hóa).

### 2.2. Quá trình Khử (Bên nhận electron - Chất oxi hóa)
Chất tham gia: Phân tử oxygen $\text{O}_2$:
$$\text{O}_2^0 + 4e^- \longrightarrow 2\text{O}^{-2}$$
- Mỗi mol phân tử $\text{O}_2$ **nhận 4 mol electron**.
- Số oxi hóa của $\text{O}$ **giảm** từ $0$ xuống $-2$.
- $\text{O}_2$ là **chất oxi hóa** (chất bị khử).

### 2.3. Định luật Bảo toàn Electron (Electron Conservation)
$$\sum n(e^- \text{ cho}) = \sum n(e^- \text{ nhận}) = 4 \times \xi$$
Trong đó $\xi$ là số mol lượt phản ứng (reaction extent).
- Số mol $e^-$ cho bởi $\text{Fe}^{2+}$: $n_e(\text{cho}) = 1 \times \Delta n(\text{Fe(OH)}_2) = 1 \times (4\xi) = 4\xi$.
- Số mol $e^-$ nhận bởi $\text{O}_2$: $n_e(\text{nhận}) = 4 \times \Delta n(\text{O}_2) = 4 \times \xi = 4\xi$.
- Do đó: $n_e(\text{cho}) \equiv n_e(\text{nhận})$.

---

## 3. Mô Hình Động Học & Độ Tiến Triển (Reaction Extent Model)

Gọi số mol ban đầu của các chất trong hệ kín là:
- $n_0(\text{Fe(OH)}_2)$
- $n_0(\text{O}_2)$
- $n_0(\text{H}_2\text{O})$

Do phản ứng một chiều diễn ra nhanh chóng ở điều kiện thường khi tiếp xúc với oxygen, độ tiến triển tối đa $\xi$ bị giới hạn bởi chất phản ứng hết trước (limiting reactant):

$$\xi = \min\left(\frac{n_0(\text{Fe(OH)}_2)}{4}, \ \frac{n_0(\text{O}_2)}{1}, \ \frac{n_0(\text{H}_2\text{O})}{2}\right)$$

Số mol tại trạng thái cuối:
$$\begin{aligned}
n(\text{Fe(OH)}_2) &= \max\left(0, \ n_0(\text{Fe(OH)}_2) - 4\xi\right) \\
n(\text{O}_2)       &= \max\left(0, \ n_0(\text{O}_2) - \xi\right) \\
n(\text{H}_2\text{O}) &= \max\left(0, \ n_0(\text{H}_2\text{O}) - 2\xi\right) \\
n(\text{Fe(OH)}_3) &= 4\xi
\end{aligned}$$

---

## 4. Tỷ Lệ Chuyển Hóa & Mô Hình Màu Sắc Kết Tủa (Precipitate Color Model)

### Tỷ lệ chuyển hóa kết tủa (% Conversion):
$$\text{Conversion} = \begin{cases}
0\% & \text{khi } n_0(\text{Fe(OH)}_2) = 0 \\
\left(\dfrac{4\xi}{n_0(\text{Fe(OH)}_2)}\right) \times 100\% & \text{khi } n_0(\text{Fe(OH)}_2) > 0
\end{cases}$$

### Mô hình chuyển màu (Color Interpolation):
Hệ màu được ánh xạ dựa trên sự phối trộn quang học giữa 2 dạng kết tủa:
- **Trạng thái khởi đầu ($\text{Conversion} = 0\%$)**: 
  - Tinh khiết $\text{Fe(OH)}_2$. Màu trắng xanh (`#6bb596`).
- **Trạng thái trung gian ($0\% < \text{Conversion} < 100\%$)**:
  - Hỗn hợp kết tủa $\text{Fe(OH)}_2$ và $\text{Fe(OH)}_3$.
  - Màu xanh rêu tối chuyển dần sang vàng đất (`#4a7c59` $\rightarrow$ `#8c6239`).
- **Trạng thái hoàn toàn ($\text{Conversion} = 100\%$)**:
  - Toàn bộ chuyển thành $\text{Fe(OH)}_3$. Màu nâu đỏ (`#8B3A2B`).

---

## 5. Định Luật Bảo Toàn Nguyên Tố & Khối Lượng

### Bảo toàn nguyên tố Fe:
$$n(\text{Fe})_{\text{in}} = n_0(\text{Fe(OH)}_2) = n(\text{Fe(OH)}_2) + n(\text{Fe(OH)}_3) = n(\text{Fe})_{\text{out}}$$

### Bảo toàn nguyên tố H:
$$n(\text{H})_{\text{in}} = 2 \cdot n_0(\text{Fe(OH)}_2) + 2 \cdot n_0(\text{H}_2\text{O})$$
$$n(\text{H})_{\text{out}} = 2 \cdot n(\text{Fe(OH)}_2) + 2 \cdot n(\text{H}_2\text{O}) + 3 \cdot n(\text{Fe(OH)}_3)$$

### Bảo toàn nguyên tố O:
$$n(\text{O})_{\text{in}} = 2 \cdot n_0(\text{Fe(OH)}_2) + 2 \cdot n_0(\text{O}_2) + n_0(\text{H}_2\text{O})$$
$$n(\text{O})_{\text{out}} = 2 \cdot n(\text{Fe(OH)}_2) + 2 \cdot n(\text{O}_2) + n(\text{H}_2\text{O}) + 3 \cdot n(\text{Fe(OH)}_3)$$

### Bảo toàn khối lượng hệ:
$$m_{\text{in}} = \sum_s n_{0,s} \cdot M_s = \sum_s n_s \cdot M_s = m_{\text{out}}$$
Hệ thống kiểm tra với ngưỡng sai số dung sai dấu phẩy động $\Delta < 10^{-5}$.
