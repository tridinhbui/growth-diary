'use client';

import { useEffect, useState } from 'react';
import { Flame, Trophy, Calendar, Star, Zap, Target, Award, Sparkles } from 'lucide-react';

interface Entry {
  _id: string;
  moodScore: number;
  note: string;
  createdAt: string;
}

interface StreakTrackerProps {
  entries: Entry[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  unlocked: boolean;
  color: string;
}

const FireParticle = ({ delay = 0, size = 'small' }: { delay?: number; size?: 'small' | 'medium' | 'large' }) => {
  const sizeClasses = {
    small: 'w-1 h-1',
    medium: 'w-2 h-2',
    large: 'w-3 h-3'
  };
  
  return (
    <div 
      className={`absolute ${sizeClasses[size]} bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 rounded-full animate-float opacity-70`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${1.5 + Math.random() * 1}s`
      }}
    />
  );
};

const achievements: Achievement[] = [
  {
    id: 'first_entry',
    title: 'Khởi đầu',
    description: 'Viết nhật ký đầu tiên',
    icon: '🌱',
    threshold: 1,
    unlocked: false,
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'week_streak',
    title: 'Tuần kiên trì',
    description: '7 ngày liên tiếp',
    icon: '🔥',
    threshold: 7,
    unlocked: false,
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'month_streak',
    title: 'Tháng bền bỉ',
    description: '30 ngày liên tiếp',
    icon: '🏆',
    threshold: 30,
    unlocked: false,
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'legendary',
    title: 'Huyền thoại',
    description: '100 ngày liên tiếp',
    icon: '⭐',
    threshold: 100,
    unlocked: false,
    color: 'from-purple-400 to-pink-500'
  }
];

export default function StreakTracker({ entries }: StreakTrackerProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [streakLevel, setStreakLevel] = useState(1);

  // Calculate streaks
  useEffect(() => {
    if (entries.length === 0) {
      setCurrentStreak(0);
      setLongestStreak(0);
      return;
    }

    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Calculate current streak
    let current = 0;
    let longest = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Group entries by date
    const entriesByDate = new Map();
    sortedEntries.forEach(entry => {
      const date = new Date(entry.createdAt);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      if (!entriesByDate.has(dateStr)) {
        entriesByDate.set(dateStr, []);
      }
      entriesByDate.get(dateStr).push(entry);
    });

    // Calculate current streak from today backwards
    let checkDate = new Date(today);
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (entriesByDate.has(dateStr)) {
        current++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    const uniqueDates = Array.from(entriesByDate.keys()).sort().reverse();
    
    for (let i = 0; i < uniqueDates.length; i++) {
      tempStreak = 1;
      for (let j = i + 1; j < uniqueDates.length; j++) {
        const currentDate = new Date(uniqueDates[j]);
        const prevDate = new Date(uniqueDates[j - 1]);
        const dayDiff = (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          break;
        }
      }
      longest = Math.max(longest, tempStreak);
    }

    setCurrentStreak(current);
    setLongestStreak(longest);

    // Calculate streak level
    const level = Math.floor(current / 7) + 1;
    setStreakLevel(level);

    // Generate particles for fire effect
    setParticles(Array.from({ length: Math.min(current * 2, 50) }, (_, i) => i));

    // Check for new achievements
    const newAchievements = achievements.filter(achievement => 
      current >= achievement.threshold && !unlockedAchievements.find(a => a.id === achievement.id)
    );

    if (newAchievements.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newAchievements]);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }

  }, [entries]);

  const getStreakColor = (streak: number) => {
    if (streak >= 100) return 'from-purple-500 via-pink-500 to-red-500';
    if (streak >= 30) return 'from-yellow-400 via-orange-500 to-red-500';
    if (streak >= 7) return 'from-orange-400 to-red-500';
    if (streak >= 3) return 'from-green-400 to-yellow-500';
    return 'from-blue-400 to-green-500';
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Hãy bắt đầu hành trình của bạn! 🌱";
    if (streak === 1) return "Bước đầu tuyệt vời! 💪";
    if (streak < 7) return `Đang xây dựng thói quen! ${streak} ngày 🔥`;
    if (streak < 30) return `Chuỗi ngày ấn tượng! ${streak} ngày 🔥🔥`;
    if (streak < 100) return `Siêu thần tỷ! ${streak} ngày 🔥🔥🔥`;
    return `Huyền thoại sống! ${streak} ngày 🔥🔥🔥🔥`;
  };

  const getNextMilestone = (streak: number) => {
    const milestones = [3, 7, 14, 30, 60, 100, 365];
    return milestones.find(m => m > streak) || 1000;
  };

  const nextMilestone = getNextMilestone(currentStreak);
  const progressToNext = currentStreak > 0 ? (currentStreak / nextMilestone) * 100 : 0;

  return (
    <div className="card relative overflow-hidden group">
      {/* Fire Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(i => (
          <FireParticle 
            key={i} 
            delay={i * 0.1} 
            size={i % 3 === 0 ? 'large' : i % 2 === 0 ? 'medium' : 'small'} 
          />
        ))}
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 via-orange-200/30 to-red-200/30 animate-pulse rounded-2xl flex items-center justify-center z-20">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-gradient mb-2">Achievement Unlocked!</div>
            <div className="text-lg text-orange-600 dark:text-orange-400">
              Bạn đã mở khóa thành tựu mới!
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl float">
              <Flame className="w-6 h-6 text-white" />
              {currentStreak > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-red-600 animate-pulse">
                  {currentStreak}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gradient">Chuỗi ngày streak</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Duy trì thói quen hàng ngày
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full">
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Cấp độ {streakLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Main Streak Display */}
        <div className="relative mb-8">
          <div className="text-center">
            {/* Streak Fire Animation */}
            <div className="relative mx-auto mb-6 w-32 h-32 flex items-center justify-center">
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-t ${getStreakColor(currentStreak)} rounded-full opacity-30 blur-xl animate-pulse`}></div>
              
              {/* Main fire container */}
              <div className={`relative w-24 h-24 bg-gradient-to-t ${getStreakColor(currentStreak)} rounded-full flex items-center justify-center shadow-glow-lg border-4 border-white/30 dark:border-gray-600/30`}>
                <Flame className="w-12 h-12 text-white animate-pulse" />
                
                {/* Floating streak number */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-lg">
                  {currentStreak}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-orange-500"></div>
                </div>
              </div>

              {/* Orbiting elements */}
              {currentStreak >= 7 && (
                <div className="absolute inset-0 animate-spin-slow">
                  <Star className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 text-yellow-400" />
                  <Star className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 text-yellow-400" />
                  <Star className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
                  <Star className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
                </div>
              )}
            </div>

            {/* Streak Message */}
            <div className="mb-4">
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {getStreakMessage(currentStreak)}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {currentStreak > 0 ? `Hôm nay là ngày thứ ${currentStreak} liên tiếp!` : 'Bắt đầu ghi nhật ký để tạo streak!'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="relative bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl p-4 border border-orange-200/30 dark:border-orange-700/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-2 right-2">
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {currentStreak}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Streak hiện tại
              </div>
            </div>
          </div>
          
          <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-xl p-4 border border-yellow-200/30 dark:border-yellow-700/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-2 right-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {longestStreak}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Streak dài nhất
              </div>
            </div>
          </div>
          
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200/30 dark:border-blue-700/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-2 right-2">
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {entries.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Tổng nhật ký
              </div>
            </div>
          </div>
        </div>

        {/* Progress to Next Milestone */}
        {currentStreak < 1000 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl p-4 border border-orange-200/30 dark:border-orange-700/30 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Mục tiêu tiếp theo: {nextMilestone} ngày
              </span>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                {Math.round(progressToNext)}%
              </span>
            </div>
            
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getStreakColor(currentStreak)} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
              Còn {nextMilestone - currentStreak} ngày nữa để đạt mục tiêu!
            </p>
          </div>
        )}

        {/* Achievement Showcase */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4 border border-purple-200/30 dark:border-purple-700/30">
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-500" />
            Thành tựu đã mở khóa
          </h5>
          
          <div className="grid grid-cols-4 gap-3">
            {achievements.map((achievement) => {
              const isUnlocked = currentStreak >= achievement.threshold;
              
              return (
                <div
                  key={achievement.id}
                  className={`relative flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                    isUnlocked 
                      ? `bg-gradient-to-br ${achievement.color} text-white shadow-lg scale-105` 
                      : 'bg-gray-100 dark:bg-gray-800/30 opacity-50'
                  }`}
                  title={achievement.description}
                >
                  <span className="text-2xl mb-1">{achievement.icon}</span>
                  <span className="text-xs text-center font-medium">
                    {achievement.title}
                  </span>
                  <span className="text-xs opacity-80 mt-1">
                    {achievement.threshold} ngày
                  </span>
                  
                  {isUnlocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-2 h-2 text-yellow-800" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
              "Thành công không phải là chìa khóa của hạnh phúc. Hạnh phúc mới là chìa khóa của thành công."
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-orange-600 dark:text-orange-400">
              <Flame className="w-4 h-4" />
              <span>Mỗi ngày một streak!</span>
              <Zap className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 