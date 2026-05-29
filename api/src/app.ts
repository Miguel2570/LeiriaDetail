// api/src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import authenticationRouters from "./Authentication/AuthenticationRoutes";
import profileRoutes from "./Profile/ProfileRoutes";
import serviceRoutes from "./Services/ServiceRoutes";
import bookingRoutes from "./Bookings/BookingRoutes";
import vehicleRoutes from "./Vehicles/VehicleRoutes";
import portfolioRoutes from "./Portfolio/PortfolioRoutes";
import reviewRoutes from "./Reviews/ReviewRoutes";
import faqRoutes from "./Faqs/FaqRoutes";
import materialRoutes from "./Materials/MaterialRoutes";
import dashboardRoutes from "./Dashboard/DashboardRoutes";
import crmRoutes from "./CRM/CRMRoutes";
import appointmentRoutes from "./Appointments/AppointmentRoutes";
import staffRoutes from "./Staff/StaffRoutes";
import inventoryRoutes from "./Inventory/InventoryRoutes";
import financialRoutes from "./Financial/FinancialRoutes";
import { LoginValidationMiddleware, requireRole, Authentication } from "./Helpers/AuthorizationMiddleware";
import paymentRoutes from "./Payment/PaymentRoutes";
import auditRoutes from "./Audit/AuditRoutes";
import { httpLogger } from './Helpers/HttpLogger';
import logger from './Helpers/Logger';
import holidayRoutes from "./Holiday/HolidayRoutes";

dotenv.config();

const app = express();

app.use(httpLogger);
app.use(helmet());
app.use(compression());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { HasError: true, Error: { Message: "Demasiadas tentativas. Tente novamente mais tarde." } }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5174', 'http://localhost:3001', 'http://localhost:5175'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Requested-With', 'Session-Key', 'session-key']
}));

app.use('/Authentication/Login', authLimiter);
app.use('/Authentication/Register', authLimiter);

const publicRoutes = [
    '/Authentication/Login', '/Authentication/Register', '/Authentication/register',
    '/Authentication/CheckEmail', '/Authentication/Verify', '/Authentication/Resend-Verification',
    '/Authentication/Reset-Password', '/Authentication/ValidateToken',
    '/Materials', '/Services', '/Portfolio', '/Faqs', '/Reviews', '/Payment/Webhook',
];

app.use(LoginValidationMiddleware(publicRoutes));

app.use('/Authentication', authenticationRouters);
app.use("/Profile", profileRoutes);
app.use("/Services", serviceRoutes);
app.use("/Bookings", bookingRoutes);
app.use("/Vehicles", vehicleRoutes);
app.use("/Portfolio", portfolioRoutes);
app.use("/Reviews", reviewRoutes);
app.use("/Faqs", faqRoutes);
app.use("/Materials", materialRoutes);
app.use("/Payment", paymentRoutes);
app.use("/Dashboard", Authentication, requireRole('admin'), dashboardRoutes);
app.use("/CRM", Authentication, requireRole('manager'), crmRoutes);
app.use("/Appointments", Authentication, requireRole('operator'), appointmentRoutes);
app.use("/Staff", Authentication, requireRole('admin'), staffRoutes);
app.use("/Inventory", Authentication, requireRole('manager'), inventoryRoutes);
app.use("/Financial", Authentication, requireRole('admin'), financialRoutes);
app.use("/Audit", Authentication, requireRole('admin'), auditRoutes);
app.use("/Holiday", Authentication, requireRole('admin'), holidayRoutes);

app.get("/", (req, res) => {
    res.send(`LeiriaDetail API - ${process.env.NODE_ENV || 'development'}`);
});

app.get("/health", async (req, res) => {
    try {
        const { server } = require('./Helpers/DatabaseConnectionHelper');
        await server.query('SELECT 1');
        res.json({ status: 'OK', database: 'connected', timestamp: new Date().toISOString() });
    } catch (error: any) {
        logger.error('Health check falhou', { error: error.message });
        res.status(500).json({ status: 'ERROR', database: 'disconnected' });
    }
});

app.get("/Holiday/check", async (req, res) => {
    const date = req.query.date as string;
    if (!date) { res.json({ blocked: false }); return; }
    try {
        const { server } = require('./Helpers/DatabaseConnectionHelper');
        const result = await server.query('SELECT id FROM blocked_dates WHERE date = $1', [date]);
        res.json({ blocked: result.rows.length > 0 });
    } catch {
        res.json({ blocked: false });
    }
});

const PORT: number = Number(process.env.API_PORT) || 3001;

app.listen(PORT, () => {
    logger.info(`API a correr em ${process.env.NODE_ENV || 'development'} na porta ${PORT}`);
});

export default app;