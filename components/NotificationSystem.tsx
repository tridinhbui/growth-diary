'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Heart, Star, Sparkles, Trophy, Flame } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'achievement' | 'streak' | 'mood';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  celebration?: boolean;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const notificationConfig = {
  success: {
    icon: CheckCircle,
    color: 'from-green-400 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800'
  },
  warning: {
    icon: AlertCircle,
    color: 'from-orange-400 to-red-500',
    bgColor: 'from-orange-50 to-red-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800'
  },
  info: {
    icon: Info,
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800'
  },
  achievement: {
    icon: Trophy,
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800'
  },
  streak: {
    icon: Flame,
    color: 'from-orange-400 to-red-500',
    bgColor: 'from-orange-50 to-red-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800'
  },
  mood: {
    icon: Heart,
    color: 'from-pink-400 to-rose-500',
    bgColor: 'from-pink-50 to-rose-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-800'
  }
};

const CelebrationParticle = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-float opacity-80"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${2 + Math.random() * 2}s`
    }}
  />
);

const NotificationCard = ({ notification, onDismiss }: { notification: Notification; onDismiss: (id: string) => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  
  const config = notificationConfig[notification.type];
  const IconComponent = config.icon;

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 100);

    // Generate celebration particles for achievements
    if (notification.celebration) {
      setParticles(Array.from({ length: 20 }, (_, i) => i));
    }

    // Auto dismiss
    if (!notification.persistent && notification.duration) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300);
  };

  return (
    <div
      className={`relative mb-4 transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${isLeaving ? 'translate-x-full opacity-0' : ''}`}
    >
      {/* Celebration Particles */}
      {notification.celebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {particles.map(i => (
            <CelebrationParticle key={i} delay={i * 0.1} />
          ))}
        </div>
      )}

      <div
        className={`relative bg-gradient-to-br ${config.bgColor} dark:from-gray-800/90 dark:to-gray-700/90 backdrop-blur-xl rounded-xl border ${config.borderColor} dark:border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group`}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Glow border */}
        <div className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-20 blur-sm rounded-xl`}></div>

        <div className="relative p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`flex-shrink-0 p-2 bg-gradient-to-br ${config.color} rounded-lg shadow-lg ${notification.celebration ? 'animate-pulse' : ''}`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`font-semibold ${config.textColor} dark:text-white mb-1`}>
                    {notification.title}
                  </h4>
                  <p className={`text-sm ${config.textColor} dark:text-gray-300 opacity-80`}>
                    {notification.message}
                  </p>
                </div>

                {/* Close button */}
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 ml-2 p-1 hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Achievement stars */}
              {notification.type === 'achievement' && (
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-yellow-400 fill-current animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              )}

              {/* Streak fire animation */}
              {notification.type === 'streak' && (
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 3 }, (_, i) => (
                    <Flame
                      key={i}
                      className="w-3 h-3 text-orange-500 animate-pulse"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  ))}
                </div>
              )}

              {/* Mood hearts */}
              {notification.type === 'mood' && (
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 3 }, (_, i) => (
                    <Heart
                      key={i}
                      className="w-3 h-3 text-pink-500 fill-current animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Progress bar for auto-dismiss */}
          {!notification.persistent && notification.duration && (
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${config.color} rounded-full animate-shrink`}
                style={{ 
                  animation: `shrink ${notification.duration}ms linear forwards` 
                }}
              />
            </div>
          )}
        </div>

        {/* Celebration fireworks effect */}
        {notification.celebration && (
          <div className="absolute top-0 right-0 p-2">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
};

export default function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <div className="space-y-0">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  );
}

// Utility function to create notifications
export const createNotification = (
  type: Notification['type'],
  title: string,
  message: string,
  options: Partial<Pick<Notification, 'duration' | 'persistent' | 'celebration'>> = {}
): Notification => {
  return {
    id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    duration: options.duration || 5000,
    persistent: options.persistent || false,
    celebration: options.celebration || false
  };
};

// Pre-defined notification creators
export const notificationCreators = {
  success: (title: string, message: string, options?: Partial<Pick<Notification, 'duration' | 'persistent'>>) =>
    createNotification('success', title, message, options),
    
  warning: (title: string, message: string, options?: Partial<Pick<Notification, 'duration' | 'persistent'>>) =>
    createNotification('warning', title, message, options),
    
  info: (title: string, message: string, options?: Partial<Pick<Notification, 'duration' | 'persistent'>>) =>
    createNotification('info', title, message, options),
    
  achievement: (title: string, message: string, options?: Partial<Pick<Notification, 'duration' | 'persistent'>>) =>
    createNotification('achievement', title, message, { 
      celebration: true, 
      duration: 8000, 
      ...options 
    }),
    
  streak: (title: string, message: string, options?: Partial<Pick<Notification, 'duration' | 'persistent'>>) =>
    createNotification('streak', title, message, { 
      celebration: true, 
      duration: 6000, 
      ...options 
    }),
    
  mood: (title: string, message: string, options?: Partial<Pick<Notification, 'duration' | 'persistent'>>) =>
    createNotification('mood', title, message, options)
}; 