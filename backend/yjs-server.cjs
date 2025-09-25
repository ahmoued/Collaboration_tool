// yjs-server.cjs
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');

const port = 1234;
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'Y.js server OK' });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => {
  console.log('🔌 New client connected to room:', req.url);
  setupWSConnection(conn, req);
});

server.listen(port, () => {
  console.log(`✅ Y.js WebSocket server running on ws://localhost:${port}`);
});