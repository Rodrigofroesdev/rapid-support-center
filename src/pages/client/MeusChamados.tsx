
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { chamados, getStatusLabel, getTipoChamadoLabel } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const MeusChamados = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChamado, setSelectedChamado] = useState<any>(null);
  
  // Filter tickets that belong to the current user
  const meusChamados = user 
    ? chamados.filter(chamado => chamado.usuarioId === user.id)
    : [];
  
  const filteredChamados = meusChamados.filter(chamado =>
    chamado.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chamado.descricao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewTicket = (chamado: any) => {
    setSelectedChamado(chamado);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Meus Chamados</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Chamados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 max-w-sm">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar chamados..."
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
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredChamados.map((chamado) => (
                  <tr key={chamado.id}>
                    <td className="font-medium">{chamado.nome}</td>
                    <td>{getTipoChamadoLabel(chamado.tipoChamado)}</td>
                    <td><StatusBadge status={chamado.status} /></td>
                    <td>{new Date(chamado.dataCriacao).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewTicket(chamado)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredChamados.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
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
              <DialogTitle>Detalhes do Chamado</DialogTitle>
              <DialogDescription>
                Chamado #{selectedChamado.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{selectedChamado.nome}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedChamado.dataCriacao).toLocaleDateString()} às {' '}
                    {new Date(selectedChamado.dataCriacao).toLocaleTimeString()}
                  </p>
                </div>
                <StatusBadge status={selectedChamado.status} className="ml-2" />
              </div>
              
              <div className="space-y-2">
                <Label>Tipo</Label>
                <div className="bg-muted/50 p-2 rounded">
                  {getTipoChamadoLabel(selectedChamado.tipoChamado)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Descrição</Label>
                <div className="bg-muted/50 p-3 rounded whitespace-pre-wrap">
                  {selectedChamado.descricao}
                </div>
              </div>
              
              {selectedChamado.observacao && (
                <div className="space-y-2">
                  <Label>Observação do Atendente</Label>
                  <div className="bg-primary/5 p-3 rounded border border-primary/20 whitespace-pre-wrap">
                    {selectedChamado.observacao}
                  </div>
                </div>
              )}
              
              {selectedChamado.arquivos && selectedChamado.arquivos.length > 0 && (
                <div className="space-y-2">
                  <Label>Arquivos</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedChamado.arquivos.map((arquivo: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center p-2 border border-border rounded bg-muted/30"
                      >
                        <span className="text-sm truncate">
                          {arquivo}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Histórico</Label>
                <div className="space-y-2">
                  <div className={cn(
                    "p-3 rounded border",
                    "bg-muted/20 border-muted"
                  )}>
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedChamado.dataCriacao).toLocaleDateString()} às {' '}
                      {new Date(selectedChamado.dataCriacao).toLocaleTimeString()}
                    </p>
                    <p className="text-sm">Chamado aberto</p>
                  </div>
                  
                  {selectedChamado.status !== 'aberto' && (
                    <div className={cn(
                      "p-3 rounded border",
                      "bg-helpdesk-blue/10 border-helpdesk-blue/30"
                    )}>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selectedChamado.dataAtualizacao).toLocaleDateString()} às {' '}
                        {new Date(selectedChamado.dataAtualizacao).toLocaleTimeString()}
                      </p>
                      <p className="text-sm">Chamado em andamento</p>
                    </div>
                  )}
                  
                  {selectedChamado.status === 'fechado' && (
                    <div className={cn(
                      "p-3 rounded border",
                      "bg-helpdesk-green/10 border-helpdesk-green/30"
                    )}>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selectedChamado.dataFechamento || '').toLocaleDateString()} às {' '}
                        {new Date(selectedChamado.dataFechamento || '').toLocaleTimeString()}
                      </p>
                      <p className="text-sm">Chamado fechado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MeusChamados;
