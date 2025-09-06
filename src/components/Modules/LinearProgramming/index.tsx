import React, { useState, useEffect } from 'react';
import { ProblemInput } from './ProblemInput';
import { SolutionDisplay } from './SolutionDisplay';
import { LinearProgrammingProblem, Solution, AIInsight } from '../../../types';
import { solverService } from '../../../services/solverService';
import { aiService } from '../../../services/aiService';

interface LinearProgrammingModuleProps {
  onProblemChange?: (problem: LinearProgrammingProblem) => void;
  initialProblem?: LinearProgrammingProblem;
}

const defaultProblem: LinearProgrammingProblem = {
  objective: {
    type: 'maximize',
    coefficients: [3, 2],
    variables: ['x1', 'x2']
  },
  constraints: [
    {
      coefficients: [1, 1],
      operator: '<=',
      rhs: 4,
      name: 'Resource Constraint 1'
    },
    {
      coefficients: [2, 1],
      operator: '<=',
      rhs: 6,
      name: 'Resource Constraint 2'
    }
  ],
  bounds: [
    { variable: 'x1', type: '>=', value: 0 },
    { variable: 'x2', type: '>=', value: 0 }
  ]
};

export const LinearProgrammingModule: React.FC<LinearProgrammingModuleProps> = ({
  onProblemChange,
  initialProblem
}) => {
  const [problem, setProblem] = useState<LinearProgrammingProblem>(initialProblem || defaultProblem);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialProblem) {
      setProblem(initialProblem);
      setSolution(null);
      setInsights([]);
    }
  }, [initialProblem]);

  const handleProblemChange = (newProblem: LinearProgrammingProblem) => {
    setProblem(newProblem);
    onProblemChange?.(newProblem);
    // Clear previous solution when problem changes
    setSolution(null);
    setInsights([]);
  };

  const handleSolve = async () => {
    setIsLoading(true);
    setSolution(null);
    setInsights([]);

    try {
      // Solve the linear programming problem
      const result = await solverService.solveLinearProgramming(problem);
      setSolution(result);

      // Generate AI insights
      const aiInsights = await aiService.generateInsights(result, problem);
      setInsights(aiInsights);
    } catch (error) {
      console.error('Error solving problem:', error);
      // In a real app, you'd show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!solution) return;

    const exportData = {
      problem,
      solution,
      insights,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linear-programming-solution-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Linear Programming</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Optimize linear objectives subject to linear constraints using the simplex method and advanced techniques.
        </p>
      </div>

      <ProblemInput
        problem={problem}
        onChange={handleProblemChange}
        onSolve={handleSolve}
        isLoading={isLoading}
      />

      {solution && (
        <SolutionDisplay
          solution={solution}
          insights={insights}
          onExport={handleExport}
        />
      )}
    </div>
  );
};