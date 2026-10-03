"use client";

import React, { useState } from 'react';
import { usePacketStore } from '@/lib/store';
import { generateSampleData } from '@/lib/generate-data';
import { parseJsonPackets, parseCsvPackets } from '@/lib/packet-parser';
import { PacketTable } from '@/components/analyzer/packet-table';
import { PacketInspector } from '@/components/analyzer/packet-inspector';
import { TrafficCharts } from '@/components/analyzer/traffic-charts';
import { FlowGraph } from '@/components/analyzer/flow-graph';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Settings, Search } from 'lucide-react';
import { SecurityHints } from '@/components/analyzer/security-hints';

export default function AnalyzerPage() {
  const { packets, setPackets, setFilterQuery, filterQuery } = usePacketStore();
  const [activeTab, setActiveTab] = useState('table');

  const loadSample = (type: 'tcp' | 'udp' | 'dns' | 'http' | 'icmp') => {
    setPackets(generateSampleData(type));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.json')) {
        const parsed = await parseJsonPackets(file);
        setPackets(parsed);
      } else if (file.name.endsWith('.csv')) {
        const parsed = await parseCsvPackets(file);
        setPackets(parsed);
      } else {
        alert("Unsupported file format. Please upload .json or .csv");
      }
    } catch (err: any) {
      alert("Error parsing file: " + err.message);
    }
    
    // reset file input
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950 shrink-0">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg text-indigo-400">PacketLens</div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => loadSample('tcp')} className="text-xs h-8">TCP Sample</Button>
            <Button variant="outline" size="sm" onClick={() => loadSample('dns')} className="text-xs h-8">DNS Sample</Button>
            <Button variant="outline" size="sm" onClick={() => loadSample('http')} className="text-xs h-8">HTTP Sample</Button>
            
            <label className="cursor-pointer">
              <Input type="file" className="hidden" accept=".json,.csv" onChange={handleFileUpload} />
              <div className="flex items-center gap-2 h-8 px-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors">
                <Upload className="w-3.5 h-3.5" />
                Import File
              </div>
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2 text-slate-500" />
            <Input 
              placeholder="Filter (e.g. tcp, port:443)" 
              className="h-8 w-64 pl-8 bg-slate-900 border-slate-700 text-xs"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {packets.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <NetworkIcon className="w-16 h-16 mb-4 text-slate-700" />
            <h2 className="text-xl font-semibold mb-2 text-slate-300">No Data Loaded</h2>
            <p className="max-w-md text-center mb-6 text-sm">
              Import a JSON or CSV packet capture, or load a sample dataset to begin analysis.
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-w-0">
            <div className="border-b border-slate-800 bg-slate-900/50 px-4 py-2 shrink-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-900 border border-slate-800">
                  <TabsTrigger value="table">Packet Table</TabsTrigger>
                  <TabsTrigger value="charts">Traffic Analytics</TabsTrigger>
                  <TabsTrigger value="flows">Flows</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col relative">
              <div className={`absolute inset-0 flex flex-col ${activeTab === 'table' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                 {/* Table and Inspector Split View */}
                 <div className="flex-1 flex overflow-hidden">
                   <div className="flex-1 flex flex-col border-r border-slate-800 min-w-0">
                     <PacketTable />
                   </div>
                   <div className="w-[400px] shrink-0 bg-slate-900 flex flex-col overflow-hidden">
                     <PacketInspector />
                   </div>
                 </div>
              </div>
              
              <div className={`absolute inset-0 overflow-auto p-6 ${activeTab === 'charts' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                <TrafficCharts />
              </div>
              
              <div className={`absolute inset-0 overflow-auto p-6 ${activeTab === 'flows' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                <FlowGraph />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function NetworkIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </svg>
  )
}
