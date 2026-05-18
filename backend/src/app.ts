import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import usuariosRoutes from "./routes/usuariosRoutes";
import dispositivosRoutes from "./routes/dispositivosRoutes";
import sensoresRoutes from "./routes/sensoresRoutes";
import leiturasRoutes from "./routes/leiturasRoutes";
import eventosRoutes from "./routes/eventosRoutes";

import { autenticacao } from "./middleware/autenticacao";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "10mb", strict: true }));
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

app.use((req, _, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  console.log("Content-Type:", req.headers["content-type"]);
  next();
});

app.get("/", (_, res) =>
  res.status(200).json({ sucesso: true, mensagem: "API BabyGuard online" }),
);

app.use("/auth", authRoutes);
app.use(autenticacao);
app.use("/usuarios", usuariosRoutes);
app.use("/dispositivos", dispositivosRoutes);
app.use("/sensores", sensoresRoutes);
app.use("/leituras", leiturasRoutes);
app.use("/eventos", eventosRoutes);

app.use((req, res) =>
  res
    .status(404)
    .json({
      sucesso: false,
      mensagem: `Rota ${req.originalUrl} não encontrada`,
    }),
);

app.use(
  (
    err: any,
    _: express.Request,
    res: express.Response,
    __: express.NextFunction,
  ) => {
    console.error(err);
    res
      .status(500)
      .json({
        sucesso: false,
        mensagem: "Erro interno do servidor",
        erro: err.message || null,
      });
  },
);

export default app;
