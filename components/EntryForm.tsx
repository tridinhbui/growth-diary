'use client';

import { useState } from 'react';
import { Sparkles, Heart, Edit3, CheckCircle } from 'lucide-react';

interface EntryFormProps {
  onSubmit: (entry: { moodScore: number; note: string }) => Promise<void>;
}

const moodEmojis = [
  { score: 1, emoji: '😢', label: 'Rất buồn', color: 'from-red-400 to-red-600' },
  { score: 2, emoji: '😔', label: 'Buồn', color: 'from-orange-400 to-orange-600' },
  { score: 3, emoji: '😐', label: 'Bình thường', color: 'from-yellow-400 to-yellow-600' },
  { score: 4, emoji: '😊', label: 'Vui', color: 'from-green-400 to-green-600' },
  { score: 5, emoji: '😍', label: 'Rất vui', color: 'from-purple-400 to-purple-600' },
];

export default function EntryForm({ onSubmit }: EntryFormProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMood === null) {
      alert('Vui lòng chọn tâm trạng của bạn');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        moodScore: selectedMood,
        note: note.trim(),
      });
      
      // Reset form
      setSelectedMood(null);
      setNote('');
      
      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
    } catch (error) {
      console.error('Error submitting entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full morphing-shape float"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full morphing-shape float-delay-1"></div>
      
      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <div className="text-center animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
            <p className="text-green-700 font-semibold">Đã lưu thành công! ✨</p>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl float">
            <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-gradient">Cảm xúc hôm nay</h2>
            <p className="text-gray-800 dark:text-gray-200 text-xs md:text-sm font-medium">
              Chia sẻ tâm trạng và suy nghĩ của bạn
            </p>
          </div>
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 flex-shrink-0 float-delay-2" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
              <span className="flex items-center gap-2 flex-wrap">
                <span className="text-gradient">Tâm trạng của bạn</span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-medium">
                  {selectedMood ? moodEmojis.find(m => m.score === selectedMood)?.label : 'Chọn một'}
                </span>
              </span>
            </label>
            
            <div className="grid grid-cols-5 gap-2 md:gap-3">
              {moodEmojis.map((mood) => (
                <button
                  key={mood.score}
                  type="button"
                  onClick={() => setSelectedMood(mood.score)}
                  className={`mood-emoji group relative ${
                    selectedMood === mood.score ? 'selected' : ''
                  }`}
                  title={mood.label}
                >
                  <span className="text-3xl md:text-4xl block transition-transform duration-300 group-hover:scale-110">
                    {mood.emoji}
                  </span>
                  
                  {/* Score indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br ${mood.color} flex items-center justify-center text-white text-xs font-bold transition-all duration-300 ${
                    selectedMood === mood.score ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}>
                    {mood.score}
                  </div>
                  
                  {/* Floating label */}
                  <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 md:px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 pointer-events-none transition-all duration-300 group-hover:opacity-100 whitespace-nowrap z-10`}>
                    {mood.label}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Note Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
              <span className="flex items-center gap-2 flex-wrap">
                <Edit3 className="w-4 h-4" />
                <span className="text-gradient">Ghi chú</span>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  ({note.length}/500)
                </span>
              </span>
            </label>
            
            <div className="relative">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Hôm nay bạn cảm thấy thế nào? Có điều gì đặc biệt không? ✨"
                maxLength={500}
                rows={4}
                className="input-field resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
              />
              
              {/* Character count indicator */}
              <div className={`absolute bottom-3 right-3 text-xs font-medium transition-colors duration-300 ${
                note.length > 450 ? 'text-red-600 dark:text-red-400' : 
                note.length > 300 ? 'text-yellow-600 dark:text-yellow-400' : 
                'text-gray-500 dark:text-gray-400'
              }`}>
                {note.length}/500
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={selectedMood === null || isSubmitting}
              className="btn-primary w-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="spinner w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white"></div>
                    <span className="text-sm md:text-base">Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">Lưu cảm xúc</span>
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 opacity-70" />
                  </>
                )}
              </span>
              
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </form>

        {/* Motivational Text */}
        <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="text-center">
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              <span className="text-gradient font-semibold">Mỗi ngày ghi nhật ký</span> là một bước tiến trong hành trình phát triển bản thân ✨
            </p>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Cảm xúc được mã hóa an toàn</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 