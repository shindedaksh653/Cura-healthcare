import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Vitals {
  heartRate: number | null;
  bloodPressure: string | null;
  spO2: number | null;
}

interface HardwareContextType {
  isConnected: boolean;
  isConnecting: boolean;
  vitals: Vitals;
  connectToBand: () => Promise<void>;
  disconnect: () => void;
}

const HardwareContext = createContext<HardwareContextType | undefined>(undefined);

export function HardwareProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: null,
    bloodPressure: null,
    spO2: null,
  });

  const connectToBand = async () => {
    if (!navigator.bluetooth) {
      alert("Web Bluetooth API is not available in this browser/environment.");
      return;
    }

    try {
      setIsConnecting(true);
      // Standard Heart Rate Service (0x180D)
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service']
      });

      const server = await device.gatt?.connect();
      if (!server) throw new Error("Could not connect to GATT Server");

      setIsConnected(true);

      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');
      
      await characteristic.startNotifications();
      
      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        const flags = value.getUint8(0);
        const rate16Bits = flags & 0x1;
        
        let currentHeartRate;
        if (rate16Bits) {
          currentHeartRate = value.getUint16(1, /*littleEndian=*/true);
        } else {
          currentHeartRate = value.getUint8(1);
        }
        
        setVitals(prev => ({
          ...prev,
          heartRate: currentHeartRate,
          // Simulating BP and SpO2 for demonstration alongside HR
          bloodPressure: '120/80',
          spO2: 98
        }));
      });

      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setVitals({ heartRate: null, bloodPressure: null, spO2: null });
      });

    } catch (error) {
      console.error("Bluetooth connection error:", error);
      alert("Failed to connect to the smart band.");
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setVitals({ heartRate: null, bloodPressure: null, spO2: null });
  };

  return (
    <HardwareContext.Provider value={{ isConnected, isConnecting, vitals, connectToBand, disconnect }}>
      {children}
    </HardwareContext.Provider>
  );
}

export function useHardware() {
  const context = useContext(HardwareContext);
  if (!context) {
    throw new Error('useHardware must be used within a HardwareProvider');
  }
  return context;
}
