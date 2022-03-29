import { cold, hot } from 'jest-marbles'
import { combineLatest, concat, distinct, filter, forkJoin, map, merge, partition, tap } from 'rxjs'
import {
    getActiveCart,
    getActiveLanguage,
    getCurrentUser,
    getHelloInLanguage,
    getInactiveUsers,
    getStatus,
} from '../chaining/chainingDemoApp'
import { created, verified } from '../chaining/status'
import { albert, berta, charlotte, dora, eric, frida, gregor } from '../chaining/users'
import { getAllDogs, getMealSources } from './combiningDemoApp'
import { calli, fay, lucky, wastl } from './dogs'
import { chicken, minerals, turkey, veggies } from './foods'

describe('combining', () => {

    // '--f--c----lw|'
    // '-t---m---v--c|'
    it('merging dogs with food', () => {

        const combined$ = merge(getAllDogs(), getMealSources())

        expect(combined$).toBeObservable(cold('-tf--(cm)vlwh|', {
            t: turkey,
            f: fay,
            m: minerals,
            c: calli,
            v: veggies,
            l: lucky,
            w: wastl,
            h: chicken,
        }))

        // WIP
        combineLatest([getCurrentUser(), getActiveLanguage()]).pipe(
            map(([user, lang]) => `${getHelloInLanguage(lang)} ${user.name}`))
    })

    it('combineLatest', () => {

        const combined$ = combineLatest([getAllDogs(), getMealSources()])

        expect(combined$).toBeObservable(cold('--a--(bc)defg|', {
            a: [fay, turkey],
            b: [calli, turkey],
            c: [calli, minerals],
            d: [calli, veggies],
            e: [lucky, veggies],
            f: [wastl, veggies],
            g: [wastl, chicken],
        }))
    })
})

describe('demo app', () => {
    describe('combining', () => {

        it('combine current and inactive users and give all a discount', () => {

            const discountForUser = jest.fn()

            // ↓ Your code here
            const combined$ = merge(getInactiveUsers(), getCurrentUser())
            const usersWithDiscount$ = combined$.pipe(
                distinct(),
                filter(user => user?.code !== eric.code),
                tap(user => discountForUser(user?.code)),
            )
            // ↑ Your code here

            expect(usersWithDiscount$).toBeObservable(cold('0--(ag)-bf-dc', {
                a: albert, b: berta, c: charlotte, d: dora, e: eric, f: frida, g: gregor, 0: null,
            }))

            //Extra assert that the function was called in the correct order
            // ↓ Your code here
            expect(combined$).toSatisfyOnFlush(() => {
                expect(discountForUser).toHaveBeenNthCalledWith(1, undefined)
                expect(discountForUser).toHaveBeenNthCalledWith(2, albert.code)
                expect(discountForUser).toHaveBeenNthCalledWith(3, gregor.code)
                expect(discountForUser).toHaveBeenNthCalledWith(4, berta.code)
                expect(discountForUser).toHaveBeenNthCalledWith(5, frida.code)
                expect(discountForUser).toHaveBeenNthCalledWith(6, dora.code)
                expect(discountForUser).toHaveBeenNthCalledWith(7, charlotte.code)
            })
            // ↑ Your code here

            // In this case we want to give a discount to all users. For this we have the function discountForUser(String code)
            // The function excepts the Code that each user has. Make sure that eric does not get a discount.
            // Make sure that every user gets only one discount. The order is not important.
        })

        it('combine the last current user and the last cart', () => {

            const combined$ = forkJoin([getCurrentUser(), getActiveCart()])

            expect(combined$).toBeObservable(cold(''))

            // Try to explain the above behaviour.
        })

        it('retrieve the users and users with the error code into their on observable', () => {

            // ↓ Your code here
            const [users, errorCases] = partition(getCurrentUser(), (user => user ? user.code !== eric.code : false))
            // ↑ Your code here

            expect(users).toBeObservable(cold('---a----b--dc-----ab',
                {a: albert, b: berta, c: charlotte, d: dora}))
            expect(errorCases).toBeObservable(cold('0--------------e----',
                {e: eric, 0: null}))

            // Split the getCurrentUser$ observable into two observables one with the errorCases (eric and null) and one with the correct users
        })

        it('', () => {

            // ↓ Your code here
            const combined$ = concat(getStatus(albert.code), getStatus(berta.code))
            // ↑ Your code here

            expect(combined$).toBeObservable(cold('-c--v-c|',
                {c: created, v: verified}))
        })

        it('concat with order', () => {

            const combined$ = concat(getStatus(charlotte.code), getStatus(albert.code), getStatus(berta.code))

            // ↓ Your code here
            expect(combined$).toBeObservable(cold('--v-c--v-c|',
                {c: created, v: verified}))
            // ↑ Your code here

            // Now lets combine the above observables, which outcome would you expect.
        })

        it('concat with hot', () => {

            const combined$ = concat(getCurrentUser(), getActiveCart())

            expect(combined$).toBeObservable(hot('0--a----b--dc--e--ab',
                {a: albert, b: berta, c: charlotte, d: dora, e: eric, 0: null}))
        })

    })
})
