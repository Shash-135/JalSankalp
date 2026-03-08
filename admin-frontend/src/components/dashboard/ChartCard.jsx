import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const ChartCard = ({ title, description, type = 'bar', data, options }) => {
  const ChartComponent = type === 'pie' ? Pie : Bar;
  return (
    <div className="card-surface p-6 h-full flex flex-col min-h-[350px]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[13px] font-medium text-slate-500 uppercase tracking-wider">{description}</div>
          <div className="text-lg font-semibold text-slate-800 leading-tight mt-1">{title}</div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wide">Live</span>
      </div>
      <div className="flex-1 min-h-[260px]">
        <ChartComponent data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartCard;
