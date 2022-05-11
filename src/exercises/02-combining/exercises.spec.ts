// noinspection ES6UnusedImports

import { cold, hot, ObservableWithSubscriptions } from 'jest-marbles'
import {
    combineLatest,
    concat,
    distinct,
    distinctUntilChanged,
    filter,
    forkJoin,
    map,
    merge,
    Observable,
    partition,
    race,
    take,
    tap,
} from 'rxjs'
import { created, verified } from '../testData/data/status'
import { albert, berta, charlotte, dora, eric, frida, gregor, herta } from '../testData/data/users'
import { Status, User } from '../testData/dataModel'
import {
    getActiveCart,
    getActiveLanguage,
    getCurrentUser,
    getHelloInLanguage,
    getInactiveUsers,
    getStatus,
} from '../testData/providerFunctions'

describe('demo app', () => {
    describe('combining', () => {

        it('concat: concat with order', () => {

            const combined$ = concat(getStatus(charlotte.code), getStatus(albert.code), getStatus(berta.code))

            let expectedResult$: ObservableWithSubscriptions

            // ↓ Your code here
            // ↑ Your code here

            expect(combined$).toBeObservable(expectedResult$)

            // Now lets combine the above observables, which outcome would you expect.
            // Assign the correct value (cold(...)) to expectedResult$
        })

        it('concat: concat with hot', () => {

            const combined$ = concat(getCurrentUser(), getActiveCart())

            let expectedResult$: ObservableWithSubscriptions

            // ↓ Your code here
            // ↑ Your code here

            expect(combined$).toBeObservable(expectedResult$)

            // Concatenate two hot observables and try to predict the outcome
            // Assign the correct value (cold(...)) to expectedResult$

        })

        it('combine the last current user and the last cart', () => {

            const combined$ = forkJoin([getCurrentUser(), getActiveCart()])

            expect(combined$).toBeObservable(cold(''))

            // Try to explain the above behaviour.
        })

        it('combineLatest, filter, map, distinctUntilChanged, getActiveLanguage, getHelloInLanguage: greet the current user in the currently selected language', () => {

            let greetingMessage$: Observable<string>

            // ↓ Your code here
            // ↑ Your code here

            expect(greetingMessage$).toBeObservable(hot('---a--b-c--defeg-hi(jk)l', {
                a: `Hello ${albert.name}`,
                b: `Hallo ${albert.name}`,
                c: `Hallo ${berta.name}`,
                d: `Hallo ${dora.name}`,
                e: `Hallo ${charlotte.name}`,
                f: `Hello ${charlotte.name}`,
                g: `Hallo ${eric.name}`,
                h: `Bonjour ${eric.name}`,
                i: `Bonjour ${albert.name}`,
                j: `Hello ${albert.name}`,
                k: `Hello ${berta.name}`,
                l: `Hello ${herta.name}`,
            }))

            // Print out a greeting whenever a new user connects and whenever the current user changes the language.
            // Filter out null users and null languages
            // A user should not be greeted twice in the same language (only if he selected a different language in between).
            // Use the method getHelloInLanguage(language) to get 'Hello' in the given language.
        })

        it('partition:  split the observable into the user value and null values', () => {

            let users: Observable<User>
            let errorCases: Observable<User | null>

            // ↓ Your code here
            // ↑ Your code here

            expect(users).toBeObservable(cold('---a----b--dc-----ab---h',
                {a: albert, b: berta, c: charlotte, d: dora, h: herta}))
            expect(errorCases).toBeObservable(cold('0-------------------',
                {0: null}))

            // Split the getCurrentUser$ observable into two observables one with the null cases and one with the correct users.
        })

        it('merge, distinct, filter, map: combine current and inactive users and give all a discount', () => {
            const applyDiscount = jest.fn()

            let userCodesToDiscount$: Observable<string>

            // ↓ Your code here
            // ↑ Your code here

            userCodesToDiscount$.subscribe(user => applyDiscount(user))

            //Extra assert that the function was called in the correct order
            expect(userCodesToDiscount$).toSatisfyOnFlush(() => {
                expect(applyDiscount).toHaveBeenNthCalledWith(1, albert.code)
                expect(applyDiscount).toHaveBeenNthCalledWith(2, gregor.code)
                expect(applyDiscount).toHaveBeenNthCalledWith(3, berta.code)
                expect(applyDiscount).toHaveBeenNthCalledWith(4, frida.code)
                expect(applyDiscount).toHaveBeenNthCalledWith(5, dora.code)
                expect(applyDiscount).toHaveBeenNthCalledWith(6, charlotte.code)
                expect(applyDiscount).toHaveBeenNthCalledWith(7, eric.code)
            })

            // In this case we want to give a discount to all users. For this we have the function applyDiscount(String code)
            // The function excepts the Code that each user has. Filter out the null user!
            // Make sure that every user gets only one discount. The discounts should be applied in the same order
            // in which the users are emitted in getInactiveUsers and getCurrentUser.
            // Assign the correct observable to userCodesToDiscount$ and add operators to its pipe to satisfy the requirements.
        })

        it('race: for the finalWorkflow use the server with faster response time', () => {

            const ping = (serverId: number) => serverId === 1 ? cold('-(a|)') : cold('----(1|)')
            const addDiscounts = (serverId: number) => serverId === 1 ? cold('----(b|)') : cold('--(2|)')
            const addVat = (serverId: number) => serverId === 1 ? cold('-(c|)') : cold('--(3|)')
            const calcPrices = (serverId: number) => serverId === 1 ? cold('--(d|)') : cold('--(4|)')

            const server1Workflow = concat(ping(1), addDiscounts(1), addVat(1), calcPrices(1))
            const server2Workflow = concat(ping(2), addDiscounts(2), addVat(2), calcPrices(2))

            let finalWorkflow: Observable<any>
            // ↓ Your code here
            // ↑ Your code here

            expect(finalWorkflow).toBeObservable(cold('-a---bc-(d|)'))

            // We have two servers, 1 and 2. Each can be used to add a discount, add vat and calculate prices.
            // The parameter of each method determines on what server this method is executed.
            // We can also ping a server to see which is faster at the moment.
            // If one action is done on one server, the other actions have to be done on the same server to avoid a data mismatch.
            //
            // For each server, we created a workflow which first pings the server, than addDiscount, addVat and calcPrices.
            // The final Workflow should start the workflow on both servers but execute everything after the ping only on the
            // fastest server (the one that answered our ping first).
        })

        it('takeOne, combineLatest: takeOne with combineLatest', () => {
            const obs1$ = cold('-a-b------c')
            const obs2$ = cold('-----(x|)')

            const combined1$ = combineLatest([obs1$.pipe(take(1)), obs2$])
            const combined2$ = combineLatest([obs1$, obs2$]).pipe(take(1))

            let expectedCombined1$
            // ↓ Your code here
            // ↑ Your code here

            let expectedCombined2$
            // ↓ Your code here
            // ↑ Your code here

            expect(combined1$).toBeObservable(expectedCombined1$)
            expect(combined2$).toBeObservable(expectedCombined2$)

            // We combine two observables. One of them emits a single value, the other one emits multiple ones.
            // But we only want to get one combination of values, so we use take(1).
            // There are two places where take(1) could go in this construct. Can you find the difference in the outcome?
            // Assign expectedCombined1$ and expectedCombined2$ to match the correct result.
        })
    })
})

