// api/src/Authentication/AuthenticationRoutes.ts
import { Request, Response, Router } from "express";
import AuthenticationManager from "./AuthenticationManager";
import { 
    LoginOutputModel, CreateUserOutputModel, ChangePasswordOutputModel,
    ResendVerificationOutputModel, ResetPasswordOutputModel,
    ErrorModel, ValidateTokenOutputModel, CheckEmailOutputModel
} from "./AuthenticationModel";
import UserManager from "./AuthenticationManager";
import { server } from "../Helpers/DatabaseConnectionHelper";
import { RegisterSchema, LoginSchema, validate } from "../Helpers/ValidationSchemas";

const router = Router();

async function Register(request: Request, response: Response) {
    const validation = validate(RegisterSchema, request.body);
    if (!validation.success) {
        response.status(400).send(new CreateUserOutputModel(undefined, undefined, new ErrorModel("Validation", validation.error)));
        return;
    }

    const { email, password, firstName, lastName } = validation.data;
    const result = await AuthenticationManager.Register(email, password, firstName, lastName);
    response.status(200).send(result);
}

async function Login(request: Request, response: Response): Promise<void> {
    const validation = validate(LoginSchema, request.body);
    if (!validation.success) {
        response.status(400).json({ HasError: true, Error: { Message: validation.error } });
        return;
    }

    const { email, password } = validation.data;
    const result = await AuthenticationManager.Login(email, password);

    if (!result.SessionKey) {
        response.status(401).json(result);
        return;
    }

    response.status(200).json(result);
}

async function ResetPassword(request: Request, response: Response) {
    if (!request.body.email) {
        response.status(412).send(new ResetPasswordOutputModel(new ErrorModel("Email", "Email não fornecido.")));
        return;
    }
    const result = await AuthenticationManager.ResetPassword(request.body.email);
    response.status(200).send(result);
}

async function ChangePassword(request: Request, response: Response) {
    const { securityToken, password } = request.body;
    if (!securityToken || !password) {
        response.status(412).send(new ChangePasswordOutputModel(new ErrorModel("Input", "Token e password obrigatórios.")));
        return;
    }
    const isValid = await AuthenticationManager.ValidateToken(securityToken);
    if (isValid.isValid) {
        response.status(200).send(await AuthenticationManager.ChangePassword(securityToken, password));
    } else {
        response.status(401).send("Token inválido ou expirado.");
    }
}

async function ChangeAccountPassword(request: Request, response: Response) {
    const { credencialKey, currentPassword, newPassword } = request.body;
    if (!credencialKey || !currentPassword || !newPassword) {
        response.status(412).send(new ChangePasswordOutputModel(new ErrorModel("Input", "Todos os campos obrigatórios.")));
        return;
    }
    response.status(200).send(await AuthenticationManager.ChangeAccountPassword(credencialKey, currentPassword, newPassword));
}

async function Logout(request: Request, response: Response) {
    const token = request.params['SecurityToken'];
    if (!token) {
        response.status(412).send("Token não fornecido.");
        return;
    }
    const tokenValidationResult = await AuthenticationManager.ValidateToken(token);
    if (tokenValidationResult.isValid) {
        response.status(200).send(await AuthenticationManager.Logout(token));
    } else {
        response.status(401).send("Token inválido.");
    }
}

async function ValidateToken(request: Request, response: Response): Promise<void> {
    const token = request.query.token as string;
    if (!token) { response.status(400).json({ isValid: false, message: "Token não fornecido." }); return; }
    try {
        const result = await AuthenticationManager.ValidateToken(token);
        response.json(result);
    } catch (error) {
        response.status(500).json({ isValid: false, message: "Erro interno." });
    }
}

async function CheckEmail(request: Request, response: Response) {
    const email = request.query.email as string;
    if (!email) { response.status(400).json({ exists: false, message: "Email não fornecido." }); return; }
    try {
        const result = await AuthenticationManager.CheckEmail(email);
        response.json(result);
    } catch (error) {
        response.status(500).json({ exists: false, message: "Erro interno." });
    }
}

