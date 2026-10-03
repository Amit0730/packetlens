import Papa from 'papaparse';
import { Packet, Protocol } from './types';

export async function parseJsonPackets(file: File): Promise<Packet[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
          // Add simple validation
          const valid = data.every(p => p.id && p.timestamp && p.protocol);
          if (!valid) {
             console.warn("Some packets missing fields");
          }
          resolve(data as Packet[]);
        } else {
          reject(new Error("JSON must be an array of packets"));
        }
      } catch (err) {
        reject(new Error("Invalid JSON format"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export async function parseCsvPackets(file: File): Promise<Packet[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const packets: Packet[] = results.data.map((row: any, i) => {
            const getCol = (names: string[]) => {
              for (const name of names) {
                const key = Object.keys(row).find(k => k.toLowerCase() === name.toLowerCase());
                if (key) return row[key];
              }
              return undefined;
            };

            const timestamp = getCol(['timestamp', 'time', 'date']) || new Date().toISOString();
            const source = getCol(['source', 'src', 'source_ip']) || 'Unknown';
            const destination = getCol(['destination', 'dst', 'dest', 'destination_ip']) || 'Unknown';
            const protocolStr = getCol(['protocol', 'proto']) || 'Unknown';
            const length = parseInt(getCol(['length', 'len', 'size']) || '0');
            const info = getCol(['info', 'information', 'summary']) || '';
            const sport = parseInt(getCol(['source port', 'sport', 'srcport']) || '0') || undefined;
            const dport = parseInt(getCol(['destination port', 'dport', 'dstport']) || '0') || undefined;

            let protocol: Protocol = 'TCP';
            if (['TCP', 'UDP', 'ICMP', 'DNS', 'HTTP', 'HTTPS', 'TLS', 'IPv4', 'IPv6', 'Ethernet'].includes(protocolStr.toUpperCase())) {
              protocol = protocolStr.toUpperCase() as Protocol;
            }

            const p: Packet = {
              id: `csv-${i}-${Math.random().toString(36).substr(2, 9)}`,
              packetNumber: i + 1,
              timestamp,
              source,
              destination,
              protocol,
              length,
              info,
              sourcePort: sport,
              destinationPort: dport
            };

            if (protocol === 'TCP' && sport && dport) {
              p.tcp = {
                sourcePort: sport,
                destinationPort: dport,
                sequenceNumber: 0,
                acknowledgmentNumber: 0,
                windowSize: 0,
                flags: { syn: false, ack: false, fin: false, rst: false, psh: false, urg: false }
              };
            }

            return p;
          });
          resolve(packets);
        } catch (e) {
          reject(new Error("Failed to parse CSV rows into packets"));
        }
      },
      error: (error) => reject(error)
    });
  });
}
