import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';


export default function Chat({ socket }: { socket: Socket }) {
  const { userId } = useParams<{ userId: string }>();
  const [socketId, setSocketId] = useState<string | undefined>();

  useEffect(()=>{
      if(socket.connected) {
        setSocketId(socket.id)
      };

      socket?.on('connect', ()=>{
        setSocketId(socket.id)
      });

      socket?.on('disconnect', ()=>{
        setSocketId(undefined)
      });

  }, [socket]);

  return <div>
    <h1>Chat</h1>
    <p>userId: {userId}</p>
    {socket.connected ? <p>Connected</p> : <p>Not connected</p>}
    <div>socketId: {socketId}</div>
  </div>;
}
