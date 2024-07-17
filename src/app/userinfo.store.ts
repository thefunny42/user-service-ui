import { computed, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withState,
} from "@ngrx/signals";

import { UserInfoService, UserInfo } from "./userinfo.service";

const initialState: UserInfo = { user: null, available: [] };

export const userInfoStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withComputed(({ user }) => ({
    isLoggedIn: computed(() => user() !== null),
  })),
  withHooks({
    onInit(store, service = inject(UserInfoService)) {
      service.userInfo
        .pipe(takeUntilDestroyed())
        .subscribe((userInfo) => patchState(store, () => userInfo));
    },
  })
);
