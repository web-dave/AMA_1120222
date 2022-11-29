import { Component, inject } from '@angular/core';
import { DataService } from './data.service';
import { WaschbenzinDataService } from './waschbenzin.ihm.sein.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data$ = inject(DataService).data$$;
  waschbenzin$ = inject(WaschbenzinDataService).getData();
}
