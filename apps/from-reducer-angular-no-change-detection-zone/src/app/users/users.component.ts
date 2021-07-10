import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import {
  getUsers,
  UserActions,
  userEpics,
  usersInitialState,
  usersReducer,
  UsersState,
} from '@benji-toolkit/users';
import { fromReducer } from 'from-reducer';
import {
  asyncScheduler,
  Observable,
  observeOn,
  Subscription,
  tap,
  UnaryFunction,
} from 'rxjs';

@Component({
  selector: 'app-users',
  template: `
    <div>
      <button (click)="dispatch(actions.getUsers())">Refresh</button>
      <pre>{{ state | json }}</pre>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnDestroy {
  readonly state$: Observable<UsersState>;

  // state to link to the template
  state: UsersState;

  dispatch: UnaryFunction<UserActions, void>;

  actions = { getUsers } as const;

  private readonly subscription = new Subscription();

  constructor(private readonly changeDetectionRef: ChangeDetectorRef) {
    const [state$, dispatch, combineEpics] = fromReducer(
      usersReducer,
      usersInitialState
    );
    // reference in componenent to be used in other methods when necessary
    this.state$ = state$;
    this.dispatch = dispatch;
    const effects$ = combineEpics(...userEpics);

    const render$ = this.state$.pipe(
      // pushes to the macro task queue to prevent template errors
      observeOn(asyncScheduler),
      tap((state) => this.render(state))
    );

    this.subscription.add(render$.subscribe());

    this.subscription.add(effects$.subscribe());
    this.dispatch(getUsers());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  render(state: UsersState): void {
    this.state = state;
    this.changeDetectionRef.detectChanges();
  }
}
