import React, { useState } from 'react';
import { Plus, Minus, Target, ArrowRight, HelpCircle } from 'lucide-react';
import { LinearProgrammingProblem, Constraint } from '../../../types';

interface ProblemInputProps {
  problem: LinearProgrammingProblem;
  onChange: (problem: LinearProgrammingProblem) => void;
  onSolve: () => void;
  isLoading: boolean;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({
  problem,
  onChange,
  onSolve,
  isLoading
}) => {
  const updateObjective = (field: string, value: any) => {
    onChange({
      ...problem,
      objective: { ...problem.objective, [field]: value }
    });
  };

  const addVariable = () => {
    const newIndex = problem.objective.variables.length + 1;
    onChange({
      ...problem,
      objective: {
        ...problem.objective,
        variables: [...problem.objective.variables, `x${newIndex}`],
        coefficients: [...problem.objective.coefficients, 0]
      },
      constraints: problem.constraints.map(constraint => ({
        ...constraint,
        coefficients: [...constraint.coefficients, 0]
      }))
    });
  };

  const removeVariable = (index: number) => {
    if (problem.objective.variables.length <= 2) return;
    
    onChange({
      ...problem,
      objective: {
        ...problem.objective,
        variables: problem.objective.variables.filter((_, i) => i !== index),
        coefficients: problem.objective.coefficients.filter((_, i) => i !== index)
      },
      constraints: problem.constraints.map(constraint => ({
        ...constraint,
        coefficients: constraint.coefficients.filter((_, i) => i !== index)
      }))
    });
  };

  const updateObjectiveCoefficient = (index: number, value: number) => {
    const newCoefficients = [...problem.objective.coefficients];
    newCoefficients[index] = value;
    updateObjective('coefficients', newCoefficients);
  };

  const addConstraint = () => {
    const newConstraint: Constraint = {
      coefficients: new Array(problem.objective.variables.length).fill(0),
      operator: '<=',
      rhs: 0,
      name: `Constraint ${problem.constraints.length + 1}`
    };
    
    onChange({
      ...problem,
      constraints: [...problem.constraints, newConstraint]
    });
  };

  const removeConstraint = (index: number) => {
    onChange({
      ...problem,
      constraints: problem.constraints.filter((_, i) => i !== index)
    });
  };

  const updateConstraint = (index: number, field: string, value: any) => {
    const newConstraints = [...problem.constraints];
    newConstraints[index] = { ...newConstraints[index], [field]: value };
    onChange({ ...problem, constraints: newConstraints });
  };

  const updateConstraintCoefficient = (constraintIndex: number, varIndex: number, value: number) => {
    const newConstraints = [...problem.constraints];
    const newCoefficients = [...newConstraints[constraintIndex].coefficients];
    newCoefficients[varIndex] = value;
    newConstraints[constraintIndex] = { ...newConstraints[constraintIndex], coefficients: newCoefficients };
    onChange({ ...problem, constraints: newConstraints });
  };

  return (
    <div className="space-y-8">
      {/* Objective Function */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Objective Function</h3>
            <p className="text-sm text-gray-600">Define what you want to optimize</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 w-20">Type:</label>
            <div className="flex space-x-3">
              {['maximize', 'minimize'].map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="objectiveType"
                    value={type}
                    checked={problem.objective.type === type}
                    onChange={(e) => updateObjective('type', e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Coefficients:</label>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {problem.objective.variables.map((variable, index) => (
                <div key={index} className="flex items-center space-x-1">
                  {index > 0 && <span className="text-gray-500">+</span>}
                  <input
                    type="number"
                    value={problem.objective.coefficients[index] || 0}
                    onChange={(e) => updateObjectiveCoefficient(index, parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                    placeholder="0"
                  />
                  <span className="text-sm text-gray-600">{variable}</span>
                  {problem.objective.variables.length > 2 && (
                    <button
                      onClick={() => removeVariable(index)}
                      className="p-1 text-red-500 hover:text-red-700 text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addVariable}
                className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Variable</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Constraints */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Constraints</h3>
              <p className="text-sm text-gray-600">Define the limitations and requirements</p>
            </div>
          </div>
          <button
            onClick={addConstraint}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Constraint</span>
          </button>
        </div>

        <div className="space-y-4">
          {problem.constraints.map((constraint, constraintIndex) => (
            <div key={constraintIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={constraint.name || ''}
                  onChange={(e) => updateConstraint(constraintIndex, 'name', e.target.value)}
                  className="text-sm font-medium bg-transparent border-none p-0 focus:ring-0"
                  placeholder={`Constraint ${constraintIndex + 1}`}
                />
                <button
                  onClick={() => removeConstraint(constraintIndex)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-2">
                {problem.objective.variables.map((variable, varIndex) => (
                  <div key={varIndex} className="flex items-center space-x-1">
                    {varIndex > 0 && <span className="text-gray-500">+</span>}
                    <input
                      type="number"
                      value={constraint.coefficients[varIndex] || 0}
                      onChange={(e) => updateConstraintCoefficient(constraintIndex, varIndex, parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                      placeholder="0"
                    />
                    <span className="text-sm text-gray-600">{variable}</span>
                  </div>
                ))}

                <select
                  value={constraint.operator}
                  onChange={(e) => updateConstraint(constraintIndex, 'operator', e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="<=">&le;</option>
                  <option value=">=">&ge;</option>
                  <option value="=">=</option>
                </select>

                <input
                  type="number"
                  value={constraint.rhs || 0}
                  onChange={(e) => updateConstraint(constraintIndex, 'rhs', parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                  placeholder="0"
                />
              </div>
            </div>
          ))}

          {problem.constraints.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No constraints added yet</p>
              <p className="text-xs mt-1">Click "Add Constraint" to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Solve Button */}
      <div className="flex justify-center">
        <button
          onClick={onSolve}
          disabled={isLoading || problem.constraints.length === 0}
          className={`
            flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200
            ${isLoading || problem.constraints.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:scale-105'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Solving...</span>
            </>
          ) : (
            <>
              <span>Solve Problem</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};