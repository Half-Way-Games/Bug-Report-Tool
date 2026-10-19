import { Routes } from '@angular/router';
import {Dashboard} from './pages/dashboard/dashboard';
import {BugsList} from './pages/bugs-list/bugs-list';
import {BugsDetail} from './pages/bugs-detail/bugs-detail';

export const routes: Routes = [
  {path: '', component: Dashboard},
  {path: 'bugs', component: BugsList},
  {path: 'bugs/:id', component: BugsDetail}
];
