import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'benji-toolkit-root',
  template: `
    <div>
      <h1>
        From Reducer Angular Local Example No Change Detection And Zone js
      </h1>
      <app-users></app-users>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
