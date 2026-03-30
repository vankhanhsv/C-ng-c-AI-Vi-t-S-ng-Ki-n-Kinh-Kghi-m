
import { SKKNTemplate } from '../types';

export const DETAILED_OUTLINE = `I. Đặt vấn đề
1. Mục đích yêu cầu
2. Thực trạng ban đầu
3. Tác hại
4. Các giải pháp đã áp dụng
5. Nguyên nhân thất bại

II. Giải quyết vấn đề
1. Cơ sở lý luận
2. Giả thuyết
3. Quá trình thực hiện giải pháp mới
4. Hiệu quả mới - Ý nghĩa của SKKN

III. Bài học kinh nghiệm
1. Kinh nghiệm cụ thể
2. Cách sử dụng SKKN
3. Ý kiến đề xuất
4. Kết luận`;

export const SKKN_TEMPLATES: SKKNTemplate[] = [
  {
    id: "math",
    name: "Toán học",
    subject: "Toán",
    description: "Mẫu SKKN môn Toán chuẩn",
    outlineText: DETAILED_OUTLINE,
  },
  {
    id: "literature",
    name: "Ngữ văn",
    subject: "Văn",
    description: "Mẫu SKKN môn Văn chuẩn",
    outlineText: DETAILED_OUTLINE,
  },
  {
    id: "informatics",
    name: "Tin học",
    subject: "Tin",
    description: "Mẫu SKKN môn Tin học chuẩn",
    outlineText: DETAILED_OUTLINE,
  },
  {
    id: "english",
    name: "Tiếng Anh",
    subject: "Anh",
    description: "Mẫu SKKN môn Tiếng Anh chuẩn",
    outlineText: DETAILED_OUTLINE,
  },
  {
    id: "stem",
    name: "STEM",
    subject: "STEM",
    description: "Mẫu SKKN giáo dục STEM",
    outlineText: DETAILED_OUTLINE,
  },
];
