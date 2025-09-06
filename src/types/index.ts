export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  type: ProblemType;
  data: any;
  solution?: Solution;
  visualizations?: any;
  created_at: string;
  updated_at: string;
}

export type ProblemType = 
  | 'linear_programming' 
  | 'integer_programming'
  | 'transportation'
  | 'assignment'
  | 'network_flow'
  | 'game_theory'
  | 'queuing'
  | 'project_management';

export interface LinearProgrammingProblem {
  objective: {
    type: 'maximize' | 'minimize';
    coefficients: number[];
    variables: string[];
  };
  constraints: Constraint[];
  bounds?: Bound[];
}

export interface Constraint {
  coefficients: number[];
  operator: '<=' | '>=' | '=';
  rhs: number;
  name?: string;
}

export interface Bound {
  variable: string;
  type: '>=' | '<=' | '=';
  value: number;
}

export interface Solution {
  optimal_value: number;
  optimal_solution: number[];
  variables: { name: string; value: number }[];
  slack_variables?: number[];
  shadow_prices?: number[];
  sensitivity_analysis?: SensitivityAnalysis;
  success: boolean;
  iterations?: number;
  execution_time: number;
}

export interface SensitivityAnalysis {
  coefficient_ranges: { variable: string; min: number; max: number }[];
  rhs_ranges: { constraint: string; min: number; max: number }[];
  binding_constraints: string[];
}

export interface AIInsight {
  type: 'interpretation' | 'recommendation' | 'warning' | 'optimization';
  content: string;
  confidence: number;
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface NetworkNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  z?: number;
  color?: string;
  size?: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  capacity?: number;
  flow?: number;
  color?: string;
}

export interface TransportationProblem {
  supply: number[];
  demand: number[];
  costs: number[][];
  supply_names?: string[];
  demand_names?: string[];
}

export interface GameTheoryProblem {
  type: 'zero_sum' | 'non_zero_sum';
  payoff_matrix: number[][];
  player1_strategies: string[];
  player2_strategies: string[];
}

export interface QueuingProblem {
  type: 'mm1' | 'mmc' | 'mg1';
  arrival_rate: number;
  service_rate: number;
  servers?: number;
  capacity?: number;
}

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
}