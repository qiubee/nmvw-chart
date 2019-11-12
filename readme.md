# Functional Programming

Voor een nieuwe tentoonstelling over de collectie van het Tropenmuseum in Amsterdam wil tentoonstellingmaker Rik Herder met visualisaties laten zien wat er in een groter geheel te vinden is in de collectie van het Nationaal Museum van Wereldculturen. Zijn insteek is om de iconen van de collectie uit te lichten. Hij heeft mij de opdracht gegeven om een van zo'n visualisatie te maken.

De datavisualisatie is gemaakt met d3. Verder zijn Node.js en Express gebruikt om dynamisch de data weer te geven.

## Benodigdheden

* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [d3](https://d3js.org/)

## Concept

Een datavisualisatie die de collectie van het Nationaal Museum van Wereldculturen laat zien. Door middel van een wereldkaart wordt er met bolletjes weergegeven hoeveel objecten er per werelddeel in de collectie zitten. In de bolletjes wordt een cirkeldiagram getoond die de top 3 laat zien van categorieën waar de meeste objecten in te vinden zijn.

![World map with pie charts showing top 3 of categories with the most objects found in the collection of the National Museum of Worldcultures](https://github.com/qiubee/functional-programming/blob/master/images/Concept-small.jpg)

## Data

De data wil ik halen uit de API van het NMVW. De data die daaruit wil halen is de Geografische herkomst van objecten, de categorie van de objecten en het aantal objecten per werelddeel en per categorie. In SPARQL heb ik `dct:spatial` en `dc:type` gebruikt voor de plaats en het type. En met `(COUNT() AS())` heb ik het aantal objecten op bij elkaar opgeteld.

Hieronder staat de query die ik heb gebruikt voor het ophalen van de data:

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?placeName ?type (COUNT(?obj) AS ?objAmount)  WHERE {
    # <hier de link uit thesaurus van werelddeel>
    skos:narrower* ?place .
    ?obj dc:type ?type ;
         dct:spatial ?place .
    ?place skos:prefLabel ?placeName .
}
ORDER BY DESC(?objAmount)
```

## License

MIT
