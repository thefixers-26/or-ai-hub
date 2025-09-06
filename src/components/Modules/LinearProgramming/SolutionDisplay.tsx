import React, { useState } from 'react';
import { 
  CheckCircle, 
  TrendingUp, 
  BarChart3, 
  Target,
  Clock,
  Zap,
  AlertTriangle,
  Info,
  Download
} from 'lucide-react';
import { Solution, AIInsight } from '../../../types';

interface SolutionDisplayProps {
  solution: Solution;
  insights: AIInsight[];
  onExport: () => void;
}

export const SolutionDisplay: React.FC<SolutionDisplayProps> = ({
  solution,
  insights,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState<'solution' | 'sensitivity' | 'insights'>('solution');

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'interpretation': return <Info className="w-4 h-4 text-blue-600" />;
      case 'recommendation': return <Zap className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'optimization': return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getInsightBorderColor = (type: string) => {
    switch (type) {
      case 'interpretation': return 'border-l-blue-500 bg-blue-50';
      case 'recommendation': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'optimization': return 'border-l-purple-500 bg-purple-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const tabs = [
    { id: 'solution', name: 'Solution', icon: Target },
    { id: 'sensitivity', name: 'Sensitivity', icon: BarChart3 },
    { id: 'insights', name: 'AI Insights', icon: Zap }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Problem Solved</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{solution.execution_time.toFixed(0)}ms</span>
                </div>
                {solution.iterations && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{solution.iterations} iterations</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Results</span>
          </button>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Optimal Value</p>
            <p className="text-3xl font-bold text-green-700">
              {solution.optimal_value.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  {tab.id === 'insights' && insights.length > 0 && (
                    <span className="bg-red-100 text-red-600 text-xs rounded-full px-2 py-0.5 ml-1">
                      {insights.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'solution' && (
            <div className="space-y-6">
              {/* Optimal Solution */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Optimal Solution</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {solution.variables.map((variable, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">{variable.name}</p>
                      <p className="text-xl font-bold text-gray-900">
                        {variable.value.toFixed(3)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slack Variables */}
              {solution.slack_variables && solution.slack_variables.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Slack Variables</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {solution.slack_variables.map((slack, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-blue-600 mb-1">s{index + 1}</p>
                        <p className="text-xl font-bold text-blue-700">
                          {slack.toFixed(3)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shadow Prices */}
              {solution.shadow_prices && solution.shadow_prices.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Shadow Prices</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {solution.shadow_prices.map((price, index) => (
                      <div key={index} className="bg-purple-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-purple-600 mb-1">π{index + 1}</p>
                        <p className="text-xl font-bold text-purple-700">
                          {price.toFixed(3)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sensitivity' && solution.sensitivity_analysis && (
            <div className="space-y-6">
              {/* Coefficient Ranges */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Coefficient Ranges</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Variable</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Minimum</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Maximum</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {solution.sensitivity_analysis.coefficient_ranges.map((range, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{range.variable}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{range.min.toFixed(3)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{range.max.toFixed(3)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{(range.max - range.min).toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RHS Ranges */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">RHS Ranges</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Constraint</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Minimum</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Maximum</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {solution.sensitivity_analysis.rhs_ranges.map((range, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{range.constraint}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{range.min.toFixed(3)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{range.max.toFixed(3)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{(range.max - range.min).toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Binding Constraints */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Binding Constraints</h4>
                <div className="flex flex-wrap gap-2">
                  {solution.sensitivity_analysis.binding_constraints.map((constraint, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                    >
                      {constraint}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={`border-l-4 p-4 rounded-lg ${getInsightBorderColor(insight.type)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {insight.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(insight.confidence * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {insight.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Zap className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-sm">No insights available yet</p>
                  <p className="text-xs mt-1">AI insights will appear here after solving</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};