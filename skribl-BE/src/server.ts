import { webSocketService } from "./service/WebSocketService";
import express from "express";
import { createServer } from "http";
import cors from "cors";

const boot = (port: number) => {
  const app = express();
  app.use(
    cors({
      origin: ["http://localhost:3000"],
    })
  );
  const httpServer = createServer(app);
  webSocketService.init(httpServer);

  httpServer.listen(port, () => {
    console.log(`Server Listening on Port ${port}`);
  });
};

boot(4000);
