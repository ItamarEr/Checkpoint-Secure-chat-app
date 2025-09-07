
import express from 'express';
import serverRoutes from './routes/server_routes';
import { WebSocketServer } from 'ws';
import { connectDB } from './serviecs/db';

connectDB();

const app = express();
const port = 3000;

const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });
});

app.get('/', (req, res) => {
  res.send('Hello from server');
});

app.use(serverRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
