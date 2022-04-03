import { webSocketService } from "./service/WebSocketService";
import express from "express";
import { createServer } from "http";
import cors from "cors";

const boot = (port: number) => {
  const app = express();
  app.use(
    cors({
      origin: ["http://localhost:3000", "https://skribble-app.netlify.app/"],
    })
  );
  app.get("/", (req, res) => {
    return res.send("Server is up");
  });
  app.all("*", (req, res) => {
    res.status(404).send("404! Page not found");
  });
  const httpServer = createServer(app);
  webSocketService.init(httpServer);

  httpServer.listen(port, () => {
    console.log(`Server Listening on Port ${port}`);
  });
};

boot(process.env.PORT ? +process.env.PORT : 4000);
