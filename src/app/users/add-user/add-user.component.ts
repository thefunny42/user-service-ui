import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
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
import { Router } from "@angular/router";

@Component({
  selector: "app-add-user",
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./add-user.component.html",
  styleUrl: "./add-user.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent {
  private fb = inject(FormBuilder);
  private notifier = inject(MatSnackBar);
  private users = inject(usersStore);
  private router = inject(Router);
  private submitted = signal<boolean>(false);

  private effects = effect(() => {
    if (!this.submitted() || this.users.busy()) return;
    if (this.users.error()) {
      this.notifier.open($localize`Could not add user`, $localize`Dismiss`, {
        duration: 5 * 1000,
      });
    } else {
      this.notifier.open($localize`User added`, $localize`Dismiss`, {
        duration: 5 * 1000,
      });
      this.router.navigate(["list"]);
    }
  });

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
    if (!this.addForm.value) return;
    this.users.add(this.addForm.value as User);
    this.submitted.set(true);
  }
}
