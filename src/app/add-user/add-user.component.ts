import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  private _fb = inject(FormBuilder);
  private _notifier = inject(MatSnackBar);

  addForm = this._fb.group({
    name: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
  });

  addUser() {
    if (!this.addForm.valid) return;
    this._notifier.open($localize`User added`, $localize`Dismiss`, {
      duration: 5 * 1000,
    });
  }
}
