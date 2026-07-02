// Visualisierung der olympischen Sommermedaillen europäischer Länder
// Datenquelle: olympia_medaillen.csv
// Kartenformen: europe.geojson

// Pfade zu den Daten
const DATA_PATH = "data/olympia_medaillen.csv";
const GEO_PATH = "data/europe.geojson";

// Standardwerte
const DEFAULT_COUNTRY = "Germany";
const TOTAL_YEAR = "Gesamt";

// Manche GeoJSON-Ländernamen unterscheiden sich von den CSV-Namen.
// Diese Map korrigiert solche Fälle.
const geoToCsvName = new Map([
    ["Czech Republic", "Czechia"],
    ["Republic of Moldova", "Moldova"],
    ["The former Yugoslav Republic of Macedonia", "North Macedonia"],
    ["Holy See (Vatican City)", "Vatican City"]
]);

// Globale Variablen
let csvData = [];
let medalByYearCountry = new Map();   // Lookup: "Jahr|Land" → Medaillendaten
let years = [];
let currentYear = TOTAL_YEAR;
let selectedCountry = DEFAULT_COUNTRY;
let mappedCountries = new Set();      // Länder, die im GeoJSON vorkommen

// D3-Elemente
const svg = d3.select("#map");
const tooltip = d3.select("#tooltip");

// Kartenprojektion
const projection = d3.geoMercator()
    .center([16, 53])
    .scale(440)
    .translate([360, 280]);

const path = d3.geoPath().projection(projection);

// Farbskala für Goldmedaillen
const colorScale = d3.scaleSequential(d3.interpolateYlOrRd);

// Daten laden

Promise.all([d3.csv(DATA_PATH), d3.json(GEO_PATH)])
    .then(([loadedCsv, geoData]) => {

        // CSV vorbereiten (Zahlen konvertieren)
        csvData = prepareCsvData(loadedCsv);

        // Lookup-Tabelle erstellen
        medalByYearCountry = createLookup(csvData);

        // Liste aller Jahre extrahieren
        years = getYears(csvData);

        // Prüfen, welche CSV-Länder im GeoJSON vorkommen
        mappedCountries = findMappedCountries(geoData, csvData);

        // Dropdown für Jahresauswahl erstellen
        buildYearSelect(years);

        // Erste Visualisierung
        updateVisualization(geoData);
    })
    .catch(error => {
        console.error("Dateien konnten nicht geladen werden:", error);
        d3.select("#coverage-note").text("Die CSV- oder GeoJSON-Datei konnte nicht geladen werden.");
    });


// CSV vorbereiten

function prepareCsvData(rows) {
    return rows.map(row => ({
        country: row.country.trim(),
        year: row.year.trim(),
        gold: Number(row.gold) || 0,
        silver: Number(row.silver) || 0,
        bronze: Number(row.bronze) || 0,
        total: Number(row.total) || 0
    }));
}


// Lookup-Tabelle: "Jahr|Land" → Medaillendaten

function createLookup(rows) {
    const lookup = new Map();
    rows.forEach(row => lookup.set(`${row.year}|${row.country}`, row));
    return lookup;
}


// Liste aller Jahre extrahieren

function getYears(rows) {
    const uniqueYears = [...new Set(rows.map(row => row.year))];

    // Gesamtjahr zuerst, dann chronologisch
    const olympicYears = uniqueYears
        .filter(year => year !== TOTAL_YEAR)
        .sort((a, b) => Number(a) - Number(b));

    return [TOTAL_YEAR, ...olympicYears];
}

// Dropdown für Jahresauswahl

function buildYearSelect(yearOptions) {
    const select = d3.select("#year-select");

    select.selectAll("option")
        .data(yearOptions)
        .join("option")
        .attr("value", d => d)
        .text(d => d === TOTAL_YEAR ? "Gesamtzeitraum (1996-2024)" : d);

    select.property("value", currentYear);

    select.on("change", event => {
        currentYear = event.target.value;
        updateVisualization(window.currentGeoData);
    });
}

