
import React, { useState } from 'react';
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
import { tiposChamado } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { FilePlus, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const NovoChamado = () => {
  const { user } = useAuth();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<{ file: File, url: string }[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim() || !descricao.trim() || !tipo) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Chamado aberto com sucesso!");
      
      // Reset form
      setNome('');
      setDescricao('');
      setTipo('');
      
      // Clear files and revoke URLs
      previewUrls.forEach(item => URL.revokeObjectURL(item.url));
      setPreviewUrls([]);
      setArquivos([]);
    } catch (error) {
      toast.error("Erro ao abrir chamado. Por favor, tente novamente.");
      console.error("Error submitting ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Abrir Novo Chamado</h1>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Detalhes do Chamado</CardTitle>
            <CardDescription>
              Preencha as informações abaixo para abrir um novo chamado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Chamado</Label>
              <Input
                id="nome"
                placeholder="Ex: Problema com impressora"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Chamado</Label>
              <Select value={tipo} onValueChange={setTipo} required>
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição do Problema</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o problema em detalhes..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="arquivos">Arquivos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Input
                  id="arquivos"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
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
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
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
