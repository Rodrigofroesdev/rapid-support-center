import { Upload, X } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { ChamadoCreate } from "@/lib/types/chamadoTypes";
import { TipoChamado } from "@/lib/types/tipoChamadoTypes";

type ChamadoFormProps = {
    tiposChamado: TipoChamado[];
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeFile: (file: File) => void;
    previewUrls: { file: File; url: string }[];
    register: UseFormRegister<ChamadoCreate>;
    control: Control<ChamadoCreate>;
    errors: FieldErrors<ChamadoCreate>;
};

export default function ChamadoForm({ tiposChamado, handleFileChange, removeFile, previewUrls, register, control, errors }: ChamadoFormProps) {
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="nome">Nome do Chamado</Label>
                <Input
                    id="nome"
                    placeholder="Ex: Problema com impressora"
                    {...register('nome')}
                />
                {errors.nome && <p className="text-sm text-red-500">*{errors.nome.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="tipoChamado">Tipo de Chamado</Label>
                <Controller
                    name="tipoChamadoId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value || ""}
                        >
                            <SelectTrigger id="tipo">
                                <SelectValue placeholder="Selecione o tipo de chamado" />
                            </SelectTrigger>
                            <SelectContent>
                                {tiposChamado.map((tipo) => (
                                    <SelectItem key={tipo.id} value={tipo.id}>
                                        {tipo.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.tipoChamadoId && <p className="text-sm text-red-500">*{errors.tipoChamadoId.message}</p>}

            </div>

            <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Problema</Label>
                <Textarea
                    id="descricao"
                    placeholder="Descreva o problema em detalhes..."
                    className="min-h-[120px]"
                    {...register('descricao')}
                />
                {errors.descricao && <p className="text-sm text-red-500">*{errors.descricao.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="arquivos">Arquivos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Input
                        id="arquivos"
                        type="file"
                        className="hidden"
                        {...register('formFiles', {
                            onChange: handleFileChange
                        })}
                        multiple
                    />
                    <Label htmlFor="arquivos" className="cursor-pointer flex flex-col items-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium">
                            Clique para selecionar ou arraste arquivos
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                            Suporte: PDF, imagens, DOC, etc.
                        </span>
                    </Label>
                </div>

                {/* File Previews */}
                {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {previewUrls.map((item, index) => (
                            <div
                                key={index}
                                className="relative flex items-center p-2 border border-border rounded-md bg-muted/30"
                            >
                                <div className="flex-1 truncate text-sm">
                                    {item.file.name}
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 shrink-0"
                                    onClick={() => removeFile(item.file)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
