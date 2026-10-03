"use client";

import { useMemo } from 'react';
import { usePacketStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Network } from 'lucide-react';

export function FlowGraph() {
  const { packets } = usePacketStore();

  const flows = useMemo(() => {
    const flowMap = new Map<string, { src: string, dst: string, proto: string, count: number, bytes: number }>();
    
    packets.forEach(p => {
      const key = `${p.source}->${p.destination}:${p.protocol}`;
      if (!flowMap.has(key)) {
        flowMap.set(key, { src: p.source, dst: p.destination, proto: p.protocol, count: 0, bytes: 0 });
      }
      const flow = flowMap.get(key)!;
      flow.count++;
      flow.bytes += p.length;
    });

    return Array.from(flowMap.values()).sort((a, b) => b.bytes - a.bytes).slice(0, 50); // limit for UI
  }, [packets]);

  return (
    <Card className="bg-slate-900 border-slate-800 max-w-5xl mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Network className="w-5 h-5 text-indigo-400" /> Network Flow Visualization
        </CardTitle>
        <CardDescription className="text-slate-400">
          Top communication flows between endpoints in the captured data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {flows.length === 0 ? (
           <div className="text-slate-500 text-sm py-10 text-center">No flow data available.</div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            {flows.map((f, i) => (
              <div key={i} className="flex flex-col items-center justify-center mb-6">
                <div className="flex w-full items-center justify-center gap-4">
                  <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded shadow-sm text-sm font-mono text-slate-200">
                    {f.src}
                  </div>
                  
                  <div className="flex-1 max-w-[200px] flex flex-col items-center">
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded-full mb-1">
                      {f.proto} • {f.count} pkts • {(f.bytes / 1024).toFixed(1)} KB
                    </span>
                    <div className="w-full h-px bg-slate-700 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-700 rotate-45"></div>
                    </div>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded shadow-sm text-sm font-mono text-slate-200">
                    {f.dst}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
