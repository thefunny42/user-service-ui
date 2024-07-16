import { Routes } from "@angular/router";
import { AddUserComponent } from "./users/add-user/add-user.component";
import { ListUserComponent } from "./users/list-user/list-user.component";
import { LoginComponent } from "./login/login.component";
import { loggedInGuard, loggedOutGuard } from "./userinfo.service";

export const routes: Routes = [
  {
    path: "add",
    component: AddUserComponent,
    title: "Add user",
    canMatch: [loggedInGuard],
  },
  {
    path: "list",
    component: ListUserComponent,
    title: "List user",
    canMatch: [loggedInGuard],
  },
  {
    path: "**",
    component: LoginComponent,
    canMatch: [loggedOutGuard],
  },
  {
    path: "**",
    redirectTo: "/list",
  },
];
