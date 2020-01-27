/*jshint esversion: 8 */

import { translateCountryToDutch } from "./translateCountryToDutch.js";

// object met nmvw info
const nmvw = {
    apiURL: "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-05/sparql",
    apiQuery: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX hdlh: <https://hdl.handle.net/20.500.11840/termmaster>
    PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX gn: <http://www.geonames.org/ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?continent ?countryName ?lat ?long ?category (COUNT(?cho) AS ?objCount) WHERE {
      
      # CONTINENTEN
      # zoekt alle continenten
      <https://hdl.handle.net/20.500.11840/termmaster2> skos:narrower ?geoTerm .
      ?geoTerm skos:prefLabel ?continent .
    
      # geeft per continent de onderliggende geografische termen
      ?geoTerm skos:narrower* ?allGeoTerms .
    
      # geeft objecten bij de onderliggende geografische termen
      ?cho dct:spatial ?allGeoTerms .
    
      # LANDEN
      # zoekt in GeoNames naar de naam van het land
      ?allGeoTerms skos:exactMatch/gn:parentCountry ?country .
      ?country gn:name ?countryName .
    
      # COORDINATEN
      # geeft de latitude en longtitude van het land (coordinaten zijn niet precies)
      ?country wgs84:lat ?lat .
      ?country wgs84:long ?long .
      
      # CATEGORIEEN
      # zoekt alle hoofdcategorieen
      <https://hdl.handle.net/20.500.11840/termmaster2802> skos:narrower ?catTerm .
      ?catTerm skos:prefLabel ?category .
      
      # geeft per categorie alle onderliggende categorische termen
      ?catTerm skos:narrower* ?allCatTerms .
      
      # geeft objecten bij alle onderliggende categorische termen
      ?cho edm:isRelatedTo ?allCatTerms
      
    } GROUP BY ?continent ?countryName ?lat ?long ?category
    ORDER BY DESC(?objCount)`
};

visualize();

// --- Visualiseren ---
async function visualize() {
deleteNoScript();
const data = await configureData(nmvw.apiURL, nmvw.apiQuery);
plotData(data);
}

// Verwijder noscript
function deleteNoScript() {
    d3.select("div").select("p").remove();
    d3.select("div").attr("class", null);
}

function addElements() {
// -- Elementen aanmaken --
    const title = d3
        .select("div")
        .append("h2")
        .text("Visualisatie die de plaats van de vondst en de categorie van objecten in de collectie van het NMVW laat zien.");
}

// Data visualiseren d.m.v. lollipop chart.
function plotData(data) {
    // Code voorbeeld: https://www.d3-graph-gallery.com/graph/lollipop_horizontal.html
    // https://vizhub.com/Razpudding/c635efa650a3433f830c7fb656d9c138?edit=files&file=index.js
    // https://observablehq.com/@d3/selection-join

    const height = 400;
    const width = 600;
    const margin = {top: 50, left: 50};
    const max = d3.max(data.map(function (d) { return d.objects;}));

    const svg = d3
        .select("div")
        .append("svg")
        .attr("height", height + margin.top)
        .attr("width", width + margin.left)
        .append("g")
        .attr("transform", "translate(" + margin.left + ",0)");

    const x = d3.scaleLinear()
        .domain([0, (max + (max / 100 * 10))])
        .range([0, width]);

    const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(function(d) { return d.key; }))
        .padding(1);
    
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10, 2) rotate(-45)")
            .style("text-anchor", "end");

    svg.append("g")
        .call(d3.axisLeft(y));
    
    // lijnen toevoegen
    svg.selectAll()
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function(d) { return x(d.objects); })
        .attr("x2", x(0))
        .attr("y1", function(d) { return y(d.key); })
        .attr("y2", function(d) { return y(d.key); })
        .attr("stroke", "black");

    // cirkels toevoegen
    svg.selectAll("circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x(d.objects); })
        .attr("cy", function(d) { return y(d.key); })
        .attr("r", 3.5)
        .attr("stroke", "black");

}

// -- Data ophalen en verwerken --
async function configureData(url, query) {
    let data = await getData(url, query);
    // console.log("Raw data: ", data);
    data = transformData(data);
    // console.log("Transformed data: ", data);
    return data;
}

// Data ophalen
async function getData(url, query) {
    const response = await fetch(url + "?query=" + encodeURIComponent(query) + "&format=json");
    const json = await response.json();
    const data = json.results.bindings;
    return data;
}

// Data transformeren
function transformData(data) {
    data = filterData(data);
    // console.log("Filtered data: ", data);
    data = translateCountryToDutch(data);
    // console.log("Translated country data: ", data);
    data = groupData(data);
    // console.log("Grouped data: ", data);
    data = calculateData(data);
    // console.log("Calculated data: ", data);  
    return data;
}

// Data filteren
function filterData(data) {
    data = data.map(item => {
        let filtered = {};
        if (item.hasOwnProperty("continent") === true) {
            filtered.continent = item.continent.value;
        }
        if (item.hasOwnProperty("countryName") === true) {
            filtered.country = item.countryName.value;
        }
        if (item.hasOwnProperty("lat") === true) {
            filtered.lat = Number(item.lat.value);
        }
        if (item.hasOwnProperty("long") === true) {
            filtered.long = Number(item.long.value);
        }
        if (item.hasOwnProperty("category") === true) {
            filtered.category = item.category.value;
        }
        if (item.hasOwnProperty("objCount") === true) {
            filtered.objects = Number(item.objCount.value);
        }
        return filtered;
    });
    return data;
}

// Groepeer data
function groupData(data) {
    data = d3.nest()
        // groepeer per continent
        .key(function (d) {
            return d.continent; 
        })
        // groepeer per land
        .key(function (d) {
            return d.country;
        })
        .entries(data);

    // groepeer categorieen per land
    data.forEach(function (continent) {
        for (let country of continent.values) {
            let listOfCategories = [];
            for (let items of country.values) {
                let category = { category: items.category, objects: items.objects };
                listOfCategories.push(category);
            }
            country.categories = listOfCategories;
        }
    });

    // groepeer categorieen per continent
    data.forEach(function (continent) {
        let categories = [];
        for (let country of continent.values) {
            for (let category of country.categories) {
                categories.push(category);
            }
        }

        categories = d3.nest()
            .key(function (d) {
                return d.category;
            })
            .entries(categories);

        continent.categories = categories;
    });

    return data;
}

// Maak berekeningen met data
function calculateData(data) {

    // tel alle landen van continent
    data.forEach(function (continent) {
        continent.countries = continent.values.length;
    });

    // telt alle objecten
    // let amount = 0;
    // for (let continent of data) {
    //     for (let country of continent.values) {
    //         for (let category of country.values) {
    //             amount += category.objects;
    //         }
    //     }
    // }
    // console.log("Total objects: ", amount);

    // tel alle objecten van land
    data.forEach(function (continent) {
        for (let country of continent.values) {
            let objects = 0;
            for (let info of country.values) {
                objects += info.objects;
            }
            country.objects = objects;
        }
    });

    // tel alle objecten van continent
    data.forEach(function (continent) {
        let objects = 0;
        for (let country of continent.values) {
            objects += country.objects;
        }
        continent.objects = objects;
    });

    // tel alle objecten per categorie van continent
    data.forEach(function (continent) {
        for (let category of continent.categories) {
            let objects = 0;
            for (let info of category.values) {
                objects += info.objects;
            }
            category.objects = objects;
        }
    });

    return data;
}