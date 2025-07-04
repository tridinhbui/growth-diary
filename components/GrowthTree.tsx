'use client';

import { useEffect, useState } from 'react';
import { Sparkles, TreePine, Sun, Droplets, Star, Leaf } from 'lucide-react';

interface Entry {
  _id: string;
  moodScore: number;
  note: string;
  createdAt: string;
}

interface GrowthTreeProps {
  entries: Entry[];
}

const getTreeStage = (totalEntries: number, avgMood: number) => {
  const moodMultiplier = avgMood / 5;
  const adjustedEntries = totalEntries * moodMultiplier;
  
  if (adjustedEntries < 5) return 0; // Seed
  if (adjustedEntries < 15) return 1; // Sprout
  if (adjustedEntries < 30) return 2; // Small tree
  if (adjustedEntries < 60) return 3; // Growing tree
  if (adjustedEntries < 100) return 4; // Large tree
  return 5; // Magical tree
};

const treeStages = [
  {
    name: 'Hạt giống',
    icon: '🌱',
    description: 'Bạn vừa bắt đầu hành trình!',
    color: 'from-brown-400 to-yellow-600',
    bgColor: 'from-yellow-100 to-brown-100',
    minEntries: 0,
    size: 'w-16 h-16'
  },
  {
    name: 'Mầm xanh',
    icon: '🌿',
    description: 'Những suy nghĩ đầu tiên nảy mầm',
    color: 'from-green-400 to-green-600',
    bgColor: 'from-green-100 to-emerald-100',
    minEntries: 5,
    size: 'w-20 h-20'
  },
  {
    name: 'Cây con',
    icon: '🌳',
    description: 'Bạn đang phát triển ổn định',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'from-emerald-100 to-green-100',
    minEntries: 15,
    size: 'w-24 h-24'
  },
  {
    name: 'Cây xanh',
    icon: '🌲',
    description: 'Tâm hồn bạn ngày càng vững chắc',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'from-teal-100 to-emerald-100',
    minEntries: 30,
    size: 'w-28 h-28'
  },
  {
    name: 'Cây lớn',
    icon: '🌴',
    description: 'Bạn đã xây dựng được thói quen tốt',
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'from-cyan-100 to-teal-100',
    minEntries: 60,
    size: 'w-32 h-32'
  },
  {
    name: 'Cây thần kỳ',
    icon: '🌸',
    description: 'Bạn đã master được nghệ thuật sống!',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'from-pink-100 to-purple-100',
    minEntries: 100,
    size: 'w-36 h-36'
  }
];

