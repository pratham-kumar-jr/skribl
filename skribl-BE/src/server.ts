import { webSocketService } from "./service/WebSockerService";
import express from "express";
import { createServer } from "http";

const boot = (port: number) => {
  const app = express();
  const httpServer = createServer(app);

  webSocketService.init(httpServer);

  httpServer.listen(port, () => {
    console.log(`Server Listening on Port ${port}`);
  });
};

boot(3000);
