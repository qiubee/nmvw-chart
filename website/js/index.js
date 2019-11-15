/*jshint esversion: 8 */

import { select, json, geoPath, geoEqualEarth } from "d3";
import { feature } from "topojson";

// object met nmvw info
const nmvw = {
    apiURL: "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-05/sparql",
    apiQuery: `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    
    SELECT ?placeName ?type (COUNT(?obj) AS ?objCount)  WHERE {
        <https://hdl.handle.net/20.500.11840/termmaster6025> skos:narrower* ?place .
        ?obj dc:type ?type ;
             dct:spatial ?place .
        ?place skos:prefLabel ?placeName .
    }
    ORDER BY DESC(?objCount)`,
    continentLinks: ["https://hdl.handle.net/20.500.11840/termmaster6025", "https://hdl.handle.net/20.500.11840/termmaster3", "https://hdl.handle.net/20.500.11840/termmaster8401", "https://hdl.handle.net/20.500.11840/termmaster6782", "https://hdl.handle.net/20.500.11840/termmaster19804", "https://hdl.handle.net/20.500.11840/termmaster18062"], // Europa, Afrika, Azie, Oceanie, Amerika, Noordpool, Antartica
};
getData(nmvw.apiURL, nmvw.apiQuery);

// visualiseren met d3 (voorbeeld kaart -> https://www.youtube.com/watch?v=Qw6uAg3EO64)
const svg = select("svg");
const projection = geoEqualEarth();
const pathGenerator = geoPath().projection(projection);

json("https://unpkg.com/world-atlas@1.1.4/world/110m.json")
    .then(data => {
    const countries = feature(data, data.objects.countries);
    console.log(countries);

    const paths = svg.selectAll("path")
        .data(countries.features);
    paths.enter().append("path")
        .attr("d", d => pathGenerator(d))
});

// data ophalen met async / await
async function getData(url, query) {
    const response = await fetch(url+ "?query=" + encodeURIComponent(query) + "&format=json");
    const json = await response.json();
    const data = await json.results.bindings;
    const normalizedData = await data.map(item => {
        let newArr = {};
        newArr.amount = Number(item.objCount.value);
        newArr.category = item.type.value;
        newArr.place = item.placeName.value;
        return newArr;
    });
    console.log(normalizedData);
    return normalizedData;
}