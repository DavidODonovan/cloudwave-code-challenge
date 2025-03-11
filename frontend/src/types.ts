

export type User = {
  id: string;
  busy?: boolean;
  name: string;
  online?: boolean;
};


export type Message = {
  sender_name: string;
  sender_user_id: string;
  sender_socket_id: string;
  receiver_user_id: string;
  message: string;
}