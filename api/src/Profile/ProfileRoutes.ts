// api/src/Profile/ProfileRoutes.ts
import { Request, Response, Router } from "express";
import ProfileManager from "./ProfileManager";
import { ProfileOutputModel, UpdateProfileOutputModel, UpdatePasswordOutputModel, ErrorModel } from "./ProfileModel";
import { UpdateProfileSchema, ChangePasswordSchema, validate } from "../Helpers/ValidationSchemas";

const router = Router();

async function GetProfile(request: Request, response: Response) {
    const sessionKey = request.headers['session-key'] as string;
    if (!sessionKey) { response.status(401).send(new ProfileOutputModel(undefined, undefined, new ErrorModel("Session", "Sessão não fornecida."))); return; }
    const result = await ProfileManager.GetProfile(sessionKey);
    response.status(200).send(result);
}

async function UpdateProfile(request: Request, response: Response) {
    const sessionKey = request.headers['session-key'] as string;
    if (!sessionKey) { response.status(401).send(new UpdateProfileOutputModel(undefined, undefined, undefined, undefined, new ErrorModel("Session", "Sessão não fornecida."))); return; }
    
    const validation = validate(UpdateProfileSchema, request.body);
    if (!validation.success) { response.status(400).send(new UpdateProfileOutputModel(undefined, undefined, undefined, undefined, new ErrorModel("Validation", validation.error))); return; }
    
    const { firstName, lastName, phone } = validation.data;
    const result = await ProfileManager.UpdateProfile(sessionKey, firstName || '', lastName || '', phone || '');
    response.status(200).send(result);
}

async function ChangePassword(request: Request, response: Response) {
    const sessionKey = request.headers['session-key'] as string;
    if (!sessionKey) { response.status(401).send(new UpdatePasswordOutputModel(undefined, new ErrorModel("Session", "Sessão não fornecida."))); return; }
    
    const validation = validate(ChangePasswordSchema, request.body);
    if (!validation.success) { response.status(400).send(new UpdatePasswordOutputModel(undefined, new ErrorModel("Validation", validation.error))); return; }
    
    const { currentPassword, newPassword } = validation.data;
    const result = await ProfileManager.ChangePassword(sessionKey, currentPassword, newPassword);
    response.status(200).send(result);
}

async function UpdateAvatar(request: Request, response: Response) {
    const sessionKey = request.headers['session-key'] as string;
    if (!sessionKey) { 
        response.status(401).send(new ProfileOutputModel(undefined, undefined, 
            new ErrorModel("Session", "Sessão não fornecida."))); 
        return; 
    }
    
    // ✅ Novos campos: imageData (base64), imageExtension, imageSize
    const { imageData, imageExtension, imageSize } = request.body;
    
    if (!imageData) {
        response.status(400).send(new ProfileOutputModel(undefined, undefined,
            new ErrorModel("Image", "Imagem não fornecida.")));
        return;
    }
    
    const result = await ProfileManager.UpdateAvatar(
        sessionKey, 
        imageData, 
        imageExtension || 'jpg', 
        imageSize || 0
    );
    response.status(200).send(result);
}

router.get("/", GetProfile);
router.put("/Update", UpdateProfile);
router.put("/ChangePassword", ChangePassword);
router.put("/Avatar", UpdateAvatar);
export default router;