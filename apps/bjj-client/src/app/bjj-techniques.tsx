import { GraphNode } from '@benji-toolkit/data-structures';
import { createEvent, createReducer } from '@benji-toolkit/reactive-actor';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import styled from 'styled-components';
import { environment } from '../environments/environment';
import { Results } from './results';
import { TechniqueVisualizer } from './technique-visualizer';
import {
  BaseState,
  D3GraphData,
  D3GraphNode,
  Technique,
  TechniqueGraph,
} from './types';

export const bjjApi = axios.create({
  baseURL: environment.API_URI,
});

export async function getBjjTechniques(): Promise<TechniqueGraph> {
  const { data } = await bjjApi.get<Record<string, GraphNode<Technique>>>(
    '/techniques'
  );

  return data;
}

export function graphDataParser(
  data: TechniqueGraph
): D3GraphData<D3GraphNode> {
  const techniques = Object.values(data);
  const nodes = techniques.map(({ name, value }) => ({
    id: name,
    data: value as Technique,
  }));

  const links = techniques.flatMap((node) =>
    node.adjacent.map((adjacent) => ({
      source: node.name,
      target: adjacent.name,
    }))
  );

  const graphData = {
    nodes,
    links,
  };

  return graphData;
}

export const getTechniques = createEvent('[Techniques] Get Techniques');

export const getTechniquesSuccess = createEvent<TechniqueGraph>(
  '[Techniques] Get Techniques Success'
);

export const getTechniquesFail = createEvent<string>(
  '[Techniques] Get Techniques Fail'
);

export const techniquesInitialState: BaseState<TechniqueGraph | null> = {
  data: null,
  loading: false,
  error: '',
};

export const techniquesReducer = createReducer(
  techniquesInitialState,
  (builder) =>
    builder
      .addCase(getTechniques, (state) => ({
        ...state,
        data: null,
        loading: true,
        error: '',
      }))
      .addCase(getTechniquesSuccess, (state, { payload }) => ({
        ...state,
        data: payload,
        loading: false,
        error: '',
      }))
      .addCase(getTechniquesFail, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
      }))
);

export function BJJTechniques() {
  const [{ data, loading, error }, dispatch] = useReducer(
    techniquesReducer,
    techniquesInitialState
  );

  const graphData = useMemo(
    () => (data ? graphDataParser(data) : null),
    [data]
  );

  const getTechniquesInit = useCallback(async () => {
    dispatch(getTechniques(null));
    try {
      const data = await getBjjTechniques();
      dispatch(getTechniquesSuccess(data));
    } catch (e) {
      dispatch(
        getTechniquesFail('Sorry there was an error please try again later')
      );
    }
  }, [dispatch]);

  useEffect(() => {
    getTechniquesInit();
  }, [getTechniquesInit]);

  return (
    <div>
      <Title>Bjj techniques</Title>

      <Results loading={loading} error={error}>
        {graphData && <TechniqueVisualizer data={graphData} />}
      </Results>
    </div>
  );
}

const Title = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;
