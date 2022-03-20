import { from, take } from 'rxjs'

type Route = {
    id: string
    url: string
    home: boolean
    queryParams: { [name: string]: string | number | boolean }
}

const currentRouteObservable = from([{
    id: 'home',
    home: true,
    url: '/',
    queryParams: {},
}, {
    id: 'myAccount',
    home: false,
    url: '/myAccount',
    queryParams: {},
}, {
    id: 'addresses',
    home: false,
    url: '/myAccount/addresses',
    queryParams: {},
}, {
    id: 'addresses',
    home: false,
    url: '/myAccount/addresses',
    queryParams: {
        mode: 'edit',
    },
}, {
    id: 'home',
    home: true,
    url: '/',
    queryParams: {
        reload: true,
    },
}] as Route[])

currentRouteObservable.pipe(
    take(2),
).subscribe(value => console.log(value))

// map, filter, take