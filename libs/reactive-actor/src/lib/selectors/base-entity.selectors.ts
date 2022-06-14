import { createSelector } from '@reduxjs/toolkit';
import { BaseEntityState } from '../interfaces';
import { prop } from '../util';

export function createBaseEntitySelectors() {
  const selectState = (state: BaseEntityState) => state;
  const selectLoading = createSelector(selectState, prop('loading'));
  const selectLoaded = createSelector(selectState, prop('loaded'));
  const selectError = createSelector(selectState, prop('error'));
  return { selectLoading, selectLoaded, selectError };
}
