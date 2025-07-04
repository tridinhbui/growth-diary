import { IEntry } from '../models/Entry';

export interface AnalysisResult {
  message: string;
  averageMood: number;
  trend: 'improving' | 'declining' | 'stable';
  suggestions: string[];
}

export function analyzeEntries(entries: IEntry[]): AnalysisResult {
  if (entries.length === 0) {
    return {
      message: "Chào mừng bạn đến với Growth Diary! Hãy bắt đầu ghi lại cảm xúc hàng ngày để theo dõi hành trình phát triển của mình.",
      averageMood: 3,
      trend: 'stable',
      suggestions: [
        "Bắt đầu với việc ghi lại cảm xúc mỗi ngày",
        "Viết ít nhất 2-3 câu về những gì bạn cảm thấy",
        "Tìm hiểu các hoạt động giúp cải thiện tâm trạng"
      ]
    };
  }

  // Calculate average mood
  const averageMood = entries.reduce((sum, entry) => sum + entry.moodScore, 0) / entries.length;

  // Determine trend by comparing first half vs second half
  const halfLength = Math.floor(entries.length / 2);
  const firstHalf = entries.slice(-entries.length, -halfLength || entries.length);
  const secondHalf = entries.slice(-halfLength);

  const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.moodScore, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.moodScore, 0) / secondHalf.length;

  let trend: 'improving' | 'declining' | 'stable';
  const trendDiff = secondHalfAvg - firstHalfAvg;
  
  if (trendDiff > 0.3) {
    trend = 'improving';
  } else if (trendDiff < -0.3) {
    trend = 'declining';
  } else {
    trend = 'stable';
  }

  // Generate message based on analysis
  let message = '';
  const suggestions: string[] = [];

  if (trend === 'improving') {
    message = `Tuyệt vời! Cảm xúc của bạn đang có xu hướng tích cực hơn với điểm trung bình ${averageMood.toFixed(1)}/5. Hãy tiếp tục duy trì những thói quen tốt này!`;
    suggestions.push(
      "Tiếp tục duy trì những hoạt động đang giúp bạn cảm thấy tốt hơn",
      "Chia sẻ kinh nghiệm tích cực với bạn bè",
      "Thử thách bản thân với mục tiêu mới"
    );
  } else if (trend === 'declining') {
    message = `Tôi nhận thấy cảm xúc của bạn có vẻ đang gặp khó khăn với điểm trung bình ${averageMood.toFixed(1)}/5. Đây là điều bình thường và bạn không đơn độc. Hãy chăm sóc bản thân nhiều hơn.`;
    suggestions.push(
      "Tìm hiểu nguyên nhân gây stress gần đây",
      "Dành thời gian cho các hoạt động yêu thích",
      "Kết nối với những người thân yêu",
      "Xem xét việc tìm kiếm sự hỗ trợ chuyên nghiệp nếu cần"
    );
  } else {
    message = `Cảm xúc của bạn khá ổn định với điểm trung bình ${averageMood.toFixed(1)}/5. Đây là dấu hiệu tốt cho thấy bạn đang duy trì được sự cân bằng trong cuộc sống.`;
    suggestions.push(
      "Thử thêm những hoạt động mới để làm phong phú trải nghiệm",
      "Đặt mục tiêu nhỏ để tạo động lực",
      "Duy trì thói quen ghi nhật ký đều đặn"
    );
  }

  // Add mood-specific suggestions
  if (averageMood < 2.5) {
    suggestions.push(
      "Luyện tập mindfulness hoặc thiền định",
      "Dành ít nhất 30 phút mỗi ngày cho hoạt động thể chất"
    );
  } else if (averageMood > 4) {
    suggestions.push(
      "Chia sẻ năng lượng tích cực với cộng đồng",
      "Ghi lại những khoảnh khắc đẹp để nhớ lại sau này"
    );
  }

  return {
    message,
    averageMood: Math.round(averageMood * 10) / 10,
    trend,
    suggestions
  };
}

// Mock OpenAI integration for future use
export async function getAIReflection(entries: IEntry[]): Promise<string> {
  // This would be replaced with actual OpenAI API call
  const analysis = analyzeEntries(entries);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return `🌱 AI Reflection: ${analysis.message}\n\n💡 Gợi ý:\n${analysis.suggestions.map(s => `• ${s}`).join('\n')}`;
} 