import { Controller, UseFormSetValue } from "react-hook-form";
import { FieldErrors, UseFormRegister, Control } from "react-hook-form";
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { SelectTrigger, SelectValue, Select, SelectContent, SelectItem } from "../ui/select";
import { Tipo } from "@/lib/types/tipoTypes";
import { Usuario } from "@/lib/types/usuarioTypes";

type UsuarioFormProps = {
    register: UseFormRegister<Usuario>;
    control: Control<Usuario>;
    isEditing: boolean;
    errors: FieldErrors<Usuario>;
    tipo: Tipo[];
}

export default function UsuarioForm({ register, control, isEditing, tipo, errors }: UsuarioFormProps) {
    return (
        <div>
            <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                    id="nome"
                    {...register('nome')}
                    placeholder="Nome completo"
                />
                {errors.nome && <p className="text-sm text-red-500">*{errors.nome.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="email@exemplo.com"
                />
                {errors.email && <p className="text-sm text-red-500">*{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="senha">
                    Senha {isEditing && <span className="text-sm text-muted-foreground">(deixe em branco para manter a mesma)</span>}
                </Label>
                <Input
                    id="senha"
                    type="password"
                    {...register('senha')}
                    placeholder={isEditing ? '••••••••' : 'Digite uma senha'}
                />
                {errors.senha && <p className="text-sm text-red-500">*{errors.senha.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Controller
                    name="tipo"
                    control={control}
                    render={({ field }) => (
                        <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value || ""}
                        >
                            <SelectTrigger id="tipo">
                                <SelectValue placeholder="Selecione um tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {tipo.map((tipo) => (
                                    <SelectItem key={tipo.id} value={tipo.id}>
                                        {tipo.status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.tipo && <p className="text-sm text-red-500">*{errors.tipo.message}</p>}
            </div>
        </div >
    );
}
