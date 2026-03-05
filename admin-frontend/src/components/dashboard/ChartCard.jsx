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
    <div className="card-surface p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-slate-500">{description}</div>
          <div className="text-lg font-semibold text-slate-800">{title}</div>
        </div>
        <span className="pill bg-primary/10 text-primary">Live</span>
      </div>
      <div className="flex-1 min-h-[260px]">
        <ChartComponent data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartCard;