const Particle = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${2 + Math.random() * 2}s`
    }}
  />
);

export default function GrowthTree({ entries }: GrowthTreeProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  const avgMood = entries.length > 0 
    ? entries.reduce((sum, entry) => sum + entry.moodScore, 0) / entries.length 
    : 0;
  
  const treeStage = getTreeStage(entries.length, avgMood);
  const currentTree = treeStages[treeStage];
  const nextTree = treeStages[treeStage + 1];

  // Progress calculation
  const progressToNext = nextTree 
    ? Math.min(((entries.length * (avgMood / 5)) - currentTree.minEntries) / (nextTree.minEntries - currentTree.minEntries) * 100, 100)
    : 100;

  useEffect(() => {
    // Animate tree growth
    const timer = setTimeout(() => {
      setCurrentStage(treeStage);
    }, 500);

    // Generate particles
    setParticles(Array.from({ length: 20 }, (_, i) => i));

    // Show celebration for new stages
    if (treeStage > 0 && entries.length > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }

    return () => clearTimeout(timer);
  }, [entries.length, avgMood]);

  const getEncouragementMessage = () => {
    if (entries.length === 0) return "Hãy bắt đầu hành trình của bạn! 🌱";
    if (avgMood >= 4) return "Bạn đang có tâm trạng rất tích cực! ✨";
    if (avgMood >= 3) return "Bạn đang duy trì được sự ổn định! 🌿";
    return "Mỗi ngày đều là cơ hội mới để phát triển! 💚";
  };

  const getNextStageText = () => {
    if (!nextTree) return "Bạn đã đạt đến đỉnh cao! 🏆";
    const remaining = nextTree.minEntries - Math.floor(entries.length * (avgMood / 5));
    return `Còn ${remaining} nhật ký chất lượng để đạt "${nextTree.name}"`;
  };

  return (
    <div className="card relative overflow-hidden group">
      {/* Magical Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/30"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(i => (
          <Particle key={i} delay={i * 0.1} />
        ))}
      </div>

      {/* Celebration Effect */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 animate-pulse rounded-2xl flex items-center justify-center z-20">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-gradient mb-2">Chúc mừng!</div>
            <div className="text-lg text-emerald-600 dark:text-emerald-400">
              Cây của bạn đã phát triển!
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl float">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gradient">Cây phát triển</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Hành trình trưởng thành của bạn
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
            <span className="text-sm font-medium text-gradient">
              Giai đoạn {treeStage + 1}/6
            </span>
          </div>
        </div>

        {/* Tree Visualization */}
        <div className="relative">
          {/* Main tree container */}
          <div className={`relative mx-auto mb-8 ${currentTree.size} transition-all duration-1000 ease-out transform`}>
            {/* Tree glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentTree.color} rounded-full opacity-20 blur-xl animate-pulse`}></div>
            
            {/* Tree icon */}
            <div className={`relative flex items-center justify-center ${currentTree.size} bg-gradient-to-br ${currentTree.bgColor} dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-xl rounded-full border-4 border-white/30 dark:border-gray-600/30 shadow-2xl transition-all duration-1000`}>
              <span className="text-6xl animate-float" style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                animationDelay: '0s'
              }}>
                {currentTree.icon}
              </span>
              
              {/* Stage indicator */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {treeStage + 1}
              </div>
            </div>

            {/* Floating elements around tree */}
            <div className="absolute -top-8 -left-8 text-2xl animate-float" style={{ animationDelay: '0.5s' }}>
              <Sun className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="absolute -top-8 -right-8 text-2xl animate-float" style={{ animationDelay: '1s' }}>
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
            <div className="absolute -bottom-8 -left-8 text-2xl animate-float" style={{ animationDelay: '1.5s' }}>
              <Leaf className="w-6 h-6 text-green-500" />
            </div>
            <div className="absolute -bottom-8 -right-8 text-2xl animate-float" style={{ animationDelay: '2s' }}>
              <Star className="w-6 h-6 text-purple-500" />
            </div>
          </div>

          {/* Tree Info */}
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-gradient mb-2">
              {currentTree.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {currentTree.description}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {getEncouragementMessage()}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200/30 dark:border-blue-700/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {entries.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Tổng nhật ký
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-4 border border-emerald-200/30 dark:border-emerald-700/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                  {avgMood > 0 ? avgMood.toFixed(1) : '0'}
                  <span className="text-2xl">
                    {avgMood >= 4 ? '😍' : avgMood >= 3 ? '😊' : avgMood >= 2 ? '😐' : avgMood >= 1 ? '😔' : '😢'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Tâm trạng TB
                </div>
              </div>
            </div>
          </div>

          {/* Progress to next stage */}
          {nextTree && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4 border border-purple-200/30 dark:border-purple-700/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tiến độ đến "{nextTree.name}"
                </span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(progressToNext)}%
                </span>
              </div>
              
              <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${progressToNext}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                {getNextStageText()}
              </p>
            </div>
          )}

          {/* All stages preview */}
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Tất cả giai đoạn phát triển
            </h5>
            
            <div className="grid grid-cols-6 gap-2">
              {treeStages.map((stage, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                    index <= treeStage 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 scale-110' 
                      : 'bg-gray-100 dark:bg-gray-800/30 opacity-60'
                  }`}
                >
                  <span className="text-2xl mb-1">{stage.icon}</span>
                  <span className="text-xs text-center font-medium text-gray-700 dark:text-gray-300">
                    {stage.name}
                  </span>
                  
                  {index <= treeStage && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
              "Cây to bắt đầu từ hạt nhỏ, hành trình dài bắt đầu từ bước chân đầu tiên"
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <TreePine className="w-4 h-4" />
              <span>Tiếp tục phát triển mỗi ngày</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 