import { cold, hot } from 'jest-marbles'
import { Observable, throwError } from 'rxjs'
import { andrenaKa, andrenaMuc, otherAddress } from './addresses'
import { cart1, cart2, cart3 } from './carts'
import { andrena, otherComp } from './companies'
import { Address, Cart, Company, User } from './model'
import { albert, berta, charlotte, eric } from './users'


function getCurrentUser(): Observable<User> {
    return hot('0--a----b--c--e--a', {
        0: null,
        a: albert,
        b: berta,
        c: charlotte,
        e: eric,
    })
}

function getActiveCart(): Observable<Cart> {
    return hot('0---1--201-03-0--2', {
        0: null,
        1: cart1,
        2: cart2,
        3: cart3,
    })
}

function getCompany(userCode: string): Observable<Company> {
    switch (userCode) {
        case albert.code:
            return cold('-a', {a: andrena})
        case berta.code:
            return cold('--a', {a: andrena})
        case charlotte.code:
            return cold('-o', {o: otherComp})
        case eric.code:
            return throwError(() => new Error('Server error'))
        default:
            return throwError(() => new Error('Invalid user code'))
    }
}

function getAddresses(company: Company): Observable<Address[]> {
    switch (company) {
        case andrena:
            return cold('----a', {a: [andrenaKa, andrenaMuc]})
        case otherComp:
            return cold('--o', {o: [otherAddress]})
        default:
            return throwError(() => new Error('Unknown company'))
    }
}