import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { usersStore } from "../users.store";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-list-user",
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: "./list-user.component.html",
  styleUrl: "./list-user.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUserComponent {
  protected columnsToDisplay = ["name", "email"];

  protected users = inject(usersStore);
}
