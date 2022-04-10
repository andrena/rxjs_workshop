import { cold } from 'jest-marbles'
import { concat, map, mergeMap, MonoTypeOperatorFunction, Observable, scan, startWith, switchMap } from 'rxjs'

export const delay: <T>(duration: number) => MonoTypeOperatorFunction<T> =
    (duration) => (
        obs => obs.pipe(
            mergeMap((val) => cold(`${'-'.repeat(duration / 10)}(x|)`).pipe(
                map(() => val))))
    )
export const debounceTime: <T>(duration: number) => MonoTypeOperatorFunction<T> =
    (duration) => (
        obs => obs.pipe(
            switchMap((val) => cold(`${'-'.repeat(duration / 10)}(x|)`).pipe(
                map(() => val))))
    )

export const interval: (period: number) => Observable<number> =
    (period) => {
        let result: Observable<number>
        result = cold(`${'-'.repeat(period / 10)}1`, {1: 1}).pipe(
            switchMap(val => result.pipe(startWith(val), map(() => val))),
            scan((agg, val) => agg + val),
            map(val => val + 1),
        )
        return result.pipe(startWith(1))
    }

export const timer: (timeout: number, period?: number) => Observable<number> =
    (timeout, period) => {
        const timerObs = cold(`${'-'.repeat(timeout / 10)}(0|)`, {0: 0})
        if (period) {
            return concat(timerObs, cold(`${'-'.repeat(period / 10)}|`), interval(period))
        }
        return timerObs
    }