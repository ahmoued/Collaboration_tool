import { WebSocketServer } from "ws";
import * as Y from "yjs";

const port = 1234;
const wss = new WebSocketServer({ port });

// Store documents in memory
const docs = new Map<string, Y.Doc>();

console.log(`Y.js WebSocket server running on ws://localhost:${port}`);

wss.on("connection", (ws: any, req: any) => {
  console.log("New WebSocket connection established");

  // Extract document name from URL query parameter
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const docName = url.searchParams.get("doc") || "default";

  console.log(`Client connected to document: ${docName}`);

  // Get or create document
  if (!docs.has(docName)) {
    docs.set(docName, new Y.Doc());
    console.log(`Created new document: ${docName}`);
  }

  const doc = docs.get(docName)!;

  // Handle incoming messages
  ws.on("message", (message: Buffer) => {
    try {
      // Apply update to document
      Y.applyUpdate(doc, new Uint8Array(message));

      // Broadcast to all other clients connected to the same document
      wss.clients.forEach((client: any) => {
        if (client !== ws && client.readyState === 1) {
          // WebSocket.OPEN = 1
          client.send(message);
        }
      });
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // Send current state to new client
  const stateVector = Y.encodeStateVector(doc);
  const update = Y.encodeStateAsUpdate(doc, stateVector);
  if (update.length > 0) {
    ws.send(update);
  }

  // Handle client disconnect
  ws.on("close", () => {
    console.log(`Client disconnected from document: ${docName}`);
  });

  ws.on("error", (error: any) => {
    console.error("WebSocket client error:", error);
  });
});

wss.on("error", (error: Error) => {
  console.error("WebSocket server error:", error);
});

process.on("SIGINT", () => {
  console.log("Shutting down WebSocket server...");
  wss.close(() => {
    process.exit(0);
  });
});
