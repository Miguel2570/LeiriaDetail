import { Request, Response, Router } from "express";
import AuthenticationManager from "./AuthenticationManager";
import { 
    LoginOutputModel, 
    CreateUserOutputModel, 
    ChangePasswordOutputModel,
    ResendVerificationOutputModel,
    ResetPasswordOutputModel,
    ErrorModel,
    ValidateTokenOutputModel,
    CheckEmailOutputModel
} from "./AuthenticationModel";

const router = Router();

async function Register(request: Request, response: Response) {
    const data = request.body;

    if (!data.email) {
        response.status(200).send(new CreateUserOutputModel(undefined, undefined, new ErrorModel("email", "Bad Request: email not defined")));
        return;
    }
    
    if (!data.password) {
        response.status(200).send(new CreateUserOutputModel(undefined, undefined, new ErrorModel("password", "Bad Request: password not defined")));
        return;
    }
    
    if (!data.firstName || !data.lastName) {
        response.status(200).send(new CreateUserOutputModel(undefined, undefined, new ErrorModel("name", "Bad Request: name fields not defined")));
        return;
    }

    const email = `${data.email ?? ""}`;
    const password = `${data.password ?? ""}`;
    const firstName = `${data.firstName ?? ""}`;
    const lastName = `${data.lastName ?? ""}`;

    const result = await AuthenticationManager.Register(email, password, firstName, lastName);
    response.status(200).send(result);
}

async function Login(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;

    if (!email || !password) {
        response.status(400).json({
            HasError: true,
            Error: {
                Message: "Email and Password are required."
            }
        });
        return;
    }

    const result = await AuthenticationManager.Login(email, password);

    if (!result.SessionKey) {
        response.status(401).json(result);
        return;
    }

    response.status(200).json(result);
}

async function ResetPassword(request: Request, response: Response) {
    const data = request.body;

    if (!data.email) {
        response.status(412).send(new ResetPasswordOutputModel(new ErrorModel("Email", "Bad Request: email not defined")));
        return;
    }

    const email = `${data.email ?? ""}`;
    const result = await AuthenticationManager.ResetPassword(email);
    response.status(200).send(result);
}

async function ResendVerification(request: Request, response: Response) {
    const data = request.body;

    if (!data.email) {
        response.status(412).send({
            HasError: true,
            Error: {
                Field: "Email",
                Message: "Bad Request: email not defined"
            }
        });
        return;
    }

    const email = `${data.email ?? ""}`;
    const result = await AuthenticationManager.ResendVerificationEmail(email);
    response.status(200).send(result);
}

async function ChangePassword(request: Request, response: Response) {
    const data = request.body;

    if (!data.securityToken) {
        response.status(412).send(new ChangePasswordOutputModel(new ErrorModel("securityToken", "Bad Request: token not defined")));
        return;
    }

    if (!data.password) {
        response.status(412).send(new ChangePasswordOutputModel(new ErrorModel("password", "Bad Request: password not defined")));
        return;
    }

    const isValid = await AuthenticationManager.ValidateToken(data.securityToken);
    
    if (isValid.isValid) {
        response.status(200).send(await AuthenticationManager.ChangePassword(data.securityToken, data.password));
    } else {
        response.status(401).send("You are not allowed to execute this action");
    }
}

async function ChangeAccountPassword(request: Request, response: Response) {
    const data = request.body;

    if (!data.credencialKey) {
        response.status(412).send(new ChangePasswordOutputModel(new ErrorModel("credencialKey", "Bad Request: credencialKey not defined")));
        return;
    }

    if (!data.currentPassword) {
        response.status(412).send(new ChangePasswordOutputModel(new ErrorModel("currentPassword", "Bad Request: currentPassword not defined")));
        return;
    }

    if (!data.newPassword) {
        response.status(412).send(new ChangePasswordOutputModel(new ErrorModel("newPassword", "Bad Request: newPassword not defined")));
        return;
    }

    response.status(200).send(await AuthenticationManager.ChangeAccountPassword(data.credencialKey, data.currentPassword, data.newPassword));
}

async function Logout(request: Request, response: Response) {
    const token = request.params['SecurityToken'];

    if (!token) {
        response.status(412).send("Bad Request: SecurityToken not defined");
    } else {
        const tokenValidationResult = await AuthenticationManager.ValidateToken(token);
        if (tokenValidationResult.isValid) {
            response.status(200).send(await AuthenticationManager.Logout(token));
        } else {
            response.status(401).send("You are not allowed to execute this action");
        }
    }
}

async function VerifyAccount(request: Request, response: Response): Promise<void> {
    const token = request.query.token as string;

    if (!token) {
        response.status(200).send({
            HasError: true,
            Error: { Message: "Missing token." }
        });
        return;
    }

    const result = await AuthenticationManager.VerifyAccount(token);
    response.status(200).send(result);
}

async function ValidateToken(request: Request, response: Response): Promise<void> {
    const token = request.query.token as string;

    if (!token) {
        response.status(400).json({
            isValid: false,
            message: "Token not provided"
        });
        return;
    }

    try {
        const result = await AuthenticationManager.ValidateToken(token);
        response.json(result);
        return;
    } catch (error) {
        console.error("Erro ao validar token:", error);
        response.status(500).json({
            isValid: false,
            message: "Internal server error while validating token"
        });
        return;
    }
}

async function CheckEmail(request: Request, response: Response) {
    const email = request.query.email as string;

    if (!email) {
        response.status(400).json({
            exists: false,
            message: "Email not provided"
        });
        return;
    }

    try {
        const result = await AuthenticationManager.CheckEmail(email);
        response.json(result);
    } catch (error) {
        response.status(500).json({
            exists: false,
            message: "Internal server error"
        });
    }
}

async function VerifyPassword(request: Request, response: Response): Promise<void> {
    const credencialKey = request.headers['credencialkey'] as string;
    const { password } = request.body;

    if (!credencialKey || !password) {
        response.status(400).json({ success: false, error: 'Missing credentials' });
        return;
    }

    const result = await AuthenticationManager.VerifyPassword(parseInt(credencialKey), password);

    if (result.success) {
        response.json({ success: true });
    } else {
        response.status(401).json({ success: false, error: result.error });
    }
}

async function GoogleLogin(request: Request, response: Response) {
    const { token } = request.body;

    if (!token) {
        response.status(400).json({ HasError: true, Error: { Message: "Token não fornecido." } });
        return;
    }

    const result = await AuthenticationManager.GoogleLogin(token);
    response.status(200).send(result);
}

async function AppleLogin(request: Request, response: Response) {
    const { token, fullName } = request.body;

    if (!token) {
        response.status(400).json({ HasError: true, Error: { Message: "Token não fornecido." } });
        return;
    }

    const result = await AuthenticationManager.AppleLogin(token, fullName);
    response.status(200).send(result);
}

router.post("/Register", Register);
router.post("/Login", Login);
router.post("/Logout/:SecurityToken", Logout);
router.post("/Change-Password", ChangePassword);
router.post("/Change-Account-Password", ChangeAccountPassword);
router.post("/Reset-Password", ResetPassword);
router.post("/Resend-Verification", ResendVerification);
router.post("/verify-password", VerifyPassword);
router.get("/Verify", VerifyAccount);
router.get("/ValidateToken", ValidateToken);
router.get("/CheckEmail", CheckEmail);
router.post("/GoogleLogin", GoogleLogin);
router.post("/AppleLogin", AppleLogin);

export default router;