async function VerifyPassword(request: Request, response: Response): Promise<void> {
    const credencialKey = request.headers['credencialkey'] as string;
    const { password } = request.body;
    if (!credencialKey || !password) { response.status(400).json({ success: false, error: 'Credenciais em falta.' }); return; }
    const result = await AuthenticationManager.VerifyPassword(parseInt(credencialKey), password);
    if (result.success) { response.json({ success: true }); }
    else { response.status(401).json({ success: false, error: result.error }); }
}

async function GoogleLogin(request: Request, response: Response) {
    if (!request.body.token) { response.status(400).json({ HasError: true, Error: { Message: "Token não fornecido." } }); return; }
    const result = await AuthenticationManager.GoogleLogin(request.body.token);
    response.status(200).send(result);
}

async function AppleLogin(request: Request, response: Response) {
    if (!request.body.token) { response.status(400).json({ HasError: true, Error: { Message: "Token não fornecido." } }); return; }
    const result = await AuthenticationManager.AppleLogin(request.body.token, request.body.fullName);
    response.status(200).send(result);
}

async function GetRole(request: Request, response: Response) {
    const sessionKey = request.headers['session-key'] as string;
    if (!sessionKey) { response.status(200).json({ role: 'customer' }); return; }
    const tokenResult = await UserManager.ValidateToken(sessionKey);
    if (!tokenResult.isValid || !tokenResult.userId) { response.status(200).json({ role: 'customer' }); return; }
    const role = await UserManager.GetUserRole(tokenResult.userId);
    response.status(200).json({ role });
}

async function DeleteAccount(request: Request, response: Response) {
    const sessionKey = request.headers['session-key'] as string;
    if (!sessionKey) { response.status(401).send({ HasError: true, Error: { Message: "Sessão não fornecida." } }); return; }
    const tokenResult = await UserManager.ValidateToken(sessionKey);
    if (!tokenResult.isValid || !tokenResult.userId) { response.status(401).send({ HasError: true, Error: { Message: "Sessão inválida." } }); return; }
    const userId = tokenResult.userId;
    await server.query(`UPDATE users SET first_name = 'Conta', last_name = 'Apagada', email = 'apagado_' || $1 || '@anon.pt', phone = NULL, is_active = false, password_hash = 'DELETED', updated_at = NOW() WHERE id = $1`, [userId]);
    await server.query('DELETE FROM user_sessions WHERE user_id = $1', [userId]);
    response.status(200).send({ HasError: false, Message: "Conta apagada com sucesso." });
}

async function VerifyCode(request: Request, response: Response) {
    const { email, code } = request.body;
    if (!email || !code) {
        response.status(400).json({ HasError: true, Error: { Message: "Email e código são obrigatórios." } });
        return;
    }
    const result = await AuthenticationManager.VerifyCode(email, code);
    response.status(result.HasError ? 400 : 200).json(result);
}

async function ResendVerificationCode(request: Request, response: Response) {
    if (!request.body.email) {
        response.status(400).json({ HasError: true, Error: { Message: "Email é obrigatório." } });
        return;
    }
    const result = await AuthenticationManager.ResendVerificationCode(request.body.email);
    response.status(200).json(result);
}

router.delete("/DeleteAccount", DeleteAccount);
router.post("/Register", Register);
router.post("/Login", Login);
router.post("/Logout/:SecurityToken", Logout);
router.put("/Change-Password", ChangePassword);
router.put("/Change-Account-Password", ChangeAccountPassword);
router.post("/Reset-Password", ResetPassword);
router.post("/verify-password", VerifyPassword);
router.get("/ValidateToken", ValidateToken);
router.get("/CheckEmail", CheckEmail);
router.post("/GoogleLogin", GoogleLogin);
router.post("/AppleLogin", AppleLogin);
router.get("/Role", GetRole);
router.post("/Verify-Code", VerifyCode);
router.post("/Resend-Code", ResendVerificationCode);

export default router;