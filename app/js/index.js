/*jshint esversion: 8 */

import { api , queries } from "./api.js";

visualize();

// --- Visualiseren ---
async function visualize() {
    deleteNoScript();
    const data = await configureData(api.originalURL, queries.queryCCT);
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
        return d.continent;
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
        if (selected === d.continent) {
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
        .domain(selectedData.map(function(d) { return d.category; }))
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
                    .attr("y1", function (d) { return y(d.category); })
                    .attr("y2", function (d) { return y(d.category); });
        },  // positie en lengte updaten
            function (update) {
                update.transition(t)
                    .attr("x1", function (d) { return x(d.objects); })
                    .attr("x2", x(0))
                    .attr("y1", function (d) { return y(d.category); })
                    .attr("y2", function (d) { return y(d.category); });
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
                    .attr("cy", function (d) { return y(d.category); })
                    .attr("r", 4);

        },  // positie updaten
            function (update) { 
                update.transition(t)
                    .attr("cx", function (d) { return x(d.objects) + 2.5; })
                    .attr("cy", function (d) { return y(d.category); });
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
	if (response.ok && response.status === 200) {
		return await response.json();
		}
	else {
		return await d3.json("js/CTT.json");
	}
}


// Data transformeren
function transformData(data) {
    data = filterData(data);
    // console.log("Filtered data: ", data);
    data = groupData(data);
    // console.log("Grouped data: ", data);
    data = calculateData(data);
    // console.log("Calculated data: ", data);
    return data;
}

// Data filteren
function filterData(data) {
    data = data.map(function (item) {
        if (item.objCount) {
			item.objects = Number(item.objCount);
			delete item.objCount;
        }
        return item;
    });
    return data;
}

// Groepeer data
function groupData(data) {
    data = d3.nest()
        // groepeer per continent
        .key(function (d) {
            return d.continent; 
		}).entries(data);
		
    // groepeer categorieen per continent en hernoem keys
    data.map(function (continent) {
		Object.defineProperty(continent, "categories", Object.getOwnPropertyDescriptor(continent, "values"));
		Object.defineProperty(continent, "continent", Object.getOwnPropertyDescriptor(continent, "key"));
		["key", "values"].forEach(function (key) {
			delete continent[key];
		});
		return continent;
	});
    return data;
}

// Maak berekeningen met data
function calculateData(data) {

    // tel alle objecten per categorie per continent
    data.map(function (continent) {
		continent.objects = 0;
        for (let category of continent.categories) {
                continent.objects += category.objects;
            }
        }
    );
    return data;
}