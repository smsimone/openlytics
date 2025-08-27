import bodyParser from "body-parser";
import express from "express";
import cookieParser from "cookie-parser";
import registerRoutes from "./routes";
import registerApis from "./api/apis";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/public/:item", (req: express.Request, res: express.Response) => {
  const item = req.params.item;
  res.sendFile(`public/${item}`, { root: "." });
});

app.use((req, res, next) => {
  const start = Date.now();
  next();
  const duration = Date.now() - start;

  if (!req.path.startsWith("/api/")) {
    return;
  }
  console.log(`[${Date.now()}] ${req.method} ${req.path}\t(${res.statusCode}) ${duration}ms`);
});

registerRoutes(app);
registerApis(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
