import { Socket } from 'socket.io-client';
import { Button } from "@/components/ui/button"

export default function Home({ socket }: { socket: Socket }) {
  console.log('Home socket: ', socket);
  return <div> Home
           <div className="flex flex-col items-center justify-center min-h-svh">
            <Button>Click me</Button>
          </div>
  </div>;
}
