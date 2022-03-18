# Überblick

## Callbacks

Der Code, der "danach" ausgeführt werden soll, wird der Funktion schon beim Aufruf übergeben. Dadurch ergibt sich schnell eine Callback-Hölle mit Callbacks in Callbacks in Callbacks in ....
Außerdem: Ggf. müssen diese Callbacks sehr tief weitergereicht werden und müllen überall den Code zu. Auch Fehlerhandling ist nicht komfortabel.

## Promises

Es wird ein Promise-Objekt zurückgegeben. Auf diesem kann über `.then()` der Folgecode definiert werden, der ausgeführt wird, sobald das Promise resolved (= fertig ist).
Es lassen sich auch mehrere `then`s verketten und kombinieren, was einen übersichtlicheren Code ergibt. Fehlerhandling kann einfach über `.catch()` umgesetzt werden.
`async` und `await` liefern syntactic sugar und machen den Code lesbarer.

## Observables

Ähnlich wie bei Promises wird ein Observable-Objekt zurückgegeben. Auf diesem kann der Folgecode über `.subscribe()` definiert werden. Verketten und Kombinieren ist ebenso möglich.
Observables können über `.pipe()` diverse Transformatoren einbinden, welche die emittierten Werte verändern.

# Unterschiede

- Promises sind eager, Observables sind lazy. Letztere beginnen also erst dann mit der Codeausführung, sobald jemand subscribed hat.
- Observables können mehrmals Werte emittieren.
- Subscriptions auf Observables können wieder gecancelt (unsubscribed) werden.
- Observables können via Piping die Daten filtern oder auch neue Werte hinzufügen.
- Für Observables kann die Laufzeitausführung mit Schedulern angepasst werden (https://betterprogramming.pub/observables-vs-promises-which-one-should-you-use-c19aef53c680#:~:text=The%20biggest%20difference%20is%20that,is%20completed%20or%20unsubscribed%20from.). Mehr Details!