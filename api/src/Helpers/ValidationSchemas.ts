// api/src/Helpers/ValidationSchemas.ts
import { z } from 'zod';

// Password forte
const passwordSchema = z.string()
    .min(8, 'A password deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'A password deve conter pelo menos uma maiúscula')
    .regex(/[a-z]/, 'A password deve conter pelo menos uma minúscula')
    .regex(/[0-9]/, 'A password deve conter pelo menos um número')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'A password deve conter pelo menos um símbolo');

// Email
const emailSchema = z.string()
    .email('Formato de email inválido')
    .transform(v => v.toLowerCase().trim());

// Nome
const nameSchema = z.string()
    .min(1, 'Nome obrigatório')
    .max(100, 'Máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos');

// Telefone português
const phoneSchema = z.string()
    .regex(/^9[1236]\d{7}$/, 'Telemóvel inválido (ex: 912345678)')
    .optional()
    .or(z.literal(''));

// NIF português
const nifSchema = z.string()
    .regex(/^\d{9}$/, 'NIF deve ter 9 dígitos')
    .optional()
    .or(z.literal(''));

// ===== SCHEMAS DE VALIDAÇÃO =====

export const RegisterSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: nameSchema,
    lastName: nameSchema,
});

export const LoginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password obrigatória'),
});

export const UpdateProfileSchema = z.object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    phone: phoneSchema,
});

export const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Password atual obrigatória'),
    newPassword: passwordSchema,
});

export const CreateBookingSchema = z.object({
    userId: z.number().int().positive(),
    vehicleId: z.number().int().positive(),
    serviceId: z.number().int().positive(),
    bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)'),
    bookingTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida (HH:MM)'),
});

export const CreatePaymentSchema = z.object({
    bookingId: z.number().int().positive(),
    amount: z.number().positive('Valor deve ser positivo'),
    method: z.enum(['mbway', 'multibanco'], 'Método inválido'),
    mbwayPhone: phoneSchema,
    invoiceNIF: nifSchema,
    invoiceName: z.string().max(255).optional(),
    invoiceAddress: z.string().max(500).optional(),
});

export const PromoteStaffSchema = z.object({
    email: emailSchema,
    role: z.enum(['operator', 'manager', 'admin', 'superadmin'], 'Role inválida'),
});

export const UpdateRoleSchema = z.object({
    id: z.number().int().positive(),
    role: z.enum(['operator', 'manager', 'admin', 'superadmin', 'customer'], 'Role inválida'),
});

// Função helper para usar nas rotas
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error.issues[0].message };
}