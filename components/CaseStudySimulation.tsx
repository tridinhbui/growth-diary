'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, Brain, Target, TrendingUp, Award, PlayCircle, PauseCircle, RefreshCw, ChevronRight, Star, Heart, Zap, Calendar, Clock, BookOpen, Lightbulb, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface CaseStudyScenario {
  id: string;
  name: string;
  description: string;
  avatar: string;
  initialMood: number;
  goals: string[];
  challenges: string[];
  duration: number; // days
  expectedOutcome: string;
  personality: 'optimistic' | 'pessimistic' | 'balanced' | 'anxious' | 'determined';
}

interface SimulationDay {
  day: number;
  mood: number;
  events: string[];
  progress: number;
  insights: string[];
  achievements: string[];
}

interface SimulationState {
  currentDay: number;
  isRunning: boolean;
  speed: number;
  completed: boolean;
  results: SimulationDay[];
}

const scenarios: CaseStudyScenario[] = [
  {
    id: 'student-stress',
    name: 'Minh - Sinh viên áp lực',
    description: 'Sinh viên năm cuối đối mặt với áp lực thi cử và tương lai',
    avatar: '🎓',
    initialMood: 2,
    goals: ['Giảm căng thẳng', 'Cải thiện giấc ngủ', 'Tăng tự tin'],
    challenges: ['Procrastination', 'Anxiety', 'Sleep issues'],
    duration: 30,
    expectedOutcome: 'Cải thiện 40% tâm trạng, giảm căng thẳng',
    personality: 'anxious'
  },
  {
    id: 'working-parent',
    name: 'Hoa - Mẹ đi làm',
    description: 'Mẹ đơn thân cân bằng công việc và chăm sóc con',
    avatar: '👩‍💼',
    initialMood: 3,
    goals: ['Work-life balance', 'Tăng năng lượng', 'Giảm stress'],
    challenges: ['Time management', 'Fatigue', 'Guilt'],
    duration: 45,
    expectedOutcome: 'Tăng 50% hiệu quả, cải thiện mối quan hệ',
    personality: 'determined'
  },
  {
    id: 'young-professional',
    name: 'Nam - Chuyên gia trẻ',
    description: 'Nhân viên IT mới bắt đầu sự nghiệp, muốn phát triển bản thân',
    avatar: '💻',
    initialMood: 4,
    goals: ['Phát triển kỹ năng', 'Networking', 'Healthy lifestyle'],
    challenges: ['Work pressure', 'Social anxiety', 'Imposter syndrome'],
    duration: 60,
    expectedOutcome: 'Tăng 35% tự tin, cải thiện kỹ năng xã hội',
    personality: 'optimistic'
  },
  {
    id: 'retiree',
    name: 'Cô Lan - Về hưu',
    description: 'Người về hưu tìm kiếm mục đích và niềm vui mới',
    avatar: '👵',
    initialMood: 3,
    goals: ['Tìm hobby mới', 'Kết nối xã hội', 'Sức khỏe tinh thần'],
    challenges: ['Loneliness', 'Purpose', 'Health concerns'],
    duration: 90,
    expectedOutcome: 'Tăng 60% hạnh phúc, tìm được mục đích mới',
    personality: 'balanced'
  }
];

const personalityTraits = {
  optimistic: {
    moodTrend: 'upward',
    volatility: 'low',
    recoveryRate: 'fast',
    color: 'from-green-400 to-emerald-500'
  },
  pessimistic: {
    moodTrend: 'downward',
    volatility: 'medium',
    recoveryRate: 'slow',
    color: 'from-blue-400 to-indigo-500'
  },
  balanced: {
    moodTrend: 'stable',
    volatility: 'low',
    recoveryRate: 'medium',
    color: 'from-purple-400 to-pink-500'
  },
  anxious: {
    moodTrend: 'volatile',
    volatility: 'high',
    recoveryRate: 'slow',
    color: 'from-orange-400 to-red-500'
  },
  determined: {
    moodTrend: 'progressive',
    volatility: 'medium',
    recoveryRate: 'fast',
    color: 'from-cyan-400 to-blue-500'
  }
};

