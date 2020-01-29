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
    addForm(data);
    setupChart(data);
}

// Verwijder noscript
function deleteNoScript() {
    d3.select("div").select("p").remove();
    d3.select("div").attr("class", null);
}

function addForm(data) {
    const values = data.map(function (d) {
        return d.key;
    });
    const form = d3.select("div")
        .append("form");

    form.append("label")
        .attr("for", "select-continent")
        .text("Kies een werelddeel");

    const select = form.append("select")
        .attr("name", "continents")
        .attr("id", "select-continent")
        .on("change", function (d) {
            updateChart.call(this, data, 450, 600, d);
        });

    select.selectAll("option")
        .data(values)
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        });
}

// Data visualiseren d.m.v. lollipop chart.
function setupChart(data) {

    const height = 450;
    const width = 600;
    const margin = {top: 70, left: 310};

    const svg = d3
        .select("div")
        .append("svg")
        // .attr("height", height + margin.top)
        // .attr("width", width + margin.left)
        .attr("viewBox", "0 0 " + (width + margin.left) + " " + (height + margin.top))
        .append("g")
        .attr("transform", "translate(" + margin.left + ",0)");

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x")
        .append("text")
            .text("aantal objecten")
            .attr("transform", "translate(" + (width - margin.top) + "," + (margin.top - (margin.top / 10))+ ")");

    svg.append("g")
        .attr("class", "y")
        .append("text")
            .text("categorie")
            .attr("transform", "translate(" + (-margin.left + 10) +"," + margin.top + ") rotate(-90)");

    updateChart(data, height, width);
}

// Update lollipop chart
function updateChart(data, height, width) {
    // Code voorbeeld chart: https://www.d3-graph-gallery.com/graph/lollipop_horizontal.html
    // Code voorbeeld interactie: 
    // https://vizhub.com/Razpudding/c635efa650a3433f830c7fb656d9c138?edit=files&file=index.js

    const selected = this ? this.value : "Azië";
    let selectedData;
    data.map(function (d) {
        if (selected === d.key) {
            selectedData = d.categories;
            return;
        }
    });

    selectedData.sort(function (a, b) {
        return d3.descending(a.objects, b.objects);
    });

    const max = d3.max(selectedData.map(function (d) { return d.objects; }));
    const svg = d3.select("div svg g");
    const x = d3.scaleLinear()
        .domain([0, (max + (max / 100 * 10))])
        .range([0, width]);
    const y = d3.scaleBand()
        .range([0, height])
        .domain(selectedData.map(function(d) { return d.key; }))
        .padding(1);
    const t = d3.transition().duration(950).ease(d3.easeBackInOut);
    const e = d3.transition().duration(750).ease(d3.easeQuadInOut);

    svg.selectAll(".line")
        .data(selectedData)
        .join(
            // lijnen toevoegen
            function (enter) { 
                enter.append("line")
                    .attr("class", "line")
                    .transition(t)
                    .attr("x1", function (d) { return x(d.objects); })
                    .attr("x2", x(0))
                    .attr("y1", function (d) { return y(d.key); })
                    .attr("y2", function (d) { return y(d.key); });
        },  // positie en lengte updaten
            function (update) {
                update.transition(t)
                    .attr("x1", function (d) { return x(d.objects); })
                    .attr("x2", x(0))
                    .attr("y1", function (d) { return y(d.key); })
                    .attr("y2", function (d) { return y(d.key); });
        },  // lege elementen verwijderen
            function (exit) { exit.remove(); }
        );

    svg.selectAll(".circle")
        .data(selectedData)
        .join(
            // cirkels toevoegen
            function (enter) { 
                enter.append("circle")
                    .attr("class", "circle")
                    .transition(t)
                    .attr("cx", function (d) { return x(d.objects) + 5; })
                    .attr("cy", function (d) { return y(d.key); })
                    .attr("r", 4);

        },  // positie updaten
            function (update) { 
                update.transition(t)
                    .attr("cx", function (d) { return x(d.objects) + 2.5; })
                    .attr("cy", function (d) { return y(d.key); });
        },  // lege elementen verwijderen
            function (exit) { exit.remove(); }
        );

    svg.select(".x")
        .transition(e)
        .call(d3.axisBottom(x).tickSize(5))
        .selectAll(".tick text")
            .attr("transform", "translate(-10, 2) rotate(-45)")
            .style("text-anchor", "end");

    svg.select(".y")
        .transition(t)
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll(".tick text")
            .attr("transform", "translate(-10, 0)");
    
    // Verkleint grootte lettertype van naam categorie
    for (const category of document.querySelectorAll(".y .tick text")) {
        if (category.__data__.length >= 45 ) {
            d3.select(category).style("font-size", 1 + "em");
        }
    }

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

    // tel alle objecten per categorie per continent
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