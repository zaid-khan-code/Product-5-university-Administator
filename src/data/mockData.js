export const initialData = {
  overview: {
    productionToday: 12450,
    targetToday: 15000,
    equipmentUtilization: 85,
    activeWorkforce: 142,
    safetyIncidentsThisMonth: 2,
    oreGrade: 1.45, // Copper percentage
  },
  equipment: Array.from({ length: 20 }, (_, i) => {
    const types = ['Drill Rig', 'Loader', 'Haul Truck', 'Conveyor'];
    const type = types[i % types.length];
    const statuses = ['operating', 'operating', 'operating', 'idle', 'maintenance', 'breakdown'];

    return {
      id: `EQ-${1000 + i}`,
      type,
      model: `${type.split(' ')[0]} X-${Math.floor(Math.random() * 100)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      location: `Zone ${String.fromCharCode(65 + (i % 4))}-${Math.floor(Math.random() * 10) + 1}`,
      hoursRunToday: Math.floor(Math.random() * 12) + (Math.random() * 6),
      fuelLevel: type === 'Conveyor' ? null : Math.floor(Math.random() * 100), // %
      lastService: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    };
  }),
  production: {
    dailyLog: [
      { time: '06:00', tonnes: 1200, grade: 1.42, waste: 300, throughput: 1100 },
      { time: '08:00', tonnes: 2500, grade: 1.45, waste: 600, throughput: 2300 },
      { time: '10:00', tonnes: 3800, grade: 1.44, waste: 950, throughput: 3600 },
      { time: '12:00', tonnes: 5100, grade: 1.48, waste: 1200, throughput: 4900 },
      { time: '14:00', tonnes: 6400, grade: 1.46, waste: 1550, throughput: 6100 },
      { time: '16:00', tonnes: 7600, grade: 1.43, waste: 1800, throughput: 7400 },
      { time: '18:00', tonnes: 8900, grade: 1.45, waste: 2100, throughput: 8600 },
      { time: '20:00', tonnes: 10200, grade: 1.47, waste: 2400, throughput: 9900 },
      { time: '22:00', tonnes: 11500, grade: 1.44, waste: 2700, throughput: 11100 },
      { time: '00:00', tonnes: 12450, grade: 1.45, waste: 2950, throughput: 12100 }, // Current
    ],
    history3Months: [
      { month: 'Mar', production: 420000, target: 450000 },
      { month: 'Apr', production: 460000, target: 450000 },
      { month: 'May', production: 210000, target: 450000 }, // Current month partial
    ]
  },
  workforce: {
    shifts: ['Day', 'Night'],
    activeShift: 'Night',
    workersUnderground: [
      { id: 'W001', name: 'John Doe', role: 'Drill Operator', zone: 'Zone A-2', entryTime: '18:00' },
      { id: 'W002', name: 'Jane Smith', role: 'Loader Operator', zone: 'Zone B-4', entryTime: '18:15' },
      { id: 'W003', name: 'Mike Johnson', role: 'Truck Driver', zone: 'Zone C-1', entryTime: '18:30' },
      { id: 'W004', name: 'Sarah Williams', role: 'Shift Supervisor', zone: 'Zone A-2', entryTime: '17:45' },
      { id: 'W005', name: 'David Brown', role: 'Maintenance Tech', zone: 'Zone D-3', entryTime: '19:00' },
      // ... more workers can be simulated in the overview count
    ],
    handoverLog: [
      { shift: 'Day', date: '2023-05-15', note: 'Drill EQ-1004 needs bits replaced. Water pooling in Zone B-4.' },
      { shift: 'Night', date: '2023-05-14', note: 'Good shift. Reached target.' },
    ]
  },
  safety: {
    incidents: [
      { id: 'INC-001', date: '2023-05-02', type: 'Near Miss', location: 'Zone C-1', severity: 'Low', status: 'Closed' },
      { id: 'INC-002', date: '2023-05-10', type: 'Equipment Damage', location: 'Zone B-4', severity: 'Medium', status: 'Under Investigation' },
    ],
    observations: 45,
    trainingCompliance: {
      'Operations': 98,
      'Maintenance': 95,
      'Engineering': 100,
      'Geology': 100,
    }
  },
  geology: {
    drillHoles: [
      { id: 'DH-23-01', depth: 150, interval: '120-140m', assay: '1.8% Cu' },
      { id: 'DH-23-02', depth: 200, interval: '160-190m', assay: '2.1% Cu' },
      { id: 'DH-23-03', depth: 180, interval: '130-150m', assay: '1.5% Cu' },
      { id: 'DH-23-04', depth: 220, interval: '180-210m', assay: '1.9% Cu' },
    ],
    oreZones: [
      { zone: 'Zone A', status: 'Active Mining', grade: '1.5%', tonnageEst: '500k', confidence: 'High' },
      { zone: 'Zone B', status: 'Development', grade: '1.8%', tonnageEst: '800k', confidence: 'Medium' },
      { zone: 'Zone C', status: 'Exploration', grade: '2.1%', tonnageEst: '1.2M', confidence: 'Low' },
      { zone: 'Zone D', status: 'Depleted', grade: '0.8%', tonnageEst: '50k', confidence: 'High' },
    ]
  },
  maintenance: {
    workOrders: [
      { id: 'WO-801', equipment: 'EQ-1004', priority: 'High', technician: 'David Brown', estDowntime: '4 hrs', issue: 'Replace drill bits' },
      { id: 'WO-802', equipment: 'EQ-1012', priority: 'Medium', technician: 'Unassigned', estDowntime: '8 hrs', issue: 'Hydraulic leak' },
      { id: 'WO-803', equipment: 'EQ-1018', priority: 'Low', technician: 'Tom Wilson', estDowntime: '2 hrs', issue: 'PM Service' },
    ]
  },
  environmental: {
    dustMonitoring: [
      { location: 'Crusher', level: '45 µg/m³', status: 'Normal' },
      { location: 'Vent Shaft 1', level: '85 µg/m³', status: 'Warning' },
      { location: 'Camp', level: '12 µg/m³', status: 'Normal' },
    ],
    waterDischarge: {
      volumeToday: '4,500 kL',
      ph: 7.2,
      tss: '15 mg/L',
      status: 'Compliant'
    },
    wasteDump: {
      capacity: '85%',
      stability: 'Stable',
      lastSurvey: '2023-05-10'
    }
  }
};
