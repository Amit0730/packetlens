export type Protocol = 'TCP' | 'UDP' | 'ICMP' | 'DNS' | 'HTTP' | 'HTTPS' | 'TLS' | 'Ethernet' | 'IPv4' | 'IPv6';

export interface Packet {
  id: string; // Internal unique ID
  packetNumber: number;
  timestamp: string; // ISO 8601 string or readable time
  source: string; // IP or MAC
  destination: string; // IP or MAC
  protocol: Protocol;
  sourcePort?: number;
  destinationPort?: number;
  length: number; // in bytes
  info: string; // summary string
  
  // Layer 2
  ethernet?: {
    sourceMac: string;
    destinationMac: string;
    etherType: string;
  };

  // Layer 3
  ip?: {
    version: 'IPv4' | 'IPv6';
    sourceIp: string;
    destinationIp: string;
    ttl: number;
    protocol: string;
    length: number;
  };

  // Layer 4
  tcp?: {
    sourcePort: number;
    destinationPort: number;
    sequenceNumber: number;
    acknowledgmentNumber: number;
    windowSize: number;
    flags: {
      syn: boolean;
      ack: boolean;
      fin: boolean;
      rst: boolean;
      psh: boolean;
      urg: boolean;
    };
  };

  udp?: {
    sourcePort: number;
    destinationPort: number;
    length: number;
  };
  
  icmp?: {
    type: number;
    code: number;
  };

  // Layer 7
  dns?: {
    query: string;
    response?: string;
    transactionId: string;
    queryType: string;
    responseCode: string;
    answerCount: number;
  };

  http?: {
    method?: string;
    uri?: string;
    statusCode?: number;
    host?: string;
  };
}
