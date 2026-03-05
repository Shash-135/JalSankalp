export const stats = {
  totalPumps: 128,
  activePumps: 116,
  inactivePumps: 12,
  pendingComplaints: 18,
  resolvedComplaints: 342,
};

export const pumps = [
  { id: 'P-001', name: 'Village Center', location: 'Ward 3', status: 'Active', uptime: '98%' },
  { id: 'P-014', name: 'River Bend', location: 'Ward 5', status: 'Active', uptime: '96%' },
  { id: 'P-027', name: 'Hilltop', location: 'Ward 2', status: 'Inactive', uptime: '82%' },
  { id: 'P-031', name: 'School Lane', location: 'Ward 1', status: 'Active', uptime: '99%' },
  { id: 'P-045', name: 'Market Yard', location: 'Ward 4', status: 'Pending', uptime: '90%' },
];

export const operators = [
  { id: 'OP-12', name: 'Sunita Devi', shift: '06:00 - 14:00', status: 'Active', region: 'North' },
  { id: 'OP-31', name: 'Rakesh Yadav', shift: '14:00 - 22:00', status: 'Active', region: 'Central' },
  { id: 'OP-07', name: 'Meera Kumari', shift: '22:00 - 06:00', status: 'Pending', region: 'South' },
  { id: 'OP-18', name: 'Ajay Singh', shift: '14:00 - 22:00', status: 'Active', region: 'East' },
];

export const complaints = [
  { id: 'C-1021', subject: 'Low pressure', village: 'Ward 2', status: 'Pending', logged: 'Today 09:12' },
  { id: 'C-0975', subject: 'Motor noise', village: 'Ward 4', status: 'Resolved', logged: 'Yesterday' },
  { id: 'C-0994', subject: 'No water', village: 'Ward 1', status: 'Escalated', logged: '2 days ago' },
  { id: 'C-1025', subject: 'Leak detected', village: 'Ward 5', status: 'Pending', logged: 'Today 07:40' },
];

export const usageChart = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Daily Pump Usage (kL)',
      data: [320, 410, 365, 450, 390, 420, 398],
      backgroundColor: '#1e3a8a',
      borderRadius: 12,
    },
  ],
};

export const complaintDistribution = {
  labels: ['Low Pressure', 'No Supply', 'Leak', 'Quality', 'Motor Issue'],
  datasets: [
    {
      label: 'Complaints',
      data: [32, 18, 12, 9, 15],
      backgroundColor: ['#1e3a8a', '#0f766e', '#38bdf8', '#f59e0b', '#ef4444'],
      borderWidth: 0,
    },
  ],
};
