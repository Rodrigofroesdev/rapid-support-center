
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { FilePlus, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import ChamadoForm from '@/components/forms/chamadoForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { chamadoSchema } from '@/lib/zod/schema/schema';
import { Chamado, ChamadoCreate } from '@/lib/types/chamadoTypes';
import { Tipo } from '@/lib/types/tipoTypes';
import { FecthTiposChamado } from '@/lib/helpers/functions';
import { TipoChamado } from '@/lib/types/tipoChamadoTypes';
import ChamadoService from '@/lib/services/chamadoService';

const NovoChamado = () => {
  const { user } = useAuth();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<{ file: File, url: string }[]>([]);
  const [tiposChamado, setTiposChamado] = useState<TipoChamado[]>([]);

  const { register, handleSubmit, setValue, control, formState: { errors }, reset } = useForm<ChamadoCreate>({
    resolver: zodResolver(chamadoSchema),
  });

  const fecthTiposChamado = async () => {
    const tipos = await FecthTiposChamado();
    setTiposChamado(tipos);
  };

  useEffect(() => {
    fecthTiposChamado();
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const newFiles = Array.from(e.target.files);
    setArquivos([...arquivos, ...newFiles]);

    // Create preview URLs
    const newPreviewUrls = newFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);

    // Set the files in the form
    setValue('formFiles', newFiles);
  };

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = arquivos.filter(file => file !== fileToRemove);
    setArquivos(updatedFiles);

    const updatedPreviews = previewUrls.filter(item => item.file !== fileToRemove);
    // Revoke the URL to avoid memory leaks
    const previewToRemove = previewUrls.find(item => item.file === fileToRemove);
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
    }
    setPreviewUrls(updatedPreviews);
  };

  const onSubmit = async (data: ChamadoCreate) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('nome', data.nome);
      formData.append('descricao', data.descricao);
      formData.append('tipoChamadoId', data.tipoChamadoId);
      data.formFiles.forEach(file => {
        formData.append('formFiles', file);
      });
      formData.append('UsuarioId', "b4b5f9ea-ecbd-4eba-8120-0ec0d75285c6");
      const chamadoService = new ChamadoService();
      await chamadoService.createChamado(formData);
      setIsSubmitting(false);
      toast.success("Chamado criado com sucesso!");
      reset();
    } catch (error) {
      toast.error(error.message);
    }
  }



  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Abrir Novo Chamado</h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Detalhes do Chamado</CardTitle>
            <CardDescription>
              Preencha as informações abaixo para abrir um novo chamado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChamadoForm handleFileChange={handleFileChange} removeFile={removeFile} previewUrls={previewUrls} register={register} control={control} errors={errors} tiposChamado={tiposChamado} />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Abrir Chamado
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NovoChamado;
