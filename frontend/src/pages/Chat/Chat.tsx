import { useState } from 'react';
import { Socket } from 'socket.io-client';
import { useParams, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MESSAGE } from '@/constants';
import { Message } from '@/types';

export default function Chat({ socket}: { socket: Socket}) {
  const [inputValue, setInputValue] = useState('');
  const location = useLocation();
  const { senderName } = location.state || {};

  if(socket){
    console.log("incoming socket chat: ", socket);
  };

  socket.on(MESSAGE, (data:Message) => {console.log("incoming message: ", data)});
  const { receiverUserId, senderUserId  } = useParams<{ receiverUserId: string, senderUserId: string }>();

  const handleSendMessage = () => {
    console.log("handleSendMessage called");
    console.log({receiverUserId, senderUserId});
    if (!socket.connected || !inputValue.trim()) return;
    
    socket.emit('message', {
      sender_name: senderName,
      sender_user_id: senderUserId,
      sender_socket_id: socket.id,
      receiver_user_id: receiverUserId,
      message: inputValue
    });
    
    setInputValue('');
  };
  const mockMessages = [
    { sender_name: "You", sender_user_id: senderUserId, message: "Hello there!" },
    { sender_name: "John", sender_user_id: receiverUserId, message: "Hi! How are you?" },
    { sender_name: "You", sender_user_id: senderUserId, message: "I'm good, how about you?" },
    { sender_name: "John", sender_user_id: receiverUserId, message: "Doing well, thanks for asking!" },
    { sender_name: "John", sender_user_id: receiverUserId, message: "Doing well, thanks for asking!" },
    { sender_name: "John", sender_user_id: receiverUserId, message: "Doing well, thanks for asking!" },
    { sender_name: "John", sender_user_id: receiverUserId, message: "Doing well, thanks for asking!" },
    { sender_name: "John", sender_user_id: receiverUserId, message: "Doing well, thanks for asking!" },
  ];


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
          {mockMessages.map((msg, index) => (
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
  )
}
