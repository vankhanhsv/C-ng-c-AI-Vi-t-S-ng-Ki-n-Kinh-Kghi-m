
export const WRITING_STYLE_PROMPTS = {
  heartfelt: "Sử dụng giọng văn tâm huyết, giàu cảm xúc, chia sẻ chân thành về những khó khăn và niềm vui của người giáo viên khi thực hiện giải pháp.",
  factual: "Sử dụng giọng văn thực tiễn, tập trung vào số liệu, bằng chứng cụ thể và các kết quả có thể đo lường được.",
  analytical: "Sử dụng giọng văn phân tích khoa học, chặt chẽ, sử dụng các thuật ngữ chuyên môn giáo dục, lập luận logic và có tính hệ thống cao.",
  simple: "Sử dụng ngôn từ đơn giản, dễ hiểu, súc tích, tránh rườm rà, phù hợp với đại đa số bạn đọc."
};

export const getSubjectContext = (subject: string) => {
  if (subject === "Giáo dục Kinh tế và Pháp luật") {
    return `
LƯU Ý QUAN TRỌNG VỀ MÔN HỌC:
Môn Giáo dục Kinh tế và Pháp luật giúp học sinh hiểu những kiến thức cơ bản về hoạt động kinh tế trong xã hội và hệ thống pháp luật của Việt Nam, từ đó hình thành ý thức công dân, năng lực kinh tế và hành vi tuân thủ pháp luật.

Các nội dung trọng tâm cần bám sát:
1. Kiến thức kinh tế cơ bản: Khái niệm nền kinh tế và các hoạt động kinh tế (sản xuất, phân phối, trao đổi, tiêu dùng). Các chủ thể của nền kinh tế: cá nhân, doanh nghiệp, Nhà nước. Thị trường, cơ chế thị trường, giá cả. Hoạt động sản xuất kinh doanh và vai trò của doanh nghiệp. Tài chính cá nhân: thu nhập, chi tiêu, tiết kiệm, tín dụng. Ngân sách nhà nước và thuế.
2. Kiến thức về Nhà nước và hệ thống chính trị: Vai trò của Nhà nước Cộng hòa xã hội chủ nghĩa Việt Nam. Hệ thống chính trị Việt Nam. Bộ máy nhà nước.
3. Kiến thức pháp luật cơ bản: Khái niệm pháp luật, bản chất và vai trò của pháp luật. Hệ thống pháp luật Việt Nam. Quyền và nghĩa vụ pháp lý. Thực hiện pháp luật và các hình thức thực hiện pháp luật. Vi phạm pháp luật và trách nhiệm pháp lý.
4. Hiến pháp và quyền công dân: Vai trò của Hiến pháp. Quyền con người, quyền và nghĩa vụ cơ bản của công dân. Trách nhiệm của công dân trong việc thực hiện quyền và nghĩa vụ.
5. Vận dụng vào đời sống: Vận dụng kiến thức pháp luật vào các tình huống thực tế (giao thông, dân sự, hình sự...). Kỹ năng quản lý tài chính cá nhân. Kỹ năng tham gia vào các quan hệ lao động, kinh doanh. Hiểu biết về hội nhập kinh tế quốc tế.
`;
  }
  return "";
};

export const SECTION_GUIDELINES: Record<string, string> = {
  "Mục đích yêu cầu": "Cần nêu những điều cần đạt, được xem là tốt trong lĩnh vực mà SKKN đề cập đến.",
  "Thực trạng ban đầu": "Miêu tả thực trạng khi chưa có cải tiến thì thế nào? Yêu cầu phải có dẫn chứng, số liệu minh họa cụ thể.",
  "Tác hại": "Thực trạng cũ đã gây tác hại ra sao? Nếu không cải tiến sẽ dẫn đến những mối nguy mới nào?",
  "Các giải pháp đã áp dụng": "Khi chưa thực hiện SKKN này, tác giả hoặc người khác đã áp dụng những biện pháp nào nhưng vẫn không mang lại hiệu quả?",
  "Nguyên nhân thất bại": "Nêu nguyên nhân thất bại của các biện pháp cũ. Phân tích xem có phải do không hợp quy luật tâm lý, xã hội hay lý do khách quan nào khác?",
  "Cơ sở lý luận": "Dựa vào cơ sở lý luận nào để tìm cách giải quyết vấn đề? Hãy trích dẫn lý thuyết và phân tích sự liên quan.",
  "Giả thuyết": "Nêu giả thuyết khoa học: 'Nếu làm thế này... thì sẽ mang lại hiệu quả...'. Nêu dưới dạng câu xác định hoặc câu hỏi.",
  "Quá trình thực hiện giải pháp mới": "Mô tả chi tiết cách thực hiện SKKN. Các hoạt động diễn ra thế nào? Áp dụng từ lúc nào, bao lâu? Có mẫu đối chứng nào? Tổ chuyên môn kiểm tra ra sao?",
  "Hiệu quả mới - Ý nghĩa của SKKN": "Trình bày lý lẽ chứng minh sự hiệu nghiệm. So sánh kết quả với trước khi thực hiện. Đạt mức độ nào so với yêu cầu? Ai đã khen ngợi? Tự đánh giá thế nào?",
  "Kinh nghiệm cụ thể": "Trình bày cụ thể các quy trình mới, hồ sơ biểu mẫu theo dõi, các công thức, hoặc các thao tác hoạt động đã đúc kết được.",
  "Cách sử dụng SKKN": "Nêu cụ thể các điều kiện cần thiết (cơ sở vật chất, con người...) để người đọc có thể áp dụng được SKKN này vào thực tế.",
  "Ý kiến đề xuất": "Để nâng hiệu quả của SKKN lên mức cao hơn, theo tác giả có thể làm thêm điều gì? Đề xuất với cấp trên.",
  "Kết luận": "Lời kết luận ngắn gọn và đề nghị với các cấp quản lý về việc phổ biến/áp dụng SKKN này."
};

