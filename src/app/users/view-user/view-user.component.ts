import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { usersStore } from "../users.store";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-view-user",
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: "./view-user.component.html",
  styleUrl: "./view-user.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewUserComponent {
  public userId = input.required<string>();

  protected users = inject(usersStore);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  protected user = computed(() => this.users.entityMap()[this.userId()]);

  protected removeUser() {
    this.users.remove(this.user()).subscribe({
      next: () => {
        this.snack.open($localize`User deleted`, $localize`Dismiss`, {
          duration: 5 * 1000,
        });
        this.router.navigate(["list"]);
      },
      error: () => {
        this.snack.open($localize`Could not delete user`, $localize`Dismiss`, {
          duration: 5 * 1000,
        });
      },
    });
  }
}
