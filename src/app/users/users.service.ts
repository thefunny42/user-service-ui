import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { defer, map } from "rxjs";

export interface User {
  name: string;
  email: string;
}

export interface IdentifiedUser extends User {
  id: string;
}

interface IdentifiedUsers {
  users: IdentifiedUser[];
}

@Injectable({ providedIn: "root" })
export class UsersService {
  private http = inject(HttpClient);

  public users = defer(() =>
    this.http
      .get<IdentifiedUsers>("/api/users")
      .pipe(map((payload) => payload.users))
  );

  public addUser(user: User) {
    return this.http.post<IdentifiedUser>("/api/users", user);
  }
}
