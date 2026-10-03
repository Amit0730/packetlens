import { create } from 'zustand';
import { Packet } from './types';

interface PacketState {
  packets: Packet[];
  selectedPacketId: string | null;
  filterQuery: string;
  setPackets: (packets: Packet[]) => void;
  selectPacket: (id: string | null) => void;
  setFilterQuery: (query: string) => void;
}

export const usePacketStore = create<PacketState>((set) => ({
  packets: [],
  selectedPacketId: null,
  filterQuery: '',
  setPackets: (packets) => set({ packets, selectedPacketId: null }),
  selectPacket: (id) => set({ selectedPacketId: id }),
  setFilterQuery: (query) => set({ filterQuery: query })
}));
