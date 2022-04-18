// 1) Log company of current users, first with subscription hell, then with mergeMap
// 2) Create new Observable for activeCompany, both with subscriptions and with mergeMap
// 3) Extend logging examples to log addresses
// 4) Use https://rxmarbles.com/ to show difference between switchMap, mergeMap, concatMap, exhaustMap
// 5) Pros: Code cleaner, more control over timing, get a single result observable, unsubscribing much easier
//    Con:  A bit annoying to keep the outer value


describe('demo', () => {
})


//////////////////////////////////////// Prewritten code for reference

// const getActiveCompany = () => {
//     return new Observable<Company>(subscriber => {
//         getWorkingCurrentUser().subscribe(user => {
//             getCompany(user.code).subscribe(company => {
//                 subscriber.next(company)
//             })
//         })
//     })
// }
//
// const getActiveCompany2 = () => getWorkingCurrentUser().pipe(mergeMap(user => getCompany(user.code)))
//
// describe('demo', () => {
//     describe('chaining vs subscription hell', () => {
//
//         it('company subscription hell', () => {
//             getWorkingCurrentUser().subscribe(user => {
//                 getCompany(user.code).subscribe(console.log)
//             })
//         })
//
//         it('company mergeMap', () => {
//             getWorkingCurrentUser().pipe(
//                 mergeMap(user => getCompany(user.code))
//             ).subscribe(console.log)
//         })
//
//         it('addresses subscription hell', () => {
//             getWorkingCurrentUser().subscribe(user => {
//                 getCompany(user.code).subscribe(company => {
//                     getAddresses(company).subscribe(console.log)
//                 })
//             })
//         })
//
//         it('addresses mergeMap', () => {
//             getWorkingCurrentUser().pipe(
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
//                 getWorkingCurrentUser().pipe(
//                     mergeMap(user => getCompany(user.code)),
//                 ),
//             )
//         })
//
//         it('company switchMap', () => {
//             printFirstCombinedValues(
//                 getWorkingCurrentUser().pipe(
//                     switchMap(user => getCompany(user.code)),
//                 ),
//             )
//         })
//     })
// })