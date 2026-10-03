"use client";

import { usePacketStore } from "@/lib/store";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, ShieldAlert, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PacketInspector() {
  const { packets, selectedPacketId } = usePacketStore();

  if (!selectedPacketId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
        <ShieldAlert className="w-12 h-12 mb-4 text-slate-700 opacity-50" />
        <p className="text-sm">Select a packet from the table to inspect its contents.</p>
      </div>
    );
  }

  const packet = packets.find(p => p.id === selectedPacketId);
  if (!packet) return null;

  const FieldRow = ({ label, value, hint }: { label: string, value: string | number | undefined, hint?: string }) => {
    if (value === undefined) return null;
    return (
      <div className="flex justify-between py-1 border-b border-slate-800/50 last:border-0 group">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">{label}</span>
          {hint && (
            <div className="hidden group-hover:block absolute left-4 mt-8 bg-slate-800 p-2 text-xs rounded border border-slate-700 max-w-[250px] z-20 shadow-lg text-slate-200">
              <div className="flex items-center gap-1 mb-1 text-indigo-400"><BookOpen className="w-3 h-3"/> Explanation</div>
              {hint}
            </div>
          )}
        </div>
        <span className="text-xs font-mono text-slate-200">{value.toString()}</span>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-10 shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Packet {packet.packetNumber}</h3>
          <p className="text-xs text-slate-500">{packet.protocol} • {packet.length} bytes</p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200">
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion className="w-full">
            
            <AccordionItem value="frame" className="border-slate-800 border bg-slate-950 rounded-md mb-2 overflow-hidden px-1">
              <AccordionTrigger className="hover:no-underline py-2 px-3 text-xs font-semibold">
                Frame {packet.packetNumber}: {packet.length} bytes on wire
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <FieldRow label="Arrival Time" value={packet.timestamp} />
                <FieldRow label="Frame Length" value={packet.length} hint="Total size of the packet as captured on the wire." />
                <FieldRow label="Capture Length" value={packet.length} />
              </AccordionContent>
            </AccordionItem>

            {packet.ethernet && (
              <AccordionItem value="eth" className="border-slate-800 border bg-slate-950 rounded-md mb-2 overflow-hidden px-1">
                <AccordionTrigger className="hover:no-underline py-2 px-3 text-xs font-semibold">
                  Ethernet II, Src: {packet.ethernet.sourceMac}, Dst: {packet.ethernet.destinationMac}
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <FieldRow label="Destination" value={packet.ethernet.destinationMac} hint="The MAC address of the next hop on the local network." />
                  <FieldRow label="Source" value={packet.ethernet.sourceMac} hint="The MAC address of the sender on the local network." />
                  <FieldRow label="Type" value={packet.ethernet.etherType} />
                </AccordionContent>
              </AccordionItem>
            )}

            {packet.ip && (
              <AccordionItem value="ip" className="border-slate-800 border bg-slate-950 rounded-md mb-2 overflow-hidden px-1">
                <AccordionTrigger className="hover:no-underline py-2 px-3 text-xs font-semibold">
                  Internet Protocol {packet.ip.version}, Src: {packet.ip.sourceIp}, Dst: {packet.ip.destinationIp}
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <FieldRow label="Version" value={packet.ip.version} />
                  <FieldRow label="Source IP" value={packet.ip.sourceIp} hint="The original sender of the packet across the internet." />
                  <FieldRow label="Destination IP" value={packet.ip.destinationIp} hint="The final destination of the packet across the internet." />
                  <FieldRow label="Time to Live (TTL)" value={packet.ip.ttl} hint="Limits how many network hops an IP packet can make before being discarded." />
                  <FieldRow label="Protocol" value={packet.ip.protocol} />
                  <FieldRow label="Total Length" value={packet.ip.length} />
                </AccordionContent>
              </AccordionItem>
            )}

            {packet.tcp && (
              <AccordionItem value="tcp" className="border-slate-800 border bg-slate-950 rounded-md mb-2 overflow-hidden px-1">
                <AccordionTrigger className="hover:no-underline py-2 px-3 text-xs font-semibold">
                  Transmission Control Protocol, Src Port: {packet.tcp.sourcePort}, Dst Port: {packet.tcp.destinationPort}
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <FieldRow label="Source Port" value={packet.tcp.sourcePort} hint="Identifies the sending application/process." />
                  <FieldRow label="Destination Port" value={packet.tcp.destinationPort} hint="Identifies the receiving application/process." />
                  <FieldRow label="Sequence Number" value={packet.tcp.sequenceNumber} hint="Used to reconstruct fragmented data in the correct order." />
                  <FieldRow label="Acknowledgment Number" value={packet.tcp.acknowledgmentNumber} />
                  <FieldRow label="Window Size" value={packet.tcp.windowSize} />
                  
                  <div className="mt-2 text-xs text-slate-400 font-medium border-b border-slate-800/50 pb-1">Flags</div>
                  <div className="grid grid-cols-2 gap-x-4 pl-2">
                    <FieldRow label="SYN" value={packet.tcp.flags.syn ? 'Set (1)' : 'Not set (0)'} hint="Used to initiate a connection." />
                    <FieldRow label="ACK" value={packet.tcp.flags.ack ? 'Set (1)' : 'Not set (0)'} hint="Acknowledges received data." />
                    <FieldRow label="FIN" value={packet.tcp.flags.fin ? 'Set (1)' : 'Not set (0)'} hint="Used to elegantly close a connection." />
                    <FieldRow label="RST" value={packet.tcp.flags.rst ? 'Set (1)' : 'Not set (0)'} hint="Abruptly resets a connection." />
                    <FieldRow label="PSH" value={packet.tcp.flags.psh ? 'Set (1)' : 'Not set (0)'} />
                    <FieldRow label="URG" value={packet.tcp.flags.urg ? 'Set (1)' : 'Not set (0)'} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {packet.udp && (
              <AccordionItem value="udp" className="border-slate-800 border bg-slate-950 rounded-md mb-2 overflow-hidden px-1">
                <AccordionTrigger className="hover:no-underline py-2 px-3 text-xs font-semibold">
                  User Datagram Protocol, Src Port: {packet.udp.sourcePort}, Dst Port: {packet.udp.destinationPort}
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <FieldRow label="Source Port" value={packet.udp.sourcePort} />
                  <FieldRow label="Destination Port" value={packet.udp.destinationPort} />
                  <FieldRow label="Length" value={packet.udp.length} />
                </AccordionContent>
              </AccordionItem>
            )}

            {packet.dns && (
              <AccordionItem value="dns" className="border-slate-800 border bg-slate-950 rounded-md mb-2 overflow-hidden px-1">
                <AccordionTrigger className="hover:no-underline py-2 px-3 text-xs font-semibold">
                  Domain Name System (query)
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <FieldRow label="Transaction ID" value={packet.dns.transactionId} />
                  <FieldRow label="Query" value={packet.dns.query} hint="The domain name being resolved to an IP address." />
                  <FieldRow label="Query Type" value={packet.dns.queryType} />
                  {packet.dns.response && (
                    <FieldRow label="Response" value={packet.dns.response} hint="The resolved IP address." />
                  )}
                  <FieldRow label="Response Code" value={packet.dns.responseCode} />
                  <FieldRow label="Answers" value={packet.dns.answerCount} />
                </AccordionContent>
              </AccordionItem>
            )}

             {packet.http && (
              <AccordionItem value="http" className="border-slate-800 border bg-slate-950 rounded-md mb-2 overflow-hidden px-1">
                <AccordionTrigger className="hover:no-underline py-2 px-3 text-xs font-semibold">
                  Hypertext Transfer Protocol
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <FieldRow label="Method" value={packet.http.method} />
                  <FieldRow label="URI" value={packet.http.uri} />
                  <FieldRow label="Host" value={packet.http.host} />
                  <FieldRow label="Status Code" value={packet.http.statusCode} />
                </AccordionContent>
              </AccordionItem>
            )}

          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
