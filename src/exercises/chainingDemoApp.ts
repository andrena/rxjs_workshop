import { from, Observable, of, switchMap, take } from 'rxjs'

export const ka = {
    line1: 'Albert-Nestler-Straße 1111',
    line2: 'Karlsruhe',
}

export type User = {
    name: string
    code: string
}

export type CartEntry = {
    code: string
    quantity: number
}

export type Cart = {
    id: string
    entries: CartEntry[]
}

export type Address = {
    line1: string
    line2: string
}

function getCurrentUser(): Observable<User> {
    return from([{name: 'Peter', code: 'peter'}, {name: 'Heinz', code: 'heinz'}])
}

function getActiveCart(userCode: string): Observable<Cart> {
    return of({id: '1234', entries: [{code: 'Blumentopferde', quantity: 3}, {code: 'Regenschirm', quantity: 1}]})
}

function getCompany(userCode: string): Observable<string> {
    return of('andrena')
}

function getAddresses(company: string): Observable<Address[]> {
    return of([ka, {
        line1: 'Ganghoferstraße 70',
        line2: 'München',
    }])
}


export const sendPackageToAddress = jest.fn()

export function sendPackageToFirstAddressOfCurrentUsersCompany() {
    getCurrentUser().pipe(
        switchMap(user => getCompany(user.code)),
        switchMap(company => getAddresses(company)),
        take(1),
    ).subscribe(addresses => {
        sendPackageToAddress(addresses[0])
    })
}