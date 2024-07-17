import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { usersStore } from "../users.store";
import { User } from "../users.service";
import { Router, RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-add-user",
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: "./add-user.component.html",
  styleUrl: "./add-user.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent {
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private users = inject(usersStore);
  private router = inject(Router);

  protected addForm = this.fb.group({
    name: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  protected addUser() {
    if (!this.addForm.valid) return;
    this.users.add(this.addForm.value as User).subscribe({
      next: () => {
        this.snack.open($localize`User added`, $localize`Dismiss`, {
          duration: 5 * 1000,
        });
        this.router.navigate(["list"]);
      },
      error: () => {
        this.snack.open($localize`Could not add user`, $localize`Dismiss`, {
          duration: 5 * 1000,
        });
      },
    });
  }
}
