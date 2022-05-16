# RxJS Workshop

Held by Marco Sieben and Fabian Stelzig (both andrena objects ag) at the Entwicklertage Karlsruhe on Mai 17th, 2022.

Materials are free to use for private education. Feel free to copy it to your machines as long as you keep the reference to the authors.

## This project on github

Here you can find this project on github together with a solutions branch: https://github.com/andrena/rxjs_workshop

## Helpful links

RxJS Operators: https://rxjs.dev/guide/operators
RxJS Animated: https://indepth.dev/reference/rxjs
RxJS Animated: https://indepth.dev/posts/1114/learn-to-combine-rxjs-sequences-with-super-intuitive-interactive-diagrams
RxJS interactive Marbles: https://rxmarbles.com/

Keyboard shortcuts for Stackblitz are the same as for Visual Studio Code. Attached in this repository there are Cheat Sheets for the different operating systems. 

## First steps

After checking out the project, first run `npm install` or `yarn install`. This should be done automatically if you use this project in Stackblitz.

Afterwards run `yarn server` or `npm run serve` and open another terminal by clicking on the plus symbol on the top right of the active terminal.
In this terminal you can run your tests.

## Exercises

The exercises can be found at `src/exercises`. There will not be enough time during the workshop to complete all exercises per section. So just pick the ones you would like to work on first.

When you start with an exercises, first check whether there is any `@ts-ignore` comment in the test. If so, remove it. This should help with the solutions since then you also get the help of type checking.
When the test console output is a bit overwhelming (especially with all the failing tests at the beginning), you can proceed as follows:
Change the `it` in the test you are working on to a `fit`. Then, jest will only execute the tests that are called via `fit`.
If your test is green, you can leave it as fit (since it works and won't clutter the logs) and move on to the next test, change `it` to `fit` and make it green as well.

If you are new to RxJS, it is advised to work on the exercises from top to bottom since they are ordered in increasing difficulty. If, however, you already have some experience with RxJS, feel free to choose which exercises you want to do.


To execute the tests and validate your results, run the scripts `test:piping`, `test:combining` and `test:chaining` (with npm: `npm run $SCRIPTNAME`, with yarn: `yarn $SCRIPTNAME`).

When you want to use `debounceTime`, `delay`, `timer` or `interval` in your tests, please use the mock functions provided in `src/exercises/testHelpers.ts` instead of the original functions from RxJS since the latter ones do not work together with jest-marbles.

### Bonus

If you are already familiar with RxJS and the exercises are too easy for you, try to implement the mocks for `debounceTime`, `delay`, `timer` and `interval` yourselves (for inspiration take a look at `src/exercises/testHelpers.ts`).

## Contact

If you have any questions regarding the workshop, feel free to contact us at marco.sieben@andrena.de and fabian.stelzig@andrena.de.
