'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Zap, Star, Heart, Target, Calendar, Clock, Trophy, Flame, Sparkles, ArrowUp, ArrowDown, Activity, Brain, Eye, ChevronRight } from 'lucide-react';

interface StatsData {
  totalEntries: number;
  averageMood: number;
  streakCount: number;
  improvementRate: number;
  consistencyScore: number;
  weeklyGoals: number;
  achievements: number;
  mindfulMinutes: number;
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  duration = 2000, 
  decimals = 0, 
  suffix = '', 
  prefix = '' 
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const startTime = Date.now();
    const startValue = countRef.current;
    const endValue = value;
    const difference = endValue - startValue;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (difference * easeOutCubic);
      
      setCount(currentValue);
      countRef.current = currentValue;

      if (progress >= 1) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 16);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className="font-bold">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const HolographicCard: React.FC<HolographicCardProps> = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl 
        bg-gradient-to-br from-white/10 via-white/5 to-transparent 
        backdrop-blur-xl border border-white/20 
        shadow-[0_8px_32px_rgba(0,0,0,0.1)]
        hover:shadow-[0_8px_48px_rgba(0,0,0,0.15)]
        transition-all duration-500 hover:scale-105
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}
      `}
      style={{
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%),
          radial-gradient(circle at 20% 20%, rgba(120,119,198,0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255,119,198,0.3) 0%, transparent 50%)
        `
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-12 -translate-x-full animate-shimmer" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
};

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
  delay?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = 'from-blue-400 to-purple-500',
  showLabel = true,
  delay = 0 
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (animatedPercentage / 100) * circumference}
          className="transition-all duration-2000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={animatedPercentage} decimals={0} suffix="%" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface InteractiveStatsPanelProps {
  data: StatsData;
  onStatClick?: (statType: string) => void;
  className?: string;
}

const InteractiveStatsPanel: React.FC<InteractiveStatsPanelProps> = ({ 
  data, 
  onStatClick,
  className = '' 
}) => {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  
  const handleStatClick = (statType: string) => {
    setSelectedStat(statType);
    onStatClick?.(statType);
  };

  const statsCards = [
    {
      icon: Heart,
      title: 'Tâm trạng TB',
      value: `${data.averageMood.toFixed(1)}/5`,
      trend: 'up' as const,
      color: 'from-pink-400 to-rose-500',
      type: 'mood'
    },
    {
      icon: Flame,
      title: 'Streak hiện tại',
      value: `${data.streakCount} ngày`,
      trend: 'up' as const,
      color: 'from-orange-400 to-red-500',
      type: 'streak'
    },
    {
      icon: Target,
      title: 'Mục tiêu tuần',
      value: `${data.weeklyGoals}/7`,
      trend: 'stable' as const,
      color: 'from-blue-400 to-indigo-500',
      type: 'goals'
    },
    {
      icon: Trophy,
      title: 'Thành tích',
      value: data.achievements,
      trend: 'up' as const,
      color: 'from-yellow-400 to-orange-500',
      type: 'achievements'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <HolographicCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl animate-float">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Thống kê tương tác</h3>
              <p className="text-white/70 text-sm">Khám phá dữ liệu của bạn theo cách mới</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-white/70">Live</span>
          </div>
        </div>
      </HolographicCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="glass-card p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => handleStatClick(stat.type)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-lg font-bold text-white">{stat.value}</div>
            <div className="text-sm text-white/70">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HolographicCard delay={500}>
          <div className="text-center space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Tiến độ tổng thể</h4>
            
            <CircularProgress 
              percentage={data.consistencyScore} 
              delay={1000}
              size={140}
            />
            
            <div className="space-y-2">
              <div className="text-sm text-white/70">Điểm nhất quán</div>
              <div className="flex items-center justify-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Xuất sắc</span>
              </div>
            </div>
          </div>
        </HolographicCard>

        <HolographicCard delay={600}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">Xu hướng tuần</h4>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">7 ngày qua</span>
              <span className="text-green-400">+{data.improvementRate}%</span>
            </div>
          </div>
        </HolographicCard>

        <HolographicCard delay={700}>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Thống kê mở rộng</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-2">
                <Calendar className="w-6 h-6 text-blue-400 mx-auto" />
                <div className="text-lg font-bold text-white">{data.totalEntries}</div>
                <div className="text-sm text-white/70">Tổng nhật ký</div>
              </div>
              
              <div className="text-center space-y-2">
                <Clock className="w-6 h-6 text-green-400 mx-auto" />
                <div className="text-lg font-bold text-white">{data.mindfulMinutes}</div>
                <div className="text-sm text-white/70">Phút mindful</div>
              </div>
            </div>
          </div>
        </HolographicCard>
      </div>

      {selectedStat && (
        <HolographicCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">
                Chi tiết: {statsCards.find(s => s.type === selectedStat)?.title}
              </h4>
              <button
                onClick={() => setSelectedStat(null)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10">
              <p className="text-white/80 text-sm">
                Dữ liệu chi tiết cho {selectedStat} sẽ được hiển thị ở đây. 
                Bạn có thể xem xu hướng, so sánh với thời gian trước và nhận được gợi ý cải thiện.
              </p>
            </div>
          </div>
        </HolographicCard>
      )}
    </div>
  );
};

export default InteractiveStatsPanel; 