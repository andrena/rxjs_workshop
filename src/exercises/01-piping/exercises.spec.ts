// noinspection ES6UnusedImports

import { cold, hot } from 'jest-marbles'
import {
    bufferCount,
    catchError,
    distinctUntilChanged,
    filter,
    first,
    from,
    map,
    max,
    Observable,
    of,
    pairwise,
    reduce,
    scan, shareReplay,
    skip,
    startWith,
    take,
    takeUntil, tap,
} from 'rxjs'
import { english, french, german } from '../testData/data/languages'
import { albert, berta, charlotte, dora, eric, frida, gast, gregor, herta } from '../testData/data/users'
import { Language, User } from '../testData/dataModel'
import { getActiveLanguage, getHelloInLanguage } from '../testData/providerFunctions'
import { debounceTime, delay, interval, timer } from '../testHelper'

describe('piping', () => {
    describe('not exercises, just some illustrations', () => {
        const numbers: number[] = [1, 2, 3, 5, 8, 13]

        it('create an observable with single emit', () => {

            const observable$ = of(numbers)

            expect(observable$).toBeObservable(cold('(a|)', {
                a: numbers,
            }))

            // of() creates a cold observable that immediately emits the given value and completes when being subscribed to.
        })

        it('create an observable with multiple emits', () => {

            const observable$ = from(numbers)

            expect(observable$).toBeObservable(cold('(abcdef|)', {
                a: 1, b: 2, c: 3, d: 5, e: 8, f: 13,
            }))

            // from() takes an array and creates a cold observable that immediately emits the entries of this array,
            // one by one, and finally completes when being subscribed to.
        })
    })

    describe('exercises', () => {

        // Let's say we have a digital lobby for some game.
        // Users can join all the time, new games start, raffles are held, ...

        let joiningUser$: Observable<User>

        beforeEach(() => {
            // Here is an observable that emits each time a new user joins the lobby.
            // First albert joins, after 40 frames berta and then herta, and so on.
            joiningUser$ = hot('-a---bh----d-g---fc--e', {
                a: albert,
                b: berta,
                c: charlotte,
                d: dora,
                e: eric,
                f: frida,
                g: gregor,
                h: herta,
            })
        })

        it('map: get user names', () => {
            // @ts-ignore
            const activeUserName$: Observable<string> = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(activeUserName$).toBeObservable(cold('-a---bh----d-g---fc--e',
                {
                    a: albert.name,
                    b: berta.name,
                    c: charlotte.name,
                    d: dora.name,
                    e: eric.name,
                    f: frida.name,
                    g: gregor.name,
                    h: herta.name,
                }))

            // Create an observable that returns the active user's name
        })

        it('take: first value', () => {
            const firstUser: Observable<User> = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(firstUser).toBeObservable(cold('-(a|)', {
                a: albert,
            }))

            // Only retrieve the first value out of the observable. There are multiple ways to do this.
        })

        it('startWith: the default language should be german at the start', () => {
            const activeLangWithDefault$: Observable<Language> = getActiveLanguage().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(activeLangWithDefault$).toBeObservable(hot('g-e--eg--g---eg--f-e',
                {e: english, g: german, f: french},
            ))

            // At the start the active language displayed on the website should be german. At the moment we only have
            // the changes by the user in the observable getActiveLanguage.
            // Add german as initial value of the observable.
        })

        it('first: retrieve first user that is younger than 18', () => {
            const firstActualUser$: Observable<User> = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(firstActualUser$).toBeObservable(cold('-----------(a|)', {
                a: dora,
            }))

            // Only retrieve the first non-null value from the observable. Try to do this with one operator.
        })

        it('skip: skip first value', () => {
            const fromSecondUser$: Observable<User> = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(fromSecondUser$).toBeObservable(cold('-----bh----d-g---fc--e',
                {a: albert, b: berta, c: charlotte, d: dora, e: eric, f: frida, g: gregor, h: herta}))

            // Skip the first value.
        })

        it('filter, map: return code of adolescent users', () => {
            // @ts-ignore
            const adultUserCode$: Observable<string> = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(adultUserCode$).toBeObservable(hot('-a---bh------g----c--e', {
                a: albert.code,
                b: berta.code,
                c: charlotte.code,
                e: eric.code,
                g: gregor.code,
                h: herta.code,
            }))

            // From the current user observable only retrieve users older than 18. Then return the code of the users matching.
        })

        it('takeUntil, filter, map: only take until the discount time observable emits', () => {
            // Only emit users as long as this observable has not emitted
            const lobbyClosed$ = cold('--------(x|)')

            const newUserInLobby$: Observable<User> = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(newUserInLobby$).toBeObservable(cold('-a---bh-|', {
                a: albert, b: berta, h: herta,
            }))

            // We can only let users into the lobby as long as it has not closed yet. We have an observable lobbyClosed$
            // that will emit (and complete) when the lobby closes.
            // Create an observable that emits the joiningUsers as long as the lobby is open.
        })

        it('distinctUntilChanged, map: return hello message on language change', () => {

            const helloMessage$: Observable<string> = getActiveLanguage().pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(helloMessage$).toBeObservable(hot('--e---g------eg--f-e', {
                e: 'Hello', g: 'Hallo', f: 'Bonjour',
            }))

            // Return the hello message on language changes. When the users selects the currently active language again no message should be
            // returned.
        })

        describe('handle errors', () => {

            let usersWithError$: Observable<User>

            beforeEach(() => {
                usersWithError$ = hot('--a---b-c-#--eg', {a: albert, b: berta, c: charlotte, e: eric, g: gregor})
            })

            it('catchError, map: return the user gast when an error occurs and return the codes of the users in the observable ', () => {
                // @ts-ignore
                const user$: Observable<string> = usersWithError$.pipe(
                    // ↓ Your code here
                    // ↑ Your code here
                )

                expect(user$).toBeObservable(cold('--a---b-c-(d|)',
                    {a: albert.code, b: berta.code, c: charlotte.code, d: gast.code}))

                // When an error occurs return an observable of the user gast. Return the code of every user in the observable.
            })

            it('catchError, map: experiment what happens when you turn things around', () => {
                const user$ = usersWithError$.pipe(
                    map(user => user?.code),
                    catchError((_) => of(gast)),
                )

                // @ts-ignore
                expect(user$).toBeObservable(
                    // ↓ Your code here
                    // ↑ Your code here
                )

                // When an error occurs we again return the user gast. What should be the expected outcome of the example above.
            })

        })

        it('map, take, max: get maximum age of first five users', () => {
            let maxAge$: Observable<number>

            // @ts-ignore
            maxAge$ = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(maxAge$).toBeObservable(cold('-------------(a|)', {
                a: 78,
            }))
            // We want to do some statistics.
            // For the first five users that join our lobby, we want to find the maximum age.
            // Create an observable that returns the maximum age of the first five users.
            // Question: Why does this only work if we restrict the number of users we want to investigate?
        })

        it('map, take, reduce: get average age of first five users', () => {
            let averageAge$: Observable<number>

            let users$ = joiningUser$
            // users$ = hot('--a--b|', {a: albert, b: berta})
            // @ts-ignore
            averageAge$ = users$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            let expectedResult$ = cold('-------------(a|)', {
                a: 41.6,
            })
            // expectedResult$ = cold('------(x|)', {x: 54})
            expect(averageAge$).toBeObservable(expectedResult$)
            // Additionally to the maximum age, we also want to know the average age of the first five users.
            // Bonus:
            // Does your implementation also work when uncommenting the commented out code?
        })

        it('map, scan: get running average age of users', () => {
            let maxAge$: Observable<number>
            let averageAge$: Observable<number>

            // @ts-ignore
            maxAge$ = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            // @ts-ignore
            averageAge$ = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(maxAge$).toBeObservable(cold('-1---23----4-5---67--8', {
                1: 78,
                2: 78,
                3: 78,
                4: 78,
                5: 78,
                6: 78,
                7: 78,
                8: 78,
            }))
            expect(averageAge$).toBeObservable(cold('-1---23----4-5---67--8', {
                1: 78,
                2: 54,
                3: 54,
                4: 42,
                5: 41.6,
                6: 37,
                7: 38,
                8: 38,
            }))
            // Restricting our statistics the a set number of users is not ideal. Can you create two new observables that:
            // 1: return the new maximum each time a user joins
            // 2: returns the new average age each time a user joins?
        })

        it('pairwise, map: display consecutive joins', () => {
            let userChangeMessage$: Observable<string>

            // @ts-ignore
            userChangeMessage$ = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(userChangeMessage$).toBeObservable(cold('-----12----3-4---56--7', {
                    1: `${berta.name} joined after ${albert.name}`,
                    2: `${herta.name} joined after ${berta.name}`,
                    3: `${dora.name} joined after ${herta.name}`,
                    4: `${gregor.name} joined after ${dora.name}`,
                    5: `${frida.name} joined after ${gregor.name}`,
                    6: `${charlotte.name} joined after ${frida.name}`,
                    7: `${eric.name} joined after ${charlotte.name}`,
                }),
            )
            // We want to display a message each time a new user joins.
            // The message text should be 'NEWUSER_NAME joined after PREVIOUSUSER_NAME'.
            // This message makes only sense once the second user joined because before that there
            // is no previous user.
            // Create an observable that emits the message for all users, beginning with the second.
        })

        it('pairwise, startWith, map: display consecutive and initial join', () => {
            let userChangeMessage$: Observable<string>

            // @ts-ignore
            userChangeMessage$ = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(userChangeMessage$).toBeObservable(cold('-0---12----3-4---56--7', {
                    0: `${albert.name} joined the lobby`,
                    1: `${berta.name} joined after ${albert.name}`,
                    2: `${herta.name} joined after ${berta.name}`,
                    3: `${dora.name} joined after ${herta.name}`,
                    4: `${gregor.name} joined after ${dora.name}`,
                    5: `${frida.name} joined after ${gregor.name}`,
                    6: `${charlotte.name} joined after ${frida.name}`,
                    7: `${eric.name} joined after ${charlotte.name}`,
                }),
            )
            // The same as above. However, this time we also want to show a message
            // when the first user joins: 'FIRSTUSER_NAME joined the lobby'.
            // Extend your previous solution to fulfill this requirement.
        })

        it('bufferCount: create group of 3 users', () => {
            let groups$: Observable<User[]>

            // @ts-ignore
            groups$ = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(groups$).toBeObservable(cold('------1----------2', {
                1: [albert, berta, herta],
                2: [dora, gregor, frida],
            }))
            // The game always requires three people per match.
            // So whenever there have enough people joined the lobby to start a match, they should be grouped.
            // Create an observable that emits such a group whenever there have enough people joined.
        })

        it('bufferCount, map, startWith: get neighbors of joining users', () => {
            type UserWithNeighbors = {
                user: User,
                leftNeighbor: User,
                rightNeighbor: User
            }

            let teams$: Observable<UserWithNeighbors>

            // @ts-ignore
            teams$ = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(teams$).toBeObservable(cold('-----12----3-4---56--7', {
                1: {user: albert, leftNeighbor: null, rightNeighbor: berta},
                2: {user: berta, leftNeighbor: albert, rightNeighbor: herta},
                3: {user: herta, leftNeighbor: berta, rightNeighbor: dora},
                4: {user: dora, leftNeighbor: herta, rightNeighbor: gregor},
                5: {user: gregor, leftNeighbor: dora, rightNeighbor: frida},
                6: {user: frida, leftNeighbor: gregor, rightNeighbor: charlotte},
                7: {user: charlotte, leftNeighbor: frida, rightNeighbor: eric},
            }))
            // There is also a metagame in the lobby. A raffle is held and if one player wins,
            // his/her neighbors have a higher chance of winning the next raffle.
            // Therefore, we need to determine the left and right neighbors of each player.
            // This is done strictly by the order they joined. The first player has no left neighbor
            // and the second player as right neighbar. The second player has the first one as first neighbor
            // and the third one as right neighbor. And so on.
            // Create an observable that emits the users together with their neighbors
            // (see the type UserWithNeighbors above).
            // Hint: The first user can only be emitted when the second player has joined. Otherwise it's not possible
            // to determine the right neighbor.
        })

        it('delay, map: how delayed welcome message after a user logged in', () => {
            let userWelcomePopupText$: Observable<string>

            // @ts-ignore
            userWelcomePopupText$ = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(userWelcomePopupText$).toBeObservable(cold('------a---bh----d-g---fc--e', {
                    a: `User ${albert.name} just joined!`,
                    b: `User ${berta.name} just joined!`,
                    h: `User ${herta.name} just joined!`,
                    d: `User ${dora.name} just joined!`,
                    g: `User ${gregor.name} just joined!`,
                    f: `User ${frida.name} just joined!`,
                    c: `User ${charlotte.name} just joined!`,
                    e: `User ${eric.name} just joined!`,
                }),
            )
            // Whenever a user joins, we want to display a welcome message for that user.
            // This message should, however, be delayed for 50 milli seconds.
            // Create an observable that emits the welcome message 'User USER_NAME just joined!' each time
            // a new player joined, but delayed by 50ms.

            // Attention: Usually, you would use 'delay' from rxjs. In this test, please use the provided
            // 'delay'-stub that is imported from '../testHelpers'. It works the same way in this example but instead of
            // the actual 'delay', it can be tested better.
        })

        it('debounceTime, map: debounce welcome message', () => {
            let userWelcomePopupText$: Observable<string>

            // @ts-ignore
            userWelcomePopupText$ = joiningUser$.pipe(
                // ↓ Your code here
                // ↑ Your code here
            )

            expect(userWelcomePopupText$).toBeObservable(cold('----a----h------g-------e', {
                    a: `User ${albert.name} just joined!`,
                    h: `User ${herta.name} just joined!`,
                    g: `User ${gregor.name} just joined!`,
                    e: `User ${eric.name} just joined!`,
                }),
            )
            // We noticed that the welcome messages switch way to fast when users join with only a small time between them.
            // So we want to change the behavior of the messages:
            // Instead of just delaying them, we want to debounce them by 30 milliseconds.
            // So when during 30ms after a user joined no other user joined, we display the welcome message.
            // If, however, in this timeframe a new user joins, we skip the message for the first user and then follow
            // the same procedure for the message for the second user (wait 30ms and display or skip).

            // Attention: Usually, you would use 'debounceTime' from rxjs. In this test, please use the provided
            // 'debounce'-stub that is imported from '../testHelpers'. It works the same way in this example but instead of
            // the actual 'debounce', it can be tested better.
        })

        it('interval, map: periodically start a new raffle', () => {
            let newRaffleMessage$: Observable<string>

            // ↓ Your code here
            // ↑ Your code here

            expect(newRaffleMessage$.pipe(take(5))).toBeObservable(
                cold('1---2---3---4---(5|)', {
                    1: 'Raffle 1 begins!',
                    2: 'Raffle 2 begins!',
                    3: 'Raffle 3 begins!',
                    4: 'Raffle 4 begins!',
                    5: 'Raffle 5 begins!',
                }),
            )
            // We want to hold raffles in our lobby.
            // Every 40 milli seconds, a new raffle begins.
            // Create an observable that emits the text 'Raffle RAFFLENUMBER begins!' indefinitely

            // Attention: Usually, you would use 'interval' from rxjs. In this test, please use the provided
            // 'interval'-stub that is imported from '../testHelpers'. It works the same way in this example but instead of
            // the actual 'interval', it can be tested better.
        })

        it('timer, map: close lobby after some time', () => {
            let gameOverMessage$: Observable<string>

            // ↓ Your code here
            // ↑ Your code here

            expect(gameOverMessage$).toBeObservable(
                cold('----------(x|)', {
                    x: 'Lobby closes. Good Bye!',
                }),
            )

            // Lobbies are expensive and grow old, so we want to automatically close our lobby after 100 milli seconds.
            // Create an observable that emits the Message 'Lobby closes. Good Bye!' after 100 ms.

            // Attention: Usually, you would use 'timer' from rxjs. In this test, please use the provided
            // 'timer'-stub that is imported from '../testHelpers'. It works the same way in this example but instead of
            // the actual 'timer', it can be tested better.
        })

        it('timer, map: periodically end raffles after some time has passed', () => {
            let raffleEndedMessage$: Observable<string>

            // ↓ Your code here
            // ↑ Your code here

            expect(raffleEndedMessage$.pipe(take(5))).toBeObservable(
                cold('----------0---1---2---3---(4|)', {
                    0: 'Raffle 1 ended.',
                    1: 'Raffle 2 ended.',
                    2: 'Raffle 3 ended.',
                    3: 'Raffle 4 ended.',
                    4: 'Raffle 5 ended.',
                }),
            )

            // Previously we periodically startet a new raffle. Now we want to end these raffles after some time has passed.
            // Create an observable that waits for 100ms and then indefinitely emits the messages
            // 'Raffle RAFFLENUMBER ended.' every 40 milli seconds.

            // Attention: Usually, you would use 'timer' from rxjs. In this test, please use the provided
            // 'timer'-stub that is imported from '../testHelpers'. It works the same way in this example but instead of
            // the actual 'timer', it can be tested better.

            // Bonus: Can you implement this method without 'timer' but using 'interval' and 'delay' instead?
        })

        it('shareReplay: only call cold observable once, keep buffer', () => {
            const mockFunction1 = jest.fn()
            const mockFunction2 = jest.fn()
            const startingObservable$ = cold('-a--b--')

            const resultingObservable$ = startingObservable$.pipe(
                tap(() => mockFunction1()),
                // ↓ Your code here
                // ↑ Your code here
            )

            resultingObservable$.subscribe(() => mockFunction2())
            resultingObservable$.subscribe(() => mockFunction2())

            expect(startingObservable$).toSatisfyOnFlush(() => {
                expect(mockFunction1).toHaveBeenCalledTimes(2)
                expect(mockFunction2).toHaveBeenCalledTimes(4)
            })

            // We want to subscribe to the resultingObservable$ multiple times to receive the emitted values on multiple places.
            // However, we do not want the calculations for this observable (in this case the "tap") to be executed each
            // time we subscribe but we want to buffer the result instead and share it across the subscribers.
        })
    })
})