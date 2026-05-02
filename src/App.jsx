import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { useDataStore } from './hooks/useDataStore';
import { useSimulation } from './hooks/useSimulation';
import { OperationsOverview } from './components/OperationsOverview';
import { Equipment } from './components/Equipment';
import { Production } from './components/Production';
import { Workforce } from './components/Workforce';
import { Safety } from './components/Safety';
import { Geology } from './components/Geology';
import { Maintenance } from './components/Maintenance';
import { Environmental } from './components/Environmental';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, updateData] = useDataStore();

  useSimulation(data, updateData);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OperationsOverview data={data} />;
      case 'equipment':
        return <Equipment data={data} />;
      case 'production':
        return <Production data={data} />;
      case 'workforce':
        return <Workforce data={data} />;
      case 'safety':
        return <Safety data={data} />;
      case 'geology':
        return <Geology data={data} />;
      case 'maintenance':
        return <Maintenance data={data} />;
      case 'environmental':
        return <Environmental data={data} />;
      default:
        return <OperationsOverview data={data} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
