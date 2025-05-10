import z from "zod";
import { emailRegex, nomeRegex, senhaRegex } from "../regex/regex";

export const usuarioSchema = z.object({
    nome: z.string()
        .min(1, "Nome é obrigatório")
        .refine((value) => nomeRegex.test(value), { message: "Nome inválido, pelo menos dois nomes" }),
    email: z.string()
        .min(1, "Email é obrigatório")
        .refine((value) => emailRegex.test(value), { message: "E-mail inválido" }),
    senha: z.string().optional(),
    tipo: z.string().min(1, { message: "Campo obrigatório" })
});

export const usuarioCreateSchema = usuarioSchema.extend({
    senha: z.string().min(1, { message: "Campo obrigatório" })
        .refine((value) => senhaRegex.test(value), { message: "Senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número." }),
});

export const chamadoSchema = z.object({
    nome: z.string().min(1, { message: "Campo obrigatório" }),
    descricao: z.string().min(1, { message: "Campo obrigatório" }),
    tipoChamadoId: z.string().min(1, { message: "Campo obrigatório" }),
    formFiles: z.array(z.instanceof(File)).optional()
});

