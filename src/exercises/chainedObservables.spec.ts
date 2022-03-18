import { cold, hot } from 'jest-marbles'
import { catchError, concatMap, exhaustMap, mergeMap, of, switchMap } from 'rxjs'
import { ka, sendPackageToAddress, sendPackageToFirstAddressOfCurrentUsersCompany } from './chainingDemoApp'

describe('chained observables', () => {
    describe('flattening operators', () => {
        it('makes a difference which operator you use', () => {
            const outerObservable = hot('-1---2------3')
            const innerObservable = cold('a---b----c|')

            const chainedWithMergeMap = outerObservable.pipe(mergeMap(() => innerObservable))
            const chainedWithSwitchMap = outerObservable.pipe(switchMap(() => innerObservable))
            const chainedWithConcatMap = outerObservable.pipe(concatMap(() => innerObservable))
            const chainedWithExhaustMap = outerObservable.pipe(exhaustMap(() => innerObservable))

            expect(chainedWithMergeMap).toBeObservable(
                cold('-a---(ba)bc-a-c-b----c'),
            )
            expect(chainedWithSwitchMap).toBeObservable(
                cold('-a---a---b--a---b----c'),
            )
            expect(chainedWithConcatMap).toBeObservable(
                cold('-a---b----ca---b----ca---b----c'),
            )
            expect(chainedWithExhaustMap).toBeObservable(
                cold('-a---b----c-a---b----c'),
            )
        })
    })

    describe('hot vs cold observable', () => {
        it('has a different outcome when using in inner observables', () => {
            const outerObservable = hot('           -1--2--|')
            const firstHotInnerObservable = hot('   -ab--c|')
            const secondHotInnerObservable = hot('  --x---y--z|')
            const firstColdInnerObservable = cold(' -ab--c|')
            const secondColdInnerObservable = cold('--x---y--z|')

            const chainedWithColdObservable = outerObservable.pipe(concatMap((val) => val === '1' ? firstColdInnerObservable : secondColdInnerObservable))
            const chainedWithHotObservable = outerObservable.pipe(concatMap((val) => val === '1' ? firstHotInnerObservable : secondHotInnerObservable))

            expect(chainedWithColdObservable).toBeObservable(
                cold('--ab--c--x---y--z|'),
            )
            expect(chainedWithHotObservable).toBeObservable(
                cold('-ab--cy--z|'),
            )
        })
    })

    describe('catchError', () => {
        it('makes a difference whether put on inner or outer observable', () => {
            const outerObservable = hot('1--2')
            const innerObservable = cold('-#')

            const chainedWithCatchOnOuter = outerObservable.pipe(
                switchMap(() => innerObservable),
                catchError(() => of('e')))
            const chainedWithCatchOnInner = outerObservable.pipe(
                switchMap(() => innerObservable.pipe(
                    catchError(() => of('e')),
                )))

            expect(chainedWithCatchOnOuter).toBeObservable(cold('-(e|)'))
            expect(chainedWithCatchOnInner).toBeObservable(cold('-e--e'))
        })
    })

    describe('demo app', () => {
        describe('sendPackageToFirstAddressOfCurrentUsersCompany', () => {
            it('sends package to Karlsruhe', (done) => {
                sendPackageToAddress.mockImplementation(() => {
                    expect(sendPackageToAddress).toHaveBeenCalledWith(ka)
                    done()
                })
                sendPackageToFirstAddressOfCurrentUsersCompany()
            })
        })
    })
})