import { cold, hot } from 'jest-marbles'
import { bufferCount, filter, map, max, Observable, pairwise, reduce, scan, startWith, take } from 'rxjs'
import { User } from '../chaining/model'
import { albert, berta, charlotte, dora, eric, frida, gregor, herta } from '../chaining/users'
import { debounceTime, delay, interval, timer } from '../testHelper'
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

    it('return code of adolescent valid users', () => {

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
})

describe('game lobby', () => {

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

    describe('evaluate ages', () => {
        it('get maximum age of first five users', () => {
            let maxAge$: Observable<number>

            maxAge$ = joiningUser$.pipe(
                // ↓ Your code here
                filter(user => user.code !== eric.code),
                map(user => user.age),
                take(5),
                max(),
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

        describe('scan vs reduce', () => {
            it('get average age of first five users (ignore eric)', () => {
                let averageAge$: Observable<number>

                let users$ = joiningUser$
                // users$ = hot('--a--b|', {a: albert, b: berta})
                averageAge$ = users$.pipe(
                    // ↓ Your code here
                    filter(user => user.code !== eric.code),
                    map(user => user.age),
                    take(5),
                    reduce((avg, current, index) => (avg * index + current) / (index + 1)),
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

            it('get running average age of users (ignore eric)', () => {
                let maxAge$: Observable<number>
                let averageAge$: Observable<number>

                maxAge$ = joiningUser$.pipe(
                    // ↓ Your code here
                    filter(user => user.code !== eric.code),
                    map(user => user.age),
                    scan((max, current) => max > current ? max : current),
                    // ↑ Your code here
                )

                averageAge$ = joiningUser$.pipe(
                    // ↓ Your code here
                    filter(user => user.code !== eric.code),
                    map(user => user.age),
                    scan((avg, current, index) => (avg * index + current) / (index + 1)),
                    // ↑ Your code here
                )

                expect(maxAge$).toBeObservable(cold('-1---23----4-5---67', {
                    1: 78,
                    2: 78,
                    3: 78,
                    4: 78,
                    5: 78,
                    6: 78,
                    7: 78,
                }))
                expect(averageAge$).toBeObservable(cold('-1---23----4-5---67', {
                    1: 78,
                    2: 54,
                    3: 54,
                    4: 42,
                    5: 41.6,
                    6: 37,
                    7: 38,
                }))
                // Restricting our statistics the a set number of users is not ideal. Can you create two new observables that:
                // 1: return the new maximum each time a user joins
                // 2: returns the new average age each time a user joins?
            })
        })
    })

    describe('grouping', () => {
        describe('join message', () => {
            it('only consecutive joins', () => {
                let userChangeMessage$: Observable<string>

                userChangeMessage$ = joiningUser$.pipe(
                    // ↓ Your code here
                    pairwise(),
                    map(([previousUser, newUser]) => `${newUser.name} joined after ${previousUser.name}`),
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

            it('include initial login', () => {
                let userChangeMessage$: Observable<string>

                userChangeMessage$ = joiningUser$.pipe(
                    // ↓ Your code here
                    startWith(null),
                    pairwise(),
                    map(([previousUser, newUser]) => previousUser ?
                        `${newUser.name} joined after ${previousUser.name}`
                        : `${newUser.name} joined the lobby`),
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
        })

        describe('match making', () => {
            it('create group of 3', () => {
                let groups$: Observable<User[]>

                groups$ = joiningUser$.pipe(
                    // ↓ Your code here
                    bufferCount(3),
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

            it('get neighbors', () => {
                type UserWithNeighbors = {
                    user: User,
                    leftNeighbor: User,
                    rightNeighbor: User
                }

                let teams$: Observable<UserWithNeighbors>

                teams$ = joiningUser$.pipe(
                    // ↓ Your code here
                    startWith(null),
                    bufferCount(3, 1),
                    map(([left, user, right]) => (
                        {user, leftNeighbor: left, rightNeighbor: right}
                    )),
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
        })
    })

    describe('timing', () => {
        it('show delayed welcome message after a user logged in', () => {
            let userWelcomePopupText$: Observable<string>

            userWelcomePopupText$ = joiningUser$.pipe(
                // ↓ Your code here
                delay(50),
                map(user => `User ${user.name} just joined!`),
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

        it('debounce welcome message', () => {
            let userWelcomePopupText$: Observable<string>

            userWelcomePopupText$ = joiningUser$.pipe(
                // ↓ Your code here
                debounceTime(30),
                map(user => `User ${user.name} just joined!`),
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

        it('periodically start a new raffle', () => {
            let newRaffleMessage$: Observable<string>

            newRaffleMessage$ = interval(40).pipe(map(i => `Raffle ${i} begins!`))

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

        it('close lobby after some time', () => {
            let gameOverMessage$: Observable<string>

            gameOverMessage$ = timer(100).pipe(map(() => 'Lobby closes. Good Bye!'))

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

        it('periodically end raffles after some time has passed', () => {
            let raffleEndedMessage$: Observable<string>

            raffleEndedMessage$ = timer(100, 40).pipe(
                map((val) => `Raffle ${val + 1} ended.`))

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
    })
})