import { cold, hot } from 'jest-marbles';
import { map, merge } from 'rxjs';

describe('example tests', () => {
    it('to be observable', () => {
        const values = cold('---1---2|');

        const multiplied = values.pipe(
            map(value => value * 2)
        )

        const expected = cold('---2---4|');

        expect(multiplied).toBeObservable(expected)
    });

    it('hot vs cold', () => {
        const coldValues = cold('---1---2|');
        const hotValues = hot('1-^1---2|');

        const multipliedCold = coldValues.pipe(
            map(value => value * 2)
        );

        const multipliedHot = hotValues.pipe(
            map(value => value * 2)
        );

        expect(multipliedCold).toBeObservable(cold('---2---4|'));
        expect(multipliedHot).toBeObservable(cold('-2---4|'));
    });

    it('Error case', () => {
        const error = cold('---#---2|');

        const output = error.pipe(
            map(value => value * 2)
        );

        expect(output).toBeObservable(cold('---#'))
    });

    it('emits at the same time', () => {
        const first =  cold('--a---|');
        const second = cold('--b---|');

        const merged = merge(first, second);

        expect(merged).toBeObservable(cold('--(ab)|'));
    });

//    toHaveSubscription geht mit nested observables da käme noch ! für unsubscribe rein
});


