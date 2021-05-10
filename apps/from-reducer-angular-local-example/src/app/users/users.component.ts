import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
} from '@angular/core';
import { fromReducer } from '@benji-toolkit/from-reducer';
import {
  getUsers,
  userEpics,
  usersInitialState,
  usersReducer,
} from '@benji-toolkit/users';
import { Subscription } from 'rxjs';

const [state$, dispatch, combineEpics] = fromReducer(
  usersReducer,
  usersInitialState
);

@Component({
  selector: 'app-users',
  template: `
    <div *ngIf="state$ | async as state">
      <pre>{{ state | json }}</pre>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements AfterViewInit, OnDestroy {
  readonly state$ = state$;

  private readonly subscription = new Subscription();

  ngAfterViewInit(): void {
    const effects$ = combineEpics(...userEpics);
    this.subscription.add(effects$.subscribe());
    dispatch(getUsers());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
