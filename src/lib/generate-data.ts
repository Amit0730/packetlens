import { Packet, Protocol } from './types';

export function generateSampleData(type: 'tcp' | 'udp' | 'dns' | 'http' | 'icmp'): Packet[] {
  const packets: Packet[] = [];
  const baseTime = Date.now() - 60000;

  const createBasePacket = (i: number): Partial<Packet> => ({
    id: `pkt-${Math.random().toString(36).substr(2, 9)}`,
    packetNumber: i,
    timestamp: new Date(baseTime + i * 15).toISOString(),
    ethernet: {
      sourceMac: '00:1A:2B:3C:4D:5E',
      destinationMac: '00:11:22:33:44:55',
      etherType: 'IPv4'
    },
    ip: {
      version: 'IPv4',
      sourceIp: '192.168.1.10',
      destinationIp: '142.250.190.46',
      ttl: 64,
      protocol: 'TCP',
      length: 60
    }
  });

  if (type === 'tcp') {
    // 3-way handshake + some data
    packets.push({
      ...(createBasePacket(1) as any),
      source: '192.168.1.10',
      destination: '142.250.190.46',
      protocol: 'TCP',
      sourcePort: 54321,
      destinationPort: 443,
      length: 60,
      info: '54321 > 443 [SYN] Seq=0 Win=65535 Len=0',
      tcp: {
        sourcePort: 54321,
        destinationPort: 443,
        sequenceNumber: 0,
        acknowledgmentNumber: 0,
        windowSize: 65535,
        flags: { syn: true, ack: false, fin: false, rst: false, psh: false, urg: false }
      }
    });

    packets.push({
      ...(createBasePacket(2) as any),
      source: '142.250.190.46',
      destination: '192.168.1.10',
      protocol: 'TCP',
      sourcePort: 443,
      destinationPort: 54321,
      length: 60,
      info: '443 > 54321 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0',
      ip: { ...createBasePacket(2).ip!, sourceIp: '142.250.190.46', destinationIp: '192.168.1.10' },
      tcp: {
        sourcePort: 443,
        destinationPort: 54321,
        sequenceNumber: 0,
        acknowledgmentNumber: 1,
        windowSize: 65535,
        flags: { syn: true, ack: true, fin: false, rst: false, psh: false, urg: false }
      }
    });

    packets.push({
      ...(createBasePacket(3) as any),
      source: '192.168.1.10',
      destination: '142.250.190.46',
      protocol: 'TCP',
      sourcePort: 54321,
      destinationPort: 443,
      length: 54,
      info: '54321 > 443 [ACK] Seq=1 Ack=1 Win=65535 Len=0',
      tcp: {
        sourcePort: 54321,
        destinationPort: 443,
        sequenceNumber: 1,
        acknowledgmentNumber: 1,
        windowSize: 65535,
        flags: { syn: false, ack: true, fin: false, rst: false, psh: false, urg: false }
      }
    });
    
    // Application Data
    packets.push({
      ...(createBasePacket(4) as any),
      source: '192.168.1.10',
      destination: '142.250.190.46',
      protocol: 'TLS',
      sourcePort: 54321,
      destinationPort: 443,
      length: 564,
      info: 'Client Hello',
      tcp: {
        sourcePort: 54321,
        destinationPort: 443,
        sequenceNumber: 1,
        acknowledgmentNumber: 1,
        windowSize: 65535,
        flags: { syn: false, ack: true, fin: false, rst: false, psh: true, urg: false }
      }
    });
  } else if (type === 'dns') {
    packets.push({
      ...(createBasePacket(1) as any),
      source: '192.168.1.10',
      destination: '8.8.8.8',
      protocol: 'DNS',
      sourcePort: 61234,
      destinationPort: 53,
      length: 74,
      info: 'Standard query 0x1234 A example.com',
      ip: { ...createBasePacket(1).ip!, destinationIp: '8.8.8.8', protocol: 'UDP' },
      udp: { sourcePort: 61234, destinationPort: 53, length: 40 },
      dns: { query: 'example.com', queryType: 'A', transactionId: '0x1234', responseCode: '', answerCount: 0 }
    });

    packets.push({
      ...(createBasePacket(2) as any),
      source: '8.8.8.8',
      destination: '192.168.1.10',
      protocol: 'DNS',
      sourcePort: 53,
      destinationPort: 61234,
      length: 90,
      info: 'Standard query response 0x1234 A example.com A 93.184.216.34',
      ip: { ...createBasePacket(2).ip!, sourceIp: '8.8.8.8', destinationIp: '192.168.1.10', protocol: 'UDP' },
      udp: { sourcePort: 53, destinationPort: 61234, length: 56 },
      dns: { query: 'example.com', response: '93.184.216.34', queryType: 'A', transactionId: '0x1234', responseCode: 'No error', answerCount: 1 }
    });
  } else if (type === 'http') {
     packets.push({
      ...(createBasePacket(1) as any),
      source: '192.168.1.10',
      destination: '93.184.216.34',
      protocol: 'HTTP',
      sourcePort: 51234,
      destinationPort: 80,
      length: 420,
      info: 'GET / HTTP/1.1',
      tcp: {
        sourcePort: 51234,
        destinationPort: 80,
        sequenceNumber: 1,
        acknowledgmentNumber: 1,
        windowSize: 65535,
        flags: { syn: false, ack: true, fin: false, rst: false, psh: true, urg: false }
      },
      http: { method: 'GET', uri: '/', host: 'example.com' }
    });
    packets.push({
      ...(createBasePacket(2) as any),
      source: '93.184.216.34',
      destination: '192.168.1.10',
      protocol: 'HTTP',
      sourcePort: 80,
      destinationPort: 51234,
      length: 1250,
      info: 'HTTP/1.1 200 OK  (text/html)',
      ip: { ...createBasePacket(2).ip!, sourceIp: '93.184.216.34', destinationIp: '192.168.1.10' },
      tcp: {
        sourcePort: 80,
        destinationPort: 51234,
        sequenceNumber: 1,
        acknowledgmentNumber: 421,
        windowSize: 65535,
        flags: { syn: false, ack: true, fin: false, rst: false, psh: true, urg: false }
      },
      http: { statusCode: 200 }
    });
  } else if (type === 'icmp') {
    packets.push({
      ...(createBasePacket(1) as any),
      source: '192.168.1.10',
      destination: '8.8.8.8',
      protocol: 'ICMP',
      length: 74,
      info: 'Echo (ping) request  id=0x0001, seq=1/256, ttl=64',
      ip: { ...createBasePacket(1).ip!, destinationIp: '8.8.8.8', protocol: 'ICMP' },
      icmp: { type: 8, code: 0 }
    });
    packets.push({
      ...(createBasePacket(2) as any),
      source: '8.8.8.8',
      destination: '192.168.1.10',
      protocol: 'ICMP',
      length: 74,
      info: 'Echo (ping) reply    id=0x0001, seq=1/256, ttl=119',
      ip: { ...createBasePacket(2).ip!, sourceIp: '8.8.8.8', destinationIp: '192.168.1.10', protocol: 'ICMP', ttl: 119 },
      icmp: { type: 0, code: 0 }
    });
  } else if (type === 'udp') {
    packets.push({
      ...(createBasePacket(1) as any),
      source: '192.168.1.10',
      destination: '10.0.0.5',
      protocol: 'UDP',
      sourcePort: 123,
      destinationPort: 123,
      length: 90,
      info: 'NTP client request',
      ip: { ...createBasePacket(1).ip!, destinationIp: '10.0.0.5', protocol: 'UDP' },
      udp: { sourcePort: 123, destinationPort: 123, length: 76 }
    });
  }

  return packets;
}
