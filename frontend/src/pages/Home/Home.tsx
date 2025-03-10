import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card"
import { UserList } from '@/components/ui/userList';

import { API_URL_USERS, CONNECT, MESSAGE, REGISTER, USER_LIST_UPDATE} from '../../constants';
import { User } from '@/types';

export default function Home({ socket, getNewSocketConnection }: { socket: Socket, getNewSocketConnection: () => void }) {
  const [userList, setUserList] = useState<User[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
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
      .then(users => {
        console.log("Fetched users:", users);
        
        // Always set the userList with the fetched users first
        setUserList(users);
        
        // Then apply online statuses if we have online user IDs
        if (onlineUserIds.length > 0) {
          const updatedUsers = handleUpdateUserStatuses(users);
          if (updatedUsers) {
            setUserList(updatedUsers);
          }
        }
      })
      .catch(err => console.error("Failed to fetch users:", err));
  };

  const handleUpdateUserStatuses = (users: User[]) => {
    // Remove the conditional that was causing the function to return undefined
    const onlineIdsSet = new Set(onlineUserIds);
    
    const updatedUserList = users.map(user => {
      return {
        ...user,
        // Set online to true if user's ID is in the onlineIdsSet, otherwise false
        online: onlineIdsSet.has(user.id.toString())
      };
    });
    
    return updatedUserList;
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

  // Update user list when online user IDs change
  useEffect(() => { 
    console.log({onlineUserIds});
    
    // Only update if we have both online IDs and a user list
    if (onlineUserIds.length > 0 && userList.length > 0) {
      const updatedUsers = handleUpdateUserStatuses([...userList]);
      setUserList(updatedUsers);
    }
  }, [onlineUserIds]);

  // Set up socket listeners and handle cleanup
  useEffect(() => {
    // Only set up listeners if socket exists
    if (!socket) return;

    const handleConnect = () => {
      setSocketId(socket.id);
      console.log('Socket connected with ID:', socketId);
      
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
    socket.on(USER_LIST_UPDATE, setOnlineUserIds);

    // If already connected, register immediately
    if (socket.connected) {
      handleConnect();
    }

    // Cleanup function to remove listeners when component unmounts
    // or when socket changes
    return () => {
      socket.off(CONNECT, handleConnect);
      socket.off(MESSAGE, handleMessage);
      socket.off(USER_LIST_UPDATE, setOnlineUserIds)
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

  const filteredUserList = userList.filter(u => u.id.toString() !== userId);

  return (
    <Card className="flex flex-col items-center justify-center min-h-svh ">
      <p className="text-4xl font-semibold">You are logged in as</p>
      <p className="text-4xl font-semibold">{user?.name || ''}</p>
      <UserList users={filteredUserList} handleUserChange={handleUserChange} />
      
      <div className="flex flex-col items-center justify-center min-h-svh">
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
          {filteredUserList.map((user) => {
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