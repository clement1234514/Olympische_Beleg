# Belegarbeit: Datenvisualisierung – Olympische Medaillen (1996–2024)

Dieses Projekt visualisiert die erfolgreichsten europäischen Nationen bei den Olympischen Sommerspielen von 1996 bis 2024 mithilfe einer interaktiven Choropleth-Karte (Flächenkartogramm) und D3.js. Ein besonderer Fokus liegt auf dem Abschneiden von Deutschland im direkten Vergleich.

##  Features & Funktionalitäten

- **Interaktive Choropleth-Karte:** Dynamische Einfärbung der europäischen Länder basierend auf der Anzahl der gewonnenen Goldmedaillen (YlOrRd-Farbskala).
- **Zeitraumauswahl:** Über ein Dropdown-Menü kann flexibel zwischen dem Gesamtzeitraum (1996–2024) oder einzelnen Olympia-Jahren gewechselt werden.
- **Top 3 Rangliste:** Ein permanentes Info-Panel zeigt stets die drei erfolgreichsten Länder des ausgewählten Zeitraums (sortiert nach Gold 🥇, Silber 🥈, Bronze 🥉).
- **Detailansicht per Klick:** Durch Klick auf ein Land in der Karte werden dessen genaue Medaillendaten im rechten Info-Panel angezeigt. Standardmäßig ist beim Start **Deutschland** ausgewählt.
- **Smarte Tooltips:** Beim Bewegen der Maus über ein Land mit Medaillen erscheint ein Tooltip mit dem Landesnamen und der Gesamtmedaillenanzahl. Länder ohne Medaillen bleiben weiß/grau und besitzen keinen Tooltip.
- **Robuste Datenbereinigung:** Automatisches Entfernen von unsichtbaren Steuerzeichen (`\r`, Whitespaces) beim Einlesen der CSV-Daten zur Vermeidung von Fehlern bei Zeilenumbrüchen.

##  Ordnerstruktur

Für eine fehlerfreie Ausführung muss die Projektstruktur exakt wie folgt aufgebaut sein:

```text
├── index.html                  # Haupt-HTML-Dokument
├── olympia_medaillen.csv       # Medaillenspiegel-Daten (1996-2024)
├── data/
│   └── europe.geojson          # Lokale Geodaten der europäischen Länder
├── js/
│   ├── d3.v7.min.js            # Vollständige, lokale D3.js (v7) Bibliothek
│   └── main.js                 # Hauptskript für Datenverarbeitung und D3-Logik
└── css/
    └── style.css               # Stylesheets für Layout, Boxen und Karte