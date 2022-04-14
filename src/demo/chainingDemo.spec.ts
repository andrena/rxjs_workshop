import { filter } from 'rxjs'
import { getCurrentUser } from '../exercises/chaining/chainingDemoApp'
import { eric } from '../exercises/chaining/users'


// 1) Log company of current users, first with subscription hell, then with mergeMap
// 2) Create new Observable for activeCompany, both with subscriptions and with mergeMap
// 3) Extend logging examples to log addresses
// 4) Use https://rxmarbles.com/ to show difference between switchMap, mergeMap, concatMap, exhaustMap
// 5) Pros: Code cleaner, more control over timing, get a single result observable, unsubscribing much easier
//    Con:  A bit annoying to keep the outer value


const getWorkingUsers = () => getCurrentUser().pipe(filter(user => user && user.code !== eric.code))

describe('demo', () => {
})


//////////////////////////////////////// Prewritten code for reference

// const getActiveCompany = () => {
//     return new Observable<Company>(subscriber => {
//         getWorkingUsers().subscribe(user => {
//             getCompany(user.code).subscribe(company => {
//                 subscriber.next(company)
//             })
//         })
//     })
// }
//
// const getActiveCompany2 = () => getWorkingUsers().pipe(mergeMap(user => getCompany(user.code)))
//
// describe('demo', () => {
//     describe('chaining vs subscription hell', () => {
//
//         it('company subscription hell', () => {
//             getWorkingUsers().subscribe(user => {
//                 getCompany(user.code).subscribe(console.log)
//             })
//         })
//
//         it('company mergeMap', () => {
//             getWorkingUsers().pipe(
//                 mergeMap(user => getCompany(user.code))
//             ).subscribe(console.log)
//         })
//
//         it('addresses subscription hell', () => {
//             getWorkingUsers().subscribe(user => {
//                 getCompany(user.code).subscribe(company => {
//                     getAddresses(company).subscribe(console.log)
//                 })
//             })
//         })
//
//         it('addresses mergeMap', () => {
//             getWorkingUsers().pipe(
//                 mergeMap(user => getCompany(user.code)),
//                 mergeMap(company => getAddresses(company))
//             ).subscribe(console.log)
//         })
//     })
//
//     describe('different flattening operators', () => {
//         const printFirstCombinedValues = (obs: Observable<any>) => obs.pipe(scan((all, val) => [...all, val], [])).subscribe(console.log)
//
//         it('company mergeMap', () => {
//             printFirstCombinedValues(
//                 getWorkingUsers().pipe(
//                     mergeMap(user => getCompany(user.code)),
//                 ),
//             )
//         })
//
//         it('company switchMap', () => {
//             printFirstCombinedValues(
//                 getWorkingUsers().pipe(
//                     switchMap(user => getCompany(user.code)),
//                 ),
//             )
//         })
//     })
// })