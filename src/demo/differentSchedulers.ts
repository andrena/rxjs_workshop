import { asapScheduler, asyncScheduler, Observable, observeOn, queueScheduler } from 'rxjs'

console.log('Start')
setTimeout(() => console.log('Timeout'))
new Promise((resolve) => resolve(1)).then(() => console.log('Promise'))
new Observable(subscriber => subscriber.next()).pipe(observeOn(asyncScheduler)).subscribe(() => console.log('Observable async'))
new Observable(subscriber => subscriber.next()).pipe(observeOn(asapScheduler)).subscribe(() => console.log('Observable asap'))
new Observable(subscriber => subscriber.next()).pipe(observeOn(queueScheduler)).subscribe(() => console.log('Observable queue'))
// new Observable(subscriber => subscriber.next()).pipe(observeOn(animationFrameScheduler)).subscribe(() => console.log('Observable animation frame'))

console.log('End')
