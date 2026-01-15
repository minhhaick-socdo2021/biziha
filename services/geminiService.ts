
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AISuggestion, NegotiationRoom } from '../types';

// Initialize Gemini Client
// Always use the named parameter and environment variable for the API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessSuggestions = async (context: string): Promise<string> => {
  try {
    // Using gemini-3-flash-preview for basic text tasks as per guidelines.
    const model = 'gemini-3-flash-preview';
    const systemInstruction = `Bạn là một trợ lý AI chuyên nghiệp cho mạng xã hội doanh nghiệp Biziha. 
    Nhiệm vụ của bạn là đưa ra các gợi ý kết nối, chiến lược kinh doanh hoặc phân tích xu hướng dựa trên ngữ cảnh người dùng cung cấp.
    Nếu người dùng yêu cầu soạn thảo hợp đồng, hãy tạo ra một bản nháp ngắn gọn với các điều khoản tiêu chuẩn (Điều 1, Điều 2...).
    Hãy trả lời ngắn gọn, súc tích, định dạng Markdown đẹp mắt.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: context,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    // Directly access the .text property of GenerateContentResponse.
    return response.text || "Xin lỗi, tôi không thể tạo gợi ý lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.";
  }
};

export const draftNegotiationMessage = async (deal: NegotiationRoom, intent: string): Promise<string> => {
  try {
    const prompt = `
      Dựa trên thông tin deal sau đây, hãy soạn thảo một tin nhắn mẫu chuyên nghiệp (ngắn gọn, lịch sự, đi thẳng vào vấn đề) để gửi cho đối tác.
      
      Thông tin Deal:
      - Tên dự án: ${deal.name}
      - Đối tác: ${deal.partnerName}
      - Giá trị: ${deal.valueRange}
      - Trạng thái hiện tại: ${deal.status}
      - Bước hiện tại: ${deal.currentStep}/4
      - Tin nhắn cuối cùng: "${deal.lastMessage}"
      
      Mục tiêu/Yêu cầu của người dùng: "${intent}"
      
      Hãy chỉ trả về nội dung tin nhắn, không cần giải thích thêm.
    `;

    // Using gemini-3-flash-preview for message drafting.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Không thể soạn thảo tin nhắn lúc này.";
  } catch (error) {
    return "Lỗi khi soạn thảo tin nhắn.";
  }
};

export const analyzeDealStrategy = async (deal: NegotiationRoom, userQuery: string): Promise<string> => {
  try {
    const prompt = `
      Bạn là chuyên gia chiến lược đàm phán và quản trị rủi ro B2B cao cấp.
      Hãy phân tích deal sau và trả lời yêu cầu của người dùng: "${userQuery}".

      📊 **Hồ Sơ Deal:**
      - **Dự án:** ${deal.name}
      - **Đối tác:** ${deal.partnerName}
      - **Giá trị:** ${deal.valueRange}
      - **Giai đoạn:** ${deal.category} (Bước ${deal.currentStep}/4)
      - **Độ ưu tiên:** ${deal.priority || 'Bình thường'}
      - **Hạn chót:** ${deal.deadline || 'Không có'}

      📝 **Yêu cầu phân tích (Trả về định dạng Markdown):**
      1. **Đánh giá tình hình:** Nhận định ngắn gọn về vị thế hiện tại dựa trên tiến độ và hạn chót.
      2. **⚠️ Phân tích rủi ro:** Chỉ ra 1-2 rủi ro tiềm ẩn (ví dụ: chậm tiến độ, rủi ro thanh toán với giá trị ${deal.valueRange}).
      3. **💡 Điểm đàm phán (Key Leverage):** Đề xuất 2-3 điểm mạnh để thuyết phục đối tác.
      4. **🚀 Hành động khuyến nghị:** Việc cần làm ngay lúc này.
      5. **Phản hồi:** Trả lời trực tiếp câu hỏi của người dùng (nếu là câu hỏi cụ thể).

      Giữ giọng văn chuyên nghiệp, sắc sảo, ngắn gọn.
    `;

    // Using gemini-3-pro-preview for complex reasoning tasks.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "Không thể phân tích chiến lược lúc này.";
  } catch (error) {
    return "Đã xảy ra lỗi khi phân tích chiến lược.";
  }
};

export const generatePostDraft = async (topic: string): Promise<string> => {
  try {
    // Using gemini-3-flash-preview for simple content generation.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Viết một bài đăng ngắn gọn, chuyên nghiệp cho mạng xã hội doanh nghiệp về chủ đề: "${topic}". Tone giọng tích cực, hướng tới hợp tác.`,
    });
    return response.text || "";
  } catch (error) {
    return "";
  }
};
