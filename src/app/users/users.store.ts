import { inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from "@ngrx/signals";

import { UsersService, User, IdentifiedUser } from "./users.service";
import { addEntity, setEntities, withEntities } from "@ngrx/signals/entities";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { mergeMap, pipe, tap } from "rxjs";

interface Busy {
  busy: boolean;
}

interface Ready {
  ready: boolean;
}

interface Error {
  error: string | null;
}

interface State extends Busy, Ready, Error {}

const setBusy = (busy: boolean): Busy => ({ busy });

const setReady = (ready: boolean): Ready => ({ ready });

const setError = (error: string | null): Error => ({ error });

export const usersStore = signalStore(
  { providedIn: "root" },
  withEntities<IdentifiedUser>(),
  withState<State>(() => ({ busy: false, ready: false, error: null })),
  withMethods((store, service = inject(UsersService)) => ({
    add: rxMethod<User>(
      pipe(
        tap(() => patchState(store, setBusy(true), setError(null))),
        mergeMap((user) => service.addUser(user)),
        tap({
          next: (user) => patchState(store, setBusy(false), addEntity(user)),
          error: (error) => patchState(store, setBusy(false), setError(error)),
        })
      )
    ),
    refresh: rxMethod<void>(
      pipe(
        mergeMap(() => service.users),
        tap((users) => patchState(store, setReady(true), setEntities(users)))
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.refresh();
    },
  })
);
