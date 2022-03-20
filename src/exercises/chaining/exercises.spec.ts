import { cold, hot } from 'jest-marbles'
import { catchError, concatMap, exhaustMap, map, mergeMap, of, switchMap, take } from 'rxjs'
import { andrenaKa } from './addresses'
import { getAddresses, getCompany, getCurrentUser, getStatus, getWorkingCurrentUser } from './chainingDemoApp'
import { andrena, otherComp } from './companies'
import { created, verified } from './status'
import { albert } from './users'

describe('chained observables', () => {
    describe('flattening operators', () => {
        it('makes a difference which operator you use', () => {
            const outerObservable = hot('-1---2------3')
            const innerObservable = cold('a---b----c|')

            const chainedWithMergeMap = outerObservable.pipe(mergeMap(() => innerObservable))
            const chainedWithSwitchMap = outerObservable.pipe(switchMap(() => innerObservable))
            const chainedWithConcatMap = outerObservable.pipe(concatMap(() => innerObservable))
            const chainedWithExhaustMap = outerObservable.pipe(exhaustMap(() => innerObservable))

            expect(chainedWithMergeMap).toBeObservable(
                cold('-a---(ba)bc-a-c-b----c'),
            )
            expect(chainedWithSwitchMap).toBeObservable(
                cold('-a---a---b--a---b----c'),
            )
            expect(chainedWithConcatMap).toBeObservable(
                cold('-a---b----ca---b----ca---b----c'),
            )
            expect(chainedWithExhaustMap).toBeObservable(
                cold('-a---b----c-a---b----c'),
            )
        })
    })

    describe('hot vs cold observable', () => {
        it('has a different outcome when using in inner observables', () => {
            const outerObservable = hot('           -1--2--|')
            const firstHotInnerObservable = hot('   -ab--c|')
            const secondHotInnerObservable = hot('  --x---y--z|')
            const firstColdInnerObservable = cold(' -ab--c|')
            const secondColdInnerObservable = cold('--x---y--z|')

            const chainedWithColdObservable = outerObservable.pipe(concatMap((val) => val === '1' ? firstColdInnerObservable : secondColdInnerObservable))
            const chainedWithHotObservable = outerObservable.pipe(concatMap((val) => val === '1' ? firstHotInnerObservable : secondHotInnerObservable))

            expect(chainedWithColdObservable).toBeObservable(
                cold('--ab--c--x---y--z|'),
            )
            expect(chainedWithHotObservable).toBeObservable(
                cold('-ab--cy--z|'),
            )
        })
    })

    describe('catchError', () => {
        it('makes a difference whether put on inner or outer observable', () => {
            const outerObservable = hot('1--2')
            const innerObservable = cold('-#')

            const chainedWithCatchOnOuter = outerObservable.pipe(
                switchMap(() => innerObservable),
                catchError(() => of('e')))
            const chainedWithCatchOnInner = outerObservable.pipe(
                switchMap(() => innerObservable.pipe(
                    catchError(() => of('e')),
                )))

            expect(chainedWithCatchOnOuter).toBeObservable(cold('-(e|)'))
            expect(chainedWithCatchOnInner).toBeObservable(cold('-e--e'))
        })
    })

    describe('demo app', () => {
        it('get observable with company of most current user', () => {
            let chainedObservable

            chainedObservable = getWorkingCurrentUser().pipe(
                // ↓ Your code here
                switchMap(user => getCompany(user.code)),
                // ↑ Your code here
            )

            expect(chainedObservable).toBeObservable(
                cold('----a-----a--o-------a',
                    {a: andrena, o: otherComp}),
            )
        })

        describe('status', () => {
            it('get status of first user', () => {
                let chainedObservable

                chainedObservable = getWorkingCurrentUser().pipe(
                    // ↓ Your code here
                    take(1),
                    switchMap(user => getStatus(user.code)),
                    // ↑ Your code here
                )

                expect(chainedObservable).toBeObservable(
                    cold('----c--v',
                        {c: created, v: verified}),
                )
            })

            it('get first status of most current user', () => {
                let chainedObservable

                chainedObservable = getWorkingCurrentUser().pipe(
                    // ↓ Your code here
                    switchMap(user => getStatus(user.code).pipe(
                        take(1),
                    )),
                    // ↑ Your code here
                )

                expect(chainedObservable).toBeObservable(
                    cold('----c----c----v-----c',
                        {c: created, v: verified}),
                )
            })

            it('get first status of first user', () => {
                let chainedObservable

                chainedObservable = getWorkingCurrentUser().pipe(
                    // ↓ Your code here
                    switchMap(user => getStatus(user.code)),
                    take(1),
                    // ↑ Your code here
                )

                expect(chainedObservable).toBeObservable(
                    cold('----(c|)',
                        {c: created}),
                )
            })

            it('get status of most current user, "undefined" when no user or erroneous user ', () => {
                let chainedObservable

                chainedObservable = getCurrentUser().pipe(
                    // ↓ Your code here
                    switchMap(user => user
                        ? getStatus(user.code).pipe(
                            catchError(_ => of(undefined)))
                        : of(undefined),
                    ),
                    // ↑ Your code here
                )

                expect(chainedObservable).toBeObservable(
                    cold('0---c--v-c----v-0---c',
                        {0: undefined, c: created, v: verified}),
                )
            })
        })

        describe('addresses', () => {
            it('get full first address for first user', () => {
                let chainedObservable

                chainedObservable = getWorkingCurrentUser().pipe(
                    // ↓ Your code here
                    take(1),
                    switchMap(user => getCompany(user.code).pipe(
                        map(company => [user, company] as const))),
                    switchMap(([user, company]) => getAddresses(company).pipe(
                        map(address => address[0]),
                        map(address => `${user.name}, ${address.line1}, ${address.line2}`),
                    )),
                    // ↑ Your code here
                )

                expect(chainedObservable).toBeObservable(
                    cold('--------(a|)',
                        {a: `${albert.name}, ${andrenaKa.line1}, ${andrenaKa.line2}`}),
                )
            })

            it('update last login for company of current user', () => {
                let chainedObservable

                const updateLastLogin = jest.fn()

                chainedObservable = getWorkingCurrentUser().pipe(
                    // ↓ Your code here
                    concatMap(user => getCompany(user.code)),
                    // ↑ Your code here
                )
                chainedObservable.subscribe(
                    company => updateLastLogin(company),
                )

                expect(chainedObservable).toSatisfyOnFlush(() => {
                    expect(updateLastLogin.mock.calls.length).toBe(6)
                    expect(updateLastLogin.mock.calls.filter(args => args[0] === andrena).length).toBe(4)
                    expect(updateLastLogin.mock.calls.filter(args => args[0] === otherComp).length).toBe(2)
                })
            })
        })
    })
})

// Add test where take(1) needs to be on the inner and one where it needs to be on the outer observable