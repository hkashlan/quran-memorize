import { Routes } from '@angular/router';
import { QuranComponent } from './quran/quran.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'page/001',
    pathMatch: 'full'
  },
  {
    path: 'page/:pageNumber',
    component: QuranComponent
  }
];