const FloatingInsight = ({ insight, delay = 0 }: { insight: string; delay?: number }) => (
  <div 
    className="absolute opacity-30 animate-float-slow text-xs bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20"
    style={{
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 80 + 10}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${8 + Math.random() * 4}s`
    }}
  >
    {insight}
  </div>
);

const MoodMeter = ({ mood, personality, animated = true }: { mood: number; personality: string; animated?: boolean }) => {
  const [displayMood, setDisplayMood] = useState(animated ? 0 : mood);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayMood(mood), 300);
      return () => clearTimeout(timer);
    }
  }, [mood, animated]);

  const moodEmojis = ['😢', '😕', '😐', '😊', '😍'];
  const moodColors = ['from-red-400 to-red-600', 'from-orange-400 to-orange-600', 'from-yellow-400 to-yellow-600', 'from-green-400 to-green-600', 'from-blue-400 to-blue-600'];

  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent animate-shimmer"></div>
        <div className="text-4xl animate-pulse">{moodEmojis[Math.floor(displayMood) - 1] || '😐'}</div>
        <div className="absolute bottom-2 text-xs text-white/80 font-medium">
          {displayMood.toFixed(1)}/5
        </div>
      </div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${moodColors[Math.floor(displayMood) - 1] || moodColors[2]} transition-all duration-1000 ease-out`}
          style={{ width: `${(displayMood / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};

const ProgressRing = ({ progress, size = 'medium' }: { progress: number; size?: 'small' | 'medium' | 'large' }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 500);
    return () => clearTimeout(timer);
  }, [progress]);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const strokeWidth = size === 'small' ? 4 : size === 'medium' ? 6 : 8;
  const radius = size === 'small' ? 28 : size === 'medium' ? 42 : 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold text-gray-700 dark:text-gray-300 ${size === 'small' ? 'text-sm' : size === 'medium' ? 'text-lg' : 'text-xl'}`}>
          {Math.round(animatedProgress)}%
        </span>
      </div>
    </div>
  );
};

