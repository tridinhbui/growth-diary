'use client';

import { useEffect, useState } from 'react';
import { Heart, Sparkles, Sun, Moon, Stars, Zap } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
  message?: string;
  progress?: number;
  type?: 'default' | 'mood' | 'analysis' | 'sync' | 'ai';
}

const loadingMessages = {
  default: [
    'Đang tải dữ liệu...',
    'Chuẩn bị giao diện...',
    'Khởi tạo ứng dụng...',
    'Kết nối dữ liệu...'
  ],
  mood: [
    'Phân tích cảm xúc...',
    'Đang xử lý tâm trạng...',
    'Tạo biểu đồ tâm trạng...',
    'Tính toán xu hướng...'
  ],
  analysis: [
    'Phân tích dữ liệu nâng cao...',
    'Tạo báo cáo chi tiết...',
    'Xử lý thống kê...',
    'Tổng hợp kết quả...'
  ],
  sync: [
    'Đồng bộ dữ liệu...',
    'Cập nhật thông tin...',
    'Kết nối server...',
    'Tải xuống cập nhật...'
  ],
  ai: [
    'AI đang suy nghĩ...',
    'Phân tích nội dung...',
    'Tạo lời khuyên...',
    'Xử lý trí tuệ nhân tạo...'
  ]
};

const loadingIcons = {
  default: Heart,
  mood: Heart,
  analysis: Stars,
  sync: Zap,
  ai: Sparkles
};

const MorphingShape = ({ delay = 0, type = 'circle' }: { delay?: number; type?: 'circle' | 'square' | 'triangle' }) => {
  const baseClasses = "absolute bg-gradient-to-br opacity-20 animate-morph";
  const typeClasses = {
    circle: "from-blue-400 to-purple-500 rounded-full w-16 h-16",
    square: "from-pink-400 to-red-500 rounded-lg w-12 h-12",
    triangle: "from-green-400 to-teal-500 w-0 h-0 border-l-8 border-r-8 border-b-12 border-transparent"
  };

  return (
    <div 
      className={`${baseClasses} ${typeClasses[type]}`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${4 + Math.random() * 2}s`
      }}
    />
  );
};

const AuroraWave = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="absolute inset-0 bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-blue-300/30 opacity-50 animate-aurora"
    style={{
      animationDelay: `${delay}s`,
      animationDuration: `8s`,
      transform: `rotate(${Math.random() * 360}deg)`
    }}
  />
);

const FloatingOrb = ({ delay = 0, size = 'medium' }: { delay?: number; size?: 'small' | 'medium' | 'large' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  
  return (
    <div 
      className={`absolute ${sizeClasses[size]} bg-gradient-to-br from-white/30 to-white/10 rounded-full backdrop-blur-sm animate-float-orb shadow-glow-sm`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${6 + Math.random() * 4}s`
      }}
    />
  );
};

const BreathingCircle = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="absolute w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-breathe blur-xl"
    style={{
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      animationDelay: `${delay}s`
    }}
  />
);

export default function LoadingScreen({ 
  isLoading, 
  message, 
  progress, 
  type = 'default' 
}: LoadingScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [morphingShapes, setMorphingShapes] = useState<any[]>([]);
  const [floatingOrbs, setFloatingOrbs] = useState<any[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  
  const messages = loadingMessages[type];
  const IconComponent = loadingIcons[type];
  const currentMessage = message || messages[currentMessageIndex];

  useEffect(() => {
    if (isLoading) {
      // Generate morphing shapes
      setMorphingShapes(
        Array.from({ length: 8 }, (_, i) => ({
          id: i,
          delay: i * 0.5,
          type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)]
        }))
      );

      // Generate floating orbs
      setFloatingOrbs(
        Array.from({ length: 12 }, (_, i) => ({
          id: i,
          delay: i * 0.3,
          size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)]
        }))
      );

      // Show progress after a delay
      const progressTimer = setTimeout(() => setShowProgress(true), 1000);

      // Cycle through messages
      const messageTimer = setInterval(() => {
        if (!message) {
          setCurrentMessageIndex(prev => (prev + 1) % messages.length);
        }
      }, 2000);

      return () => {
        clearTimeout(progressTimer);
        clearInterval(messageTimer);
      };
    }
  }, [isLoading, message, messages.length]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 3 }, (_, i) => (
          <AuroraWave key={i} delay={i * 2} />
        ))}
      </div>

      {/* Morphing Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {morphingShapes.map((shape) => (
          <MorphingShape 
            key={shape.id} 
            delay={shape.delay} 
            type={shape.type}
          />
        ))}
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingOrbs.map((orb) => (
          <FloatingOrb 
            key={orb.id} 
            delay={orb.delay} 
            size={orb.size}
          />
        ))}
      </div>

      {/* Breathing Circles */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }, (_, i) => (
          <BreathingCircle key={i} delay={i * 1.5} />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Central Icon */}
        <div className="relative mb-8">
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-50 blur-xl animate-pulse"></div>
            
            {/* Icon container */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-glow-lg">
              <IconComponent className="w-8 h-8 text-white animate-pulse" />
            </div>

            {/* Orbiting elements */}
            <div className="absolute inset-0 animate-spin-slow">
              <Sparkles className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 text-yellow-300" />
              <Sparkles className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 text-blue-300" />
              <Sparkles className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-300" />
              <Sparkles className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-300" />
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-3 animate-pulse">
            {currentMessage}
          </h2>
          <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>

        {/* Progress Bar */}
        {(showProgress || progress !== undefined) && (
          <div className="w-80 max-w-full mx-auto">
            <div className="relative w-full bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ 
                  width: progress !== undefined 
                    ? `${Math.min(progress, 100)}%` 
                    : '70%',
                  animation: progress === undefined ? 'loading-pulse 2s ease-in-out infinite' : 'none'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            {progress !== undefined && (
              <p className="text-white/70 text-sm mt-2">
                {Math.round(progress)}% hoàn thành
              </p>
            )}
          </div>
        )}

        {/* Inspirational Quote */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm italic max-w-md mx-auto">
            "Mỗi khoảnh khắc chờ đợi đều là cơ hội để suy ngẫm và chuẩn bị cho những điều tuyệt vời sắp tới..."
          </p>
        </div>

        {/* Time of day indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 text-white/50 text-xs">
          <Sun className="w-4 h-4" />
          <div className="w-px h-4 bg-white/30"></div>
          <Moon className="w-4 h-4" />
          <span>Đang tạo trải nghiệm tuyệt vời cho bạn</span>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4">
        <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full animate-pulse"></div>
      </div>
      <div className="absolute top-4 right-4">
        <div className="w-12 h-12 bg-gradient-to-bl from-white/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="w-20 h-20 bg-gradient-to-tr from-white/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="absolute bottom-4 right-4">
        <div className="w-14 h-14 bg-gradient-to-tl from-white/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
} 