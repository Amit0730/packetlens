"use client";

import { useMemo, useState } from "react";
import { usePacketStore } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function PacketTable() {
  const { packets, filterQuery, selectedPacketId, selectPacket } = usePacketStore();

  const filteredPackets = useMemo(() => {
    if (!filterQuery) return packets;
    const q = filterQuery.toLowerCase();
    
    // Parse complex queries if needed e.g. "port:443"
    const portMatch = q.match(/port:(\d+)/);
    const srcMatch = q.match(/src:([^\s]+)/);
    const dstMatch = q.match(/dst:([^\s]+)/);
    const protoMatch = q.match(/protocol:([a-z0-9]+)/);

    return packets.filter((p) => {
      if (portMatch) {
        if (p.sourcePort?.toString() !== portMatch[1] && p.destinationPort?.toString() !== portMatch[1]) return false;
      }
      if (srcMatch && !p.source.toLowerCase().includes(srcMatch[1])) return false;
      if (dstMatch && !p.destination.toLowerCase().includes(dstMatch[1])) return false;
      if (protoMatch && p.protocol.toLowerCase() !== protoMatch[1]) return false;
      
      // Free text search
      if (!portMatch && !srcMatch && !dstMatch && !protoMatch) {
        const fullStr = `${p.protocol} ${p.source} ${p.destination} ${p.info}`.toLowerCase();
        if (!fullStr.includes(q)) return false;
      }
      return true;
    });
  }, [packets, filterQuery]);

  const getProtocolColor = (protocol: string) => {
    switch (protocol) {
      case 'TCP': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'UDP': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'DNS': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'HTTP': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'HTTPS': 
      case 'TLS': return 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30';
      case 'ICMP': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTcpFlags = (p: any) => {
    if (!p.tcp) return null;
    const flags = [];
    if (p.tcp.flags.syn) flags.push('SYN');
    if (p.tcp.flags.ack) flags.push('ACK');
    if (p.tcp.flags.fin) flags.push('FIN');
    if (p.tcp.flags.rst) flags.push('RST');
    if (p.tcp.flags.psh) flags.push('PSH');
    return flags.length ? `[${flags.join(', ')}]` : '';
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-950">
      <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-10 flex justify-between items-center">
        <span className="text-xs font-medium text-slate-400">
          Showing {filteredPackets.length} of {packets.length} packets
        </span>
      </div>
      <Table>
        <TableHeader className="bg-slate-950 sticky top-[37px] z-10 shadow-sm border-b border-slate-800">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="w-[60px] text-xs h-8">No.</TableHead>
            <TableHead className="w-[140px] text-xs h-8">Time</TableHead>
            <TableHead className="w-[150px] text-xs h-8">Source</TableHead>
            <TableHead className="w-[150px] text-xs h-8">Destination</TableHead>
            <TableHead className="w-[90px] text-xs h-8">Protocol</TableHead>
            <TableHead className="w-[80px] text-xs h-8">Length</TableHead>
            <TableHead className="text-xs h-8">Info</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPackets.map((p) => {
            const isSelected = selectedPacketId === p.id;
            const flags = getTcpFlags(p);
            
            // Safe date formatting
            let timeStr = p.timestamp;
            try {
              const d = new Date(p.timestamp);
              if (!isNaN(d.getTime())) {
                timeStr = format(d, 'HH:mm:ss.SSS');
              }
            } catch (e) {}

            return (
              <TableRow 
                key={p.id}
                className={`cursor-pointer border-b border-slate-800/50 transition-colors
                  ${isSelected ? 'bg-indigo-900/40 hover:bg-indigo-900/50' : 'hover:bg-slate-900/60'}`}
                onClick={() => selectPacket(p.id)}
              >
                <TableCell className="font-mono text-xs py-1.5 text-slate-500">{p.packetNumber}</TableCell>
                <TableCell className="font-mono text-xs py-1.5 text-slate-400">{timeStr}</TableCell>
                <TableCell className="font-mono text-xs py-1.5 truncate max-w-[150px]">{p.source}</TableCell>
                <TableCell className="font-mono text-xs py-1.5 truncate max-w-[150px]">{p.destination}</TableCell>
                <TableCell className="py-1.5">
                  <Badge variant="outline" className={`font-mono text-[10px] px-1.5 py-0 rounded ${getProtocolColor(p.protocol)}`}>
                    {p.protocol}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs py-1.5 text-slate-400">{p.length}</TableCell>
                <TableCell className="font-mono text-xs py-1.5 truncate max-w-[400px] text-slate-300">
                  {flags && <span className="text-slate-500 mr-2">{flags}</span>}
                  {p.info}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
