import { Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';


export default function Chat({ socket }: { socket: Socket }) {
  if(socket){
    console.log("incoming socket chat: ", socket);
  }
  const { userId } = useParams<{ userId: string }>();

  return <div>
    <h1>Chat</h1>
    <p>userId: {userId}</p>
    <div>{socket ? <p>{socket.id}</p> : <p>Not connected</p>}</div>
  </div>;
}
