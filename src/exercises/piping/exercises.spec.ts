import { first, from, of, take } from 'rxjs';
import { albert } from '../chaining/users';
import { cold } from 'jest-marbles';
import { getCurrentUser } from '../chaining/chainingDemoApp';

describe('creation', () => {

    const numbers: number[] = [1, 2, 3, 5, 8, 13]

    it('create an observable with single emit', () => {

        // ↓ Your code here
        const observable$ = of(numbers);
        // ↑ Your code here

        expect(observable$).toBeObservable(cold('(a|)', {
            a: numbers,
        }));

        // Create an observable that emits numbers as a single value. Keep in mind, that the observable should only emit once.
    });

    it('create an observable with multiple emits', () => {

        // ↓ Your code here
        const observable$ = from(numbers);
        // ↑ Your code here

        expect(observable$).toBeObservable(cold('(abcdef|)', {
            a: 1, b: 2, c: 3, d: 5, e: 8, f: 13
        }))

        // Create an observable that emits the content of the numbers array. Each value should be in the timeline.
    });
});

describe('operators', () => {
    it('take', () => {

        const observable$ = getCurrentUser().pipe(
            take(1)
        );

        expect(observable$).toBeObservable(cold('(0|)', {
            0: null
        }))
    });

    it('take first non null', () => {

        const observable$ = getCurrentUser().pipe(
            first(user => !!user)
        );

        expect(observable$).toBeObservable(cold('---(a|)', {
            a: albert
        }))
    });
});
