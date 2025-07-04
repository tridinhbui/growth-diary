'use client';

import { useState, useMemo, useEffect } from 'react';
import { BarChart, PieChart, TrendingUp, TrendingDown, Calendar, Clock, Target, Brain, Sparkles, Star, Heart, Zap, ArrowUp, ArrowDown, Activity } from 'lucide-react';

interface Entry {
  _id: string;
  moodScore: number;
  note: string;
  createdAt: string;
}

interface AdvancedAnalyticsProps {
  entries: Entry[];
}

interface MoodTrend {
  date: string;
  average: number;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

interface InsightCard {
  id: string;
  type: 'positive' | 'neutral' | 'improvement';
  title: string;
  description: string;
  icon: string;
  value?: string;
  color: string;
}

const FloatingDataPoint = ({ value, delay = 0, type = 'number' }: { value: string | number; delay?: number; type?: 'number' | 'emoji' | 'text' }) => (
  <div 
    className={`absolute opacity-20 animate-float font-bold ${
      type === 'emoji' ? 'text-2xl' : type === 'number' ? 'text-lg text-blue-400' : 'text-sm text-gray-400'
    }`}
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${4 + Math.random() * 2}s`
    }}
  >
    {value}
  </div>
);

const AnimatedChart = ({ data, type = 'bar' }: { data: number[]; type?: 'bar' | 'line' }) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(...data);
  
  return (
    <div className="flex items-end gap-2 h-32 p-4">
      {data.map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className={`w-full bg-gradient-to-t from-blue-400 to-purple-500 rounded-t-lg transition-all duration-1000 ease-out relative overflow-hidden ${
              type === 'bar' ? 'min-h-1' : 'rounded-lg'
            }`}
            style={{ 
              height: animated ? `${(value / maxValue) * 100}%` : '0%',
              transitionDelay: `${index * 100}ms`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
          <span className="text-xs text-gray-500 mt-2">{index + 1}</span>
        </div>
      ))}
    </div>
  );
};

const CircularProgress = ({ percentage, color = 'blue', size = 'medium' }: { percentage: number; color?: string; size?: 'small' | 'medium' | 'large' }) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const strokeWidth = size === 'small' ? 4 : size === 'medium' ? 6 : 8;
  const radius = size === 'small' ? 28 : size === 'medium' ? 42 : 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = animated ? circumference - (percentage / 100) * circumference : circumference;

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`text-${color}-500 transition-all duration-1000 ease-out`}
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold ${size === 'small' ? 'text-sm' : size === 'medium' ? 'text-lg' : 'text-xl'} text-gray-700 dark:text-gray-300`}>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export default function AdvancedAnalytics({ entries }: AdvancedAnalyticsProps) {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showInsights, setShowInsights] = useState(false);
  const [floatingData, setFloatingData] = useState<any[]>([]);

