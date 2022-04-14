import { distinctUntilChanged, filter, from, map, of, take } from 'rxjs'

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


// map, filter, take