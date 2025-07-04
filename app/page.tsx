'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, storage } from '@/lib/auth';
import EntryForm from '@/components/EntryForm';
import GrowthTree from '@/components/GrowthTree';
import MoodChart from '@/components/MoodChart';
import StreakTracker from '@/components/StreakTracker';
import GoalsManager from '@/components/GoalsManager';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import EntrySearch from '@/components/EntrySearch';
import { ThemeToggleIcon } from '@/components/ThemeToggle';
import { Brain, LogOut, User, MessageCircle, Target, BarChart3, Search, Settings, Flame, Plus, Sparkles, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import CaseStudySimulation from '@/components/CaseStudySimulation';
import InteractiveStatsPanel from '@/components/InteractiveStatsPanel';
import LoadingScreen from '@/components/LoadingScreen';
import NotificationSystem from '@/components/NotificationSystem';
import MagicalBackground from '@/components/MagicalBackground';

interface Entry {
  _id: string;
  userId: string;
  date: string;
  moodScore: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}

interface Goal {
  _id: string;
  title: string;
  description: string;
  category: 'mood' | 'streak' | 'frequency' | 'personal';
  targetValue: number;
  currentValue: number;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  createdAt: string;
  completed: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'achievement' | 'streak' | 'mood';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  celebration?: boolean;
}

function MainApp() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  
  // Modal states
  const [showGoalsManager, setShowGoalsManager] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [showEntrySearch, setShowEntrySearch] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'analytics' | 'goals' | 'simulation'>('dashboard');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Magical background theme based on time and user activity
  const [backgroundTheme, setBackgroundTheme] = useState<'aurora' | 'cosmic' | 'forest' | 'ocean' | 'sunset'>('aurora');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // Fetch user entries
  useEffect(() => {
    if (auth.isAuthenticated()) {
      fetchEntries();
    }
  }, []);

  // Initialize filtered entries
  useEffect(() => {
    setFilteredEntries(entries);
  }, [entries]);

  useEffect(() => {
    // Dynamic background theme based on time of day
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setBackgroundTheme('forest'); // Morning
    else if (hour >= 12 && hour < 17) setBackgroundTheme('ocean'); // Afternoon  
    else if (hour >= 17 && hour < 20) setBackgroundTheme('sunset'); // Evening
    else if (hour >= 20 && hour < 24) setBackgroundTheme('cosmic'); // Night
    else setBackgroundTheme('aurora'); // Late night/early morning
  }, []);

  useEffect(() => {
    // Simulate initial loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setIsInitialLoad(false);
      
      // Welcome notification
      addNotification({
        type: 'achievement',
        title: 'Chào mừng trở lại! 🌟',
        message: 'Growth Diary của bạn đã được nâng cấp với UI ảo diệu mới!',
        celebration: true,
        duration: 5000
      });
    }, 3000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Sample data for demo
  useEffect(() => {
    if (!isLoading && entries.length === 0) {
      // Generate sample entries for demo
      const sampleEntries: Entry[] = Array.from({ length: 15 }, (_, i) => {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        return {
          _id: `entry-${i}`,
          userId: auth.currentUser?.id || 'demo-user',
          date: date.toISOString().split('T')[0],
          moodScore: Math.floor(Math.random() * 5) + 1,
          note: `Ghi chú mẫu ${i + 1}: Hôm nay tôi cảm thấy ${Math.random() > 0.5 ? 'tích cực' : 'bình thường'}.`,
          createdAt: date.toISOString(),
          updatedAt: date.toISOString()
        };
      });
      setEntries(sampleEntries);
      storage.setEntries(sampleEntries);

      // Generate sample goals
      const sampleGoals: Goal[] = [
        {
          _id: 'goal-1',
          title: 'Cải thiện tâm trạng',
          description: 'Duy trì tâm trạng tích cực 80% thời gian',
          category: 'mood',
          targetValue: 80,
          currentValue: 65,
          priority: 'high',
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          _id: 'goal-2', 
          title: 'Streak 30 ngày',
          description: 'Ghi nhật ký liên tục 30 ngày',
          category: 'streak',
          targetValue: 30,
          currentValue: 15,
          priority: 'medium',
          createdAt: new Date().toISOString(),
          completed: false
        }
      ];
      setGoals(sampleGoals);
      storage.setGoals(sampleGoals);
    }
  }, [isLoading, entries.length]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString()
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const fetchEntries = async () => {
    try {
      // Load from localStorage instead of API
      const storedEntries = storage.getEntries();
      setEntries(storedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEntrySubmit = async (entryData: { moodScore: number; note: string }) => {
    try {
      const response = await fetch('/api/entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });

      if (response.ok) {
        const newEntry = await response.json();
        // Refresh entries to get updated data
        await fetchEntries();
        alert('Nhật ký đã được lưu thành công! 🌱');
      } else {
        const error = await response.json();
        alert(error.error || 'Có lỗi xảy ra khi lưu nhật ký');
      }
    } catch (error) {
      console.error('Error submitting entry:', error);
      alert('Có lỗi xảy ra khi lưu nhật ký');
    }
  };

  const getAIAdvice = async () => {
    setIsLoadingAdvice(true);
    try {
      const response = await fetch('/api/advise', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setAiAdvice(data.message);
      } else {
        const error = await response.json();
        setAiAdvice(error.error || 'Có lỗi xảy ra khi lấy lời khuyên');
      }
    } catch (error) {
      console.error('Error getting AI advice:', error);
      setAiAdvice('Có lỗi xảy ra khi kết nối đến AI');
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  const handleAddEntry = async (entryData: { moodScore: number; note: string }) => {
    try {
      // Create entry with localStorage instead of API
      const newEntry: Entry = {
        _id: `entry_${Date.now()}`,
        userId: auth.currentUser?.id || 'demo-user',
        date: new Date().toISOString().split('T')[0],
        moodScore: entryData.moodScore,
        note: entryData.note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const savedEntry = storage.addEntry(newEntry);
      setEntries(prev => [savedEntry, ...prev]);
      
      // Success notification
      addNotification({
        type: 'success',
        title: 'Đã lưu nhật ký! 🎉',
        message: `Cảm xúc hôm nay: ${getMoodEmoji(entryData.moodScore)}`,
        duration: 3000
      });
      
      // Check for streak achievements
      const currentStreak = calculateStreak([savedEntry, ...entries]);
      if (currentStreak > 0 && currentStreak % 7 === 0) {
        addNotification({
          type: 'achievement',
          title: `Streak ${currentStreak} ngày! 🔥`,
          message: 'Bạn đang duy trì thói quen tuyệt vời!',
          celebration: true,
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      addNotification({
        type: 'warning',
        title: 'Lỗi lưu nhật ký',
        message: 'Có lỗi xảy ra khi lưu nhật ký.',
        duration: 4000
      });
    }
  };

  const handleCreateGoal = async (goalData: Omit<Goal, '_id' | 'createdAt' | 'currentValue' | 'completed'>) => {
    try {
      const newGoal: Goal = {
        ...goalData,
        _id: `goal-${Date.now()}`,
        currentValue: 0,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      setGoals(prev => [...prev, newGoal]);
      
      addNotification({
        type: 'success',
        title: 'Mục tiêu mới! 🎯',
        message: `"${goalData.title}" đã được tạo`,
        celebration: true,
        duration: 3000
      });
    } catch (error) {
      addNotification({
        type: 'warning',
        title: 'Lỗi',
        message: 'Không thể tạo mục tiêu. Vui lòng thử lại.',
        duration: 3000
      });
    }
  };

  const handleStatClick = (statType: string) => {
    switch (statType) {
      case 'mood':
        setActiveTab('analytics');
        break;
      case 'add-entry':
        setActiveTab('dashboard');
        break;
      case 'goals':
        setActiveTab('goals');
        break;
      case 'view-analytics':
        setActiveTab('analytics');
        break;
      default:
        addNotification({
          type: 'info',
          title: 'Tính năng sắp có',
          message: `Chi tiết về ${statType} sẽ có trong phiên bản tiếp theo!`,
          duration: 2000
        });
    }
  };

  const statsData = {
    totalEntries: entries.length,
    averageMood: entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.moodScore, 0) / entries.length : 0,
    streakCount: 7, // Calculate actual streak
    improvementRate: 15.5,
    consistencyScore: 82,
    weeklyGoals: goals.filter(g => !g.completed).length,
    achievements: 12,
    mindfulMinutes: 245
  };

  const tabConfig = {
    dashboard: {
      icon: Brain,
      label: 'Dashboard',
      gradient: 'from-pink-500 to-rose-500'
    },
    search: {
      icon: Search,
      label: 'Tìm kiếm',
      gradient: 'from-blue-500 to-indigo-500'
    },
    analytics: {
      icon: BarChart3,
      label: 'Phân tích',
      gradient: 'from-purple-500 to-violet-500'
    },
    goals: {
      icon: Target,
      label: 'Mục tiêu',
      gradient: 'from-green-500 to-emerald-500'
    },
    simulation: {
      icon: Brain,
      label: 'Simulation',
      gradient: 'from-orange-500 to-red-500'
    }
  };

  const handleFilteredEntries = (filtered: any[]) => {
    setFilteredEntries(filtered);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Helper functions
  const getMoodEmoji = (score: number): string => {
    const emojis = { 1: '😢', 2: '😕', 3: '😐', 4: '😊', 5: '😄' };
    return emojis[score as keyof typeof emojis] || '😐';
  };

  const calculateStreak = (userEntries: Entry[]): number => {
    if (userEntries.length === 0) return 0;
    
    const sortedEntries = userEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 1;
    let currentDate = new Date(sortedEntries[0].date);
    
    for (let i = 1; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        streak++;
        currentDate = entryDate;
      } else if (daysDiff > 1) {
        break;
      }
    }
    
    return streak;
  };

  if (auth.currentUser === null || isLoading) {
    return (
      <LoadingScreen 
        isLoading={isLoading} 
        type="mood"
        progress={isInitialLoad ? undefined : 85}
      />
    );
  }

  if (!auth.currentUser) {
    return null; // Will redirect to login
  }

  const currentEntries = activeTab === 'search' ? filteredEntries : entries;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Magical Background */}
      <MagicalBackground 
        theme={backgroundTheme}
        intensity="medium"
        interactive={true}
        className="opacity-30"
      />

      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      {/* Enhanced Header */}
      <header className="relative z-10 bg-gradient-to-r from-white/10 via-white/5 to-transparent backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-float shadow-glow">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Growth Diary
                </h1>
                <p className="text-xs md:text-sm text-gray-800 dark:text-gray-300 font-medium">
                  Magical Journey • {new Date().toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative p-2 md:p-3 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:scale-110 transition-all duration-300 group"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="w-4 h-4 md:w-5 md:h-5 text-indigo-500 group-hover:-rotate-12 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>

              {/* Settings */}
              <button className="relative p-2 md:p-3 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:scale-110 transition-all duration-300 group">
                <Settings className="w-4 h-4 md:w-5 md:h-5 text-gray-700 dark:text-gray-300 group-hover:rotate-180 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 md:gap-2 py-3 overflow-x-auto scrollbar-hide">
            {Object.entries(tabConfig).map(([key, config]) => {
              const IconComponent = config.icon;
              const isActive = activeTab === key;
              
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`
                    relative flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium
                    transition-all duration-300 whitespace-nowrap group flex-shrink-0
                    ${isActive 
                      ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg scale-105` 
                      : 'text-gray-800 dark:text-gray-200 hover:bg-white/10 hover:scale-105 bg-white/5'
                    }
                  `}
                >
                  <IconComponent className={`w-3 h-3 md:w-4 md:h-4 ${isActive ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`} />
                  <span className="hidden sm:inline">{config.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-12 -translate-x-full animate-shimmer" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-6 md:py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 md:space-y-8">
            {/* Interactive Stats Panel */}
            <InteractiveStatsPanel 
              data={statsData}
              onStatClick={handleStatClick}
            />

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
              {/* Entry Form */}
              <div className="xl:col-span-1 order-1 xl:order-1">
                <EntryForm onSubmit={handleAddEntry} />
              </div>

              {/* Mood Chart & Growth Tree */}
              <div className="xl:col-span-2 space-y-6 order-2 xl:order-2">
                <MoodChart entries={entries} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <GrowthTree entries={entries} />
                  <StreakTracker entries={entries} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            <EntrySearch 
              entries={entries}
              onFilteredEntries={handleFilteredEntries}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <AdvancedAnalytics entries={entries} />
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <GoalsManager goals={goals} onGoalCreate={handleCreateGoal} />
          </div>
        )}

        {activeTab === 'simulation' && (
          <div className="space-y-6">
            <CaseStudySimulation />
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setActiveTab('dashboard')}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-20 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-[0_8px_32px_rgba(168,85,247,0.4)] hover:shadow-[0_12px_48px_rgba(168,85,247,0.6)] hover:scale-110 transition-all duration-300 group animate-float"
      >
        <Plus className="w-6 h-6 md:w-8 md:h-8 mx-auto group-hover:rotate-180 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl" />
      </button>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Corner decorations */}
        <div className="absolute top-20 left-4 md:left-10 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-4 md:right-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-green-400/10 to-teal-400/10 rounded-full blur-3xl animate-breathe"></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
} 