export const SUGGEST_TOPICS_PROMPT = (input: any) => {
  const strengthInfo = input.strength?.trim() ? `- Thế mạnh: ${input.strength}` : "- Thế mạnh: Chưa xác định (Hãy gợi ý các đề tài phổ biến và hiệu quả nhất)";
  const productInfo = input.product?.trim() ? `- Công cụ/Phương pháp: ${input.product}` : "- Công cụ/Phương pháp: Các phương pháp dạy học tích cực hiện đại";
  const goalInfo = input.goal?.trim() ? `- Mục tiêu: ${input.goal}` : "- Mục tiêu: Nâng cao chất lượng dạy và học, tạo hứng thú cho học sinh";

  return `
Bạn là một chuyên gia giáo dục tại Việt Nam, am hiểu sâu sắc về phong trào viết Sáng kiến kinh nghiệm (SKKN).
Dựa trên thông tin cơ bản sau:
- Cấp học: ${input.educationLevel}
- Môn học: ${input.subject}
${strengthInfo}
${productInfo}
${goalInfo}

${getSubjectContext(input.subject)}

Nhiệm vụ: Gợi ý 3 tiêu đề SKKN độc đáo, mang tính thực tiễn cao, có khả năng đạt giải cao.
Tiêu đề phải đúng quy chuẩn văn phong sư phạm (ví dụ: 'Một số giải pháp...', 'Nâng cao chất lượng...', 'Ứng dụng... vào...').
Nếu thông tin thế mạnh/công cụ còn trống, hãy dựa vào xu hướng giáo dục mới nhất của môn học và cấp học này tại Việt Nam để gợi ý.
`;
};

export const PARSE_OUTLINE_PROMPT = (text: string) => `
Dưới đây là một danh sách các mục lục hoặc đề cương thô cho một bài Sáng kiến kinh nghiệm (SKKN):
---
${text}
---
Hãy chuyển đổi đề cương này thành định dạng JSON phân cấp. 
Yêu cầu:
1. Giữ nguyên tiêu đề các mục.
2. Cấu trúc JSON phải là một mảng các đối tượng, mỗi đối tượng có:
   - id: chuỗi ngẫu nhiên duy nhất
   - title: tiêu đề mục
   - children: mảng các mục con (nếu có)
`;

export const GENERATE_SECTION_PROMPT = (topic: string, sectionTitle: string, stylePrompt: string, fullContext: string) => {
  // Tìm kiếm hướng dẫn tương ứng dựa trên tiêu đề mục (không phân biệt hoa thường)
  const guideline = Object.entries(SECTION_GUIDELINES).find(([key]) => 
    sectionTitle.toLowerCase().includes(key.toLowerCase())
  )?.[1] || "Viết chuyên sâu, đúng văn phong hành chính - sư phạm giáo dục Việt Nam.";

  return `
Bạn là một giáo viên giỏi đang viết bài Sáng kiến kinh nghiệm (SKKN) với đề tài: "${topic}".
Nhiệm vụ: Soạn thảo nội dung chi tiết cho phần: "${sectionTitle}".

YÊU CẦU NGHIỆP VỤ QUAN TRỌNG:
1. SỬ DỤNG THÔNG TIN THỰC TẾ: Bạn phải sử dụng các thông tin về vùng miền, đặc điểm học sinh, số liệu kết quả, và các công cụ cụ thể được cung cấp trong phần "BỐI CẢNH THỰC TẾ" bên dưới để nội dung bài viết không bị chung chung.
2. VĂN PHONG: Chuyên nghiệp, đúng quy định của ngành giáo dục Việt Nam.
3. PHONG CÁCH: ${stylePrompt}
4. HƯỚNG DẪN RIÊNG CHO PHẦN NÀY: ${guideline}
5. ĐỘ DÀI: 450-650 từ.

--- BỐI CẢNH THỰC TẾ ĐỂ LỒNG GHÉP VÀO BÀI ---
${fullContext}
------------------------------------------

Lưu ý: Chỉ trả về nội dung bài viết, không bao gồm tiêu đề phần hay lời dẫn của AI. Sử dụng các gạch đầu dòng, bảng biểu (nếu có số liệu so sánh) để tăng tính thuyết phục.
`;
};
