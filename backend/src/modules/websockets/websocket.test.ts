import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebSocketService } from './websocket.service';
import { MESSAGE, REGISTER, DISCONNECT, USER_LIST_UPDATE } from '../../constants';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockIo: any;
  let mockSocket: any;

  beforeEach(() => {
    // Mock socket.io server
    mockSocket = {
      id: 'socket-123',
      on: vi.fn(),
    };

    mockIo = {
      on: vi.fn(),
      to: vi.fn().mockReturnThis(),
      emit: vi.fn(),
    };

    service = new WebSocketService(mockIo as any);
  });

  it('should initialize and set up connection handler', () => {
    // Verify the constructor called initialize
    expect(mockIo.on).toHaveBeenCalledWith('connection', expect.any(Function));
  });

  it('should register a user and update connected users list', () => {
    // Simulate a connection handler capturing the callback
    const connectionCallback = mockIo.on.mock.calls[0][1];
    connectionCallback(mockSocket);

    // Get the register handler
    const registerHandler = mockSocket.on.mock.calls.find(call => call[0] === REGISTER)[1];

    // Trigger the register handler
    registerHandler({ user_id: '123', socket_id: 'socket-123' });

    // Verify USER_LIST_UPDATE was emitted with the correct data
    expect(mockIo.emit).toHaveBeenCalledWith(USER_LIST_UPDATE, ['123']);
  });

  it('should handle messages and send them to the correct recipients', () => {
    // Set up the connection handler
    const connectionCallback = mockIo.on.mock.calls[0][1];
    connectionCallback(mockSocket);

    // Get the message handler
    const messageHandler = mockSocket.on.mock.calls.find(call => call[0] === MESSAGE)[1];

    // Register a user to set up the userSocketMap
    const registerHandler = mockSocket.on.mock.calls.find(call => call[0] === REGISTER)[1];
    registerHandler({ user_id: '456', socket_id: 'socket-456' });

    // Clear previous emit calls
    mockIo.emit.mockClear();

    // Create a test message
    const testMessage = {
      sender_user_id: '123',
      receiver_user_id: '456',
      message: 'Test message'
    };

    // Trigger the message handler
    messageHandler(testMessage);

    // Verify the message was sent to the right socket
    expect(mockIo.to).toHaveBeenCalledWith('socket-456');
    expect(mockIo.emit).toHaveBeenCalledWith(MESSAGE, expect.objectContaining({
      ...testMessage,
      timestamp: expect.any(String)
    }));
  });

  it('should handle disconnect and update user lists', () => {
    // Set up the connection handler
    const connectionCallback = mockIo.on.mock.calls[0][1];
    connectionCallback(mockSocket);

    // Get the disconnect handler
    const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === DISCONNECT)[1];

    // Register a user first
    const registerHandler = mockSocket.on.mock.calls.find(call => call[0] === REGISTER)[1];
    registerHandler({ user_id: '123', socket_id: 'socket-123' });
    
    // Clear previous emit calls
    mockIo.emit.mockClear();

    // Trigger the disconnect handler
    disconnectHandler('transport close', 'socket-123');

    // Verify the USER_LIST_UPDATE was emitted with empty array (no more users)
    expect(mockIo.emit).toHaveBeenCalledWith(USER_LIST_UPDATE, []);
  });
});