  // Generate floating data points
  useEffect(() => {
    const data = [
      ...Array.from({ length: 8 }, (_, i) => ({ type: 'number', value: (Math.random() * 5).toFixed(1), delay: i * 0.3 })),
      ...Array.from({ length: 6 }, (_, i) => ({ type: 'emoji', value: ['😊', '🎯', '💪', '✨', '🔥', '⭐'][i], delay: (i + 8) * 0.3 })),
    ];
    setFloatingData(data);
    
    const timer = setTimeout(() => setShowInsights(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter entries by time period
  const filteredEntries = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeFilter) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return entries.filter(entry => new Date(entry.createdAt) >= filterDate);
  }, [entries, timeFilter]);

  // Calculate analytics
  const analytics = useMemo(() => {
    if (filteredEntries.length === 0) {
      return {
        averageMood: 0,
        totalEntries: 0,
        moodDistribution: [0, 0, 0, 0, 0],
        weeklyTrends: [],
        bestDay: 'N/A',
        worstDay: 'N/A',
        improvementRate: 0,
        consistencyScore: 0
      };
    }

    // Average mood
    const averageMood = filteredEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / filteredEntries.length;

    // Mood distribution
    const moodDistribution = [1, 2, 3, 4, 5].map(score => 
      filteredEntries.filter(entry => entry.moodScore === score).length
    );

    // Weekly trends
    const weeklyTrends: MoodTrend[] = [];
    const weeksToAnalyze = Math.min(8, Math.ceil(filteredEntries.length / 7));
    
    for (let i = 0; i < weeksToAnalyze; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const weekEntries = filteredEntries.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        return entryDate >= weekStart && entryDate < weekEnd;
      });
      
      if (weekEntries.length > 0) {
        const weekAverage = weekEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / weekEntries.length;
        const prevWeekAverage = i > 0 ? weeklyTrends[i - 1]?.average || weekAverage : weekAverage;
        
        weeklyTrends.push({
          date: weekStart.toISOString().split('T')[0],
          average: weekAverage,
          count: weekEntries.length,
          trend: weekAverage > prevWeekAverage ? 'up' : weekAverage < prevWeekAverage ? 'down' : 'stable'
        });
      }
    }

    // Best and worst days
    const dayGroups = filteredEntries.reduce((groups, entry) => {
      const day = new Date(entry.createdAt).toLocaleDateString();
      if (!groups[day]) groups[day] = [];
      groups[day].push(entry.moodScore);
      return groups;
    }, {} as Record<string, number[]>);

    const dayAverages = Object.entries(dayGroups).map(([day, scores]) => ({
      day,
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length
    }));

    const bestDay = dayAverages.length > 0 ? dayAverages.reduce((best, current) => 
      current.average > best.average ? current : best
    ).day : 'N/A';

    const worstDay = dayAverages.length > 0 ? dayAverages.reduce((worst, current) => 
      current.average < worst.average ? current : worst
    ).day : 'N/A';

    // Improvement rate
    const firstHalf = filteredEntries.slice(0, Math.floor(filteredEntries.length / 2));
    const secondHalf = filteredEntries.slice(Math.floor(filteredEntries.length / 2));
    
    const firstHalfAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, entry) => sum + entry.moodScore, 0) / firstHalf.length : 0;
    const secondHalfAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, entry) => sum + entry.moodScore, 0) / secondHalf.length : 0;
    
    const improvementRate = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;

    // Consistency score (how often entries are made)
    const totalDays = Math.ceil((new Date().getTime() - new Date(filteredEntries[filteredEntries.length - 1]?.createdAt || new Date()).getTime()) / (1000 * 60 * 60 * 24));
    const consistencyScore = totalDays > 0 ? (filteredEntries.length / totalDays) * 100 : 0;

    return {
      averageMood,
      totalEntries: filteredEntries.length,
      moodDistribution,
      weeklyTrends: weeklyTrends.reverse(),
      bestDay,
      worstDay,
      improvementRate,
      consistencyScore: Math.min(consistencyScore, 100)
    };
  }, [filteredEntries]);

  // Generate insights
  const insights: InsightCard[] = useMemo(() => {
    const cards: InsightCard[] = [];

    if (analytics.averageMood >= 4) {
      cards.push({
        id: 'positive-mood',
        type: 'positive',
        title: 'Tâm trạng tích cực',
        description: `Bạn đang duy trì tâm trạng tuyệt vời với điểm trung bình ${analytics.averageMood.toFixed(1)}/5`,
        icon: '😊',
        color: 'from-green-400 to-emerald-500'
      });
    }

    if (analytics.improvementRate > 10) {
      cards.push({
        id: 'improvement',
        type: 'improvement',
        title: 'Cải thiện đáng kể',
        description: `Tâm trạng của bạn đã cải thiện ${analytics.improvementRate.toFixed(1)}% so với trước`,
        icon: '📈',
        color: 'from-blue-400 to-indigo-500'
      });
    }

    if (analytics.consistencyScore >= 70) {
      cards.push({
        id: 'consistency',
        type: 'positive',
        title: 'Thói quen tuyệt vời',
        description: `Bạn ghi nhật ký rất đều đặn với ${analytics.consistencyScore.toFixed(0)}% thời gian`,
        icon: '🎯',
        color: 'from-purple-400 to-pink-500'
      });
    }

    if (analytics.weeklyTrends.filter(trend => trend.trend === 'up').length >= 2) {
      cards.push({
        id: 'upward-trend',
        type: 'positive',
        title: 'Xu hướng tăng',
        description: 'Tâm trạng của bạn có xu hướng tích cực trong những tuần gần đây',
        icon: '⬆️',
        color: 'from-orange-400 to-red-500'
      });
    }

    return cards;
  }, [analytics]);

  const moodLabels = ['Rất buồn', 'Buồn', 'Bình thường', 'Vui', 'Rất vui'];
  const moodEmojis = ['😢', '😕', '😐', '😊', '😍'];
  const moodColors = ['from-red-400 to-red-600', 'from-orange-400 to-orange-600', 'from-yellow-400 to-yellow-600', 'from-green-400 to-green-600', 'from-blue-400 to-blue-600'];

  return (
    <div className="card relative overflow-hidden group">
      {/* Floating Background Data */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingData.map((item, i) => (
          <FloatingDataPoint 
            key={i} 
            value={item.value} 
            delay={item.delay} 
            type={item.type}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl float">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gradient">Phân tích nâng cao</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Khám phá xu hướng và pattern tâm trạng
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeFilter(period)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                  timeFilter === period 
                    ? 'bg-indigo-500 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {period === 'week' ? 'Tuần' : period === 'month' ? 'Tháng' : period === 'quarter' ? 'Quý' : 'Năm'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200/30 dark:border-blue-700/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-2 right-2">
              <Heart className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {analytics.averageMood.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Tâm trạng TB
              </div>
              <div className="flex justify-center mt-2">
                <CircularProgress percentage={(analytics.averageMood / 5) * 100} color="blue" size="small" />
              </div>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-4 border border-green-200/30 dark:border-green-700/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-2 right-2">
              <Activity className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {analytics.totalEntries}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Tổng nhật ký
              </div>
              <div className="flex justify-center mt-2">
                <CircularProgress percentage={analytics.consistencyScore} color="green" size="small" />
              </div>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4 border border-purple-200/30 dark:border-purple-700/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-2 right-2">
              {analytics.improvementRate >= 0 ? (
                <TrendingUp className="w-4 h-4 text-purple-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-1 ${
                analytics.improvementRate >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {analytics.improvementRate >= 0 ? '+' : ''}{analytics.improvementRate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Cải thiện
              </div>
              <div className="flex justify-center mt-2">
                <CircularProgress 
                  percentage={Math.abs(analytics.improvementRate)} 
                  color={analytics.improvementRate >= 0 ? "purple" : "red"} 
                  size="small" 
                />
              </div>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl p-4 border border-orange-200/30 dark:border-orange-700/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-2 right-2">
              <Target className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {analytics.consistencyScore.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Đều đặn
              </div>
              <div className="flex justify-center mt-2">
                <CircularProgress percentage={analytics.consistencyScore} color="orange" size="small" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mood Distribution */}
          <div className="bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl p-6 border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-500" />
              Phân bố tâm trạng
            </h4>
            
            <div className="space-y-3">
              {moodLabels.map((label, index) => {
                const count = analytics.moodDistribution[index];
                const percentage = analytics.totalEntries > 0 ? (count / analytics.totalEntries) * 100 : 0;
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-2xl">{moodEmojis[index]}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {label}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${moodColors[index]} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                          style={{ width: `${percentage}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Trends */}
          <div className="bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl p-6 border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-purple-500" />
              Xu hướng theo thời gian
            </h4>
            
            <AnimatedChart data={analytics.weeklyTrends.map(trend => trend.average)} />
            
            <div className="mt-4 space-y-2">
              {analytics.weeklyTrends.slice(0, 3).map((trend, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tuần {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {trend.average.toFixed(1)}
                    </span>
                    {trend.trend === 'up' && <ArrowUp className="w-3 h-3 text-green-500" />}
                    {trend.trend === 'down' && <ArrowDown className="w-3 h-3 text-red-500" />}
                    {trend.trend === 'stable' && <div className="w-3 h-px bg-gray-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        {showInsights && insights.length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 border border-purple-200/30 dark:border-purple-700/30 mb-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Insights thông minh
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`relative bg-gradient-to-br ${insight.color} p-4 rounded-xl text-white overflow-hidden group hover:scale-105 transition-transform duration-300`}
                >
                  <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                    {insight.icon}
                  </div>
                  <h5 className="font-semibold mb-2">{insight.title}</h5>
                  <p className="text-sm opacity-90">{insight.description}</p>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Stats */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-indigo-200/30 dark:border-indigo-700/30">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Thống kê chi tiết
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ngày tốt nhất</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">{analytics.bestDay}</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">💪</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cần cải thiện</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">{analytics.worstDay}</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Đánh giá tổng thể</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {analytics.averageMood >= 4 ? 'Xuất sắc' : analytics.averageMood >= 3.5 ? 'Tốt' : analytics.averageMood >= 3 ? 'Khá' : 'Cần cải thiện'}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
              "Dữ liệu không chỉ là những con số, mà là câu chuyện về hành trình phát triển của bạn."
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-indigo-600 dark:text-indigo-400">
              <Brain className="w-4 h-4" />
              <span>Phân tích thông minh • Phát triển bền vững</span>
              <Zap className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 