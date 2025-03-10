import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"

type User = {
  id: string;
  name: string;
};

export default function Home({ socket }: { socket: Socket }) {
  const [userList, setUserList] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [socketId, setSocketId] = useState<string | undefined>();

  useEffect(() => {
    const handleFetchUserList = async () => {
      const users = await fetch('http://localhost:3001/api/users').then((res) => res.json());
      setUserList(users);
    };
    handleFetchUserList();
  }, []);

  useEffect(() => {
    console.log('userList====>', userList);
  }, [userList]);

  useEffect(()=>{
    socket.on('connect', () => {
      console.log('Connected with ID:', socket.id);
      setSocketId(socket.id);
      socket.emit('register', { user_id: 'some_user_id', socket_id: socket.id });
    });
    socket.on('message', (message) => {
      console.log('message received', message);
    });
  }, [socket])

  const handleSendMessage = () => {
    if (socket.connected) {
      console.log("helloo I am connected...", inputValue)
      socket.emit('message', {
        content: inputValue
      });
      setInputValue('');
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-svh">
        <div>here is the socketId: {socketId}</div>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-grow"
        />
        <Button variant={"outline"} onClick={handleSendMessage}>Send message</Button>
        {userList.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    </div>
  )
}
