import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import Chat from './Chat';
const createMockSocket = () => {
    const mockSocket = {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn(),
      connected: true,
      disconnected: false,
      id: 'socket-123',
      io: {},
      nsp: '/',
      auth: {},
      recovered: false,
      volatile: {},
      timeout: vi.fn().mockReturnThis(),
      open: vi.fn(),
      close: vi.fn(),
      send: vi.fn(),
      compress: vi.fn().mockReturnThis(),
      listeners: vi.fn().mockReturnValue([]),
      hasListeners: vi.fn().mockReturnValue(false),
      eventNames: vi.fn().mockReturnValue([]),
      once: vi.fn(),
      removeListener: vi.fn(),
      removeAllListeners: vi.fn(),
      onAny: vi.fn(),
      prependAny: vi.fn(),
      offAny: vi.fn(),
      listenersAny: vi.fn().mockReturnValue([]),
      onAnyOutgoing: vi.fn(),
      prependAnyOutgoing: vi.fn(),
      offAnyOutgoing: vi.fn(),
      listenersAnyOutgoing: vi.fn().mockReturnValue([]),
      emitWithAck: vi.fn(),
      emitReserved: vi.fn(),
      serverSideEmit: vi.fn(),
      prependListener: vi.fn(),
      prependOnceListener: vi.fn(),
      addListener: vi.fn()
    } as unknown as Socket;
  
    return mockSocket;
  };

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ receiverUserId: 'receiver-123', senderUserId: 'sender-456' })
  };
});

describe('Chat Component', () => {
  it('can send message with Enter key', () => {
    const mockSocket = createMockSocket();
    
    render(
      <BrowserRouter>
        <Chat socket={mockSocket} />
      </BrowserRouter>
    );
    
    const input = screen.getByPlaceholderText('Type a message...');
    
    fireEvent.change(input, { target: { value: 'Testing Enter key' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockSocket.emit).toHaveBeenCalledWith('message', expect.objectContaining({
      message: 'Testing Enter key'
    }));
  });
});
