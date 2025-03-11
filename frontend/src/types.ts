

export type User = {
  id: string;
  busy?: boolean;
  name: string;
  online?: boolean;
};


export type Message = {
  message: string;
  receiver_user_id: string;
  sender_name: string;
  sender_user_id: string;
  sender_socket_id: string;
  timestamp: string;
}