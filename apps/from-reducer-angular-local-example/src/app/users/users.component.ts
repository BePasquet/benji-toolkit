import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  getUsers,
  UserActions,
  userEpics,
  usersInitialState,
  usersReducer,
  UsersState,
} from '@benji-toolkit/users';
import { fromReducer } from 'from-reducer';
import { Observable, Subscription, UnaryFunction } from 'rxjs';

@Component({
  selector: 'app-users',
  template: `
    <div>
      <button (click)="dispatch(actions.getUsers())">Refresh</button>
      <pre>{{ state$ | async | json }}</pre>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnDestroy {
  readonly state$: Observable<UsersState>;

  dispatch: UnaryFunction<UserActions, void>;

  actions = { getUsers } as const;

  private readonly subscription = new Subscription();

  constructor() {
    const [state$, dispatch, combineEpics] = fromReducer(
      usersReducer,
      usersInitialState
    );
    this.state$ = state$;
    this.dispatch = dispatch;
    const effects$ = combineEpics(...userEpics);

    // In case state changes before ui subscribes to state$ with async pipe
    this.subscription.add(this.state$.subscribe());
    this.subscription.add(effects$.subscribe());
    this.dispatch(getUsers());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