export default function CaseStudySimulation() {
  const [selectedScenario, setSelectedScenario] = useState<CaseStudyScenario | null>(null);
  const [simulation, setSimulation] = useState<SimulationState>({
    currentDay: 0,
    isRunning: false,
    speed: 1,
    completed: false,
    results: []
  });
  const [floatingInsights, setFloatingInsights] = useState<string[]>([]);

  // Generate simulation data
  const generateSimulationDay = useCallback((scenario: CaseStudyScenario, day: number, prevMood: number): SimulationDay => {
    const personality = personalityTraits[scenario.personality];
    let moodChange = 0;
    
    // Personality-based mood calculation
    switch (personality.moodTrend) {
      case 'upward':
        moodChange = (Math.random() * 0.3) + 0.1; // Generally positive
        break;
      case 'downward':
        moodChange = (Math.random() * 0.3) - 0.2; // Generally negative
        break;
      case 'volatile':
        moodChange = (Math.random() * 1.0) - 0.5; // High volatility
        break;
      case 'progressive':
        moodChange = (day / scenario.duration) * 0.1 + (Math.random() * 0.2) - 0.1; // Gradual improvement
        break;
      default:
        moodChange = (Math.random() * 0.4) - 0.2; // Balanced
    }

    // Weekly patterns
    const weekProgress = Math.floor(day / 7);
    if (weekProgress > 0) {
      moodChange += weekProgress * 0.05; // Gradual improvement over weeks
    }

    const newMood = Math.max(1, Math.min(5, prevMood + moodChange));
    const progress = (day / scenario.duration) * 100;

    // Generate events based on mood and day
    const events = [];
    if (newMood > prevMood) {
      events.push(`Cải thiện tâm trạng (+${(newMood - prevMood).toFixed(1)})`);
    } else if (newMood < prevMood) {
      events.push(`Gặp thử thách (-${(prevMood - newMood).toFixed(1)})`);
    }

    if (day % 7 === 0 && day > 0) {
      events.push('Đánh giá tuần');
    }

    // Generate insights
    const insights = [];
    if (day % 10 === 0 && day > 0) {
      insights.push(`Xu hướng ${personality.moodTrend} được duy trì`);
    }
    if (progress > 50 && Math.random() > 0.7) {
      insights.push('Đạt được mốc quan trọng');
    }

    // Generate achievements
    const achievements = [];
    if (day % 14 === 0 && day > 0) {
      achievements.push(`Streak ${Math.floor(day / 7)} tuần`);
    }
    if (newMood >= 4.5 && Math.random() > 0.8) {
      achievements.push('Tâm trạng xuất sắc');
    }

    return {
      day,
      mood: newMood,
      events,
      progress,
      insights,
      achievements
    };
  }, []);

  // Run simulation
  useEffect(() => {
    if (!simulation.isRunning || !selectedScenario) return;

    const interval = setInterval(() => {
      setSimulation(prev => {
        if (prev.currentDay >= selectedScenario.duration) {
          return { ...prev, isRunning: false, completed: true };
        }

        const prevMood = prev.results[prev.results.length - 1]?.mood || selectedScenario.initialMood;
        const newDay = generateSimulationDay(selectedScenario, prev.currentDay + 1, prevMood);

        return {
          ...prev,
          currentDay: prev.currentDay + 1,
          results: [...prev.results, newDay]
        };
      });
    }, 1000 / simulation.speed);

    return () => clearInterval(interval);
  }, [simulation.isRunning, simulation.speed, selectedScenario, generateSimulationDay]);

  // Generate floating insights
  useEffect(() => {
    if (simulation.results.length > 0) {
      const latestInsights = simulation.results[simulation.results.length - 1].insights;
      setFloatingInsights(prev => [...prev, ...latestInsights].slice(-10));
    }
  }, [simulation.results]);

  const startSimulation = () => {
    setSimulation(prev => ({ ...prev, isRunning: true }));
  };

  const pauseSimulation = () => {
    setSimulation(prev => ({ ...prev, isRunning: false }));
  };

  const resetSimulation = () => {
    setSimulation({
      currentDay: 0,
      isRunning: false,
      speed: 1,
      completed: false,
      results: []
    });
    setFloatingInsights([]);
  };

  const currentMood = simulation.results[simulation.results.length - 1]?.mood || selectedScenario?.initialMood || 3;
  const currentProgress = ((simulation.currentDay / (selectedScenario?.duration || 30)) * 100);

  return (
    <div className="card relative overflow-hidden">
      {/* Floating Insights Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingInsights.map((insight, i) => (
          <FloatingInsight key={i} insight={insight} delay={i * 0.5} />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl animate-float">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gradient">Case Study Simulation</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Mô phỏng hành trình phát triển cá nhân thực tế
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">AI Powered</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Scenario Selection */}
        {!selectedScenario && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                className="relative p-6 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm cursor-pointer hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl animate-float-slow">{scenario.avatar}</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {scenario.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {scenario.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {scenario.duration} ngày
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${personalityTraits[scenario.personality].color} text-white`}>
                        {scenario.personality}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Kỳ vọng: {scenario.expectedOutcome}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            ))}
          </div>
        )}

        {/* Simulation Dashboard */}
        {selectedScenario && (
          <div className="space-y-6">
            {/* Current Scenario Info */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-indigo-200/30 dark:border-indigo-700/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedScenario.avatar}</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {selectedScenario.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedScenario.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedScenario(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mục tiêu</h5>
                  <div className="space-y-1">
                    {selectedScenario.goals.map((goal, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Target className="w-3 h-3 text-blue-500" />
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thử thách</h5>
                  <div className="space-y-1">
                    {selectedScenario.challenges.map((challenge, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <AlertCircle className="w-3 h-3 text-orange-500" />
                        {challenge}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kỳ vọng</h5>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedScenario.expectedOutcome}
                  </div>
                </div>
              </div>
            </div>

            {/* Control Panel */}
            <div className="bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl p-6 border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Bảng điều khiển
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Ngày {simulation.currentDay}/{selectedScenario.duration}</span>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={startSimulation}
                  disabled={simulation.isRunning || simulation.completed}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                >
                  <PlayCircle className="w-4 h-4" />
                  Bắt đầu
                </button>
                
                <button
                  onClick={pauseSimulation}
                  disabled={!simulation.isRunning}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                >
                  <PauseCircle className="w-4 h-4" />
                  Tạm dừng
                </button>
                
                <button
                  onClick={resetSimulation}
                  className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 hover:scale-105"
                >
                  <RefreshCw className="w-4 h-4" />
                  Đặt lại
                </button>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-600 dark:text-gray-400">Tốc độ:</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={simulation.speed}
                  onChange={(e) => setSimulation(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                  className="w-32"
                />
                <span className="text-sm text-gray-500">{simulation.speed}x</span>
              </div>
            </div>

            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-200/30 dark:border-blue-700/30 text-center">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Tâm trạng hiện tại</h5>
                <MoodMeter mood={currentMood} personality={selectedScenario.personality} />
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 border border-purple-200/30 dark:border-purple-700/30 text-center">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Tiến độ</h5>
                <ProgressRing progress={currentProgress} />
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 border border-green-200/30 dark:border-green-700/30">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Thành tích</h5>
                <div className="space-y-2">
                  {simulation.results.slice(-3).map((day, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {day.achievements.map((achievement, j) => (
                        <div key={j} className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs">
                          <Award className="w-3 h-3" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            {simulation.results.length > 0 && (
              <div className="bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl p-6 border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Timeline thời gian thực
                </h4>
                
                <div className="max-h-64 overflow-y-auto scrollbar-thin space-y-3">
                  {simulation.results.slice(-10).reverse().map((day, i) => (
                    <div key={day.day} className="flex items-start gap-3 p-3 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg border border-indigo-200/30 dark:border-indigo-700/30">
                      <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-2 py-1 rounded-full">
                        Ngày {day.day}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tâm trạng: {day.mood.toFixed(1)}/5
                          </span>
                          <div className="flex items-center gap-1">
                            {day.mood > 3.5 && <TrendingUp className="w-3 h-3 text-green-500" />}
                            {day.mood < 2.5 && <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />}
                          </div>
                        </div>
                        {day.events.length > 0 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {day.events.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Summary */}
            {simulation.completed && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 border border-green-200/30 dark:border-green-700/30 animate-fade-in">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h4 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                    Simulation Hoàn Thành!
                  </h4>
                  <p className="text-green-600 dark:text-green-500 mb-6">
                    {selectedScenario.name} đã hoàn thành hành trình {selectedScenario.duration} ngày
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {simulation.results[simulation.results.length - 1]?.mood.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Tâm trạng cuối</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {simulation.results.filter(day => day.achievements.length > 0).length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Ngày có thành tích</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {((simulation.results[simulation.results.length - 1]?.mood - selectedScenario.initialMood) / selectedScenario.initialMood * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Cải thiện</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 