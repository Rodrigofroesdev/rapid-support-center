
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CircularProgress } from '@mui/material';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { FecthTipos, FecthUsuarios } from '@/lib/helpers/functions';
import { Usuario } from '@/lib/types/usuarioTypes';
import { Tipo } from '@/lib/types/tipoTypes';
import Tables from '@/components/tables/tables';
import { cn } from '@/lib/utils';
import UsuarioService from '@/lib/services/usuarioService';
import { usuarioSchema, usuarioCreateSchema } from '@/lib/zod/schema/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import UsuarioForm from '@/components/forms/usuarioForm';
import { Progress } from '@/components/ui/progress';
import Loading from '@/components/loading';

const GerenciarUsuarios = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('nome') || '');
  const [emailFilter, setEmailFilter] = useState(searchParams.get('email') || '');
  const [tipoFilter, setTipoFilter] = useState(searchParams.get('tipo') || 'all');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState<Tipo[]>([]);

  const { register, handleSubmit, setValue, control, formState: { errors }, reset } = useForm<Usuario>({
    resolver: zodResolver(isEditing ? usuarioSchema : usuarioCreateSchema),
  });

  const fecthUsuarios = async () => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams();
      if (searchQuery) queryParams.set('nome', searchQuery);
      if (emailFilter) queryParams.set('email', emailFilter);
      if (tipoFilter && tipoFilter !== 'all') queryParams.set('tipo', tipoFilter);

      const queryString = queryParams.toString();
      const url = queryString ? `Usuario?${queryString}` : "Usuario";

      const usuarioService = new UsuarioService();
      const usuarios = await usuarioService.getUsuariosWithFilter(url);
      setUsuarios(usuarios);
      setLoading(false);
    } catch (error) {
      toast.error("Erro ao buscar usuários");
      console.error(error);
      setLoading(false);
    }
  };
  const fecthTipos = async () => {
    const tipos = await FecthTipos();
    setTipo(tipos);
  };

  const updateSearchParams = (params: { nome?: string; email?: string; tipo?: string }) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  const debouncedUpdateSearchParams = debounce(updateSearchParams, 300);

  useEffect(() => {
    debouncedUpdateSearchParams({
      nome: searchQuery,
      email: emailFilter,
      tipo: tipoFilter
    });

    fecthUsuarios();
  }, [searchQuery, emailFilter, tipoFilter]);

  useEffect(() => {
    const nome = searchParams.get('nome');
    const email = searchParams.get('email');
    const tipo = searchParams.get('tipo');

    if (nome) setSearchQuery(nome);
    if (email) setEmailFilter(email);
    if (tipo) setTipoFilter(tipo);

    fecthUsuarios();
    fecthTipos();
  }, []);

  const colums = [
    { headerName: "Nome", field: 'nome' },
    { headerName: "Email", field: 'email' },
    {
      headerName: "Tipo", field: 'tipo', renderCell: (row: Usuario) => (
        <span className={
          cn(
            "px-2 py-1 rounded-md text-xs font-medium",
            row.tipo.status === 'TI' ? "bg-helpdesk-blue/20 text-helpdesk-blue" :
              row.tipo.status === 'UBS' ? "bg-helpdesk-green/20 text-helpdesk-green" :
                "bg-helpdesk-yellow/20 text-helpdesk-yellow"
          )
        }>
          {row.tipo.status}
        </span>
      )
    },
    {
      headerName: "Ações", field: 'acoes', renderCell: (row: Usuario) => (
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditUser(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteUser(row.id)}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]


  const handleEditUser = (user: Usuario) => {
    setEditingUser(user);
    setNome(user.nome);
    setEmail(user.email);
    setSenha('');
    setIsEditing(true);
    setDialogOpen(true);
    reset({
      nome: user.nome,
      email: user.email,
      tipo: user.tipo.id,
      senha: ''
    });
  };

  const handleDeleteUser = (id: string) => {
    setEditingUser(usuarios.find(user => user.id === id) || null);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!editingUser) return;

    try {
      const usuarioService = new UsuarioService();
      await usuarioService.deleteUsuario(editingUser.id);
      await fecthUsuarios();
      setIsDeleting(false);
      toast.success("Usuário excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir usuário");
      console.error(error);
    }
  };

  const resetForm = () => {
    setNome('');
    setEmail('');
    setSenha('');
    reset({
      nome: '',
      email: '',
      senha: '',
      tipo: ''
    });
    setIsEditing(false);
    setEditingUser(null);
  };

  const onSubmit = async (data: Usuario) => {
    try {
      let obj = {};
      const usuarioService = new UsuarioService();
      if (isEditing && editingUser) {
        obj = {
          id: editingUser.id,
          nome: data.nome,
          email: data.email,
          tipo: data.tipo
        };

        if (data.senha && data.senha.trim() !== '') {
          obj.senha = data.senha;
        }

        await usuarioService.updateUsuario(obj);
        toast.success("Usuário atualizado com sucesso!");
        resetForm();
      } else {
        await usuarioService.createUsuario(data);
        toast.success("Usuário criado com sucesso!");
        resetForm();
      }
      await fecthUsuarios();
      setDialogOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
        <Button onClick={() => {
          setIsEditing(false);
          setEditingUser(null);
          setNome('');
          setEmail('');
          setSenha('');
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader >
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Nome</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por nome..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email-filter">Email</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email-filter"
                  placeholder="Filtrar por email..."
                  className="pl-8"
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tipo-filter">Tipo</Label>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger id="tipo-filter">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {tipo.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card >

      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loading size={28} />
          ) : (
            <div className="overflow-x-auto">
              <Tables data={usuarios} columns={colums} />
            </div>
          )}
        </CardContent>
      </Card>


      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este usuário?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={loading}
              className="flex items-center gap-2 min-w-[100px] justify-center"
              onClick={confirmDelete}
            >
              {loading ? <Loading size={24} /> : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Edite os detalhes do usuário abaixo.'
                : 'Preencha as informações para criar um novo usuário.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <UsuarioForm control={control} errors={errors} register={register} isEditing={isEditing} tipo={tipo} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type='submit'>
                {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default GerenciarUsuarios;

