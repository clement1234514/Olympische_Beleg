# Belegarbeit: Datenvisualisierung – Olympische Medaillen (1996–2024)

Dieses Projekt visualisiert die erfolgreichsten europäischen Nationen bei den Olympischen Sommerspielen von 1996 bis 2024 mithilfe einer interaktiven Choropleth-Karte (Flächenkartogramm). Ein besonderer Fokus liegt auf dem Abschneiden von Deutschland im direkten Vergleich.

---

##  Verwendete Technologien & Ressourcen (Quellenangaben)

Für die Umsetzung dieser Anwendung wurden ausschließlich quelloffene Webtechnologien und freie Datenquellen genutzt. Um Netzwerkblockaden (CORS-Richtlinien) oder Proxy-Filter im universitären Umfeld komplett zu umgehen, wurden alle Ressourcen **lokal** in das Projekt eingebunden.

### 1. Bibliotheken & Frameworks
* **D3.js (Data-Driven Documents) v7.8.5:** Wird für die gesamte Datenbindung, die Verarbeitung der Geodaten, das Zeichnen der SVG-Karte, die Farbskalierung sowie die Interaktionen (Klicks, Tooltips) verwendet. 
  * *Quelle:* [Official D3.js Library](https://d3js.org/) (Lokale Kopie unter `js/d3.v7.min.js`).

### 2. Datenquellen
* **Geodaten (Kartenmaterial):** Eine angepasste GeoJSON-Datei, die die Ländergrenzen Europas abbildet. Gemäß der Aufgabenstellung sind hierbei auch Russland und die Türkei als europäische Länder enthalten.
  * *Quelle:* [leakyMirror / map-of-europe (GitHub)](https://github.com/leakyMirror/map-of-europe) (Lokale Kopie unter `data/europe.geojson`).
* **Medaillenspiegel-Daten:** Eine selbst erstellte und bereinigte CSV-Datei (`olympia_medaillen.csv`), welche die offiziellen Medaillenspiegel der Olympischen Sommerspiele von 1996 bis 2024 (einschließlich der Gesamtwerte) strukturiert zusammenfasst.
  * *Quelle:* Zusammentragung basierend auf den offiziellen Platzierungen und historischen Datenarchiven (u. a. Wikipedia).

### 3. Programmiersprachen & Laufzeitumgebung
* **HTML5 & CSS3:** Für die semantische Struktur (Layout-Container, Steuerelemente) und das visuelle Design (Side-Panels, Tabellen-Styling, Tooltip-Effekte).
* **JavaScript (ES6):** Für die asynchrone Ladelogik (`Promise.all`), Datenbereinigung und dynamische DOM-Manipulation.

---

##  Leitfaden zum Starten des Projekts

Moderne Webbrowser blockieren das asynchrone Laden lokaler Dateien (wie CSV- oder GeoJSON-Dateien) über das Standard-Protokoll (`file:///C:/...`) aus Sicherheitsgründen (**CORS-Richtlinie**). Daher **muss** die Anwendung über einen lokalen Webserver gestartet werden.

### Schritt-für-Schritt-Anleitung mit Visual Studio Code:

1. **Projektordner öffnen:**
   Öffne **Visual Studio Code** (VS Code) und wähle über `Datei` -> `Ordner öffnen...` den Hauptordner aus, in dem sich deine `index.html` befindet.

2. **Erweiterung "Live Server" installieren:**
   * Klicke links in der Aktivitätsleiste auf das Symbol für **Erweiterungen** (oder drücke `Strg + Shift + X`).
   * Suche nach **`Live Server`** (von Ritwick Dey).
   * Klicke auf den grünen **Installieren**-Button.

3. **Server starten ("Go Live"):**
   * Öffne deine `index.html` im Editor.
   * Klicke ganz unten rechts in der blauen Statusleiste von VS Code auf den Button **`Go Live`** (alternativ: Rechtsklick in die `index.html` -> `Open with Live Server`).

4. **Visualisierung betrachten:**
   Der Standard-Browser öffnet sich nun automatisch unter der lokalen Adresse:
   `http://127.0.0.1:5500/index.html`
   
   *Hinweis:* Sollte die Karte nicht direkt geladen werden, drücke einmal **`Strg + F5`** (Windows) bzw. **`Cmd + Shift + R`** (Mac), um den Browser-Cache vollständig zu leeren.

   Live verfügbar über http://clement1234514.me/Olympische_Beleg/ 

---

##  Projektstruktur im Überblick

Stelle sicher, dass deine Dateien genau in dieser Hierarchie angeordnet sind, damit die lokalen Pfade fehlerfrei aufgelöst werden:

```text
├── index.html                  # Struktur der Anwendung und UI-Elemente
├── olympia_medaillen.csv       # Bereinigter Medaillenspiegel (1996-2024)
├── data/
│   └── europe.geojson          # Lokale Geodaten (Europa inkl. RUS & TUR)
├── js/
│   ├── d3.v7.min.js            # Vollständige Kernbibliothek von D3.js (lokal)
│   └── main.js                 # Logik für Datenverarbeitung, Karte & Interaktion
└── css/
    └── style.css               # Design-Regeln für Karte, Tooltips & Info-Boxen
