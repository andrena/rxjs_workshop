# RxJS Workshop

Held by Marco Sieben and Fabian Stelzig (both andrena objects ag) at the Entwicklertage Karlsruhe on Mai 17th, 2022. 

## First steps

After checking out the project, first run `npm install` or `yarn install`. This should be done automatically if you use this project in Stackblitz.

## Exercises

The exercises can be found at `src/exercises`. There will not be enough time during the workshop to complete all exercises per section. So just pick the ones you would like to work on first.

If you are new to RxJS, it is advised to work on the exercises from top to bottom since they are ordered in increasing difficulty. If, however, you already have some experience with RxJS, feel free to choose which exercises you want to do.


To execute the tests and validate your results, run the scripts `test:piping`, `test:combining` and `test:chaining` (with npm: `npm run $SCRIPTNAME`, with yarn: `yarn $SCRIPTNAME`).

When you want to use `debounceTime`, `delay`, `timer` or `interval` in your tests, please use the mock functions provided in `src/exercises/testHelpers.ts` instead of the original functions from RxJS since the latter ones do not work together with jest-marbles.

### Bonus

If you are already familiar with RxJS and the exercises are too easy for you, try to implement the mocks for `debounceTime`, `delay`, `timer` and `interval` yourselves (for inspiration take a look at `src/exercises/testHelpers.ts`).

## Contact

If you have any questions regarding the workshop, feel free to contact us at marco.sieben@andrena.de and fabian.stelzig@andrena.de.