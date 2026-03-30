
import { GoogleGenAI, Type } from "@google/genai";
import { 
  SKKNSuggestionInput, 
  SKKNSuggestion, 
  OutlineNode, 
  WritingStyle,
  DetailedConfig,
  UserInfo
} from "../types";
import { 
  SUGGEST_TOPICS_PROMPT, 
  PARSE_OUTLINE_PROMPT, 
  GENERATE_SECTION_PROMPT, 
  WRITING_STYLE_PROMPTS,
  getSubjectContext
} from "../constants/prompts";

const MODEL_NAME = "gemini-3-flash-preview";

// Helper for retry logic
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && error?.status === 429) {
      await sleep(delay);
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export class AIService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateSkknSuggestions(input: SKKNSuggestionInput): Promise<SKKNSuggestion[]> {
    const ai = this.getAI();
    return retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: SUGGEST_TOPICS_PROMPT(input),
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

      const data = JSON.parse(response.text || "[]");
      return data.map((item: any, idx: number) => ({
        id: `suggest-${idx}-${Date.now()}`,
        title: item.title,
        description: item.description
      }));
    });
  }

  async parseCustomOutline(text: string): Promise<OutlineNode[]> {
    const ai = this.getAI();
    return retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: PARSE_OUTLINE_PROMPT(text),
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                children: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING }
                    }
                  }
                }
              },
              required: ["id", "title"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      
      const transform = (item: any): OutlineNode => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        title: item.title,
        targetWordCount: 500,
        actualWordCount: 0,
        content: "",
        status: "PENDING",
        userGuidance: "",
        children: item.children ? item.children.map(transform) : undefined
      });

      return data.map(transform);
    });
  }

  async generateSectionContent(
    topic: string, 
    sectionTitle: string, 
    writingStyle: WritingStyle, 
    userInfo: UserInfo,
    detailedConfig: DetailedConfig,
    baseInfo: { educationLevel: string, subject: string },
    userGuidance: string
  ): Promise<string> {
    const ai = this.getAI();
    const stylePrompt = WRITING_STYLE_PROMPTS[writingStyle];

    // Xây dựng chuỗi ngữ cảnh thực tế cực kỳ chi tiết từ các input người dùng đã nhập
    const fullContext = `
[THÔNG TIN CƠ BẢN]
- Tác giả: ${userInfo.name}
- Đơn vị: ${userInfo.school}
- Cấp học: ${baseInfo.educationLevel}
- Môn học: ${baseInfo.subject}

[ĐƠN VỊ & ĐỐI TƯỢNG]
- Loại hình/Vùng miền: ${detailedConfig.schoolType}
- Quy mô trường: ${detailedConfig.schoolScale || "Không rõ"}
- Cơ sở vật chất: ${detailedConfig.facilities || "Phòng học cơ bản"}
- Khó khăn đơn vị: ${detailedConfig.difficulties || "Không có khó khăn đặc thù"}
- Khối lớp áp dụng: ${detailedConfig.targetClass || "Khối lớp của bộ môn"}
- Số lượng HS: ${detailedConfig.studentCount || "Một lớp học tiêu chuẩn"}
- Đặc điểm HS: ${detailedConfig.studentCharacteristics || "Học sinh có học lực đồng đều"}

[THỰC TRẠNG & GIẢI PHÁP]
- Thực trạng vấn đề: ${detailedConfig.problemStatus || "Chưa đạt hiệu quả tối ưu trong dạy học"}
- Giải pháp cốt lõi: ${detailedConfig.mainSolutions || "Cải tiến phương pháp giảng dạy truyền thống"}
- Công cụ/Phần mềm: ${detailedConfig.tools || "Đồ dùng dạy học sẵn có"}
- Thời gian thực hiện: ${detailedConfig.timeRange || "Trong năm học hiện tại"}

[KẾT QUẢ SO SÁNH]
- Trước khi áp dụng: ${detailedConfig.resultBefore || "Mức độ hoàn thành trung bình"}
- Sau khi áp dụng: ${detailedConfig.resultAfter || "Mức độ hoàn thành tốt trở lên"}
- Minh chứng: ${detailedConfig.evidence || "Sổ điểm, phiếu khảo sát"}
- Cấp xét duyệt: ${detailedConfig.approvalLevel}

[GHI CHÚ RIÊNG CỦA GIÁO VIÊN]
${userGuidance || "Không có yêu cầu bổ sung."}

${getSubjectContext(baseInfo.subject)}
    `.trim();
    
    return retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: GENERATE_SECTION_PROMPT(topic, sectionTitle, stylePrompt, fullContext),
        config: {
          temperature: 0.7,
        }
      });

      return response.text || "";
    });
  }
}

export const aiService = new AIService();