// Prüfen, welche CSV-Länder im GeoJSON vorkommen
function findMappedCountries(geoData, rows) {
    const csvCountries = new Set(rows.map(row => row.country));

    return new Set(
        geoData.features
            .map(feature => getCsvCountryName(feature.properties.NAME))
            .filter(country => csvCountries.has(country))
    );
}

// GeoJSON-Namen → CSV-Namen
function getCsvCountryName(geoName) {
    return geoToCsvName.get(geoName) || geoName;
}

// Medaillendaten für ein Land + Jahr holen
function getMedalRow(country, year = currentYear) {
    return medalByYearCountry.get(`${year}|${country}`);
}

// Alle Medaillendaten des aktuellen Jahres
function getCurrentRows() {
    return csvData.filter(row => row.year === currentYear);
}

// Hauptfunktion: Visualisierung aktualisieren
function updateVisualization(geoData) {
    window.currentGeoData = geoData;

    const yearRows = getCurrentRows();

    // Farbskala anpassen
    const maxGold = d3.max(yearRows, d => d.gold) || 1;
    colorScale.domain([0, maxGold]);

    updateMetrics(yearRows);
    updateTopThree(yearRows);
    updateSelectedCountryBox();
    updateCountryList(yearRows);
    updateCoverageNote(yearRows);
    drawMap(geoData, maxGold);
    drawLegend(maxGold);
}

// Kennzahlen aktualisieren
function updateMetrics(yearRows) {
    const countries = yearRows.length;
    const gold = d3.sum(yearRows, d => d.gold);
    const total = d3.sum(yearRows, d => d.total);
    const zeroMedalCountries = yearRows.filter(d => d.total === 0).length;

    d3.select("#metric-countries").text(countries);
    d3.select("#metric-gold").text(gold);
    d3.select("#metric-total").text(total);
    d3.select("#metric-zero").text(zeroMedalCountries);
}

// Top 3 Länder anzeigen
function updateTopThree(yearRows) {
    const topThree = [...yearRows]
        .sort((a, b) =>
            b.gold - a.gold ||
            b.silver - a.silver ||
            b.bronze - a.bronze ||
            a.country.localeCompare(b.country)
        )
        .slice(0, 3);

    const rows = topThree.map(row => `
        <tr>
            <td><strong>${row.country}</strong></td>
            <td class="medal-gold">${row.gold}</td>
            <td class="medal-silver">${row.silver}</td>
            <td class="medal-bronze">${row.bronze}</td>
            <td><strong>${row.total}</strong></td>
        </tr>
    `).join("");

    d3.select("#top3-content").html(`
        <table>
            <thead>
                <tr><th>Land</th><th>Gold</th><th>Silber</th><th>Bronze</th><th>Gesamt</th></tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `);
}

// Detailbox für ausgewähltes Land
function updateSelectedCountryBox() {
    const row = getMedalRow(selectedCountry);

    const content = row ? `
        <h3>${selectedCountry} (${currentYear})</h3>
        <div class="detail-grid">
            <div class="detail-item"><span>Gold</span><strong class="medal-gold">${row.gold}</strong></div>
            <div class="detail-item"><span>Silber</span><strong class="medal-silver">${row.silver}</strong></div>
            <div class="detail-item"><span>Bronze</span><strong class="medal-bronze">${row.bronze}</strong></div>
            <div class="detail-item"><span>Gesamt</span><strong>${row.total}</strong></div>
        </div>
    ` : `<p>Für ${selectedCountry} liegen in diesem Zeitraum keine Daten vor.</p>`;

    d3.select("#selected-content").html(content);
}

// Liste aller Länder (Chips)
function updateCountryList(yearRows) {
    const chips = [...yearRows]
        .sort((a, b) => b.total - a.total || a.country.localeCompare(b.country))
        .map(row => {
            const zeroClass = row.total === 0 ? " zero" : "";
            return `<span class="country-chip${zeroClass}">${row.country}: ${row.gold}/${row.silver}/${row.bronze}</span>`;
        })
        .join("");

    d3.select("#country-list").html(chips);
}

