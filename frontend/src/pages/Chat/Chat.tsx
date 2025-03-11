import { useState } from 'react';
import { Socket } from 'socket.io-client';
import { useParams, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MESSAGE } from '@/constants';

export default function Chat({ socket }: { socket: Socket }) {
  const [inputValue, setInputValue] = useState('');
  const location = useLocation();
  const { senderName } = location.state || {};
  const { receiverUserId, senderUserId } = useParams<{ receiverUserId: string, senderUserId: string }>();

  const handleSendMessage = () => {
    if (!socket.connected || !inputValue.trim()) return;
    
    socket.emit(MESSAGE, {
      sender_name: senderName,
      sender_user_id: senderUserId,
      sender_socket_id: socket.id,
      receiver_user_id: receiverUserId,
      message: inputValue
    });
    
    setInputValue('');
  };

  // Example messages (will be replaced with actual messages later)
  const mockMessages = [
    {
      sender_name: "You",
      sender_user_id: senderUserId,
      message: "Hey there!",
      timestamp: "2023-05-01T14:22:00Z"
    },
    {
      sender_name: "John",
      sender_user_id: receiverUserId,
      message: "Hi! How are you?",
      timestamp: "2023-05-01T14:23:00Z"
    },
    {
      sender_name: "You",
      sender_user_id: senderUserId,
      message: "I'm good, thanks for asking!",
      timestamp: "2023-05-01T14:24:00Z"
    },
    {
      sender_name: "You",
      sender_user_id: senderUserId,
      message: "I'm good, thanks for asking!",
      timestamp: "2023-05-01T14:24:00Z"
    },
    {
      sender_name: "You",
      sender_user_id: senderUserId,
      message: "I'm good, thanks for asking!",
      timestamp: "2023-05-01T14:24:00Z"
    },    {
      sender_name: "You",
      sender_user_id: senderUserId,
      message: "I'm good, thanks for asking!",
      timestamp: "2023-05-01T14:24:00Z"
    },
    {
      sender_name: "You",
      sender_user_id: senderUserId,
      message: "I'm good, thanks for asking!",
      timestamp: "2023-05-01T14:24:00Z"
    },
  ];

  const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  )
  return (
    <div className="flex flex-col h-screen max-h-screen p-4">
      <Card className="flex flex-col h-full">
        {/* Chat header */}
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Chat with User</h1>
          <div className="text-sm text-muted-foreground">
            {socket ? `Connected (${socket.id})` : 'Not connected'}
          </div>
        </div>
        <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        {mockMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender_user_id === senderUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
                    msg.sender_user_id === senderUserId 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                  }`}
                >
                  <div className="font-semibold">
                    {msg.sender_name}
                  </div>
                  <div>{msg.message}</div>
                  <div className="text-xs opacity-70 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </ScrollArea>
        
        {/* Messages area */}
        {/* <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {mockMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender_user_id === senderUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
                    msg.sender_user_id === senderUserId 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                  }`}
                >
                  <div className="font-semibold">
                    {msg.sender_name}
                  </div>
                  <div>{msg.message}</div>
                  <div className="text-xs opacity-70 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea> */}
        
        {/* Input area */}
        <div className="p-4 border-t">
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
      </Card>
    </div>
  );
}