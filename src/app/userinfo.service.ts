import {
  HttpClient,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { firstValueFrom, map, mergeMap, Observable, shareReplay } from "rxjs";
import { cacheValue } from "./utils";
import { CanMatchFn } from "@angular/router";

type LoginMethod = "github" | "google";

export interface User {
  email: string;
  name: string;
  roles: string[];
  method: LoginMethod;
}

export interface UserInfo {
  user: User | null;
  available: LoginMethod[];
}

export interface Token {
  access_token: string;
  token_type: string;
  expire_in: number;
}

@Injectable({ providedIn: "root" })
export class UserInfoService {
  #http = inject(HttpClient);

  public userInfo = this.#http
    .get<UserInfo>("/authentication/userinfo")
    .pipe(shareReplay(1));

  public isLoggedIn() {
    return firstValueFrom(
      this.userInfo.pipe(map((userInfo) => userInfo.user !== null))
    );
  }

  public isLoggedOut() {
    return firstValueFrom(
      this.userInfo.pipe(map((userInfo) => userInfo.user === null))
    );
  }

  public token = this.#http.get<Token>("/authentication/token").pipe(
    cacheValue((token) => token.expire_in),
    map((token) => token.access_token)
  );
}

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  service = inject(UserInfoService)
): Observable<HttpEvent<unknown>> {
  if (req.url.startsWith("/api")) {
    return service.token.pipe(
      mergeMap((token) =>
        next(
          req.clone({
            headers: req.headers.set("Authorization", "Bearer " + token),
          })
        )
      )
    );
  }
  return next(req);
}

export const loggedInGuard: CanMatchFn = (
  route,
  state,
  user = inject(UserInfoService)
) => {
  return user.isLoggedIn();
};

export const loggedOutGuard: CanMatchFn = (
  route,
  state,
  user = inject(UserInfoService)
) => {
  return user.isLoggedOut();
};
