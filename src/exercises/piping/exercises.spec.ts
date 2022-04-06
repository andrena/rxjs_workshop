import { distinctUntilChanged, filter, first, from, map, of, skip, startWith, take, takeUntil, tap } from 'rxjs';
import { albert, berta, charlotte, dora, eric, herta } from '../chaining/users';
import { cold, hot } from 'jest-marbles';
import { getActiveCart, getActiveLanguage, getCurrentUser, getHelloInLanguage } from '../chaining/chainingDemoApp';
import { cart1, cart2 } from '../chaining/carts';
import { english, french, german } from '../chaining/languages';

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

    it('the websites standard should be german at the start', () => {

        // ↓ Your code here
        const observable$ = getActiveLanguage().pipe(
            startWith(german)
        );
        // ↑ Your code here

        expect(observable$).toBeObservable(hot('g-e--eg--g-eg----f-e',
            {e: english, g: german, f: french}
        ));

        // At the start the active language displayed on the website should be german. At the moment we only have the changes by the user
        // in the observable getActiveLanguage. Add the language german to the start.
    });

    it('first value', () => {

        // ↓ Your code here
        const observable$ = getCurrentUser().pipe(
            take(1)
        );
        // ↑ Your code here

        expect(observable$).toBeObservable(cold('(0|)', {
            0: null
        }))

        // Only retrieve the first value out of the observable. There are multiple ways to do this.
    });

    it('retrieve first non-null value', () => {

        // ↓ Your code here
        const observable$ = getCurrentUser().pipe(
            first(user => !!user)
        );
        // ↑ Your code here

        expect(observable$).toBeObservable(cold('---(a|)', {
            a: albert
        }))

        // Only retrieve the first non-null value from the observable. Try to do this with one operator.
    });

    it('skip null', () => {

        // ↓ Your code here
        const observable$ = getCurrentUser().pipe(
            skip(1),
        );
        // ↑ Your code here

        expect(observable$).toBeObservable(cold('---a----b--dc--e--ab---h',
            {a: albert, b: berta, c: charlotte, d: dora, e: eric, h: herta}));

        // Skip the first value.
    });

    // it('distinct', () => {
    //
    //     // ↓ Your code here
    //     const observable$ = getActiveLanguage().pipe(
    //         distinct()
    //     );
    //     // ↑ Your code here
    //
    //     expect(observable$).toBeObservable(hot('--e---g----------f--',
    //         {e: english, g: german, f: french}));
    // });

    it('filter', () => {

        const observable$ = getCurrentUser().pipe(
            filter(user => user?.age >= 18 && (!user?.name.includes('hörnchen'))),
            map(user => user.code)
        );

        expect(observable$).toBeObservable(hot('------------c----------h', {
            c: 'c_user', h: "h_user"
        }));

        // From the current user observable only retrieve users older than 18 and remove the test
        // users which have a 'hörnchen' in their name. Then return the code of the users matching.
    });

    it('only take until the discount time observable emits', () => {

        const discountEnd$ = cold('--------(a|)');
        const applyDiscount = jest.fn();

        // ↓ Your code here
        const observable$ = getActiveCart().pipe(
            takeUntil(discountEnd$),
            filter(cart => !!cart),
            tap(cart => applyDiscount(cart))
        );
        // ↑ Your code here

        expect(observable$).toBeObservable(cold("----a--b|", {
            a: cart1, b: cart2
        }))

        // During an event a discount is applied to all carts until the event stops signaled by the discount End observable.
        // Each Cart emitted during that time should get a discount. Null values should not be regarded.
    });

    it('return hello message on language change', () => {

        // ↓ Your code here
        const observable$ = getActiveLanguage().pipe(
            distinctUntilChanged(),
            map(lang => getHelloInLanguage(lang))
        );
        // ↑ Your code here

        expect(observable$).toBeObservable(hot('--e---g----eg----f-e', {
            e: "Hello", g: "Hallo", f: "Bonjour"
        }));

        // Return the hello message on language changes. When the users selects the currently active language again no message should be
        // returned.
    });
});
