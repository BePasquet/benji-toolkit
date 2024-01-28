import { TechniqueGraph, bjjTechniquesGraph } from './bjj-data';

export async function getBjjTechniques(): Promise<TechniqueGraph> {
  return Promise.resolve(bjjTechniquesGraph);
}
