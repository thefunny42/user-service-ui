import { inject } from "@angular/core";
import {
  PartialStateUpdater,
  patchState,
  signalStore,
  StateSignal,
  withHooks,
  withMethods,
  withState,
} from "@ngrx/signals";

import { UsersService, User, IdentifiedUser } from "./users.service";
import {
  addEntity,
  EntityState,
  removeEntity,
  setEntities,
  withEntities,
} from "@ngrx/signals/entities";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { mergeMap, Observable, pipe, tap } from "rxjs";

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

const setBusy = (busy: boolean): Partial<State> => ({ busy });

const setReady = (ready: boolean): Partial<State> => ({ ready });

const setError = (error: string | null): Partial<State> => ({ error });

const rxAction = <Input, Result, Entity>(
  store: StateSignal<EntityState<Entity> & State>,
  action: (value: Input) => Observable<Result>,
  updater: (value: Result) => PartialStateUpdater<EntityState<Entity>>
) =>
  rxMethod<Input>(
    pipe(
      tap(() => patchState(store, setBusy(true), setError(null))),
      mergeMap(action),
      tap({
        next: (value) => patchState(store, setBusy(false), updater(value)),
        error: (error) => patchState(store, setBusy(false), setError(error)),
      })
    )
  );

export const usersStore = signalStore(
  { providedIn: "root" },
  withEntities<IdentifiedUser>(),
  withState<State>(() => ({ busy: false, ready: false, error: null })),
  withMethods((store, service = inject(UsersService)) => ({
    add: rxAction(store, (user: User) => service.addUser(user), addEntity),
    remove: rxAction(
      store,
      (user: IdentifiedUser) => service.removeUser(user),
      removeEntity
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
