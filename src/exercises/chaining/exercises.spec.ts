import { cold, hot } from 'jest-marbles'
import {
    catchError,
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
import { andrenaKa, andrenaMuc } from './addresses'
import { getAddresses, getCompany, getCurrentUser, getStatus, getWorkingCurrentUser } from './chainingDemoApp'
import { andrena, otherComp } from './companies'
import { Address, Company, Status, User } from './model'
import { created, verified } from './status'
import { albert, berta, charlotte, dora, eric } from './users'

const timer = jest.fn((sleep: number) => cold('----0', {0: 0}))

describe('chained observables', () => {
    describe('flattening operators', () => {
        it('makes a difference which operator you use', () => {
            const outerObservable$ = hot('-1---2------3')
            const innerObservable$ = cold('a---b----c|')

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
        })
    })

    describe('hot vs cold observable', () => {
        it('has a different outcome when using in inner observables', () => {
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
        })
    })

    describe('catchError', () => {
        it('makes a difference whether put on inner or outer observable', () => {
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
        })
    })

    describe('demo app', () => {
        describe('company', () => {

            it('get observable with company of most current user', () => {
                let chainedObservable$: Observable<Company>

                chainedObservable$ = getWorkingCurrentUser().pipe(
                    // ↓ Your code here
                    switchMap(user => getCompany(user.code)),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('----a-----a--o-------a',
                        {a: andrena, o: otherComp}),
                )
                // We want an observable that always emits the company as soon as it is loaded of the most recent user.
                // So if the current user is albert, it will emit "andrena". If, at some time, the user changes to charlotte,
                // the resulting observable should emit "otherComp" now.
                // If the user changed before the company for the previous user could be resolved, this company should be
                // skipped and the next one (for the now current user) should emit.
            })

            it('get observable with company of most current actual user (filter out null), undefined when an error occurs', () => {
                let chainedObservable$: Observable<Company>

                chainedObservable$ = getCurrentUser().pipe(
                    // ↓ Your code here
                    filter(user => !!user),
                    switchMap(user => getCompany(user.code).pipe(catchError(_ => of(undefined)))),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('----a-----a--o--0----a',
                        {a: andrena, o: otherComp, 0: undefined}),
                )
                // The same observable as above. However, now we need to deal with the error case because for some users
                // fetching the company will throw an error (see the slightly changed source observable).
                // In these cases we want the result to emit "undefined".
                // Also, we only want to emit the company for actual users, so only do this if the current user is not null
            })

            it('get observable with company of most current user (that is not eric; filter him out), null when user is null', () => {
                let chainedObservable$: Observable<Company>

                chainedObservable$ = getCurrentUser().pipe(
                    // ↓ Your code here
                    filter(user => user?.code !== eric.code),
                    switchMap(user => user ? getCompany(user.code) : of(null)),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('0---a-----a--o-------a',
                        {a: andrena, o: otherComp, 0: null}),
                )
                // The same observable as above. However, now we ignore the error case so first filter out eric.
                // Instead, now we want to deal with the case that we have no actual user (so the current user is "null").
                // In this case, the resulting observable should emit null.
            })

            it('get observable with company of most current user, null when user is null, undefined on error', () => {
                let chainedObservable$: Observable<Company>

                chainedObservable$ = getCurrentUser().pipe(
                    // ↓ Your code here
                    switchMap(user => user ? getCompany(user.code).pipe(
                        catchError(_ => of(undefined))) : of(null)),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('0---a-----a--o--u----a',
                        {a: andrena, o: otherComp, 0: null, u: undefined}),
                )
                // Once again the same observable as above. Now we combine both previous cases, so for the "null" user the
                // resulting observable should emit "null", in the error case emit "undefined"
            })

            it('get observable with user and company string', () => {
                let chainedObservable$: Observable<string>

                chainedObservable$ = getWorkingCurrentUser().pipe(
                    // ↓ Your code here
                    switchMap(user => getCompany(user.code).pipe(
                        map(company => `${user.name} at ${company}`))),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('----a-----b--c-------b',
                        {
                            a: `${albert.name} at ${andrena}`,
                            b: `${berta.name} at ${andrena}`,
                            c: `${charlotte.name} at ${otherComp}`,
                        }),
                )
                // Create an observable that emits the string "USERNAME at COMPANY" for the current user
            })
        })

        describe('status', () => {
            it('get status of first user', () => {
                let chainedObservable$: Observable<Status>

                chainedObservable$ = getWorkingCurrentUser().pipe(
                    // ↓ Your code here
                    take(1),
                    switchMap(user => getStatus(user.code)),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('----c--v|',
                        {c: created, v: verified}),
                )
                // We want an observable that emits the status of the first user. If at some time the user changes, we
                // ignore this and still only emit the status (and status changes) of the first user.
            })

            it('get first status of most current user', () => {
                let chainedObservable$: Observable<Status>

                chainedObservable$ = getWorkingCurrentUser().pipe(
                    // ↓ Your code here
                    switchMap(user => getStatus(user.code).pipe(
                        take(1),
                    )),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('----c----c----v-----c',
                        {c: created, v: verified}),
                )
                // We want an observable that emits the first status of the most current user. If the user changes, then
                // the resulting observable should emit the first status of this new user.
                // If the user changes before the status for the previous user could be resolved, we skip this status
                // and continue with the first status of the now current user.
            })

            it('get first status of first user', () => {
                let chainedObservable$: Observable<Status>

                chainedObservable$ = getWorkingCurrentUser().pipe(
                    // ↓ Your code here
                    switchMap(user => getStatus(user.code)),
                    take(1),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('----(c|)',
                        {c: created}),
                )
                // We want an observable that emits the first status of the first user and then completes
            })

            it('get status of most current user, "undefined" when no user or erroneous user ', () => {
                let chainedObservable$: Observable<Status>

                chainedObservable$ = getCurrentUser().pipe(
                    // ↓ Your code here
                    switchMap(user => user
                        ? getStatus(user.code).pipe(
                            catchError(_ => of(undefined)))
                        : of(undefined),
                    ),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('0---c--v-c----v-0---c',
                        {0: undefined, c: created, v: verified}),
                )
                // We want an observable that emits the status (and status changes) of the most current user. If the
                // user changes, the observable now emits the status of the new user.
                // If the user is undefined or the resolution of the status for a user fails, we want the resulting
                // observable to return "undefined" instead
            })
        })

        describe('addresses', () => {
            it('get addresses for first actual user', () => {
                let chainedObservable$: Observable<Address[]>

                chainedObservable$ = getCurrentUser().pipe(
                    // ↓ Your code here
                    filter(user => !!user),
                    take(1),
                    switchMap(user => getCompany(user.code)),
                    switchMap(company => getAddresses(company)),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('--------(a|)',
                        {a: [andrenaKa, andrenaMuc]}),
                )
                // For the first user that is not null we want to get the company's addresses
            })

            it('get first address for first actual user', () => {
                let chainedObservable$: Observable<Address>

                chainedObservable$ = getCurrentUser().pipe(
                    // ↓ Your code here
                    filter(user => !!user),
                    take(1),
                    switchMap(user => getCompany(user.code)),
                    switchMap(company => getAddresses(company)),
                    map(addresses => addresses[0]),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('--------(a|)',
                        {a: andrenaKa}),
                )
                // For the first user that is not null we now want to get the company's first addresses
            })

            it('get first address string with company for first actual user', () => {
                let chainedObservable$: Observable<string>

                chainedObservable$ = getCurrentUser().pipe(
                    // ↓ Your code here
                    filter(user => !!user),
                    take(1),
                    switchMap(user => getCompany(user.code)),
                    switchMap(company => getAddresses(company).pipe(
                        map(addresses => addresses[0]),
                        map(address => `${company}, ${address.line1}, ${address.line2}`))),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('--------(a|)',
                        {a: `${andrena}, ${andrenaKa.line1}, ${andrenaKa.line2}`}),
                )
                // For the first user that is not null we now want to get the company's first addresses, in the form
                // "COMPANY, ADDRESS_LINE1, ADDRESS_LINE2"
            })

            it('get first address string with company and username for first actual user', () => {
                let chainedObservable$: Observable<string>

                chainedObservable$ = getCurrentUser().pipe(
                    // ↓ Your code here
                    filter(user => !!user),
                    take(1),
                    switchMap(user => getCompany(user.code).pipe(
                        map(company => ([user, company] as const)))),
                    switchMap(([user, company]) => getAddresses(company).pipe(
                        map(addresses => addresses[0]),
                        map(address => `${user.name}, ${company}, ${address.line1}, ${address.line2}`))),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('--------(a|)',
                        {a: `${albert.name}, ${andrena}, ${andrenaKa.line1}, ${andrenaKa.line2}`}),
                )
                // The same as above with the difference that we now want to include the username as well so the result
                // should be "USERNAME, COMPANY, ADDRESS_LINE1, ADDRESS_LINE2"
            })
        })

        describe('different flattening operators', () => {
            it('update last login for company of current user as soon as user logs in', () => {
                let chainedObservable$: Observable<{ company: Company, user: User }>

                // Call this function for each users' company when the user logs in
                const updateLastLoggedInUser: (company: Company, userCode: string) => void = jest.fn()

                chainedObservable$ = getWorkingCurrentUser().pipe(
                    // ↓ Your code here
                    concatMap(user => getCompany(user.code).pipe(
                        map(company => ({company, user})),
                    )),
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

                // We have the function "updateLastLoggedInUser(company)". Now, each time a user logs in (i. e. a new user is
                // emitted) we want to fetch his/her company and as soon as we have it we want to call this function
                // for this company and user so that we can store which user of this company last logged on.
                // So make sure that the order in which this function is called for the different users corresponds
                // to the order in which these users are emitted.
            })

            it('update users first status in database', () => {
                let chainedObservable$: Observable<{ status: Status, user: User }>

                // Call this function for each users' first status as soon as the user logs in and the corresponding status resolves
                const updateUserStatusInDb: (status: Status, userCode: string) => void = jest.fn()

                chainedObservable$ = getWorkingCurrentUser().pipe(
                    // ↓ Your code here
                    mergeMap(user => getStatus(user.code).pipe(
                        take(1),
                        map(status => ({status, user})))),
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
                // Similar as above, but this time we do not care about the order of the users but instead we care about
                // performance and want to call the function as soon as we have all required data (user and status)
            })

            it('do not make the same request while it is still in progress', () => {
                let chainedObservable$: Observable<string>

                const getClicksOnUpdateProfile$ = hot('-x------x--x--', {x: undefined})
                const updateProfile = () => cold('----(x|)', {x: 'profile updated'})

                chainedObservable$ = getClicksOnUpdateProfile$.pipe(
                    // ↓ Your code here
                    exhaustMap(_ => updateProfile()),
                    // ↑ Your code here
                )

                expect(chainedObservable$).toBeObservable(
                    cold('-----x------x--', {x: 'profile updated'}),
                )
                // We have a button that a user can click and that updates the user profile (calls "updateProfile()").
                // "getClicksOnUpdateProfile$" is an observable that emits each time the user clicks this button.
                // We want to wait for the update process to finish before we start a new update, even if the user pressed
                // the button while the update is still in progress. In this case, it should not queue a new update but
                // ignore the button click.
            })
        })

        it('shows an error message for five seconds if an error occurs', () => {
            let displayErrorMessage$: Observable<boolean>

            const errors$ = hot('--x------x-x--------')

            // Hint: use the function "timer(timeoutInMs)".
            // In this file it is mocked to emit a 0 after 5 frames and complete.
            // The actual method by this name that is provided by rxjs creates an observable that waits "timeoutInMs"
            // milli seconds and then emits a 0 and completes (there are also variants with more parameters but they
            // are not relevant here).

            displayErrorMessage$ = errors$.pipe(
                // ↓ Your code here
                switchMap(() => timer(5000).pipe(
                    map(() => false),
                    startWith(true))),
                startWith(false),
                // ↑ Your code here
            )

            expect(displayErrorMessage$).toBeObservable(
                cold('f-t---f--t-t---f', {f: false, t: true}),
            )

            expect(errors$).toSatisfyOnFlush(() => {
                expect(timer).toHaveBeenCalledWith(5000)
                expect(timer).toHaveBeenCalledTimes(3)
            })
            // We have an observable "error$" that emits each time an error happens.
            // We want to create an observable "displayErrorMessage$" that emits a boolean to determine whether an error
            // message should be displayed.
            // The error message should be displayed for 5 seconds and then disappear. If during this time, a new error
            // happens, the timer should reset.
            // Initially, no error message should be returned.
        })
    })
})