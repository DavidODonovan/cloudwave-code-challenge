

export type User = {
  id: string;
  busy?: boolean;
  name: string;
  online?: boolean;
};


export type Message = {
  senderName: string;
  sender_user_id: string;
  sender_socket_id: string;
  receiver_user_id: string;
  message: string;
}