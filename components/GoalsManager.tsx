'use client';

import { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle, Clock, Star, Trophy, Zap, Flame, ArrowRight, X, Edit2, Save } from 'lucide-react';

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

interface GoalsManagerProps {
  onGoalCreate: (goal: Omit<Goal, '_id' | 'createdAt' | 'currentValue' | 'completed'>) => Promise<void>;
  goals: Goal[];
}

const categoryConfig = {
  mood: {
    icon: '😊',
    name: 'Tâm trạng',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'from-pink-50 to-rose-50',
    description: 'Mục tiêu về cảm xúc và tâm trạng'
  },
  streak: {
    icon: '🔥',
    name: 'Streak',
    color: 'from-orange-400 to-red-500',
    bgColor: 'from-orange-50 to-red-50',
    description: 'Mục tiêu về chuỗi ngày liên tiếp'
  },
  frequency: {
    icon: '📅',
    name: 'Tần suất',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'from-blue-50 to-indigo-50',
    description: 'Mục tiêu về tần suất thực hiện'
  },
  personal: {
    icon: '🎯',
    name: 'Cá nhân',
    color: 'from-purple-400 to-violet-500',
    bgColor: 'from-purple-50 to-violet-50',
    description: 'Mục tiêu phát triển bản thân'
  }
};

const priorityConfig = {
  low: { name: 'Thấp', color: 'text-gray-500', bg: 'bg-gray-100' },
  medium: { name: 'Trung bình', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  high: { name: 'Cao', color: 'text-red-600', bg: 'bg-red-100' }
};

const FloatingIcon = ({ icon, delay = 0 }: { icon: string; delay?: number }) => (
  <div 
    className="absolute text-2xl opacity-20 animate-float"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${3 + Math.random() * 2}s`
    }}
  >
    {icon}
  </div>
);

export default function GoalsManager({ onGoalCreate, goals }: GoalsManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Goal['category'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'progress' | 'deadline'>('priority');
  const [floatingIcons, setFloatingIcons] = useState<string[]>([]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
    targetValue: 1,
    priority: 'medium' as Goal['priority'],
    deadline: ''
  });

  // Generate floating icons
  useEffect(() => {
    const icons = ['🎯', '⭐', '🏆', '💪', '🚀', '✨', '🔥', '💫'];
    setFloatingIcons(icons);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    try {
      await onGoalCreate(newGoal);
      setNewGoal({
        title: '',
        description: '',
        category: 'personal',
        targetValue: 1,
        priority: 'medium',
        deadline: ''
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const getProgress = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredGoals = goals
    .filter(goal => selectedCategory === 'all' || goal.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'progress') {
        return getProgress(b) - getProgress(a);
      }
      if (sortBy === 'deadline' && a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <div className="card relative overflow-hidden group">
      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingIcons.map((icon, i) => (
          <FloatingIcon key={i} icon={icon} delay={i * 0.5} />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl float">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gradient">Quản lý mục tiêu</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Theo dõi và đạt được các mục tiêu của bạn
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo mục tiêu</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-4 border border-green-200/30 dark:border-green-700/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-2 right-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {completedGoals}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Đã hoàn thành
              </div>
            </div>
          </div>
          
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200/30 dark:border-blue-700/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-2 right-2">
              <Target className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalGoals}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Tổng mục tiêu
              </div>
            </div>
          </div>
          
          <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4 border border-purple-200/30 dark:border-purple-700/30 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-2 right-2">
              <Trophy className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(completionRate)}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Tỷ lệ hoàn thành
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Danh mục:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                  selectedCategory === 'all' 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Tất cả
              </button>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as Goal['category'])}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1 ${
                    selectedCategory === key 
                      ? `bg-gradient-to-r ${config.color} text-white shadow-lg` 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{config.icon}</span>
                  <span>{config.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field text-xs py-1 px-2 w-auto"
            >
              <option value="priority">Độ ưu tiên</option>
              <option value="progress">Tiến độ</option>
              <option value="deadline">Hạn chót</option>
            </select>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="space-y-4 mb-6">
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Chưa có mục tiêu nào
              </h4>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Hãy tạo mục tiêu đầu tiên để bắt đầu hành trình phát triển!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo mục tiêu đầu tiên</span>
              </button>
            </div>
          ) : (
            filteredGoals.map((goal) => {
              const progress = getProgress(goal);
              const category = categoryConfig[goal.category];
              const priority = priorityConfig[goal.priority];
              const daysRemaining = goal.deadline ? getDaysRemaining(goal.deadline) : null;
              
              return (
                <div
                  key={goal._id}
                  className={`relative group bg-gradient-to-br ${category.bgColor} dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl p-6 border border-gray-200/30 dark:border-gray-700/30 hover:scale-102 transition-all duration-300 overflow-hidden ${
                    goal.completed ? 'opacity-75' : ''
                  }`}
                >
                  {/* Floating Category Icon */}
                  <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                    {category.icon}
                  </div>
                  
                  {/* Completion Overlay */}
                  {goal.completed && (
                    <div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <div className="bg-green-500 text-white rounded-full p-4 animate-pulse">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                    </div>
                  )}

                  <div className="relative z-10">
                    {/* Goal Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                              {goal.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {goal.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
                            {priority.name}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category.color} text-white`}>
                            {category.name}
                          </span>
                          {goal.deadline && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              daysRemaining && daysRemaining < 7 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              <Clock className="w-3 h-3" />
                              {daysRemaining !== null ? (
                                daysRemaining > 0 ? `${daysRemaining} ngày` : 'Đã quá hạn'
                              ) : 'Không hạn'}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingGoal(editingGoal === goal._id ? null : goal._id)}
                          className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-300"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tiến độ: {goal.currentValue}/{goal.targetValue}
                        </span>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      
                      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          {!goal.completed && progress === 100 && (
                            <button className="btn-primary text-xs py-1 px-3 flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              <span>Đánh dấu hoàn thành</span>
                            </button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(progress / 20) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Create Goal Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gradient">Tạo mục tiêu mới</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tiêu đề mục tiêu
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="VD: Viết nhật ký 30 ngày liên tiếp"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Mô tả chi tiết về mục tiêu..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Danh mục
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                      className="input-field"
                    >
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.icon} {config.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Độ ưu tiên
                    </label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })}
                      className="input-field"
                    >
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Giá trị mục tiêu
                    </label>
                    <input
                      type="number"
                      value={newGoal.targetValue}
                      onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hạn chót (tùy chọn)
                    </label>
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Tạo mục tiêu</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Motivational Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
              "Mục tiêu không phải là để đạt được hoàn hảo, mà là để trở thành phiên bản tốt hơn của chính mình."
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-purple-600 dark:text-purple-400">
              <Target className="w-4 h-4" />
              <span>Hành trình 1000 dặm bắt đầu từ bước chân đầu tiên</span>
              <Zap className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 