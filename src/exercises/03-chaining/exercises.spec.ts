// noinspection ES6UnusedImports

import { cold, hot } from 'jest-marbles'
import {
    catchError, combineLatest,
    concatMap,
    exhaustMap,
    filter,
    map,
    mergeMap,
    Observable,
    of,
    startWith,
    switchMap,
    take,
} from 'rxjs'
import { andrenaKa, andrenaMuc } from '../testData/data/addresses'
import { andrena, otherComp } from '../testData/data/companies'
import { created, verified } from '../testData/data/status'
import { albert, berta, charlotte, dora, eric, herta } from '../testData/data/users'
import { Address, Company, Status, User } from '../testData/dataModel'
import {
    getAddresses,
    getCompany,
    getCurrentUser,
    getStatus,
    getWorkingCurrentUser,
} from '../testData/providerFunctions'
import { timer } from '../testHelper'

describe('chained observables', () => {
    describe('not exercises, just some illustrations', () => {
        describe('flattening operators', () => {
            it('makes a difference which operator you use', () => {
                // No exercise yet, just an example to show the difference between the flattening operators.

                const outerObservable$ = hot('-1---2------3')
                const innerObservable$ = cold('a---b----c|')
                // It can help to write the marble diagrams below each other with the correct indentation
                // Outer     : -1---2------3
                // Inner at 1:  a---b----c|
                // Inner at 2:      a---b----c|
                // Inner at 3:             a---b----c|

                const chainedWithMergeMap$ = outerObservable$.pipe(mergeMap(() => innerObservable$))
                const chainedWithSwitchMap$ = outerObservable$.pipe(switchMap(() => innerObservable$))
                const chainedWithConcatMap$ = outerObservable$.pipe(concatMap(() => innerObservable$))
                const chainedWithExhaustMap$ = outerObservable$.pipe(exhaustMap(() => innerObservable$))

                expect(chainedWithMergeMap$).toBeObservable(
                    cold('-a---(ba)bc-a-c-b----c'),
                )
                expect(chainedWithSwitchMap$).toBeObservable(
                    cold('-a---a---b--a---b----c'),
                )
                expect(chainedWithConcatMap$).toBeObservable(
                    cold('-a---b----ca---b----ca---b----c'),
                )
                expect(chainedWithExhaustMap$).toBeObservable(
                    cold('-a---b----c-a---b----c'),
                )

                // Here you can see the difference that the choice of the flattening operator makes
            })
        })

        describe('hot vs cold observable', () => {
            it('has a different outcome when using in inner observables', () => {
                // No exercise yet, just an example to show the difference between hot and cold observables.

                const outerObservable$ = hot('           -1--2--|')

                const firstHotInnerObservable$ = hot('   -ab--c|')
                const secondHotInnerObservable$ = hot('  --x---y--z|')

                const firstColdInnerObservable$ = cold(' -ab--c|')
                const secondColdInnerObservable$ = cold('--x---y--z|')

                const chainedWithColdObservable$ = outerObservable$.pipe(concatMap((val) => val === '1' ? firstColdInnerObservable$ : secondColdInnerObservable$))
                const chainedWithHotObservable$ = outerObservable$.pipe(concatMap((val) => val === '1' ? firstHotInnerObservable$ : secondHotInnerObservable$))

                expect(chainedWithColdObservable$).toBeObservable(
                    cold('--ab--c--x---y--z|'),
                )
                expect(chainedWithHotObservable$).toBeObservable(
                    cold('-ab--cy--z|'),
                )

                // Here you can see the difference between hot and cold observables. Cold inner observables start from the beginning each time they are subscribed,
                // hot inner observables emit values all the time so if you do not subscribe right at the start, you miss some of these values.
            })
        })

        describe('catchError', () => {
            it('makes a difference whether put on inner or outer observable', () => {
                // No exercise yet, just an example to show that it is important for some operators whether to put them on the inner or outer pipe

                const outerObservable$ = hot('1--2')
                const innerObservable$ = cold('-#')

                const chainedWithCatchOnOuter$ = outerObservable$.pipe(
                    switchMap(() => innerObservable$),
                    catchError(() => of('e')))
                const chainedWithCatchOnInner$ = outerObservable$.pipe(
                    switchMap(() => innerObservable$.pipe(
                        catchError(() => of('e')),
                    )))

                expect(chainedWithCatchOnOuter$).toBeObservable(cold('-(e|)'))
                expect(chainedWithCatchOnInner$).toBeObservable(cold('-e--e'))

                // As you can see, a catchError automatically completes the observable. If it is done on the outer observable, the whole chain completes.
                // If, however, it is done just on the inner observable, this will complete but the chain stays open and waits for next values.
            })
        })
    })

    describe('exercises', () => {

        it('01 switchMap: get observable with company of most current user', () => {
            let chainedObservable$: Observable<Company>

            // @ts-ignore
            chainedObservable$ = getWorkingCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('----a-----a--o-------a--o',
                    {a: andrena, o: otherComp}),
            )
            // We want an observable that always emits the company as soon as it is loaded of the most recent user.
            // So if the current user is albert, it will emit "andrena". If, at some time, the user changes to charlotte,
            // the resulting observable should emit "otherComp" now.
            // If the user changed before the company for the previous user could be resolved, this company should be
            // skipped and the next one (for the now current user) should emit.
        })

        it('02 switchMap, map: get observable with user and company string', () => {
            let chainedObservable$: Observable<string>
            // Hint: Remember that you can pipe on the inner observable as well!

            // @ts-ignore
            chainedObservable$ = getWorkingCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('----a-----b--c-------b--h',
                    {
                        a: `${albert.name} at ${andrena}`,
                        b: `${berta.name} at ${andrena}`,
                        c: `${charlotte.name} at ${otherComp}`,
                        h: `${herta.name} at ${otherComp}`,
                    }),
            )
            // The same as above, but we want the observable not to emit just the company but the string `USERNAME at COMPANYNAME` instead
        })

        it('03 take, switchMap: get status of first user', () => {
            let chainedObservable$: Observable<Status>

            // @ts-ignore
            chainedObservable$ = getWorkingCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('----c--v|',
                    {c: created, v: verified}),
            )
            // We want an observable that emits the status of the first user. If at some time the user changes, we
            // ignore this and still only emit the status (and status changes) of the first user.
        })

        it('04 take, switchMap: get first status of most current user', () => {
            let chainedObservable$: Observable<Status>

            // @ts-ignore
            chainedObservable$ = getWorkingCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('----c----c----v-----c---c',
                    {c: created, v: verified}),
            )
            // We want an observable that emits the first status of the most current user. If the user changes, then
            // the resulting observable should emit the first status of this new user.
            // If the user changes before the status for the previous user could be resolved, we skip this status
            // and continue with the first status of the now current user.
        })

        it('05 take, switchMap: get first status that resolves', () => {
            let chainedObservable$: Observable<Status>

            // @ts-ignore
            chainedObservable$ = getWorkingCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('----(c|)',
                    {c: created}),
            )
            // We want an observable that emits the first status that resolves
            // (i.e. return the first status that we can get)
        })

        it('06 take, switchMap: get addresses for first user', () => {
            let chainedObservable$: Observable<Address[]>
            // Hint: Remember that you can chain multiple observables!

            // @ts-ignore
            chainedObservable$ = getWorkingCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('--------(a|)',
                    {a: [andrenaKa, andrenaMuc]}),
            )
            // For the first user that is not null we want to get the company's addresses
        })

        it('07 take, switchMap, map: get first address for first actual user', () => {
            let chainedObservable$: Observable<Address>

            // @ts-ignore
            chainedObservable$ = getWorkingCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('--------(a|)',
                    {a: andrenaKa}),
            )
            // The same as above but we don't want all addresses, we just want the first in the array.
        })

        it('08 take, switchMap, map: get first address string with company for first actual user', () => {
            let chainedObservable$: Observable<string>
            // Hint: Remember that you can pipe on inner observables as well!

            // @ts-ignore
            chainedObservable$ = getWorkingCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('--------(a|)',
                    {a: `${andrena}, ${andrenaKa.line1}, ${andrenaKa.line2}`}),
            )
            // The same as above, but we want the address formatted as a string
            // "COMPANY, ADDRESS_LINE1, ADDRESS_LINE2"
        })

        it('09 take, switchMap, map: get first address string with company and username for first actual user', () => {
            let chainedObservable$: Observable<string>
            // Hint: To also keep the outer value after a switchMap, you can pipe on the inner observable of the
            // switchMap and change the inner value to a tuple of object that contains both (outer and inner) values.

            // @ts-ignore
            chainedObservable$ = getWorkingCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('--------(a|)',
                    {a: `${albert.name}, ${andrena}, ${andrenaKa.line1}, ${andrenaKa.line2}`}),
            )
            // The same as above with the difference that we now want to include the username as well so the result
            // should be "USERNAME, COMPANY, ADDRESS_LINE1, ADDRESS_LINE2"
        })

        it('10 filter, switchMap, catchError, of: get observable with company of most current actual user (filter out null), undefined when an error occurs', () => {
            let chainedObservable$: Observable<Company>
            // Hint: Remember that catchError can go on the inner or on the outer observable! What is needed here?

            // @ts-ignore
            chainedObservable$ = getCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('----a-----a--o--0----a--o',
                    {a: andrena, o: otherComp, 0: undefined}),
            )
            // Once again an observable of the current company. However, now we need to deal with the error case because for some users
            // fetching the company will throw an error (see the slightly changed source observable).
            // In these cases we want the result to emit "undefined".
            // Also, we only want to emit the company for actual users, so only do this if the current user is not null
        })

        it('11 filter, switchMap, of: get observable with company of most current user (that is not eric; filter him out), null when user is null', () => {
            let chainedObservable$: Observable<Company>

            // @ts-ignore
            chainedObservable$ = getCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('0---a-----a--o-------a--o',
                    {a: andrena, o: otherComp, 0: null}),
            )
            // The same observable as above. However, now we ignore the error case so first filter out eric.
            // Instead, now we want to deal with the case that we have no actual user (so the current user is "null").
            // In this case, the resulting observable should emit null.
        })

        it('12 switchMap, catchError, of: get observable with company of most current user, null when user is null, undefined on error', () => {
            let chainedObservable$: Observable<Company>

            // @ts-ignore
            chainedObservable$ = getCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('0---a-----a--o--u----a--o',
                    {a: andrena, o: otherComp, 0: null, u: undefined}),
            )
            // Once again the same observable as above. Now we combine both previous cases, so for the "null" user the
            // resulting observable should emit "null", in the error case emit "undefined"
        })


        it('13 switchMap, catchError, of: get status of most current user, "undefined" when no user or erroneous user ', () => {
            let chainedObservable$: Observable<Status>

            // @ts-ignore
            chainedObservable$ = getCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('0---c--v-c----v-0---c---c',
                    {0: undefined, c: created, v: verified}),
            )
            // The same handling as above but for the status. If the user is null oder fetching the status results in an
            // error, we want to return "undefined"
        })


        it('14 concatMap, map: update last login for company of current user as soon as user logs in', () => {
            let chainedObservable$: Observable<{ company: Company, user: User }>

            // We call this function in the subscribe-callback of the observable.
            const updateLastLoggedInUser: (company: Company, userCode: string) => void = jest.fn()

            // @ts-ignore
            chainedObservable$ = getWorkingCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )
            chainedObservable$.subscribe(
                ({company, user}) => updateLastLoggedInUser(company, user.code),
            )

            expect(chainedObservable$).toSatisfyOnFlush(() => {
                expect(updateLastLoggedInUser).toHaveBeenNthCalledWith(1, andrena, albert.code)
                expect(updateLastLoggedInUser).toHaveBeenNthCalledWith(2, andrena, berta.code)
                expect(updateLastLoggedInUser).toHaveBeenNthCalledWith(3, otherComp, dora.code)
                expect(updateLastLoggedInUser).toHaveBeenNthCalledWith(4, otherComp, charlotte.code)
                expect(updateLastLoggedInUser).toHaveBeenNthCalledWith(5, andrena, albert.code)
                expect(updateLastLoggedInUser).toHaveBeenNthCalledWith(6, andrena, berta.code)
            })

            // For each company we want to track which user was the last one that logged in.
            // We have the function "updateLastLoggedInUser(company)". Now, each time a user logs in (i. e. a new user is
            // emitted) we want to fetch his/her company and as soon as we have it we want to call this function
            // for this company and user so that we can store which user of this company last logged on.
            //
            // Create an observable that emits the user and company in the order in which the users log in.
            // The structure of the result should be {company: Company, user: User}
        })

        it('15 mergeMap, take, map: update users first status in database', () => {
            let chainedObservable$: Observable<{ status: Status, user: User }>

            // Call this function for each users' first status as soon as the user logs in and the corresponding status resolves
            const updateUserStatusInDb: (status: Status, userCode: string) => void = jest.fn()

            // @ts-ignore
            chainedObservable$ = getWorkingCurrentUser().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )
            chainedObservable$.subscribe(
                ({status, user}) => updateUserStatusInDb(status, user.code),
            )

            expect(chainedObservable$).toSatisfyOnFlush(() => {
                expect(updateUserStatusInDb).toHaveBeenNthCalledWith(1, created, albert.code)
                expect(updateUserStatusInDb).toHaveBeenNthCalledWith(2, created, berta.code)
                expect(updateUserStatusInDb).toHaveBeenNthCalledWith(3, verified, charlotte.code)
                expect(updateUserStatusInDb).toHaveBeenNthCalledWith(4, verified, dora.code)
                expect(updateUserStatusInDb).toHaveBeenNthCalledWith(5, created, albert.code)
                expect(updateUserStatusInDb).toHaveBeenNthCalledWith(6, created, berta.code)
            })
            // We want to update the user status in out database. In this case, the order is not relevant and we only
            // care about performance; so as soon as we have the value, we want to emit it.
            //
            // Create an observable that emits the users and his first status as soon as they are available.
        })

        it('16 exhaustMap: do not make the same request while it is still in progress', () => {
            let chainedObservable$: Observable<string>

            const updateProfileClicks$ = hot('-x------x--x--', {x: undefined})
            const updateProfile = () => cold('----(x|)', {x: 'profile updated'})

            chainedObservable$ = updateProfileClicks$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(chainedObservable$).toBeObservable(
                cold('-----x------x--', {x: 'profile updated'}),
            )
            // We have a button that a user can click and that should updates the user profile (calls "updateProfile()").
            // "updateProfileClicks$" is an observable that emits each time the user clicks this button.
            // updateProfile() is a function that returns an observable that completes once the update process has finished.
            // We want to wait for the update process to finish before we start a new update, even if the user pressed
            // the button while the update is still in progress. In this case, it should not queue a new update but
            // ignore the button click.
            //
            // Create an observable that calls updateProfile() each time the user clicks the button but only if the previous
            // update has finished yet.
        })

        it('17 switchMap, timer, map, startWith: shows an error message for five seconds if an error occurs', () => {
            let displayErrorMessage$: Observable<boolean>

            const errors$ = hot('--x------x-x--------')

            // Hint: use the function "timer(timeoutInMs)" from testHelpers.ts.
            // The actual method by this name that is provided by rxjs creates an observable that waits "timeoutInMs"
            // milli seconds and then emits a 0 and completes (there are also variants with more parameters but they
            // are not relevant here).

            displayErrorMessage$ = errors$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(displayErrorMessage$).toBeObservable(
                cold('f-t----f-t-t----f', {f: false, t: true}),
            )

            // expect(errors$).toSatisfyOnFlush(() => {
            //     expect(timer).toHaveBeenCalledWith(500)
            //     expect(timer).toHaveBeenCalledTimes(3)
            // })
            // We have an observable "error$" that emits each time an error happens.
            // We want to create an observable "displayErrorMessage$" that emits a boolean to determine whether an error
            // message should be displayed.
            // The error message should be displayed for 50 milliseconds and then disappear. If during this time, a new error
            // happens, the timer should reset.
            // Initially, no error message should be returned.
        })

        it('takeOne, combineLatest, switchMap: takeOne with combineLatest and switchMap (revisited)', () => {
            const outer$ = cold('--1')
            const obs1$ = cold('-a-b------c')
            const obs2$ = cold('-----(x|)')

            const chained1$ = outer$.pipe(switchMap(() => combineLatest([obs1$.pipe(take(1)), obs2$])))
            const chained2$ = outer$.pipe(switchMap(() => combineLatest([obs1$, obs2$]).pipe(take(1))))
            const chained3$ = outer$.pipe(switchMap(() => combineLatest([obs1$, obs2$])), take(1))

            let expectedChained1$
            // ↓ Your code here
            // ↑ Your code here

            let expectedChained2$
            // ↓ Your code here
            // ↑ Your code here

            let expectedChained3$
            // ↓ Your code here
            // ↑ Your code here

            expect(chained1$).toBeObservable(expectedChained1$)
            expect(chained2$).toBeObservable(expectedChained2$)
            expect(chained3$).toBeObservable(expectedChained3$)

            // Similar as in the combining exercise, there are three places to place a take(1) to achieve similar things.
            // Assign values to the expectedChained$-Variables to match the actual results
        })
    })
})