import { useState } from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import config from '../config';
// Routes
import Chat from './Chat';
import Home from './Home';


export default function Routes() {
  const [socket, setSocket] = useState(()=>{
    return io(config.SOCKET_ENDPOINT, { transports: ['websocket', 'polling'] })}
  );

  // we pass this function to Home component to get a new socket connection when client selects different user.
  const handleGetNewSocketConnection = () => {
    if(socket){
      socket.disconnect();
      setSocket(io(config.SOCKET_ENDPOINT, { transports: ['websocket', 'polling'] }));
    }
  };

  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<Home socket={socket} getNewSocketConnection={handleGetNewSocketConnection}/>} />
        <Route path="/chat/:receiverUserId/:senderUserId" element={<Chat socket={socket} />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}