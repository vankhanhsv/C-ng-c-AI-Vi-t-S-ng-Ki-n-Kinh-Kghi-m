
import { GoogleGenAI, Type } from "@google/genai";
import { SKKNSuggestionInput, SKKNSuggestion, AIOutlineResponse, OutlineNode, SectionStatus, WritingStyle } from "../types";

const MODEL_NAME = "gemini-3-flash-preview";

export class GeminiService {
  private ai: any;

  constructor() {
    // Initializing with named parameter as per @google/genai guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async suggestTopics(input: SKKNSuggestionInput): Promise<SKKNSuggestion[]> {
    // Fix: Access educationLevel instead of non-existent gradeLevel from SKKNSuggestionInput
    const prompt = `Bạn là một chuyên gia giáo dục tại Việt Nam. Dựa trên các thông tin sau, hãy gợi ý 3 tiêu đề Sáng kiến kinh nghiệm (SKKN) độc đáo, mang tính thực tiễn cao và đúng quy chuẩn giáo dục:
    - Môn học: ${input.subject}
    - Cấp học: ${input.educationLevel}
    - Thế mạnh giáo viên: ${input.strength}
    - Sản phẩm/Phương pháp áp dụng: ${input.product}
    - Mục tiêu đạt được: ${input.goal}
    
    Hãy trả về kết quả dưới dạng JSON là một mảng các đối tượng có 'title' (tiêu đề SKKN) và 'description' (mô tả ngắn gọn lý do chọn đề tài này).`;

    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["title", "description"]
          }
        }
      }
    });

    // Access the .text property directly from response
    const results = JSON.parse(response.text || "[]");
    return results.map((r: any, idx: number) => ({ ...r, id: `topic-${idx}` }));
  }

  async generateOutline(topic: string, subject: string): Promise<OutlineNode[]> {
    const prompt = `Hãy xây dựng một khung đề cương chi tiết cho Sáng kiến kinh nghiệm với đề tài: "${topic}". 
    Đề cương phải tuân thủ cấu trúc chuẩn của Bộ Giáo dục Việt Nam:
    I. ĐẶT VẤN ĐỀ (Lý do chọn đề tài, Mục đích nghiên cứu, Đối tượng, Phạm vi...)
    II. GIẢI QUYẾT VẤN ĐỀ (Cơ sở lý luận, Thực trạng, Các giải pháp thực hiện, Hiệu quả...)
    III. KẾT LUẬN VÀ KIẾN NGHỊ
    
    Trả về cấu trúc JSON phân cấp. Mỗi mục có 'title' và mảng 'children'.`;

    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              children: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["title"]
          }
        }
      }
    });

    // Access the .text property directly from response
    const rawData = JSON.parse(response.text || "[]");
    
    const transform = (node: any): OutlineNode => ({
      id: Math.random().toString(36).substr(2, 9),
      title: node.title,
      targetWordCount: 400,
      actualWordCount: 0,
      content: "",
      status: "PENDING",
      userGuidance: "",
      children: node.children ? node.children.map(transform) : undefined
    });

    return rawData.map(transform);
  }

  async generateSectionContent(
    topic: string, 
    sectionTitle: string, 
    writingStyle: WritingStyle, 
    context: string
  ): Promise<string> {
    const styleDescription = {
      heartfelt: "tâm huyết, truyền cảm, chia sẻ trải nghiệm thực tế",
      factual: "thực tiễn, khách quan, dựa trên số liệu và kết quả cụ thể",
      analytical: "phân tích khoa học, logic, chặt chẽ, sử dụng thuật ngữ chuyên môn",
      simple: "đơn giản, dễ hiểu, súc tích"
    }[writingStyle];

    const prompt = `Viết nội dung cho phần "${sectionTitle}" của Sáng kiến kinh nghiệm đề tài: "${topic}".
    Yêu cầu:
    - Phong cách viết: ${styleDescription}.
    - Nội dung phải chuyên sâu, thực tế, đúng văn phong sư phạm Việt Nam.
    - Độ dài khoảng 300-500 từ.
    - Sử dụng các ví dụ minh họa nếu cần thiết.
    - Ngữ cảnh bổ sung: ${context || "Không có"}
    
    Chỉ trả về nội dung văn bản, không bao gồm tiêu đề hay các lời dẫn khác.`;

    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    // Access the .text property directly from response
    return response.text || "Không thể tạo nội dung cho phần này.";
  }
}
