import { Observable, tap } from "rxjs";

export function cacheValue<T>(windowTime: (value: T) => number) {
  return (source: Observable<T>) => {
    let cache: { value: T; expires: number } | undefined = undefined;
    return new Observable<T>((observer) => {
      if (cache && cache.expires > Date.now()) {
        observer.next(cache.value);
        observer.complete();
        return undefined;
      } else {
        return source
          .pipe(
            tap(
              (value) =>
                (cache = {
                  value,
                  expires: Date.now() + windowTime(value) * 1000,
                })
            )
          )
          .subscribe(observer);
      }
    });
  };
}
