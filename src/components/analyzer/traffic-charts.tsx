"use client";

import { useMemo } from 'react';
import { usePacketStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { SecurityHints } from './security-hints';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

export function TrafficCharts() {
  const { packets } = usePacketStore();

  const analytics = useMemo(() => {
    let bytes = 0;
    const protocols: Record<string, number> = {};
    const sources: Record<string, number> = {};
    const dests: Record<string, number> = {};
    const ports: Record<string, number> = {};

    packets.forEach((p) => {
      bytes += p.length || 0;
      protocols[p.protocol] = (protocols[p.protocol] || 0) + 1;
      sources[p.source] = (sources[p.source] || 0) + 1;
      dests[p.destination] = (dests[p.destination] || 0) + 1;
      
      if (p.sourcePort) ports[p.sourcePort] = (ports[p.sourcePort] || 0) + 1;
      if (p.destinationPort) ports[p.destinationPort] = (ports[p.destinationPort] || 0) + 1;
    });

    const protoData = Object.keys(protocols).map(k => ({ name: k, value: protocols[k] }));
    const sourceData = Object.keys(sources).map(k => ({ name: k, count: sources[k] })).sort((a,b) => b.count - a.count).slice(0, 5);
    const destData = Object.keys(dests).map(k => ({ name: k, count: dests[k] })).sort((a,b) => b.count - a.count).slice(0, 5);
    const portData = Object.keys(ports).map(k => ({ name: `Port ${k}`, count: ports[k] })).sort((a,b) => b.count - a.count).slice(0, 5);

    return {
      totalPackets: packets.length,
      totalBytes: bytes,
      protoData,
      sourceData,
      destData,
      portData,
    };
  }, [packets]);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Total Packets</CardDescription>
            <CardTitle className="text-3xl font-mono">{analytics.totalPackets}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Total Data Volume</CardDescription>
            <CardTitle className="text-3xl font-mono">{(analytics.totalBytes / 1024).toFixed(2)} KB</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Unique Sources</CardDescription>
            <CardTitle className="text-3xl font-mono">{analytics.sourceData.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Unique Destinations</CardDescription>
            <CardTitle className="text-3xl font-mono">{analytics.destData.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Protocol Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.protoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.protoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} itemStyle={{ color: '#f8fafc' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Top Source IPs / MACs</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.sourceData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} width={120} />
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <SecurityHints />
    </div>
  );
}
