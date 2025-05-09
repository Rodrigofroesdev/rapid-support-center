
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const GerenciarUsuarios = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState<Tipo[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const fecthUsuarios = async () => {
    const usuarios = await FecthUsuarios();
    setUsuarios(usuarios);
  };
  const fecthTipos = async () => {
    const tipos = await FecthTipos();
    setTipo(tipos);
  };

  useEffect(() => {
    fecthTipos();
    fecthUsuarios();
  }, [])

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
    setTipoSelecionado(user.tipo.id);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    // Set the user to be deleted
    setEditingUser(usuarios.find(user => user.id === id) || null);
    // Open the delete confirmation dialog
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!editingUser) return;

    try {
      const usuarioService = new UsuarioService();
      await usuarioService.deleteUsuario(editingUser.id);
      await fecthUsuarios();

      // Close dialog and show success message
      setIsDeleting(false);
      toast.success("Usuário excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir usuário");
      console.error(error);
    }
  };


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
          setTipoSelecionado('');
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 max-w-sm">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Tables data={usuarios} columns={colums} />
          </div>
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
              onClick={confirmDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Edite os detalhes do usuário abaixo.'
                : 'Preencha as informações para criar um novo usuário.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">
                Senha {isEditing && <span className="text-sm text-muted-foreground">(deixe em branco para manter a mesma)</span>}
              </Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder={isEditing ? '••••••••' : 'Digite uma senha'}
                required={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
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
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              if (isEditing && editingUser) {
                // Update existing user
                const updatedUsers = usuarios.map(u =>
                  u.id === editingUser.id
                    ? {
                      ...u,
                      nome,
                      email,
                      tipo: tipo.find(t => t.id === tipoSelecionado) || u.tipo
                    }
                    : u
                );
                setUsuarios(updatedUsers);
                toast.success("Usuário atualizado com sucesso!");
              } else {
                // Create new user
                const newUser: Usuario = {
                  id: `${Date.now()}`, // Generate a temporary ID
                  nome,
                  email,
                  tipo: tipo.find(t => t.id === tipoSelecionado) || tipo[0]
                };
                setUsuarios([...usuarios, newUser]);
                toast.success("Usuário criado com sucesso!");
              }
              setDialogOpen(false);
            }}>
              {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarUsuarios;
