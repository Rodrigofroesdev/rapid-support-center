
import React from 'react';
import { 
  BarChart3, 
  FileClock, 
  FileCheck, 
  FileWarning,
  FilePlus
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { chamados } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  // Calculate statistics
  const totalChamados = chamados.length;
  const chamadosAbertos = chamados.filter(c => c.status === 'aberto').length;
  const chamadosEmAndamento = chamados.filter(c => c.status === 'em_andamento').length;
  const chamadosFechados = chamados.filter(c => c.status === 'fechado').length;
  
  // Prepare chart data
  const chartDataStatus = [
    { name: 'Abertos', value: chamadosAbertos },
    { name: 'Em Andamento', value: chamadosEmAndamento },
    { name: 'Fechados', value: chamadosFechados }
  ];
  
  // Group by tipo
  const tipoCount: Record<string, number> = {};
  chamados.forEach(chamado => {
    if (tipoCount[chamado.tipoChamado]) {
      tipoCount[chamado.tipoChamado]++;
    } else {
      tipoCount[chamado.tipoChamado] = 1;
    }
  });
  
  const chartDataTipo = Object.entries(tipoCount).map(([key, value]) => ({
    name: `Tipo ${key}`,
    value
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total de Chamados" 
          value={totalChamados} 
          icon={<BarChart3 size={24} />} 
        />
        <StatCard 
          title="Chamados Abertos" 
          value={chamadosAbertos} 
          icon={<FilePlus size={24} />} 
          className="border-l-4 border-l-helpdesk-yellow"
        />
        <StatCard 
          title="Em Andamento" 
          value={chamadosEmAndamento} 
          icon={<FileClock size={24} />} 
          className="border-l-4 border-l-helpdesk-blue"
        />
        <StatCard 
          title="Chamados Fechados" 
          value={chamadosFechados} 
          icon={<FileCheck size={24} />} 
          className="border-l-4 border-l-helpdesk-green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chamados por Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataStatus} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Chamados por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataTipo} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
