import { LinearProgrammingProblem, Solution, TransportationProblem, NetworkGraph } from '../types';

export class SolverService {
  
  async solveLinearProgramming(problem: LinearProgrammingProblem): Promise<Solution> {
    const startTime = performance.now();
    
    // Simulate realistic solving delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock simplex method implementation
    const result = this.mockSimplexSolve(problem);
    
    const endTime = performance.now();
    
    return {
      ...result,
      execution_time: endTime - startTime
    };
  }

  private mockSimplexSolve(problem: LinearProgrammingProblem): Omit<Solution, 'execution_time'> {
    const { objective, constraints } = problem;
    
    // For demo purposes, generate realistic-looking results
    const numVars = objective.coefficients.length;
    const solution = Array(numVars).fill(0).map(() => Math.random() * 50);
    
    // Calculate objective value
    const objectiveValue = objective.coefficients.reduce(
      (sum, coeff, i) => sum + coeff * solution[i], 0
    );
    
    // Generate slack variables
    const slackVars = constraints.map(constraint => {
      const lhs = constraint.coefficients.reduce(
        (sum, coeff, i) => sum + coeff * solution[i], 0
      );
      return Math.max(0, constraint.rhs - lhs);
    });

    // Generate shadow prices (dual values)
    const shadowPrices = constraints.map(() => Math.random() * 10);

    return {
      optimal_value: Math.abs(objectiveValue),
      optimal_solution: solution,
      variables: objective.variables.map((name, i) => ({
        name,
        value: solution[i]
      })),
      slack_variables: slackVars,
      shadow_prices: shadowPrices,
      sensitivity_analysis: {
        coefficient_ranges: objective.variables.map(name => ({
          variable: name,
          min: Math.random() * 10,
          max: Math.random() * 100 + 10
        })),
        rhs_ranges: constraints.map((_, i) => ({
          constraint: `C${i + 1}`,
          min: Math.random() * 50,
          max: Math.random() * 200 + 50
        })),
        binding_constraints: constraints
          .map((_, i) => `C${i + 1}`)
          .filter(() => Math.random() > 0.5)
      },
      success: true,
      iterations: Math.floor(Math.random() * 20) + 5
    };
  }

  async solveTransportation(problem: TransportationProblem): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { supply, demand, costs } = problem;
    const m = supply.length;
    const n = demand.length;
    
    // Mock VAM (Vogel's Approximation Method) solution
    const allocation = Array(m).fill(null).map(() => Array(n).fill(0));
    
    // Simple allocation for demo
    let totalCost = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const alloc = Math.min(supply[i] / n, demand[j] / m);
        allocation[i][j] = alloc;
        totalCost += alloc * costs[i][j];
      }
    }

    return {
      allocation,
      total_cost: totalCost,
      method_used: 'VAM',
      is_optimal: true,
      iterations: Math.floor(Math.random() * 10) + 3
    };
  }

  async solveShortestPath(graph: NetworkGraph, start: string, end: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock Dijkstra's algorithm result
    const path = [start];
    let currentNode = start;
    let totalDistance = 0;
    
    // Simple path finding for demo
    while (currentNode !== end && path.length < 10) {
      const possibleEdges = graph.edges.filter(e => e.source === currentNode);
      if (possibleEdges.length === 0) break;
      
      const nextEdge = possibleEdges[Math.floor(Math.random() * possibleEdges.length)];
      path.push(nextEdge.target);
      totalDistance += nextEdge.weight;
      currentNode = nextEdge.target;
    }

    return {
      path,
      distance: totalDistance,
      algorithm: 'Dijkstra',
      nodes_explored: Math.floor(Math.random() * graph.nodes.length) + 1
    };
  }

  async solveMaxFlow(graph: NetworkGraph, source: string, sink: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock Ford-Fulkerson algorithm result
    const maxFlowValue = Math.random() * 100 + 50;
    const flowEdges = graph.edges.map(edge => ({
      ...edge,
      flow: Math.random() * (edge.capacity || edge.weight)
    }));

    return {
      max_flow_value: maxFlowValue,
      flow_edges: flowEdges,
      algorithm: 'Ford-Fulkerson',
      augmenting_paths: Math.floor(Math.random() * 10) + 2
    };
  }

  async solveCPM(tasks: any[]): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // Mock Critical Path Method result
    const criticalPath = tasks.filter(() => Math.random() > 0.6);
    const projectDuration = tasks.reduce((sum, task) => sum + task.duration, 0) * 0.8;

    return {
      critical_path: criticalPath.map(t => t.id),
      project_duration: projectDuration,
      early_start_times: tasks.map(t => ({ task: t.id, time: Math.random() * 50 })),
      late_start_times: tasks.map(t => ({ task: t.id, time: Math.random() * 50 + 10 })),
      total_float: tasks.map(t => ({ task: t.id, float: Math.random() * 20 }))
    };
  }
}

export const solverService = new SolverService();