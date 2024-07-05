import { Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { ListUserComponent } from './list-user/list-user.component';

export const routes: Routes = [
  { path: 'add', component: AddUserComponent, title: 'Add user' },
  { path: 'list', component: ListUserComponent, title: 'List user' },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
];