// Hinweis: Welche Länder fehlen im GeoJSON?
function updateCoverageNote(yearRows) {
    const countriesInCsv = new Set(yearRows.map(row => row.country));

    const missingShapes = [...countriesInCsv]
        .filter(country => !mappedCountries.has(country))
        .sort((a, b) => a.localeCompare(b));

    const note = missingShapes.length
        ? `${countriesInCsv.size} Länder im Datensatz. Ohne eigene GeoJSON-Form: ${missingShapes.join(", ")}.`
        : `${countriesInCsv.size} Länder im Datensatz. Alle CSV-Länder haben eine Kartenform.`;

    d3.select("#coverage-note").text(note);
}

// Karte zeichnen
function drawMap(geoData, maxGold) {
    svg.selectAll(".country")
        .data(geoData.features, d => d.properties.NAME)
        .join("path")
        .attr("class", "country")
        .attr("d", path)

        // CSS-Klassen für Interaktion
        .classed("is-clickable", d => Boolean(getMedalRow(getCsvCountryName(d.properties.NAME))))
        .classed("no-data", d => !getMedalRow(getCsvCountryName(d.properties.NAME)))
        .classed("zero-medals", d => {
            const row = getMedalRow(getCsvCountryName(d.properties.NAME));
            return row && row.total === 0;
        })
        .classed("selected-country", d => getCsvCountryName(d.properties.NAME) === selectedCountry)

        // Farbe setzen
        .attr("fill", d => getCountryFill(getCsvCountryName(d.properties.NAME), maxGold))

        // Interaktionen
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)
        .on("click", selectCountry);
}

// Farbe eines Landes bestimmen
function getCountryFill(country) {
    const row = getMedalRow(country);

    if (!row) return "#e4e9f1";   // Kein Datensatz → hellgrau
    if (row.total === 0) return "#fbfdff"; // 0 Medaillen → fast weiß

    return colorScale(row.gold);  // Goldmedaillen bestimmen Farbe
}

// Tooltip anzeigen
function showTooltip(event, feature) {
    const country = getCsvCountryName(feature.properties.NAME);
    const row = getMedalRow(country);

    // Tooltip nur für Länder mit mindestens einer Medaille
    if (!row || row.total === 0) {
        hideTooltip();
        return;
    }

    tooltip.style("visibility", "visible")
        .html(`<strong>${country}</strong><br>Gesamtanzahl: ${row.total}`);
}

// Tooltip bewegen
function moveTooltip(event) {
    tooltip
        .style("top", `${event.pageY - 12}px`)
        .style("left", `${event.pageX + 16}px`);
}

// Tooltip verstecken
function hideTooltip() {
    tooltip.style("visibility", "hidden");
}

// Land auswählen (Klick)
function selectCountry(event, feature) {
    const country = getCsvCountryName(feature.properties.NAME);

    if (!getMedalRow(country)) return;

    selectedCountry = country;
    updateSelectedCountryBox();

    svg.selectAll(".country")
        .classed("selected-country", d => getCsvCountryName(d.properties.NAME) === selectedCountry);
}

// ============================================================================
// Legende zeichnen
// ============================================================================
function drawLegend(maxGold) {
    svg.select("#legend-group").remove();
    svg.select("#legend-gradient").remove();

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%")
        .attr("x2", "100%");

    gradient.selectAll("stop")
        .data(d3.range(0, 1.01, 0.1))
        .join("stop")
        .attr("offset", d => `${d * 100}%`)
        .attr("stop-color", d => colorScale(d * maxGold));

    const legend = svg.append("g")
        .attr("id", "legend-group")
        .attr("transform", "translate(30, 488)");

    legend.append("text")
        .attr("x", 0)
        .attr("y", -12)
        .attr("class", "legend-title")
        .style("font-size", "12px")
        .style("font-weight", "700")
        .text("Goldmedaillen");

    legend.append("rect")
        .attr("width", 180)
        .attr("height", 12)
        .attr("rx", 2)
        .style("fill", "url(#legend-gradient)");

    legend.append("text")
        .attr("x", 0)
        .attr("y", 30)
        .style("font-size", "11px")
        .text("0");

    legend.append("text")
        .attr("x", 180)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "11px")
        .text(Math.round(maxGold));
}
