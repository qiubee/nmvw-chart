/*jshint esversion: 6 */

const data = {
    url: "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-05/sparql",
    query: `
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
    continentLinks: ["https://hdl.handle.net/20.500.11840/termmaster6025", "https://hdl.handle.net/20.500.11840/termmaster3", "https://hdl.handle.net/20.500.11840/termmaster8401", "https://hdl.handle.net/20.500.11840/termmaster6782", "https://hdl.handle.net/20.500.11840/termmaster19804", "https://hdl.handle.net/20.500.11840/termmaster18062"], // Europe, Afrika, Asia, Oceania, Amerika, North Pole, Antartica
};

fetch(data.url + "?query=" + encodeURIComponent(data.query) + "&format=json")
.then(response => response.json())
.then(json => console.log(json))
.catch(error => console.log(error));