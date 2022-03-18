import { Observable } from 'rxjs'

// Angenommen, wir haben eine Methode, die uns den aktuellen Benutzer zurückgibt.
// Für die Demo geben wir den gewünschten User inkl. der Ausführungszeit als Parameter mit.
function getCurrentUser(callback: (result: string) => any, userForDemo: string, waitTimeForDemo: number) {
    // throw 'ERROR'
    setTimeout(() => callback(userForDemo), waitTimeForDemo)
}


// Functions

// Diese Funktion ruft getCurrentUser-Methode auf und gibt das Ergebnis sowie ggf. einen Fehler via Callbacks weiter.
function getCurrentUserWithCallback(callback: (result: string) => any, errorCallback: (error: any) => any) {
    try {
        console.log('Callback executing')
        getCurrentUser((result) => callback(result), 'andrena', 3000)
    } catch (error) {
        errorCallback(error)
    }
}

// Diese Funktion gibt ein Promise zurück, welches mit dem current User resolved oder einem Fehler rejected
function getCurrentUserWithPromise() {
    return new Promise<string>((resolve, reject) => {
        try {
            console.log('Promise executing')
            getCurrentUser((result) => resolve(result), 'andrena', 3000)
        } catch (error) {
            reject(error)
        }
    })
}

// Diese Funktion gibt ein Observable zurück, welches das Ergebnis oder ggf. den Fehler emittiert
function getCurrentUserWithObservable() {
    return new Observable<string>(subscriber => {
        try {
            console.log('Observable executing')
            getCurrentUser(result => subscriber.next(result), 'andrena', 3000)
        } catch (error) {
            subscriber.error(error)
        }
    })
}

// Invocations

console.log('Start')

// Wird kein Error-Handling benötigt, muss entweder () => {} übergeben werden oder getCurrentUserWithCallback muss in der Implementierung
// prüfen, ob der error-Callback undefined ist und ihn ggf. nicht aufrufen. Für den success-Callback gilt das gleiche.
getCurrentUserWithCallback(
    result => console.log(`Callback says ${result}`),
    error => console.error(`Callback says ${error}`),
)

// Wird kein Error-Handling benötigt, dann lässt man lediglich den .catch-Teil weg. Wird auch kein Success-Code benötigt,
// kann ebenso der .then-Code weggelassen werden. Innerhalb von getCurrentUserWithPromise muss nichts beachtet werden.
getCurrentUserWithPromise()
    .then(result => console.log(`Promise says ${result}`))
    .catch(error => console.error(`Promise says ${error}`))

// Wird kein Error-Handling benötigt, lässt man den error:-Teil einfach weg und kann dann sogar direkt die
// next-Methode direkt als Parameter übergeben.
// Wird kein Success-Code benötigt, dann muss dennoch .subscribe() (ohne Parameter) aufgerufen werden,
// da das Observable sonst gar nicht erst mit der internen Ausführung beginnt.
getCurrentUserWithObservable()
    .subscribe({
        next: result => console.log(`Observable says ${result}`),
        error: error => console.error(`Observable says ${error}`),
    })