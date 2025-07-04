'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Calendar, BarChart3, Sparkles, Star, Heart, AlertCircle } from 'lucide-react';

interface Entry {
  _id: string;
  moodScore: number;
  note: string;
  createdAt: string;
  userId: string;
}

interface MoodChartProps {
  entries: Entry[];
}

interface DayData {
  date: string;
  avgMood: number;
  entries: Entry[];
  displayDate: string;
}

const moodEmojis = [
  { score: 1, emoji: '😢', label: 'Rất buồn', color: 'from-red-400 to-red-600' },
  { score: 2, emoji: '😔', label: 'Buồn', color: 'from-orange-400 to-orange-600' },
  { score: 3, emoji: '😐', label: 'Bình thường', color: 'from-yellow-400 to-yellow-600' },
  { score: 4, emoji: '😊', label: 'Vui', color: 'from-green-400 to-green-600' },
  { score: 5, emoji: '😍', label: 'Rất vui', color: 'from-purple-400 to-purple-600' },
];

const getColorForMood = (score: number) => {
  if (score <= 1.5) return 'from-red-400 to-red-600';
  if (score <= 2.5) return 'from-orange-400 to-orange-600';
  if (score <= 3.5) return 'from-yellow-400 to-yellow-600';
  if (score <= 4.5) return 'from-green-400 to-green-600';
  return 'from-purple-400 to-purple-600';
};

const getMoodEmoji = (score: number) => {
  if (score <= 1.5) return '😢';
  if (score <= 2.5) return '😔';
  if (score <= 3.5) return '😐';
  if (score <= 4.5) return '😊';
  return '😍';
};

export default function MoodChart({ entries }: MoodChartProps) {
  const [animatedHeights, setAnimatedHeights] = useState<number[]>([]);
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  // Get last 14 days of data
  const last14Days: DayData[] = [];
  const today = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayEntries = entries.filter(entry => 
      entry.createdAt.startsWith(dateStr)
    );
    
    const avgMood = dayEntries.length > 0 
      ? dayEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / dayEntries.length
      : 0;
    
    last14Days.push({
      date: dateStr,
      avgMood,
      entries: dayEntries,
      displayDate: date.toLocaleDateString('vi-VN', { 
        weekday: 'short',
        day: '2-digit',
        month: '2-digit'
      })
    });
  }

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const heights = last14Days.map(day => day.avgMood);
      setAnimatedHeights(heights);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [entries]);

  const maxMood = Math.max(...last14Days.map(day => day.avgMood), 5);
  const avgMood = last14Days.reduce((sum, day) => sum + day.avgMood, 0) / last14Days.filter(day => day.avgMood > 0).length || 0;

  const getStatsSummary = () => {
    const validDays = last14Days.filter(day => day.avgMood > 0);
    const totalEntries = entries.length;
    const streakDays = validDays.length;
    
    return { totalEntries, streakDays, avgMood };
  };

  const stats = getStatsSummary();

  return (
    <div className="card relative overflow-hidden group">
      {/* Magical Background Elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full morphing-shape float"></div>
      <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full morphing-shape float-delay-1"></div>
      
      {/* Floating Sparkles */}
      <div className="absolute top-4 right-4">
        <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse float-delay-2" />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gradient">Biểu đồ tâm trạng</h2>
              <p className="text-gray-800 dark:text-gray-200 text-xs md:text-sm font-medium">
                Xu hướng cảm xúc 7 ngày gần nhất
              </p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 animate-pulse" />
        </div>

        {/* Chart Container */}
        <div className="relative">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Chưa có dữ liệu
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Hãy thêm nhật ký đầu tiên để xem biểu đồ tâm trạng
              </p>
            </div>
          ) : (
            <>
              {/* Chart */}
              <div className="mb-6">
                <div className="flex items-end justify-between gap-2 md:gap-4 h-48 md:h-64 mb-4">
                  {last14Days.map((day, index) => (
                    <div key={day.date} className="flex flex-col items-center flex-1 group">
                      {/* Mood Bar */}
                      <div className="relative w-full max-w-8 md:max-w-12">
                        <div 
                          className={`
                            w-full rounded-t-lg transition-all duration-500 hover:brightness-110 cursor-pointer
                            ${day.avgMood >= 4 ? 'bg-gradient-to-t from-green-400 to-green-500' :
                              day.avgMood === 3 ? 'bg-gradient-to-t from-yellow-400 to-yellow-500' :
                              'bg-gradient-to-t from-red-400 to-red-500'}
                          `}
                          style={{ 
                            height: `${(day.avgMood / 5) * 100}%`,
                            animation: `grow 0.8s ease-out ${index * 0.1}s both`
                          }}
                          title={`${day.date}: ${getMoodEmoji(day.avgMood)} (${day.avgMood.toFixed(1)}/5)`}
                        />
                        
                        {/* Hover tooltip */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          {getMoodEmoji(day.avgMood)} {day.avgMood.toFixed(1)}/5
                        </div>
                      </div>
                      
                      {/* Date Label */}
                      <div className="mt-2 text-center">
                        <div className="text-lg md:text-xl">{getMoodEmoji(day.avgMood)}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                          {day.displayDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Y-axis labels */}
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span>😢 1</span>
                  <span>😔 2</span>
                  <span>😐 3</span>
                  <span>😊 4</span>
                  <span>😍 5</span>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { 
                    label: 'Trung bình', 
                    value: stats.avgMood.toFixed(1), 
                    icon: TrendingUp, 
                    color: 'from-blue-500 to-cyan-500',
                    emoji: getMoodEmoji(Math.round(stats.avgMood))
                  },
                  { 
                    label: 'Tốt nhất', 
                    value: maxMood.toFixed(1), 
                    icon: Star, 
                    color: 'from-green-500 to-emerald-500',
                    emoji: getMoodEmoji(maxMood)
                  },
                  { 
                    label: 'Thấp nhất', 
                    value: Math.min(...last14Days.filter(day => day.avgMood > 0).map(day => day.avgMood)).toFixed(1), 
                    icon: AlertCircle, 
                    color: 'from-orange-500 to-red-500',
                    emoji: getMoodEmoji(Math.min(...last14Days.filter(day => day.avgMood > 0).map(day => day.avgMood)))
                  },
                  { 
                    label: 'Tổng cộng', 
                    value: stats.totalEntries, 
                    icon: Calendar, 
                    color: 'from-purple-500 to-pink-500',
                    emoji: '📊'
                  }
                ].map((stat, index) => (
                  <div key={index} className={`glass-card p-3 md:p-4 text-center hover:scale-105 transition-transform duration-300`}>
                    <div className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200">
                      {stat.value} <span className="text-sm">{stat.emoji}</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Mood Legend */}
        <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-wrap justify-center gap-3">
            {moodEmojis.map((mood) => (
              <div
                key={mood.score}
                className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 hover:scale-105 transition-transform duration-300"
              >
                <span className="text-lg">{mood.emoji}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {mood.label}
                </span>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${mood.color}`}></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="text-gradient font-medium">Nhấp vào từng cột</span> để xem chi tiết tâm trạng ngày đó ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 