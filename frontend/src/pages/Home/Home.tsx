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
} from "@/components/ui/carousel";

import { API_URL_USERS, CONNECT, MESSAGE, REGISTER, USER_LIST_UPDATE} from '../../constants';

type User = {
  id: string;
  name: string;
  online?: boolean;
};

export default function Home({ socket, getNewSocketConnection }: { socket: Socket, getNewSocketConnection: () => void }) {
  const [userList, setUserList] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [socketId, setSocketId] = useState<string | undefined>();
  const [userId, setUserId] = useState(() => localStorage.getItem('cloudWaveChatId') || '');

  // Handle user ID changes - save to localStorage and get new socket
  const handleUserChange = (newUserId: string) => {
    localStorage.setItem('cloudWaveChatId', newUserId);
    setUserId(newUserId);
    getNewSocketConnection();
  };

  const handleFetchUsers = () => {
    console.log('fetch users called')
    fetch(API_URL_USERS)
      .then(res => res.json())
      .then(users => setUserList(users))
      .catch(err => console.error("Failed to fetch users:", err));
  };

  const handleUpdateUserStatuses= (data: any) => {
    console.log("handleUpdateUserStatuses called", data)
    console.log("typeof data", typeof data[0])
    if(userList.length === 0) return;
    console.log('hellooooooooo')
    console.log('hellooooooooo')
    console.log('hellooooooooo')
    console.log('hellooooooooo')
    console.log('hellooooooooo')
    console.log('hellooooooooo')
    console.log('hellooooooooo')
    console.log('hellooooooooo')
    const onlineIdsSet = new Set(data);

    const updatedUserList = userList.map(user => {
      return {...user,
        // Set online to true if user's ID is in the onlineIdsSet, otherwise false
        online: onlineIdsSet.has(user.id.toString())
      };
    });
    setUserList(updatedUserList);
  }

  // Fetch user list once on component mount
  useEffect(() => {
    handleFetchUsers();
  }, []);

  // Update current user when userList or userId changes
  useEffect(() => {
    const currentUser = userList.find(user => user.id.toString() === userId);
    if (currentUser) {
      setUser(currentUser);
    }
  }, [userList, userId]);

  // Set up socket listeners and handle cleanup
  useEffect(() => {
    // Only set up listeners if socket exists
    if (!socket) return;

    const handleConnect = () => {
      console.log('Socket connected with ID:', socket.id);
      setSocketId(socket.id);
      
      // Only register if we have a userId
      if (userId) {
        socket.emit(REGISTER, { user_id: userId, socket_id: socket.id });
      }
    };

    const handleMessage = (message: any) => {
      console.log('Message received:', message);
    };

    // Register connect handler
    socket.on(CONNECT, handleConnect);
    socket.on(MESSAGE, handleMessage);
    socket.on(USER_LIST_UPDATE, handleUpdateUserStatuses);

    // If already connected, register immediately
    if (socket.connected) {
      handleConnect();
    }

    // Cleanup function to remove listeners when component unmounts
    // or when socket changes
    return () => {
      socket.off(CONNECT, handleConnect);
      socket.off(MESSAGE, handleMessage);
      socket.off(USER_LIST_UPDATE, handleUpdateUserStatuses)
    };
  }, [socket, userId]);

  const handleSendMessage = () => {
    if (!socket.connected || !inputValue.trim()) return;
    
    socket.emit('message', {
      sender_user_id: userId,
      sender_socket_id: socket.id,
      receiver_user_id: '1',
      message: inputValue
    });
    
    setInputValue('');
  };

  return (
    <Card className="flex flex-col items-center justify-center min-h-svh">
      <p className="text-4xl font-semibold">Hello {user?.name || ''}</p>
      
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {userList.map((user, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center">
                    <Button 
                      variant="ghost" 
                      className="text-xl font-semibold hover:cursor-pointer"
                      onClick={() => handleUserChange(user.id.toString())}
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
        <div>Socket ID: {socketId || "Not connected"}</div>
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
        
        <div className="mt-4">
          {userList.map((user) => {
            if(user.id === userId) return;
            return (
              <div key={user.id}>
                <div>{user.online ? '🟢' : '🔴'} {user.name}</div>
              </div>
            )
          })}
          
        </div>
      </div>
    </Card>
  );
}