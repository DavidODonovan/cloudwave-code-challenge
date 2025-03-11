import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"
import { UserList } from '@/components/ui/userList';

import { API_URL_USERS, CONNECT, MESSAGE, REGISTER, USER_LIST_UPDATE} from '../../constants';
import { User, Message } from '@/types';

export default function Home({ socket, getNewSocketConnection }: { socket: Socket, getNewSocketConnection: () => void }) {
  const navigate = useNavigate();
  const [userList, setUserList] = useState<User[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [socketId, setSocketId] = useState<string | undefined>();
  const [senderUserId, setSenderUserId] = useState(() => localStorage.getItem('cloudWaveChatId') || '');
  const [receiverUserId, setReceiverUserId] = useState<string | undefined>();

  useEffect(() => {
    console.log("useeffect was called with receiverUserId: ", receiverUserId);
    if (receiverUserId) {
      // Navigate to chat-route when receiverUserId changes
      navigate(`/chat/${receiverUserId}/${senderUserId}`, {
        state: { senderName: user?.name }
      });
    }
  }, [receiverUserId, navigate]);

  // Handle user ID changes - save to localStorage and get new socket
  const handleUserChange = (newUserId: string) => {
    localStorage.setItem('cloudWaveChatId', newUserId);
    setSenderUserId(newUserId);
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

  // Update current user when userList or senderUserId changes
  useEffect(() => {
    const currentUser = userList.find(user => user.id.toString() === senderUserId);
    if (currentUser) {
      setUser(currentUser);
    }
  }, [userList, senderUserId]);

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
      
      // Only register if we have a senderUserId
      if (senderUserId) {
        socket.emit(REGISTER, { user_id: senderUserId, socket_id: socket.id });
      }
    };

    const handleMessage = (message: Message) => {
      console.log('Message received:', message);
      // If the message is for the current user, set the receiverUserId to sender, which will trigger a redirect to chat page.
      setReceiverUserId(message.sender_user_id);
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
  }, [socket, senderUserId]);



  const handleInitiateChat = (receiverUserId: string) => {
    if(userList) {
      const receiver = userList.find(u => u.id.toString() === receiverUserId);
      if(receiver?.online === true && receiver?.busy !== true) {
        setReceiverUserId(receiverUserId);
      } else if(!receiver?.online) {
        alert("This user is offline and cannot receive messages right now.");
      } else if(receiver?.busy) {
        alert("This user is busy and cannot receive messages right now.");
      }
    }
  }

  const filteredUserList = userList.filter(u => u.id.toString() !== senderUserId);

  return (
    <Card className="flex flex-col items-center justify-around min-h-svh ">
      <Card className="flex flex-col items-center justify-center p-8">
      <h2 className="text-4xl font-semibold">You are logged in as</h2>
      <h2 className="text-4xl font-semibold">{user?.name || ''}</h2>
      <h2 className="text-xl font-semibold">socketID: {socketId}</h2>
      <UserList users={filteredUserList} handleUserChange={handleUserChange} />
      </Card>
      
        <Card className='flex flex-col items-center justify-center p-4 mt-4'>
          <h2 className="text-2xl font-semibold">Who do you want to message?</h2>
          <div className="flex flex-col py-4">
              {filteredUserList.map((user) => (
                  <Button
                    type="submit" 
                    key={user.id}
                    variant="ghost"
                    className="text-xl font-semibold hover:cursor-pointer"
                    onClick={() => handleInitiateChat(user.id.toString())}
                  >
                  {user.online ? '🟢' : '🔴'} {user.name}
                  </Button>
              ))}
          </div>
        </Card>
    </Card>
  );
}