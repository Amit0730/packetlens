import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LearningCenterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      <header className="h-14 border-b border-slate-800 flex items-center px-6 bg-slate-950">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-slate-200">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
        <div className="mx-auto font-bold text-lg text-slate-200 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> Learning Center
        </div>
        <div className="w-[120px]"></div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto p-6 w-full pb-20">
        
        <h1 className="text-3xl font-bold mb-2">Networking Concepts</h1>
        <p className="text-slate-400 mb-10">
          Understand the fundamentals of how computers communicate over a network.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" /> The Protocol Stack (OSI Model)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                Network communication is divided into layers. Each layer wraps the layer above it, adding its own headers (like putting a letter in an envelope, and then putting that envelope in a box).
              </p>
              <div className="flex flex-col gap-1 font-mono text-xs">
                <div className="bg-purple-950/50 border border-purple-900 p-2 rounded text-center text-purple-300">
                  Application (HTTP, DNS)
                </div>
                <div className="mx-auto w-px h-2 bg-slate-700"></div>
                <div className="bg-blue-950/50 border border-blue-900 p-2 rounded text-center text-blue-300">
                  Transport (TCP, UDP)
                </div>
                <div className="mx-auto w-px h-2 bg-slate-700"></div>
                <div className="bg-emerald-950/50 border border-emerald-900 p-2 rounded text-center text-emerald-300">
                  Network (IPv4, IPv6)
                </div>
                <div className="mx-auto w-px h-2 bg-slate-700"></div>
                <div className="bg-amber-950/50 border border-amber-900 p-2 rounded text-center text-amber-300">
                  Data Link (Ethernet)
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle>TCP 3-Way Handshake</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                Before sending data reliably, TCP requires both computers to agree to talk. This is the 3-way handshake.
              </p>
              <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs text-slate-400">
                <div className="flex justify-between mb-2">
                  <span className="text-indigo-400">Client</span>
                  <span className="text-indigo-400">Server</span>
                </div>
                <div className="relative h-20 w-full border-l border-r border-slate-700/50 mt-2">
                   <div className="absolute top-2 left-0 right-0 flex items-center justify-center">
                     <span className="bg-slate-950 px-2 text-[10px]">SYN (Seq=0) &rarr;</span>
                   </div>
                   <div className="absolute top-8 left-0 right-0 flex items-center justify-center">
                     <span className="bg-slate-950 px-2 text-[10px]">&larr; SYN-ACK (Seq=0, Ack=1)</span>
                   </div>
                   <div className="absolute top-14 left-0 right-0 flex items-center justify-center">
                     <span className="bg-slate-950 px-2 text-[10px]">ACK (Seq=1, Ack=1) &rarr;</span>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle>DNS: Domain Name System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                DNS translates human-readable domain names (like example.com) into IP addresses (like 93.184.216.34).
              </p>
              <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                <li><strong>A Record:</strong> Maps a domain to an IPv4 address.</li>
                <li><strong>AAAA Record:</strong> Maps a domain to an IPv6 address.</li>
                <li><strong>UDP Port 53:</strong> Standard port for DNS queries.</li>
              </ul>
            </CardContent>
          </Card>
          
           <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle>TCP Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                TCP uses flags in its header to manage the state of the connection.
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li><span className="font-mono text-xs bg-slate-800 px-1 rounded text-slate-200">SYN</span> Synchronize sequence numbers to initiate a connection.</li>
                <li><span className="font-mono text-xs bg-slate-800 px-1 rounded text-slate-200">ACK</span> Acknowledgment field is significant.</li>
                <li><span className="font-mono text-xs bg-slate-800 px-1 rounded text-slate-200">FIN</span> No more data from sender (close connection).</li>
                <li><span className="font-mono text-xs bg-slate-800 px-1 rounded text-slate-200">RST</span> Reset the connection (abort).</li>
                <li><span className="font-mono text-xs bg-slate-800 px-1 rounded text-slate-200">PSH</span> Push function (send data immediately).</li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
