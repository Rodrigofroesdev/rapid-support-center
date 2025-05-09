
export interface Chamado {
  id: string;
  nome: string;
  descricao: string;
  tipoChamado: string;
  status: 'aberto' | 'em_andamento' | 'fechado';
  dataCriacao: string;
  dataAtualizacao: string;
  dataFechamento?: string;
  prazo?: string;
  observacao?: string;
  arquivos?: string[];
  responsavelId?: string;
  usuarioId: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'TI' | 'UBS' | 'LAB';
}

export interface TipoChamado {
  id: string;
  nome: string;
}

export interface ChamadoUsuario {
  id: string;
  chamadoId: string;
  usuarioId: string;
  data: string;
  observacao: string;
}

export const tiposChamado: TipoChamado[] = [
  { id: '1', nome: 'Problema de Hardware' },
  { id: '2', nome: 'Problema de Software' },
  { id: '3', nome: 'Problema de Rede' },
  { id: '4', nome: 'Solicitação de Novo Equipamento' },
  { id: '5', nome: 'Solicitação de Software' },
  { id: '6', nome: 'Outros' }
];

export const usuarios: Usuario[] = [
  { id: '1', nome: 'Admin Teste', email: 'admin@teste.com', tipo: 'TI' },
  { id: '2', nome: 'Cliente UBS', email: 'ubs@teste.com', tipo: 'UBS' },
  { id: '3', nome: 'Cliente LAB', email: 'lab@teste.com', tipo: 'LAB' },
  { id: '4', nome: 'Técnico João', email: 'joao@ti.com', tipo: 'TI' },
  { id: '5', nome: 'UBS Central', email: 'central@ubs.com', tipo: 'UBS' },
];

export const chamados: Chamado[] = [
  {
    id: '1',
    nome: 'Computador não liga',
    descricao: 'O computador da recepção não está ligando desde ontem.',
    tipoChamado: '1',
    status: 'aberto',
    dataCriacao: '2023-05-01T10:30:00Z',
    dataAtualizacao: '2023-05-01T10:30:00Z',
    arquivos: ['imagem1.png', 'log.txt'],
    usuarioId: '2'
  },
  {
    id: '2',
    nome: 'Instalação do programa X',
    descricao: 'Preciso do programa X instalado no meu computador para acessar o novo sistema.',
    tipoChamado: '5',
    status: 'em_andamento',
    dataCriacao: '2023-05-02T09:15:00Z',
    dataAtualizacao: '2023-05-02T14:20:00Z',
    prazo: '2023-05-10T00:00:00Z',
    observacao: 'Em processo de instalação',
    responsavelId: '1',
    usuarioId: '3'
  },
  {
    id: '3',
    nome: 'Internet lenta',
    descricao: 'A conexão com a internet está muito lenta nos últimos dias.',
    tipoChamado: '3',
    status: 'fechado',
    dataCriacao: '2023-04-28T13:45:00Z',
    dataAtualizacao: '2023-04-30T11:20:00Z',
    dataFechamento: '2023-04-30T11:20:00Z',
    observacao: 'Problema resolvido, era o roteador',
    usuarioId: '2'
  },
  {
    id: '4',
    nome: 'Solicitação de novo monitor',
    descricao: 'Precisamos de um monitor novo para o consultório 3.',
    tipoChamado: '4',
    status: 'aberto',
    dataCriacao: '2023-05-03T16:00:00Z',
    dataAtualizacao: '2023-05-03T16:00:00Z',
    usuarioId: '5'
  },
  {
    id: '5',
    nome: 'Problema no sistema de registro',
    descricao: 'O sistema de registro de pacientes está apresentando erros ao salvar novos registros.',
    tipoChamado: '2',
    status: 'em_andamento',
    dataCriacao: '2023-05-01T08:30:00Z',
    dataAtualizacao: '2023-05-02T10:15:00Z',
    prazo: '2023-05-08T00:00:00Z',
    responsavelId: '4',
    usuarioId: '2'
  }
];

export const chamadosUsuarios: ChamadoUsuario[] = [
  {
    id: '1',
    chamadoId: '2',
    usuarioId: '1',
    data: '2023-05-02T14:20:00Z',
    observacao: 'Designado para instalação do programa X'
  },
  {
    id: '2',
    chamadoId: '5',
    usuarioId: '4',
    data: '2023-05-02T10:15:00Z',
    observacao: 'Designado para resolver o problema no sistema de registro'
  }
];

// Funções auxiliares
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'aberto':
      return 'Aberto';
    case 'em_andamento':
      return 'Em Andamento';
    case 'fechado':
      return 'Fechado';
    default:
      return status;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'aberto':
      return 'bg-helpdesk-yellow/20 text-helpdesk-yellow border-helpdesk-yellow/30';
    case 'em_andamento':
      return 'bg-helpdesk-blue/20 text-helpdesk-blue border-helpdesk-blue/30';
    case 'fechado':
      return 'bg-helpdesk-green/20 text-helpdesk-green border-helpdesk-green/30';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getTipoChamadoLabel = (id: string): string => {
  const tipo = tiposChamado.find(t => t.id === id);
  return tipo ? tipo.nome : 'Desconhecido';
};

export const getUsuarioNome = (id: string): string => {
  const usuario = usuarios.find(u => u.id === id);
  return usuario ? usuario.nome : 'Desconhecido';
};

export const getUsuarioByEmail = (email: string): Usuario | undefined => {
  return usuarios.find(u => u.email === email);
};

export const getChamadosByUsuarioId = (usuarioId: string): Chamado[] => {
  return chamados.filter(c => c.usuarioId === usuarioId);
};
