import React from 'react';
import { Calculator, Truck, Network, Users, TowerControl as GameController2, Clock, Calendar, BarChart3 } from 'lucide-react';
import { ModuleConfig, ProblemType } from '../../types';

interface SidebarProps {
  activeModule: ProblemType;
  onModuleChange: (module: ProblemType) => void;
}

const modules: ModuleConfig[] = [
  {
    id: 'linear_programming',
    name: 'Linear Programming',
    description: 'Optimize linear objectives with constraints',
    icon: 'Calculator',
    color: 'bg-blue-500',
    enabled: true
  },
  {
    id: 'transportation',
    name: 'Transportation',
    description: 'Optimize distribution and logistics',
    icon: 'Truck',
    color: 'bg-green-500',
    enabled: true
  },
  {
    id: 'network_flow',
    name: 'Network Analysis',
    description: 'Graph algorithms and network optimization',
    icon: 'Network',
    color: 'bg-purple-500',
    enabled: true
  },
  {
    id: 'assignment',
    name: 'Assignment',
    description: 'Optimal task and resource allocation',
    icon: 'Users',
    color: 'bg-orange-500',
    enabled: true
  },
  {
    id: 'game_theory',
    name: 'Game Theory',
    description: 'Strategic decision making and equilibrium',
    icon: 'GameController2',
    color: 'bg-red-500',
    enabled: true
  },
  {
    id: 'queuing',
    name: 'Queuing Theory',
    description: 'Waiting line and service optimization',
    icon: 'Clock',
    color: 'bg-teal-500',
    enabled: true
  },
  {
    id: 'project_management',
    name: 'Project Management',
    description: 'CPM, PERT, and resource planning',
    icon: 'Calendar',
    color: 'bg-indigo-500',
    enabled: true
  }
];

const iconMap = {
  Calculator,
  Truck,
  Network,
  Users,
  GameController2,
  Clock,
  Calendar,
  BarChart3
};

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  return (
    <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">OR-AI Hub</h1>
            <p className="text-sm text-gray-600">Operations Research Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            OR Modules
          </h2>
        </div>
        
        {modules.map((module) => {
          const IconComponent = iconMap[module.icon as keyof typeof iconMap] || Calculator;
          const isActive = activeModule === module.id;
          
          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id as ProblemType)}
              disabled={!module.enabled}
              className={`
                w-full text-left p-4 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md' 
                  : 'hover:bg-gray-50 border-2 border-transparent'
                }
                ${!module.enabled && 'opacity-50 cursor-not-allowed'}
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center transition-all
                  ${isActive 
                    ? `${module.color} shadow-lg` 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}>
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    font-semibold text-sm mb-1 transition-colors
                    ${isActive ? 'text-blue-900' : 'text-gray-900'}
                  `}>
                    {module.name}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">AI</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">AI Assistant Active</p>
            <p className="text-xs text-gray-600">Ready to help optimize</p>
          </div>
        </div>
      </div>
    </div>
  );
};