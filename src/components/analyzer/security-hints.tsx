"use client";

import { useMemo } from 'react';
import { usePacketStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Info, AlertTriangle } from 'lucide-react';

export function SecurityHints() {
  const { packets } = usePacketStore();

  const hints = useMemo(() => {
    const h: { type: string, title: string, desc: string }[] = [];
    if (packets.length === 0) return h;

    // Check for high proportion of SYN packets without ACKs (SYN Flood hint)
    let synCount = 0;
    let ackCount = 0;
    let largePacketCount = 0;
    let dnsQueryCount = 0;

    packets.forEach(p => {
      if (p.tcp?.flags.syn && !p.tcp?.flags.ack) synCount++;
      if (p.tcp?.flags.ack) ackCount++;
      if (p.length > 1500) largePacketCount++;
      if (p.protocol === 'DNS' && p.dns?.answerCount === 0) dnsQueryCount++;
    });

    if (synCount > 10 && ackCount < synCount * 0.5) {
      h.push({
        type: 'warning',
        title: 'High SYN to ACK Ratio',
        desc: 'A large number of TCP SYN packets were seen compared to ACKs. This can sometimes indicate a port scan or SYN flood attempt, but verify the context.'
      });
    }

    if (largePacketCount > packets.length * 0.2 && packets.length > 10) {
      h.push({
        type: 'info',
        title: 'Large Packet Volumes',
        desc: 'Over 20% of packets in this dataset are larger than 1500 bytes. This often happens with data exfiltration, large file transfers, or jumbo frames.'
      });
    }

    if (dnsQueryCount > 50) {
       h.push({
        type: 'info',
        title: 'DNS Query Burst',
        desc: 'A significant burst of DNS queries without answers was detected. Check if this is normal application behavior or a potential misconfiguration.'
      });
    }

    // Handshake detection
    const synPackets = packets.filter(p => p.tcp?.flags.syn && !p.tcp?.flags.ack);
    if (synPackets.length > 0) {
      const synAck = packets.find(p => p.tcp?.flags.syn && p.tcp?.flags.ack);
      if (synAck) {
        const ack = packets.find(p => !p.tcp?.flags.syn && p.tcp?.flags.ack && p.tcp?.acknowledgmentNumber === synAck.tcp?.sequenceNumber! + 1);
        if (ack) {
          h.push({
            type: 'success',
            title: 'Complete TCP Handshake Found',
            desc: `A successful 3-way handshake was observed between ${synAck.destination} and ${synAck.source}.`
          });
        }
      } else {
        h.push({
          type: 'warning',
          title: 'Incomplete TCP Handshakes',
          desc: 'SYN packets were sent, but no returning SYN-ACK was captured in this dataset. The server might be down, firewalled, or the capture started late.'
        });
      }
    }

    return h;
  }, [packets]);

  if (hints.length === 0) return null;

  return (
    <Card className="bg-slate-900 border-slate-800 mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-400" /> Defensive Analysis
        </CardTitle>
        <CardDescription className="text-slate-400">
          Heuristic observations based on this dataset. These are not confirmed attacks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {hints.map((h, i) => (
            <div key={i} className={`p-4 rounded-lg border flex gap-3 ${
              h.type === 'warning' ? 'bg-amber-950/30 border-amber-900/50 text-amber-200' :
              h.type === 'info' ? 'bg-cyan-950/30 border-cyan-900/50 text-cyan-200' :
              'bg-emerald-950/30 border-emerald-900/50 text-emerald-200'
            }`}>
              <div className="shrink-0 mt-0.5">
                {h.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <Info className="w-5 h-5 text-cyan-500" />}
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">{h.title}</h4>
                <p className="text-xs opacity-80 leading-relaxed">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
