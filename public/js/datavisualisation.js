/*jshint esversion: 8 */

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
    continentLinks: ["https://hdl.handle.net/20.500.11840/termmaster6025", "https://hdl.handle.net/20.500.11840/termmaster3", "https://hdl.handle.net/20.500.11840/termmaster8401", "https://hdl.handle.net/20.500.11840/termmaster6782", "https://hdl.handle.net/20.500.11840/termmaster19804", "https://hdl.handle.net/20.500.11840/termmaster18062"], // Europe, Afrika, Asia, Oceania, Amerika, North Pole, Antartica
};

/*
fetch(nmvw.apiURL + "?query=" + encodeURIComponent(nmvw.apiQuery) + "&format=json") //
    .then(response => response.json()) // zet data om in JSON formaat
    .then(json => json.results.bindings) // zet JSON om in de waarden van de resultaten
    .then(data => data.map(item => { // maakt nieuwe array met juiste label voor de waarden
        let cleanData = {};
        cleanData.amount = Number(item.objCount.value);
        cleanData.category = item.type.value;
        cleanData.place = item.placeName.value;
        return cleanData;
    }))
    .catch(error => console.error(error));
*/

// async / await
getData(nmvw.apiURL, nmvw.apiQuery);

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
}
