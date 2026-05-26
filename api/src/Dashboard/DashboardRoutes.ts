// src/Dashboard/DashboardRoutes.ts
import { Request, Response, Router } from "express";
import DashboardManager from "./DashboardManager";
import { DashboardOutputModel, ErrorModel } from "./DashboardModel";

const router = Router();

async function GetDashboard(request: Request, response: Response) {
    try {
        const [metrics, revenue, activityLogs] = await Promise.all([
            DashboardManager.getMetrics(),
            DashboardManager.getRevenueChart(7),
            DashboardManager.getActivityLogs(10)
        ]);

        response.status(200).json(new DashboardOutputModel(metrics, revenue, activityLogs));
    } catch (error: any) {
        console.error('Dashboard error:', error);
        response.status(500).json(new DashboardOutputModel(
            undefined, undefined, undefined,
            new ErrorModel("Server", "Erro ao carregar dashboard")
        ));
    }
}

router.get("/", GetDashboard);

export default router;