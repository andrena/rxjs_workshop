// noinspection ES6UnusedImports

import { cold, hot } from 'jest-marbles';
import { catchError, filter, first, map, merge, min, of, tap } from 'rxjs';

type Dog = {
    name: string,
    age: number,
    breed: string
}

const fay: Dog = {
    name: 'Fay',
    age: 4,
    breed: 'Swiss Shepard'
}

const calli: Dog = {
    name: 'Calli',
    age: 3,
    breed: 'Colli'
}

const prida: Dog = {
    name: 'Prida',
    age: 7,
    breed: 'Siberian Huskey'
}

const max: Dog = {
    name: 'Max',
    age: 7,
    breed: 'Siberian Huskey'
}

const dogError: Error = {
    name: 'Dog Error',
    message: 'Whoops an error occurred'
}


describe('example tests', () => {

    it('to be observable', () => {
        const observable = cold('--a---b--c---d|', {a: fay, b: calli, c: prida, d: max});

        let filtered = observable.pipe(
            filter(dog => dog.age > 4)
        )

        expect(filtered).toBeObservable(cold('---------c---d|', {a: fay, b: calli, c: prida, d: max}))
    });

    it('flush', () => {

        let feedDog = jest.fn();
        let observable = cold('--a---b--c---d|', {a: fay, b: calli, c: prida, d: max});


        let feed = observable.pipe(
            tap(dog => feedDog(dog))
        )

        let sub = observable.subscribe()

        expect(feed).toSatisfyOnFlush(() => {
            expect(feedDog).toHaveBeenCalledWith(fay)
        })
    });

    it('Error case',() => {
        let observable = cold('--a---b--#', {a: fay, b: calli, c: prida, d: max});

        let minAge = observable.pipe(
            map(dog => dog.age),
            min(),
            catchError((_) => of(dogError))
        )

        expect(minAge).toBeObservable(cold('---------(a|)', {a: dogError}))

    });

    it('emits at the same time', () => {

        // ---a--b--
        // ---d-----
        // ---(ad)--
        // ------x--
    });
});


