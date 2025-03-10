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

  const handleGetNewSocketConnection = () => {
    if(socket){
      console.log("disconnecting socket");
      socket.disconnect();
      console.log("creating new socket");
      setSocket(io(config.SOCKET_ENDPOINT, { transports: ['websocket', 'polling'] }));
      console.log("new socket created", socket);
    }
  };

  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<Home socket={socket} getNewSocketConnection={handleGetNewSocketConnection}/>} />
        <Route path="/chat/:userId" element={<Chat socket={socket} />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}