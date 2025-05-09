
import React, { useState } from 'react';
import { usuarios } from '@/data/mockData';
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

interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'TI' | 'UBS' | 'LAB';
}

const GerenciarUsuarios = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: '1', nome: 'Admin Teste', email: 'admin@teste.com', tipo: 'TI' },
    { id: '2', nome: 'Cliente UBS', email: 'ubs@teste.com', tipo: 'UBS' },
    { id: '3', nome: 'Cliente LAB', email: 'lab@teste.com', tipo: 'LAB' },
    { id: '4', nome: 'Técnico João', email: 'joao@ti.com', tipo: 'TI' },
    { id: '5', nome: 'UBS Central', email: 'central@ubs.com', tipo: 'UBS' },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState<'TI' | 'UBS' | 'LAB' | ''>('');

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (user?: Usuario) => {
    if (user) {
      setIsEditing(true);
      setEditingUser(user);
      setNome(user.nome);
      setEmail(user.email);
      setSenha('');
      setTipo(user.tipo);
    } else {
      setIsEditing(false);
      setEditingUser(null);
      setNome('');
      setEmail('');
      setSenha('');
      setTipo('');
    }
    setDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!nome || !email || (!isEditing && !senha) || !tipo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditing && editingUser) {
      // Update existing user
      const updatedUsuarios = usuarios.map(u => 
        u.id === editingUser.id ? { ...u, nome, email, tipo: tipo as 'TI' | 'UBS' | 'LAB' } : u
      );
      setUsuarios(updatedUsuarios);
      toast.success("Usuário atualizado com sucesso!");
    } else {
      // Create new user
      const newUser: Usuario = {
        id: String(Date.now()),
        nome,
        email,
        tipo: tipo as 'TI' | 'UBS' | 'LAB',
      };
      setUsuarios([...usuarios, newUser]);
      toast.success("Usuário criado com sucesso!");
    }
    setDialogOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    const confirmed = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (confirmed) {
      setUsuarios(usuarios.filter(u => u.id !== id));
      toast.success("Usuário excluído com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
        <Button onClick={() => handleOpenDialog()}>
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
            <table className="helpdesk-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="font-medium">{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <span className={cn(
                        "px-2 py-1 rounded-md text-xs font-medium",
                        usuario.tipo === 'TI' ? "bg-helpdesk-blue/20 text-helpdesk-blue" : 
                        usuario.tipo === 'UBS' ? "bg-helpdesk-green/20 text-helpdesk-green" : 
                        "bg-helpdesk-yellow/20 text-helpdesk-yellow"
                      )}>
                        {usuario.tipo}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(usuario)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(usuario.id)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsuarios.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
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
              <Select value={tipo} onValueChange={(value) => setTipo(value as 'TI' | 'UBS' | 'LAB')}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="UBS">UBS</SelectItem>
                  <SelectItem value="LAB">LAB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser}>
              {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default GerenciarUsuarios;
