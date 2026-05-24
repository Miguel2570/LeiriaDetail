import { Request, Response, Router } from "express";
import FaqManager from "./FaqManager";
import { server } from "../Helpers/DatabaseConnectionHelper";

const router = Router();

async function GetAll(request: Request, response: Response) {
    const result = await FaqManager.GetAll();
    response.status(200).send(result);
}

async function AddFaq(request: Request, response: Response) {
    const { question, answer, orderIndex } = request.body;
    const result = await server.query(
        'INSERT INTO faqs (question, answer, order_index) VALUES ($1, $2, $3) RETURNING *',
        [question, answer, orderIndex || 0]
    );
    response.status(200).send({ Faqs: [result.rows[0]], Message: "FAQ adicionada." });
}

async function UpdateFaq(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const { question, answer, orderIndex, isActive } = request.body;
    const result = await server.query(
        `UPDATE faqs SET 
            question = COALESCE($1, question),
            answer = COALESCE($2, answer),
            order_index = COALESCE($3, order_index),
            is_active = COALESCE($4, is_active)
        WHERE id = $5 RETURNING *`,
        [question, answer, orderIndex, isActive, id]
    );
    response.status(200).send({ Faqs: [result.rows[0]], Message: "FAQ atualizada." });
}

async function DeleteFaq(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    await server.query('DELETE FROM faqs WHERE id = $1', [id]);
    response.status(200).send({ success: true, Message: "FAQ removida." });
}

router.post("/Add", AddFaq);
router.put("/:id", UpdateFaq);
router.delete("/:id", DeleteFaq);
router.get("/", GetAll);

export default router;