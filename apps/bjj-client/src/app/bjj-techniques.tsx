import { createEvent, createReducer } from '@benji-toolkit/reactive-actor';
import axios from 'axios';
import { useCallback, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { environment } from '../environments/environment';
import { Results } from './results';
import { TechniqueVisualizer } from './technique-visualizer';

export const bjjApi = axios.create({
  baseURL: environment.API_URI,
});

export interface BaseState<T> {
  data: T;
  loading: boolean;
  error: string;
}

export async function getBjjTechniques() {
  const { data } = await bjjApi.get('/techniques');

  return data;
}

export const getTechniques = createEvent('[Techniques] Get Techniques');

export const getTechniquesSuccess = createEvent<any>(
  '[Techniques] Get Techniques Success'
);

export const getTechniquesFail = createEvent<string>(
  '[Techniques] Get Techniques Fail'
);

export const techniquesInitialState: BaseState<{} | null> = {
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
        {data && <TechniqueVisualizer data={data} />}
      </Results>
    </div>
  );
}

const Title = styled.div`
  text-align: center;
`;
