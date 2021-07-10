import { ChangeDetectionStrategy, Component } from '@angular/core';
import { effects$, state$ } from './store';

@Component({
  selector: 'benji-toolkit-root',
  template: `
    <div>
      <h1>From Reducer Angular Global Example</h1>
      <app-users></app-users>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor() {
    // subscribes when application starts
    // state$ is a multicaster
    state$.subscribe();
    effects$.subscribe();
  }
}
