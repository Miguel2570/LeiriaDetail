import { Router, Request, Response } from 'express';
import { UserManager } from './AuthenticationManager';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await UserManager.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao procurar utilizadores" });
    }
});

router.post('/register', async (req: Request, res: Response) => {
    try {
        const newUser = await UserManager.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar utilizador" });
    }
});

export default router;