import { Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { userInfoStore } from "../userinfo.store";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [MatCardModule, MatListModule, MatButtonModule, MatIconModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  public user = inject(userInfoStore);
}
