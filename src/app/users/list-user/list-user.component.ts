import { Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { usersStore } from "../users.store";

@Component({
  selector: "app-list-user",
  standalone: true,
  imports: [MatCardModule, MatTableModule],
  templateUrl: "./list-user.component.html",
  styleUrl: "./list-user.component.scss",
})
export class ListUserComponent {
  protected columnsToDisplay = ["name", "email"];

  protected users = inject(usersStore);
}
