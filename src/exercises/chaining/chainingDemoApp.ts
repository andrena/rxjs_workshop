import { cold, hot } from 'jest-marbles'
import { filter, Observable } from 'rxjs'
import { andrenaKa, andrenaMuc, otherAddress } from './addresses'
import { cart1, cart2, cart3 } from './carts'
import { andrena, otherComp } from './companies'
import { Address, Cart, Company, Language, Status, User } from './model'
import { created, verified } from './status'
import { albert, berta, charlotte, dora, eric, frida, gregor, herta } from './users'
import { english, french, german } from './languages';

export function getActiveLanguage() {
    return hot('--e--eg--g---eg--f-e', {
        e: english, g: german, f: french
    })
}

export const getHelloInLanguage = (lang: Language): string => {
    switch (lang) {
        case english:
            return 'Hello'
        case german:
            return 'Hallo'
        case french:
            return 'Bonjour'
        default:
            return 'Hi'
    }
}

export function getCurrentUser(): Observable<User> {
    return hot('0--a----b--dc--e--ab---h', {
        0: null,
        a: albert,
        b: berta,
        c: charlotte,
        d: dora,
        e: eric,
        h: herta,
    })
}

export function getCurrentUsersWithError(): Observable<User> {
    return hot('--a---b-c-#--eg', {a: albert, b: berta, c: charlotte, e: eric, g: gregor});
}


export function getInactiveUsers(): Observable<User> {
    return cold('---g-----f|', {
        f: frida,
        g: gregor,
    })
}

export function getWorkingCurrentUser(): Observable<User> {
    return getCurrentUser().pipe(
        filter(user => user && user.code !== eric.code),
    )
}

export function getStatus(userCode: string): Observable<Status> {
    switch (userCode) {
        case albert.code:
            return cold('-c--v|', {c: created, v: verified})
        case berta.code:
            return cold('-c|', {c: created})
        case charlotte.code:
            return cold('--v|', {v: verified})
        case dora.code:
            return cold('-----v|', {v: verified})
        case eric.code:
            return cold('-#', null, 'Internal Server Error')
        case herta.code:
            return cold('-c|', {c: created})
        default:
            return cold('-#', null, 'Invalid user code')
    }
}

export function getActiveCart(): Observable<Cart> {
    return hot('0---1--201-03-0--21', {
        0: null,
        1: cart1,
        2: cart2,
        3: cart3,
    })
}

export function getCompany(userCode: string): Observable<Company> {
    switch (userCode) {
        case albert.code:
            return cold('-(a|)', {a: andrena})
        case berta.code:
            return cold('--(a|)', {a: andrena})
        case charlotte.code:
            return cold('-(o|)', {o: otherComp})
        case dora.code:
            return cold('------(o|)', {o: otherComp})
        case eric.code:
            return cold('-#', null, 'Internal Server Error')
        case herta.code:
            return cold('-(o|)', {o: otherComp})
        default:
            return cold('-#', null, 'Invalid user code')
    }
}

export function getAddresses(company: Company): Observable<Address[]> {
    switch (company) {
        case andrena:
            return cold('----(a|)', {a: [andrenaKa, andrenaMuc]})
        case otherComp:
            return cold('--(o|)', {o: [otherAddress]})
        default:
            return cold('-#', null, 'Unknown company')
    }
}
