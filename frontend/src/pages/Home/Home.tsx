import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type User = {
  id: string;
  name: string;
};

export default function Home({ socket }: { socket: Socket }) {
  const [userList, setUserList] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [socketId, setSocketId] = useState<string | undefined>();
  const [userId, setUserId] = useState(() => {
    // Check if userId exists in localStorage during initialization
    const savedUserId = localStorage.getItem('cloudWaveChatId');
    return savedUserId || '';
  });

  useEffect(() => {
    if (userId) {
      localStorage.setItem('cloudWaveChatId', userId);
    }
  }, [userId]);

  useEffect(() => {
    const handleFetchUserList = async () => {
      const users = await fetch('http://localhost:3001/api/users').then((res) => res.json());
      setUserList(users);
    };
    handleFetchUserList();
  }, []);

  useEffect(()=>{
    socket.on('connect', () => {
      setSocketId(socket.id);
      socket.emit('register', { user_id: userId, socket_id: socket.id });
    });
    if(socket.connected){
      socket.emit('register', { user_id: userId, socket_id: socket.id });
    }
    socket.on('message', (message) => {
      console.log('message received:', message);
    });

    
  }, [socket, userId]);


  //TODO: send message, if message is received, go to chat page and set url params to receiver user_id.
  // When in chat page, fetch messages from database with both user ids.

  const handleSendMessage = () => {
    if (socket.connected) {
      socket.emit('message', {
        sender_user_id: userId, 
        sender_socket_id: socket.id,
        receiver_user_id: '0',
        message: inputValue
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
    <Card className="flex flex-col items-center justify-center min-h-svh">
      {userId}
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {userList.map((user, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-2">
                    <Button 
                      variant="ghost" 
                      className="text-4xl font-semibold hover:cursor-pointer"
                      onClick={()=>{setUserId(index.toString())}}
                      >
                        {user.name}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
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
    </Card>
  )
}
