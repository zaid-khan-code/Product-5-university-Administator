import { useEffect } from 'react';

export function useSimulation(data, updateData) {
  useEffect(() => {
    const interval = setInterval(() => {
      updateData(prevData => {
        // Simulate live updates for equipment
        const updatedEquipment = prevData.equipment.map(eq => {
          if (eq.status === 'operating') {
            return {
              ...eq,
              hoursRunToday: eq.hoursRunToday + (1 / 60), // Add 1 minute
              fuelLevel: eq.fuelLevel !== null ? Math.max(0, eq.fuelLevel - Math.random() * 0.2) : null,
            };
          }
          return eq;
        });

        // Simulate some minor changes in overview
        const newProduction = prevData.overview.productionToday + Math.floor(Math.random() * 5);

        return {
          ...prevData,
          equipment: updatedEquipment,
          overview: {
            ...prevData.overview,
            productionToday: newProduction,
          }
        };
      });
    }, 5000); // update every 5 seconds for simulation purposes

    return () => clearInterval(interval);
  }, [updateData]);
}
