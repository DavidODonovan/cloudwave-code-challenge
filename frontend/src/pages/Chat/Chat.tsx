import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useParams, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MESSAGE } from '@/constants';
import { Message } from '@/types';

export default function Chat({ socket}: { socket: Socket}) {
  const location = useLocation();
  const { senderName, initialMessage } = location.state || {};
  const { receiverUserId, senderUserId } = useParams<{ receiverUserId: string, senderUserId: string }>();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessage ? [initialMessage] : []);

  useEffect(() => {
    if (!socket) return;
    
    const handleIncomingMessage = (data: Message) => {
      // Ensure all required fields are present
      const validatedMessage: Message = {
        ...data,
        sender_name: data.sender_name || 'Anonymous',
        sender_user_id: data.sender_user_id,
        sender_socket_id: data.sender_socket_id || '',
        receiver_user_id: data.receiver_user_id,
        message: data.message,
        timestamp: data.timestamp || new Date().toISOString()
      };
      setMessages(prevMessages => [...prevMessages, validatedMessage]);
    };
    
    socket.on(MESSAGE, handleIncomingMessage);
    
    return () => {
      socket.off(MESSAGE, handleIncomingMessage);
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (!socket.connected || !inputValue.trim() || !receiverUserId || !senderUserId) return;
    
    // Emit message to server and add to local state
    const newMessage: Message = {
      sender_name: senderName || 'Anonymous',
      sender_user_id: senderUserId,
      sender_socket_id: socket.id || '',
      receiver_user_id: receiverUserId,
      message: inputValue,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    socket.emit('message', newMessage);
    
    setInputValue('');
  };
  
  return (
    <div className="h-screen flex flex-col p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Chat</h1>
        <p className="text-sm text-gray-500">Chatting with User ID: {receiverUserId}</p>
      </div>

      {/* Chat Messages */}
      <Card className="flex-grow mb-4 border overflow-hidden">
        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender_user_id === senderUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.sender_user_id === senderUserId 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100'
                  }`}
                >
                  <p className="font-semibold">{msg.sender_name}</p>
                  <p>{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Message Input */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-grow"
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
}