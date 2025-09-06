import React, { useRef, useEffect } from 'react';
import { LinearProgrammingProblem, Solution } from '../../types';

interface LPVisualizationProps {
  problem: LinearProgrammingProblem;
  solution?: Solution;
  width?: number;
  height?: number;
}

export const LPVisualization: React.FC<LPVisualizationProps> = ({
  problem,
  solution,
  width = 500,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Only visualize 2-variable problems
    if (problem.objective.variables.length !== 2) {
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Visualization available for 2-variable problems only', width / 2, height / 2);
      return;
    }

    // Set up coordinate system
    const padding = 50;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const maxX = 10;
    const maxY = 10;

    // Helper function to convert problem coordinates to canvas coordinates
    const toCanvas = (x: number, y: number) => ({
      x: padding + (x / maxX) * chartWidth,
      y: height - padding - (y / maxY) * chartHeight
    });

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(problem.objective.variables[0], width - 25, height - 25);
    ctx.save();
    ctx.translate(25, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(problem.objective.variables[1], 0, 0);
    ctx.restore();

    // Draw grid
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    for (let i = 0; i <= maxX; i++) {
      const x = padding + (i / maxX) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      
      if (i % 2 === 0) {
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText(i.toString(), x, height - padding + 15);
      }
    }
    
    for (let i = 0; i <= maxY; i++) {
      const y = height - padding - (i / maxY) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      if (i % 2 === 0) {
        ctx.fillStyle = '#666';
        ctx.textAlign = 'right';
        ctx.fillText(i.toString(), padding - 10, y + 4);
      }
    }

    // Draw feasible region
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;

    // Calculate feasible region vertices
    const feasiblePoints: Array<{ x: number; y: number }> = [];
    
    // Add origin if feasible
    if (problem.bounds?.every(bound => bound.value <= 0 || bound.type === '>=')) {
      feasiblePoints.push({ x: 0, y: 0 });
    }

    // Add intercepts for each constraint
    problem.constraints.forEach(constraint => {
      const [a, b] = constraint.coefficients;
      const c = constraint.rhs;
      
      // x-intercept (when y = 0)
      if (a !== 0) {
        const x = c / a;
        if (x >= 0 && x <= maxX) {
          feasiblePoints.push({ x, y: 0 });
        }
      }
      
      // y-intercept (when x = 0)
      if (b !== 0) {
        const y = c / b;
        if (y >= 0 && y <= maxY) {
          feasiblePoints.push({ x: 0, y });
        }
      }
    });

    // Find intersection points
    for (let i = 0; i < problem.constraints.length; i++) {
      for (let j = i + 1; j < problem.constraints.length; j++) {
        const c1 = problem.constraints[i];
        const c2 = problem.constraints[j];
        
        const det = c1.coefficients[0] * c2.coefficients[1] - c1.coefficients[1] * c2.coefficients[0];
        if (Math.abs(det) > 1e-10) {
          const x = (c1.rhs * c2.coefficients[1] - c2.rhs * c1.coefficients[1]) / det;
          const y = (c1.coefficients[0] * c2.rhs - c2.coefficients[0] * c1.rhs) / det;
          
          if (x >= 0 && y >= 0 && x <= maxX && y <= maxY) {
            // Check if point satisfies all constraints
            const satisfiesAll = problem.constraints.every(constraint => {
              const lhs = constraint.coefficients[0] * x + constraint.coefficients[1] * y;
              return constraint.operator === '<=' ? lhs <= constraint.rhs + 1e-10 : 
                     constraint.operator === '>=' ? lhs >= constraint.rhs - 1e-10 : 
                     Math.abs(lhs - constraint.rhs) < 1e-10;
            });
            
            if (satisfiesAll) {
              feasiblePoints.push({ x, y });
            }
          }
        }
      }
    }

    // Remove duplicate points and sort
    const uniquePoints = feasiblePoints.filter((point, index, arr) => 
      index === arr.findIndex(p => Math.abs(p.x - point.x) < 1e-10 && Math.abs(p.y - point.y) < 1e-10)
    );

    // Sort points by angle from centroid for proper polygon drawing
    if (uniquePoints.length > 2) {
      const centroid = uniquePoints.reduce(
        (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }), 
        { x: 0, y: 0 }
      );
      centroid.x /= uniquePoints.length;
      centroid.y /= uniquePoints.length;

      uniquePoints.sort((a, b) => {
        const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
        const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
        return angleA - angleB;
      });

      // Draw feasible region
      ctx.beginPath();
      const firstPoint = toCanvas(uniquePoints[0].x, uniquePoints[0].y);
      ctx.moveTo(firstPoint.x, firstPoint.y);
      
      for (let i = 1; i < uniquePoints.length; i++) {
        const point = toCanvas(uniquePoints[i].x, uniquePoints[i].y);
        ctx.lineTo(point.x, point.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw constraint lines
    problem.constraints.forEach((constraint, index) => {
      const colors = ['#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
      ctx.strokeStyle = colors[index % colors.length];
      ctx.lineWidth = 2;
      
      const [a, b] = constraint.coefficients;
      const c = constraint.rhs;
      
      ctx.beginPath();
      if (Math.abs(b) > 1e-10) {
        // Not vertical line
        const y1 = c / b;
        const y2 = (c - a * maxX) / b;
        const start = toCanvas(0, y1);
        const end = toCanvas(maxX, y2);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
      } else if (Math.abs(a) > 1e-10) {
        // Vertical line
        const x = c / a;
        const start = toCanvas(x, 0);
        const end = toCanvas(x, maxY);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
      }
      ctx.stroke();
    });

    // Draw optimal point if solution exists
    if (solution && solution.optimal_solution.length === 2) {
      const [x, y] = solution.optimal_solution;
      if (x <= maxX && y <= maxY) {
        const point = toCanvas(x, y);
        
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Label the optimal point
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Optimal: (${x.toFixed(2)}, ${y.toFixed(2)})`, point.x + 10, point.y - 10);
      }
    }

    // Draw objective function iso-lines
    if (solution) {
      const [c1, c2] = problem.objective.coefficients;
      const optimalValue = solution.optimal_value;
      
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      for (let k = 0.2; k <= 1.2; k += 0.2) {
        const value = optimalValue * k;
        if (Math.abs(c2) > 1e-10) {
          const y1 = value / c2;
          const y2 = (value - c1 * maxX) / c2;
          if (y1 >= 0 && y1 <= maxY || y2 >= 0 && y2 <= maxY) {
            const start = toCanvas(0, y1);
            const end = toCanvas(maxX, y2);
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);
    }

  }, [problem, solution, width, height]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Feasible Region Visualization</h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border border-gray-200 rounded-lg"
        />
      </div>
      {problem.objective.variables.length !== 2 && (
        <p className="text-sm text-gray-600 text-center mt-4">
          Graphical visualization is available for 2-variable problems only.
        </p>
      )}
    </div>
  );
};