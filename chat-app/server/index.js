const WebSocket = require('ws');
const http = require('http');
const uuid = require('uuid');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Map();
const messageHistory = [];

function broadcastMessage(message, senderId) {
  const messageString = JSON.stringify(message);
  clients.forEach((client, clientId) => {
    if (clientId !== senderId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(messageString);
    }
  });
}

wss.on('connection', (ws) => {
  const userId = uuid.v4();
  let username = `User-${Math.floor(Math.random() * 1000)}`;

  console.log(`New connection: ${userId}`);

  clients.set(userId, { ws, username });

  ws.send(JSON.stringify({
    type: 'welcome',
    userId,
    username,
    users: Array.from(clients.values()).map(client => client.username),
    history: messageHistory.slice(-100)
  }));

  broadcastMessage({
    type: 'user-joined',
    userId,
    username,
    timestamp: new Date().toISOString()
  }, userId);

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      switch (parsedMessage.type) {
        case 'set-username':
          username = parsedMessage.username;
          clients.set(userId, { ws, username });
          
          broadcastMessage({
            type: 'username-changed',
            userId,
            oldUsername: clients.get(userId).username,
            newUsername: username,
            timestamp: new Date().toISOString()
          }, userId);
          break;

        case 'chat-message':
          const chatMessage = {
            type: 'chat-message',
            messageId: uuid.v4(),
            userId,
            username,
            text: parsedMessage.text,
            timestamp: new Date().toISOString()
          };

          messageHistory.push(chatMessage);
          broadcastMessage(chatMessage, userId);
          break;

        default:
          console.warn('Unknown message type:', parsedMessage.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(userId);
    console.log(`Connection closed: ${userId}`);

    broadcastMessage({
      type: 'user-left',
      userId,
      username,
      timestamp: new Date().toISOString()
    }, userId);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});