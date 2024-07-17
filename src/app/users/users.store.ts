import { computed, inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from "@ngrx/signals";

import { UsersService, User, IdentifiedUser } from "./users.service";
import {
  addEntity,
  removeEntity,
  setEntities,
  withEntities,
} from "@ngrx/signals/entities";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { map, mergeMap, pipe, tap } from "rxjs";

enum Status {
  FETCHING,
  FETCHED,
  FAILED,
}

interface State {
  status: Status;
}

const setState = (status: Status): Partial<State> => ({ status });

export const usersStore = signalStore(
  { providedIn: "root" },
  withEntities<IdentifiedUser>(),
  withState<State>(() => ({ status: Status.FETCHING })),
  withComputed((store) => ({
    ready: computed(() => store.status() == Status.FETCHED),
  })),
  withMethods((store, service = inject(UsersService)) => ({
    add: (user: User) =>
      service
        .addUser(user)
        .pipe(map((user) => patchState(store, addEntity(user)))),
    remove: (user: IdentifiedUser) =>
      service
        .removeUser(user)
        .pipe(map((id) => patchState(store, removeEntity(id)))),
    refresh: rxMethod<void>(
      pipe(
        mergeMap(() => service.users),
        tap({
          next: (users) =>
            patchState(store, setState(Status.FETCHED), setEntities(users)),
          error: () => patchState(store, setState(Status.FAILED)),
        })
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.refresh();
    },
  })
);
