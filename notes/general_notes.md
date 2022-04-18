# Entwicklertag

## TODO

Handout mit:
- anlegen von Observables mit of und from
- Marble-Syntax (hot, cold, #, |, (, ), ^)
- Testsyntax (expect().toBeObservable())
- Link to RxJS-Seite mit Operatoren

## Next Steps
- Jeder bereitet die Live Demos, die er vorstellt, vor und probt sie. Dadurch erhalten wir auch eine bessere Einschätzung der benötigten Zeit.
- Jeder überlegt sich schöne Übungen für alles (außer Piping; das gucken wir zusammen). Primär für den Teil, den man vorführt, für den anderen Teil welche mit genialen Ideen (oder so).

## Plan

Aktueller Plan des Ablaufs
15 min - Begrüßung und Warum Observables (Beide, Stichpunkte und Text überlegen)
15 min - Unterschied Callback <-> Promise <-> Observables - live Demo (inkl. Unsubscribe) (Marco, nochmal proben, Stichpunkte, evtl. vorbereiten) (erster Probelauf: 21 min)
15 min - Piping - live Demo (Marco)
20
XX min - Interaktive Session: Piping (ohne Marbles)
10 min - Observables durch Marbles veranschaulichen (Fabian)
     Marble-Diagramme ermöglichen uns die grafische Darstellung der zeitlichen Abfolge von Observables und Operationen, die auf diesen durchgeführt werden. Dadurch können komplexe Sachverhalte einfacher verstanden werden.
15 min - Marble Syntax und Tests - live Demo (Fabian) (18 Minuten)

40
15/25
Unabhängige Observables kombinieren: Live Demo mit Marbles und unterschieden zwischen "concat" und "merge" sowie "combineLatest" und "forkJoin". Einen Vertreter je Art in Code zeigen. (Fabian)
Interaktive Session: Combining mit Marbles

40
15/25
Abhängige Observables: Live Demo mit Marbles, Unterschiede (und Anwendungsfälle) zwischen switchMap, exhaustMap, concatMap, .... (Marco)
Beispiele im Code zeigen.
Interaktive Session: Abhängige Observables

5 min - Abschluss


1:10 Interaktiv


Alte Notizen
========================

## Titel
Reaktive Programmierung verstehen mit RxJS und Marble
Entkommen aus der Callback-Hölle - reaktive Programmierung mit RxJS und Marble
Playing with Marbles: Reaktive Streams und wie man sie testet

## Abstract
Im Zeitalter der Webanwendungen kann man sich vor Asynchronität in der Entwicklung nicht mehr retten. Die Seite soll responsiv bleiben, nicht einfrieren und dennoch alle Informationen unmittelbar anzeigen.
Mit gängigen Mechanismen stößt man schnell an die Grenzen des lesbaren Codes und Testings.
RxJS nimmt sich dieses Problems erfolgreich an.
Mit Live-Coding werden neue Aspekte eingeführt. Sowohl die Grundlagen als auch fortgeschrittene Aspekte werden dann durch anknüpfende interaktive Übungen vertieft.
hot('l-e-t-s-s-t-a-r-t|').subscribe()

--------------------------------------------------

Möglichst schnell, möglichst viel und möglichst unäuffällig sollen Daten häufig Nutzern auf Webseiten dargestellt werden. Wir können entweder warten bis eine Anfrage abgefrühstückt ist, oder möglichst asynchron unsere Anfragen durchführen. Dafür bietet RxJS eine Lösung. Hier werden wir sehen wie man Reaktive Streams effizent einsetzt, testet und lieben lernt.



## Extended Abstract
Im Zeitalter der Webanwendungen kann man sich vor Asynchronität in der Entwicklung nicht mehr retten. Die Seite soll responsiv bleiben, nicht einfrieren und dennoch alle Informationen unmittelbar anzeigen.
Mit gängigen Mechanismen stößt man schnell an die Grenzen des lesbaren Codes und Testings.
Die Bibliothek RxJS nimmt sich dieses Problems erfolgreich an, kann auf den ersten Blick mit ihren Möglichkeiten aber erschlagen.

In diesem interaktiven Tutorial gehen wir auf die verschiedenen Aspekte von RxJS ein: Wir beleuchten den Unterschied zwischen Observables, Promises sowie Callbacks und veranschaulichen durch Live-Codings von bereitgestellten Übungen die Kernbestandteile der Bibliothek wie Piping, Combining und Chaining. Darauf aufbauend erarbeiten wir uns gemeinsam Testingmöglichkeiten der Funktionen.
Zur anschaulichen Darstellung setzen wir Marble-Diagramme ein, wodurch verschiedene Operatoren leichter begreifbar werden.

Nach dieser Session haben die Teilnehmer das Handwerkszeug kennengelernt, um RxJS in den eigenen Anwendungen sicher einzusetzen. Fragen wie „Wie verändere ich Daten, die ich asynchron erhalte?“, „Wie löse ich genestete Subscribes auf?“ und „Wie teste ich das eigentlich?“ gehören dann der Vergangenheit an.

Um die Übungen durchführen zu können, wird ein Laptop mit NodeJs, yarn oder npm sowie einer IDE für TypeScript benötigt. Der Code für die Übungen wird über ein GitHub-Repository bereitgestellt.







In diesem interaktiven Tutorial gehen wir auf die Unterschiede von Observables zu Promises und Callbacks ein.
Durch Live-Coding und bereitgestellten Übungen zum Selbstimplementieren werden Kernbestandteilen der Bibliothek wie Piping, Combining und Chaining verinnerlicht. Auch das Testen sowie der Unterschied zwischen hot und cold Observables wird adressiert.
Zur anschaulicheren Darstellung setzen wir Marble-Diagramme ein, verschiedene Operatoren werden dadurch leichter begreifbar.

Nach dieser Session haben die Teilnehmer das Handwerkszeug kennengelernt, um RxJS in den eigenen Anwendungen sicher einzusetzen. Fragen wie „Wie verändere ich Daten, die ich asynchron erhalte?“, „Wie löse ich genestete Subscribes auf?“ und „Wie teste ich das eigentlich?“ gehören dann der Vergangenheit an.

Um die Übungen durchführen zu können, wird ein Laptop mit NodeJs, yarn oder npm sowie einer IDE für TypeScript benötigt. Der Code für die Übungen wird über ein GitHub-Repository bereitgestellt.

-----------------------------


**RxJs ermöglicht es uns mehreren Subscribern informationen zukommen zu lassen und diese je nach Bedarf reaktiv zu verändern**. 

## Biografie

Marco ist Entwickler, weil er gerne komplexe Probleme elegant lößt. Durch gemeinsames Coden begeistert er gerne andere Entwickler  jeglichen Erfahrungslevels für spannende Lösungen und Technologien.

Seit er sein erstes Programmierlernbuch in Händen hielt, ist Marco begeistert von den Möglichkeiten, die sich ihm damit eröffneten. Noch begeisterter ist er von den immer neuen Features und Bibliotheken, die moderne Programmiersprachen mit sich bringen - moderne Probleme erfordern moderne Lösungen! In letzter Zeit ist er überwiegend in Frontendprojekten unterwegs und geht seinen Kollegen mit seiner dadurch gefundenen Liebe und Begeisterung für RxJS gerne auf die Nerven.

Fabian glüht als Full-Stack-Entwickler für die Vielseitigkeit der Softwareentwicklung, den fachliche Austausch mit Entwicklern und das Mitgestalten innovativer Lösungen mithilfe agiler Prozesse.

Fabian ist eher still, zurückhaltend und nicht so der Redetyp. Also warum nicht mal einen Talk halten. Dazu braucht man einen guten Kollegen und ein Spitzenthema. Observables sind so ein Thema. Zum Projekteinstieg fand er sie geradezu verwirrend. Fuchst man sich aber rein in das Thema, so lernt man sie zu schätzen. Observables ermöglichen eine sehr umgängliche asynchrone Programmierung mit einigen Vorteilen gegenüber herkömmlichen Mitteln. Welche das sind das veraten euch Marco und Fabian gern im Talk.

## Ablaufplan

Als Bestandteil von Angular wird RxJS bereits in vielen Projekten verwendet, aber auch als alleinstehende Bibliothek hat es viel zu bieten.
Unsere Beobachtungen aus verschiedenen Projekten zeigen allerdings, dass bei vielen Entwicklern das Verständnis der fortgeschrittenen Techniken wie Combining und Chaining oftmals fehlt, was leicht zu falscher Anwendung, Performanceproblemen und Bugs führen kann. Auch das Testen von Code mit Observables ist in vielen Projekten ein Problemkind.

Mit diesem Tutorial möchten wir den Teilnehmern die Mechanismen der Bibliothek näher bringen, sodass sie anschließend leichter begreifen, wie sie diese einsetzen und was in ihrem Code vor sich geht.

Dazu führen wir neue Konzepte zunächst durch ein Live-Coding ein und erklären es auch mithilfe grafischer Mittel, um den Teilnehmern anschließend durch speziell zugeschnittene kleine Übungen selbst die Tastatur in die Hand zu geben. Jeder mit eigenem Laptop kann teilnehmen. Wir stehen in dieser Zeit für Nachfragen oder konkrete Problemstellungen bereit.

Für jedes der Konzepte ist ca. eine Stunde eingeplant, anschließend wiederholt sich der Ablauf dann für den nächsten, fortgeschritteneren Aspekt.

Aktueller Plan des Ablaufs
10 min - Begrüßung
10 min - Warum Observables
15 min - Unterschied Callback <-> Promise <-> Observables - live Demo
5 min - Observables anlegen - live Demo
10 min - Piping - live Demo
30 min - Interaktive Session: Anlegen und Piping
10 min - Observables durch Marbles veranschaulichen
     Marble-Diagramme ermöglichen uns die grafische Darstellung der zeitlichen Abfolge von Observables und Operationen, die auf diesen durchgeführt werden. Dadurch können komplexe Sachverhalte einfacher verstanden werden.
15 min - Unabhängige Observables kombinieren - live Demo
30 min - Interaktive Session: Combining
15 min - Abhängige Observables Chainen - live Demo
40 min - Interaktive Session: Chaining
15 min - Unsubscribing - live Demo
15 min - Marble: Einführung und Testscheduler - live Demo
      Der Testscheduler ermöglicht mit einfachem Setup, asynchronen Code synchron zu testen. Dabei wird direkt die Implementierung des Frameworks verwendet und keine zusätzliche Komplexität eingeführt.
10 min - Marble Syntax - live Demo
10 min - Helper-Funktionen, was kann man testen - live Demo
10 min - Tests schreiben - live Demo
45 min - Interaktive Session: Testing mit Marble
5 min - Abschluss

Gesamtdauer interaktive Sessions: 145 min
Gesamtdauer Demos: 120 min
