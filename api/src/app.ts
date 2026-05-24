import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authenticationRouters from "./Authentication/AuthenticationRoutes";
import { LoginValidationMiddleware } from "./Helpers/AuthorizationMiddleware";
import profileRoutes from "./Profile/ProfileRoutes";


dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5174', 'http://localhost:3001'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Requested-With', 'credencialkey', 'Session-Key', 'token']
}));

const publicRoutes = [
    '/Authentication/Login',
    '/Authentication/Register',
    '/Authentication/CheckEmail',
    '/Authentication/Verify',
    '/Authentication/Resend-Verification',
    
];

app.use('/Authentication', authenticationRouters);
app.use("/Profile", profileRoutes);

app.get("/health", (req, res) => {
    res.json({ 
        status: "ok", 
        service: "leiriadetail-api",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req, res) => {
    res.send(`
        <html>
            <body>
                <h1>LeiriaDetail API</h1>
                <ul>
                    <li><a href="/health">Health Check</a></li>
                    <li><a href="/Authentication">Authentication</a></li>
                </ul>
                <p>Environment: ${process.env.NODE_ENV}</p>
            </body>
        </html>
    `);
});

const PORT: number = Number(process.env.API_PORT) || 3001;

app.listen(PORT, () => {
    console.log(`🚀 API running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📍 URL: http://localhost:${PORT}`);
});

export default app;