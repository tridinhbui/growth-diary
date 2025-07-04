'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Heart, Users } from 'lucide-react';

// Simple ID generator to replace uuid
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

interface Message {
  id: string;
  text: string;
  uuid: string;
  timestamp: Date;
  empathy: number;
  support: number;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userUuid] = useState(() => generateId());
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate real-time chat with mock data
  useEffect(() => {
    // Mock initial messages
    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Hôm nay mình cảm thấy có chút lo lắng về công việc. Có ai cùng cảm giác này không?',
        uuid: 'user-1',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        empathy: 3,
        support: 2
      },
      {
        id: '2', 
        text: 'Mình hiểu cảm giác đó. Thỉnh thoảng việc chia sẻ giúp mình cảm thấy nhẹ nhõm hơn.',
        uuid: 'user-2',
        timestamp: new Date(Date.now() - 240000), // 4 minutes ago
        empathy: 1,
        support: 5
      },
      {
        id: '3',
        text: 'Cảm ơn mọi người đã lắng nghe. Cộng đồng này thật ấm áp! 💚',
        uuid: 'user-1',
        timestamp: new Date(Date.now() - 180000), // 3 minutes ago
        empathy: 2,
        support: 3
      }
    ];

    setMessages(mockMessages);
    setIsConnected(true);

    // Simulate receiving occasional messages
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const randomMessages = [
          'Chúc mọi người một ngày tốt lành! 🌟',
          'Ai cũng có những ngày khó khăn, nhưng chúng ta sẽ vượt qua thôi.',
          'Rất vui khi thấy mọi người chia sẻ và hỗ trợ nhau.',
          'Hôm nay mình học được một điều mới, cảm thấy rất hạnh phúc!',
          'Đôi khi chỉ cần biết rằng mình không đơn độc cũng đủ rồi.'
        ];
        
        const newMsg: Message = {
          id: Date.now().toString(),
          text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          uuid: `anonymous-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date(),
          empathy: 0,
          support: 0
        };
        
        setMessages(prev => [...prev, newMsg]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      uuid: userUuid,
      timestamp: new Date(),
      empathy: 0,
      support: 0
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleEmpathy = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId && msg.uuid !== userUuid
        ? { ...msg, empathy: msg.empathy + 1 }
        : msg
    ));
  };

  const handleSupport = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId && msg.uuid !== userUuid
        ? { ...msg, support: msg.support + 1 }
        : msg
    ));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDisplayName = (uuid: string) => {
    if (uuid === userUuid) return 'Bạn';
    return `Ẩn danh ${uuid.slice(-4)}`;
  };

  return (
    <div className="card h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-growth-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">Cộng Đồng Ẩn Danh</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.uuid === userUuid ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.uuid === userUuid
                  ? 'bg-growth-green-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="text-sm mb-1">
                <span className="font-medium">
                  {getDisplayName(message.uuid)}
                </span>
                <span className="ml-2 text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm">{message.text}</p>
            </div>

            {/* Reaction buttons (only for others' messages) */}
            {message.uuid !== userUuid && (
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => handleEmpathy(message.id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                >
                  🤝 {message.empathy > 0 && message.empathy}
                </button>
                <button
                  onClick={() => handleSupport(message.id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
                >
                  ❤️ {message.support > 0 && message.support}
                </button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Chia sẻ cảm xúc của bạn một cách ẩn danh..."
          className="flex-1 input-field"
          maxLength={200}
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() || !isConnected}
          className="btn-primary flex items-center gap-1"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500 mt-2 text-center">
        Đây là một không gian an toàn để chia sẻ. Tất cả tin nhắn đều ẩn danh.
      </p>
    </div>
  );
} 