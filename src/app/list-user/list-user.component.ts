import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

interface User {
  name: string;
  email: string;
}

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [MatCardModule, MatTableModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss',
})
export class ListUserComponent {
  columnsToDisplay = ['name', 'email'];
  dataSource: User[] = [
    { name: 'User 1', email: 'user1@example.com' },
    { name: 'User 2', email: 'user2@example.com' },
  ];
}
