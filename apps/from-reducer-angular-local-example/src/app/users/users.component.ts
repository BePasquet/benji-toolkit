import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  getUsers,
  userEpics,
  usersInitialState,
  usersReducer,
  UsersState,
} from '@benji-toolkit/users';
import { fromReducer } from 'from-reducer';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  template: `
    <div>
      <pre>{{ state$ | async | json }}</pre>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnDestroy {
  readonly state$: Observable<UsersState>;

  private readonly subscription = new Subscription();

  constructor() {
    const [state$, dispatch, combineEpics] = fromReducer(
      usersReducer,
      usersInitialState
    );
    this.state$ = state$;
    const effects$ = combineEpics(...userEpics);

    // In case state changes before ui subscribes to state$ with async pipe
    this.subscription.add(this.state$.subscribe());
    this.subscription.add(effects$.subscribe());
    dispatch(getUsers());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
