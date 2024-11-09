import { Routes } from '@angular/router';
import { QuranComponent } from './quran/quran.component';

export const routes: Routes = [
  {
    path: 'page/:pageNumber',
    component: QuranComponent
  }
];
