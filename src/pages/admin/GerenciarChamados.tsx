
import React, { useState } from 'react';
import { 
  chamados, 
  getStatusLabel, 
  getTipoChamadoLabel, 
  getUsuarioNome, 
  tiposChamado,
  usuarios
} from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
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
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Check, Edit, Search } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger, 
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const GerenciarChamados = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [tipoFilter, setTipoFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChamado, setSelectedChamado] = useState<any>(null);
  const [prazo, setPrazo] = useState<Date | undefined>(undefined);
  const [responsavel, setResponsavel] = useState("");
  const [observacao, setObservacao] = useState("");

  // Filtrar chamados
  const filteredChamados = chamados.filter(chamado => {
    const matchesStatus = statusFilter ? chamado.status === statusFilter : true;
    const matchesTipo = tipoFilter ? chamado.tipoChamado === tipoFilter : true;
    const matchesQuery = searchQuery 
      ? chamado.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chamado.descricao.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesTipo && matchesQuery;
  });

  const openChamadoDetails = (chamado: any) => {
    setSelectedChamado(chamado);
    setResponsavel(chamado.responsavelId || "");
    setPrazo(chamado.prazo ? new Date(chamado.prazo) : undefined);
    setObservacao(chamado.observacao || "");
  };

  const handleSaveChamado = () => {
    // Na implementação real, isso seria uma chamada à API
    // Aqui vamos apenas simular e mostrar uma toast
    toast.success("Chamado atualizado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Gerenciar Chamados</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Busca</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar chamados..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tipo-filter">Tipo</Label>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger id="tipo-filter">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {tiposChamado.map(tipo => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Chamados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="helpdesk-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Status</th>
                  <th>Tipo</th>
                  <th>Usuário</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredChamados.map((chamado) => (
                  <tr key={chamado.id}>
                    <td className="font-medium">{chamado.nome}</td>
                    <td><StatusBadge status={chamado.status} /></td>
                    <td>{getTipoChamadoLabel(chamado.tipoChamado)}</td>
                    <td>{getUsuarioNome(chamado.usuarioId)}</td>
                    <td>{new Date(chamado.dataCriacao).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openChamadoDetails(chamado)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredChamados.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum chamado encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {selectedChamado && (
        <Dialog open={!!selectedChamado} onOpenChange={(open) => !open && setSelectedChamado(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Gerenciar Chamado</DialogTitle>
              <DialogDescription>
                Atualize os detalhes do chamado #{selectedChamado.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h3 className="font-medium">{selectedChamado.nome}</h3>
                <StatusBadge status={selectedChamado.status} />
                <p className="text-sm text-muted-foreground">{selectedChamado.descricao}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Select value={responsavel} onValueChange={setResponsavel}>
                    <SelectTrigger id="responsavel">
                      <SelectValue placeholder="Selecione um responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios
                        .filter(user => user.tipo === 'TI')
                        .map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.nome}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prazo">Prazo</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="prazo"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !prazo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {prazo ? format(prazo, "PPP", { locale: ptBR }) : <span>Selecionar data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={prazo}
                        onSelect={setPrazo}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacao">Observação</Label>
                <Textarea
                  id="observacao"
                  placeholder="Adicione uma observação sobre este chamado..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="min-h-32"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={selectedChamado.status === "aberto" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedChamado({...selectedChamado, status: "aberto"})}
                  >
                    Aberto
                  </Button>
                  <Button 
                    variant={selectedChamado.status === "em_andamento" ? "default" : "outline"}
                    size="sm" 
                    onClick={() => setSelectedChamado({...selectedChamado, status: "em_andamento"})}
                  >
                    Em Andamento
                  </Button>
                  <Button 
                    variant={selectedChamado.status === "fechado" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedChamado({...selectedChamado, status: "fechado"})}
                  >
                    Fechado
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleSaveChamado}>
                <Check className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GerenciarChamados;
