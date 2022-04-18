import { cold, hot } from 'jest-marbles'
import { combineLatest, concat, distinct, distinctUntilChanged, filter, forkJoin, map, merge, partition, race, tap } from 'rxjs'
import {
    getActiveCart,
    getActiveLanguage,
    getCurrentUser,
    getHelloInLanguage,
    getInactiveUsers,
    getStatus,
} from '../testData/providerFunctions'
import { created, verified } from '../testData/data/status'
import { albert, berta, charlotte, dora, eric, frida, gregor, herta } from '../testData/data/users'

describe('demo app', () => {
    describe('combining', () => {

        it('combine the last current user and the last cart', () => {

            const combined$ = forkJoin([getCurrentUser(), getActiveCart()])

            expect(combined$).toBeObservable(cold(''))

            // Try to explain the above behaviour.
        })

        it('retrieve the users and users with the error code into their on observable', () => {

            // ↓ Your code here
            const [users, errorCases] = partition(getCurrentUser(), (user => user ? user.code !== eric.code : false))
            // ↑ Your code here

            expect(users).toBeObservable(cold('---a----b--dc-----ab---h',
                {a: albert, b: berta, c: charlotte, d: dora, h: herta}))
            expect(errorCases).toBeObservable(cold('0--------------e----',
                {e: eric, 0: null}))

            // Split the getCurrentUser$ observable into two observables one with the errorCases (eric and null) and one with the correct users
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

            const combined$ = concat(getCurrentUser(), getActiveCart());

            // ↓ Your code here
            expect(combined$).toBeObservable(hot('0--a----b--dc--e--ab---h',
                {a: albert, b: berta, c: charlotte, d: dora, e: eric, h: herta, 0: null}))
            // ↑ Your code here

            // Concatenate two hot observables and try to predict the outcome
        })

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

            expect(usersWithDiscount$).toBeObservable(cold('0--(ag)-bf-dc----------h', {
                a: albert, b: berta, c: charlotte, d: dora, e: eric, f: frida, g: gregor, h: herta, 0: null,
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

        it('for the finalWorkflow use the server with faster response time', () => {

            const ping = (serverId: number) => serverId === 1 ? cold('-(a|)') : cold('----(1|)')
            const addDiscounts = (serverId: number) => serverId === 1 ? cold('----(b|)') : cold('--(2|)')
            const addVat = (serverId: number) => serverId === 1 ? cold('-(c|)') : cold('--(3|)')
            const calcPrices = (serverId: number) => serverId === 1 ? cold('--(d|)') : cold('--(4|)')

            const server1Workflow = concat(ping(1), addDiscounts(1), addVat(1), calcPrices(1))
            const server2Workflow = concat(ping(2), addDiscounts(2), addVat(2), calcPrices(2))

            // ↓ Your code here
            let finalWorkflow = race([server1Workflow, server2Workflow])
            // ↑ Your code here

            expect(finalWorkflow).toBeObservable(cold('-a---bc-(d|)'))

            // We have a workflow which includes ping, addDiscount, addVat and calcPrices. The final Workflow should
            // only query the faster one of the two servers.
        })

        it('greet the current user in the currently selected language', () => {

            // ↓ Your code here
            const observable$ = combineLatest([getCurrentUser(), getActiveLanguage()]).pipe(
                filter(([user, lang]) => !!user && !!lang),
                map(([user, lang]) => `${getHelloInLanguage(lang)} ${user.name}`),
                distinctUntilChanged()
            );
            // ↑ Your code here

            expect(observable$).toBeObservable(hot('---a--b-c--defeh-ij(kl)m', {
                a: 'Hello Albert Ahörnchen',
                b: 'Hallo Albert Ahörnchen',
                c: 'Hallo Berta Bhörnchen',
                d: 'Hallo Dora the Explorer',
                e: 'Hallo Charlotte Chicoree',
                f: 'Hello Charlotte Chicoree',
                g: 'Hello Charlotte Chicoree',
                h: 'Hallo Eric Erroruser',
                i: 'Bonjour Eric Erroruser',
                j: 'Bonjour Albert Ahörnchen',
                k: 'Bonjour Berta Bhörnchen',
                l: 'Hello Berta Bhörnchen',
                m: 'Hello Herta Hertenstein'
            }));

            // Print out a greeting when a new user connects and when the current user changes the language. A user should not be greeted
            // twice in the same language.
        })
    })
})

