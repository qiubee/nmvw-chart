/*jshint esversion: 8 */

import { makeCorrectHexCodes } from "./clean-hex-data.js";

cleanHex();

async function cleanHex() {
    const data = await fetchData("data/Enquete voor dataverzameling (Antwoorden).csv");
    const hexcodes = makeCorrectHexCodes(data);
    console.log("Raw data:", data, "\nClean list of hexcodes:", hexcodes);
    return data;
}

async function fetchData(path) {
return await d3.csv(path);
}