import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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


dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5174', 'http://localhost:3001', 'http://localhost:5175'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Requested-With', 'credencialkey', 'Session-Key', 'session-key', 'token']
}));

// Rotas públicas (sem autenticação)
const publicRoutes = [
    '/Authentication/Login',
    '/Authentication/Register',
    '/Authentication/register',
    '/Authentication/CheckEmail',
    '/Authentication/Verify',
    '/Authentication/Resend-Verification',
    '/Authentication/Reset-Password',
    '/Authentication/ValidateToken',
    '/Materials',
    '/Services',
    '/Portfolio',
    '/Faqs',
    '/Reviews',
];

// Aplicar middleware de autenticação
app.use(LoginValidationMiddleware(publicRoutes));

// Rotas
app.use('/Authentication', authenticationRouters);
app.use("/Profile", profileRoutes);
app.use("/Services", serviceRoutes);
app.use("/Bookings", bookingRoutes);
app.use("/Vehicles", vehicleRoutes);
app.use("/Portfolio", portfolioRoutes);
app.use("/Reviews", reviewRoutes);
app.use("/Faqs", faqRoutes);
app.use("/Materials", materialRoutes);
app.use("/Dashboard", Authentication, requireRole('admin'), dashboardRoutes);
app.use("/CRM", Authentication, requireRole('manager'), crmRoutes);
app.use("/Appointments", Authentication, requireRole('operator'), appointmentRoutes);
app.use("/Staff", Authentication, requireRole('admin'), staffRoutes);
app.use("/Inventory", Authentication, requireRole('manager'), inventoryRoutes);
app.use("/Financial", Authentication, requireRole('admin'), financialRoutes);

app.get("/", (req, res) => {
    res.send(`...`);
});

const PORT: number = Number(process.env.API_PORT) || 3001;

app.listen(PORT, () => {
    console.log(`🚀 API running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📍 URL: http://localhost:${PORT}`);
});

export default app;