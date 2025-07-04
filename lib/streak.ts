import { IEntry } from '../models/Entry';

export interface StreakData {
  current: number;
  longest: number;
  lastEntryDate: Date | null;
  streakStartDate: Date | null;
  isActiveToday: boolean;
}

export function calculateStreak(entries: IEntry[]): StreakData {
  if (entries.length === 0) {
    return {
      current: 0,
      longest: 0,
      lastEntryDate: null,
      streakStartDate: null,
      isActiveToday: false
    };
  }

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get unique dates (one entry per day)
  const uniqueDates = Array.from(new Set(
    sortedEntries.map(entry => new Date(entry.date).toDateString())
  )).map(dateStr => new Date(dateStr));

  // Sort dates (newest first)
  uniqueDates.sort((a, b) => b.getTime() - a.getTime());

  if (uniqueDates.length === 0) {
    return {
      current: 0,
      longest: 0,
      lastEntryDate: null,
      streakStartDate: null,
      isActiveToday: false
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastEntryDate = uniqueDates[0];
  const isActiveToday = lastEntryDate.toDateString() === today.toDateString();

  // Calculate current streak
  let currentStreak = 0;
  let streakStartDate: Date | null = null;
  
  // Start from today or yesterday if there's an entry
  let checkDate = isActiveToday ? today : yesterday;
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const entryDate = uniqueDates[i];
    
    if (entryDate.toDateString() === checkDate.toDateString()) {
      currentStreak++;
      streakStartDate = entryDate;
      
      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Check if there's a gap
      const dayDiff = Math.floor((checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff > 0) {
        // There's a gap, break the streak
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i];
    const previousDate = uniqueDates[i - 1];
    
    const dayDiff = Math.floor((previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      // Consecutive days
      tempStreak++;
    } else {
      // Not consecutive, update longest and reset
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return {
    current: currentStreak,
    longest: longestStreak,
    lastEntryDate,
    streakStartDate,
    isActiveToday
  };
}

export function getStreakMessage(streak: StreakData): string {
  if (streak.current === 0) {
    return "Bắt đầu chuỗi ngày ghi nhật ký của bạn! 🌱";
  }
  
  if (streak.current === 1) {
    return "Khởi đầu tuyệt vời! Hãy tiếp tục ngày mai! 💪";
  }
  
  if (streak.current < 7) {
    return `Tuyệt vời! ${streak.current} ngày liên tiếp! Hãy đạt mục tiêu 7 ngày! 🔥`;
  }
  
  if (streak.current < 30) {
    return `Thật ấn tượng! ${streak.current} ngày liên tiếp! Bạn đang tạo thói quen tốt! ⭐`;
  }
  
  return `Phi thường! ${streak.current} ngày liên tiếp! Bạn là một Master Journaler! 🏆`;
}

export function getNextMilestone(currentStreak: number): { target: number; message: string } {
  const milestones = [
    { target: 3, message: "3 ngày đầu tiên" },
    { target: 7, message: "1 tuần hoàn hảo" },
    { target: 14, message: "2 tuần kiên trì" },
    { target: 30, message: "1 tháng xuất sắc" },
    { target: 60, message: "2 tháng phi thường" },
    { target: 100, message: "100 ngày huyền thoại" },
    { target: 365, message: "1 năm hoàn hảo" }
  ];

  for (const milestone of milestones) {
    if (currentStreak < milestone.target) {
      return milestone;
    }
  }

  // If already past all milestones
  return { target: currentStreak + 100, message: "Huyền thoại mới" };
} 