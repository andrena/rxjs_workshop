import { cold, hot } from 'jest-marbles'

describe('test marbels', () => {
    it('works', () => {
        expect(hot('--a')).toBeObservable(cold('--a'))
    })
})