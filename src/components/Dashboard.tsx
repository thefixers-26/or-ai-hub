import React, { useState } from 'react';
import { Sidebar } from './Layout/Sidebar';
import { Header } from './Layout/Header';
import { AIAssistant } from './AI/AIAssistant';
import { LinearProgrammingModule } from './Modules/LinearProgramming';
import { LPVisualization } from './Visualizations/LPVisualization';
import { ProblemType, LinearProgrammingProblem } from '../types';

export const Dashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ProblemType>('linear_programming');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<LinearProgrammingProblem | null>(null);
  const [projectName] = useState('Untitled Project');

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving project...');
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting project...');
  };

  const handleImport = () => {
    // Implement import functionality
    console.log('Importing project...');
  };

  const handleAIGeneratedProblem = (problem: any) => {
    if (problem && activeModule === 'linear_programming') {
      setCurrentProblem(problem);
    }
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'linear_programming':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <LinearProgrammingModule
                initialProblem={currentProblem || undefined}
                onProblemChange={setCurrentProblem}
              />
            </div>
            <div className="xl:col-span-1">
              {currentProblem && (
                <LPVisualization 
                  problem={currentProblem}
                  width={400}
                  height={300}
                />
              )}
            </div>
          </div>
        );
      
      case 'transportation':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Transportation Problem</h1>
              <p className="text-lg text-gray-600 mb-8">
                Optimize distribution and logistics using VAM and MODI methods.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">
                  Transportation module coming soon! Currently implementing advanced algorithms.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'network_flow':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Network Flow Analysis</h1>
              <p className="text-lg text-gray-600 mb-8">
                Solve shortest path, maximum flow, and minimum spanning tree problems.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">
                  Network analysis module coming soon! Including 3D visualizations.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'assignment':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Assignment Problem</h1>
              <p className="text-lg text-gray-600 mb-8">
                Optimal task and resource allocation using the Hungarian algorithm.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">
                  Assignment module coming soon! Interactive allocation matrices.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'game_theory':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Game Theory</h1>
              <p className="text-lg text-gray-600 mb-8">
                Strategic decision making and Nash equilibrium analysis.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">
                  Game theory module coming soon! Zero-sum and non-zero-sum games.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'queuing':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Queuing Theory</h1>
              <p className="text-lg text-gray-600 mb-8">
                Waiting line analysis and service optimization.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">
                  Queuing theory module coming soon! M/M/1, M/M/c, and M/G/1 models.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'project_management':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Management</h1>
              <p className="text-lg text-gray-600 mb-8">
                CPM, PERT, and resource planning optimization.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">
                  Project management module coming soon! Critical path analysis and Gantt charts.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Module not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeModule={activeModule} 
        onModuleChange={setActiveModule}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header
          projectName={projectName}
          onSave={handleSave}
          onExport={handleExport}
          onImport={handleImport}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderModule()}
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant
        visible={showAIAssistant}
        onToggle={() => setShowAIAssistant(!showAIAssistant)}
        onProblemGenerated={handleAIGeneratedProblem}
      />
    </div>
  );
};