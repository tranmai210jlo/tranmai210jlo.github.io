
# MXD – Affiliate Store (GitHub Pages)

Triển khai nhanh website tĩnh trên GitHub Pages.

## Bước nhanh

1. Tạo repo **<username>.github.io** (Public).
2. Upload toàn bộ file/folder trong gói này vào nhánh `main` (root).
3. Vào **Settings → Pages** → chọn `Deploy from a branch` → Branch: `main` / Folder: `/ (root)` → Save.
4. Mở `https://<username>.github.io` để xem site.

## Form liên hệ (Formspree)

- Đăng ký Formspree để lấy endpoint, sau đó sửa `contact.html` phần `action="ACTION_URL"` thành endpoint của bạn.
- Hoặc tạo Google Forms / Netlify Forms nếu muốn.

## Tuỳ biến

- Logo/ảnh: thay `assets/img/placeholder.png`.
- Sản phẩm: sửa `store.html` (cập nhật link affiliate).
- Màu sắc: `assets/css/styles.css`.
