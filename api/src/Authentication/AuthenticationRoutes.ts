import { Router, Request, Response } from 'express';
import { UserManager } from './AuthenticationManager';

const router = Router();

// Rota de Registo
router.post('/register', async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, phone, email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "E-mail e password são obrigatórios." });
        }

        const newUser = await UserManager.createUser({ name, phone, email, password });
        res.status(201).json({ message: "Utilizador criado com sucesso!", user: newUser });

    } catch (error: any) {
        // Se for o erro de email duplicado que criámos no Manager
        if (error.message === "O e-mail fornecido já se encontra registado.") {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "Erro interno do servidor ao criar utilizador" });
    }
});

// Rota de Login Básico
router.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "E-mail e password são obrigatórios." });
        }

        const user = await UserManager.getUserByEmail(email);

        // Verifica se o user existe e a password bate certo (novamente, em prod usar bcrypt.compare)
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        // Não enviamos a password de volta na resposta
        const { password: _, ...safeUser } = user;
        
        res.status(200).json({ message: "Login efetuado com sucesso", user: safeUser });

    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor durante o login" });
    }
});

// Listar todos os utilizadores (apenas para efeitos de teste)
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await UserManager.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao procurar utilizadores" });
    }
});

export default router;