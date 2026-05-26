import { Request, Response, Router } from "express";
import ProfileManager from "./ProfileManager";
import { ProfileOutputModel, UpdateProfileOutputModel, UpdatePasswordOutputModel, ErrorModel } from "./ProfileModel";

const router = Router();

// GET /Profile
async function GetProfile(request: Request, response: Response) {
    const sessionKey = request.headers['session-key'] as string;

    if (!sessionKey) {
        response.status(401).send(
            new ProfileOutputModel(undefined, undefined, new ErrorModel("Session", "Sessão não fornecida."))
        );
        return;
    }

    const result = await ProfileManager.GetProfile(sessionKey);
    response.status(200).send(result);
}

// PUT /Profile/Update
async function UpdateProfile(request: Request, response: Response) {
    const sessionKey = request.headers['session-key'] as string;

    if (!sessionKey) {
        response.status(401).send(
            new UpdateProfileOutputModel(undefined, undefined, undefined, undefined, new ErrorModel("Session", "Sessão não fornecida."))
        );
        return;
    }

    const { firstName, lastName, phone } = request.body;
    const result = await ProfileManager.UpdateProfile(sessionKey, firstName, lastName, phone);
    response.status(200).send(result);
}

// PUT /Profile/ChangePassword
async function ChangePassword(request: Request, response: Response) {
    const sessionKey = request.headers['session-key'] as string;

    if (!sessionKey) {
        response.status(401).send(
            new UpdatePasswordOutputModel(undefined, new ErrorModel("Session", "Sessão não fornecida."))
        );
        return;
    }

    const { currentPassword, newPassword } = request.body;
    const result = await ProfileManager.ChangePassword(sessionKey, currentPassword, newPassword);
    response.status(200).send(result);
}

// PUT /Profile/Avatar
async function UpdateAvatar(request: Request, response: Response) {
    const sessionKey = request.headers['session-key'] as string;

    if (!sessionKey) {
        response.status(401).send(
            new ProfileOutputModel(undefined, undefined, new ErrorModel("Session", "Sessão não fornecida."))
        );
        return;
    }

    const { avatarUrl } = request.body;
    const result = await ProfileManager.UpdateAvatar(sessionKey, avatarUrl);
    response.status(200).send(result);
}

// Registar rotas
router.get("/", GetProfile);
router.put("/Update", UpdateProfile);
router.put("/ChangePassword", ChangePassword);
router.put("/Avatar", UpdateAvatar);

export default router;