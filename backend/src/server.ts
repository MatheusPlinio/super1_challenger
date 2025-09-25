import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("API do Mini Marketplace está rodando!");
});

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || "Erro interno do servidor",
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit();
});

process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    process.exit();
});
