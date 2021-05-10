import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getRepositories } from '@benji-toolkit/repositories';
import { getUsers } from '@benji-toolkit/users';
import { dispatch, state$ } from '../store';

@Component({
  selector: 'app-users',
  template: `
    <div *ngIf="state$ | async as state">
      <pre>{{ state | json }}</pre>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  readonly state$ = state$;

  constructor() {
    dispatch(getUsers());
    dispatch(getRepositories());
  }
}
