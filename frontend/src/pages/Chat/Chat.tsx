import { useState } from 'react';
import { Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MESSAGE } from '@/constants';
import { Message } from '@/types';

export default function Chat({ socket}: { socket: Socket}) {
  const [inputValue, setInputValue] = useState('');
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
      sender_user_id: senderUserId,
      sender_socket_id: socket.id,
      receiver_user_id: receiverUserId,
      message: inputValue
    });
    
    setInputValue('');
  };

  return <div>
    <h1>Chat</h1>
    <p>receiverUserId: {receiverUserId}</p>
    <div>local socket id: {socket ? <span>{socket.id}</span> : <p>Not connected</p>}</div>
    <div className="flex w-full gap-2 mt-4">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Type a message..."
        className="flex-grow"
      />
      <Button variant="outline" onClick={handleSendMessage}>Send message</Button>
    </div>
  </div>;
}
