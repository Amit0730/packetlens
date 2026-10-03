import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Activity, Network, BookOpen, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-indigo-500" />
          <span className="font-bold text-xl tracking-tight">PacketLens</span>
        </div>
        <nav className="flex gap-6">
          <Link href="/analyzer" className="text-sm font-medium hover:text-indigo-400 transition-colors">Analyzer</Link>
          <Link href="/learning" className="text-sm font-medium hover:text-indigo-400 transition-colors">Learning Center</Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            See What's Actually Happening Inside a Network Packet.
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto">
            An interactive packet visualization and networking learning tool for developers and cybersecurity students. No backend required—your data stays in your browser.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/analyzer">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 h-12 text-lg w-full sm:w-auto">
                Open Analyzer
              </Button>
            </Link>
            <Link href="/learning">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 h-12 px-8 text-lg w-full sm:w-auto">
                Explore Networking
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-900 border-y border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Core Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Network className="h-8 w-8 text-cyan-500" />}
                title="Interactive Packet Inspection"
                description="Click on any packet to dive deep into Ethernet frames, IP headers, and TCP/UDP details in a clean, hierarchical view."
              />
              <FeatureCard 
                icon={<Activity className="h-8 w-8 text-indigo-500" />}
                title="TCP Handshake Visualization"
                description="Automatically identify and visualize SYN, SYN-ACK, and ACK sequences to understand how connections are established."
              />
              <FeatureCard 
                icon={<Shield className="h-8 w-8 text-rose-500" />}
                title="Defensive Analysis"
                description="Heuristic observations that highlight unusually large packets, weird ports, and unexpected protocol distributions."
              />
              <FeatureCard 
                icon={<Network className="h-8 w-8 text-emerald-500" />}
                title="Traffic Analytics"
                description="Beautiful charts breaking down protocol distribution, top IPs, and traffic volume over time."
              />
              <FeatureCard 
                icon={<BookOpen className="h-8 w-8 text-amber-500" />}
                title="Learning Center"
                description="Beginner-friendly explanations for every packet field. Understand the OSI model, DNS, and more."
              />
              <FeatureCard 
                icon={<Lock className="h-8 w-8 text-slate-400" />}
                title="Privacy First"
                description="All processing happens locally in your browser. Uploaded packet datasets are never sent to an external server."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 text-center border-t border-slate-800 text-slate-500 text-sm">
        <p>PacketLens — Educational Cybersecurity Tool</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="mb-4 bg-slate-900 w-16 h-16 rounded-lg flex items-center justify-center border border-slate-800">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}
