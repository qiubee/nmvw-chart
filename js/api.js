const api = {
	originalURL: "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-05/sparql",
	generalURL: "https://api.data.netwerkdigitaalerfgoed.nl/datasets/NMVW/collectie/services/collectie/sparql"
};
const queries = {
	// Amount of types of objects per place in Eurasia
	queryTypeEU: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX dc: <http://purl.org/dc/elements/1.1/>
	PREFIX dct: <http://purl.org/dc/terms/>
	PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	PREFIX edm: <http://www.europeana.eu/schemas/edm/>
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>
	
	SELECT ?placeName ?type (COUNT(?obj) AS ?objCount)  WHERE {
		<https://hdl.handle.net/20.500.11840/termmaster6025> skos:narrower* ?place . # term: Eurazie
		?obj dc:type ?type ;
			 dct:spatial ?place .
		?place skos:prefLabel ?placeName .
	}
	GROUP BY ?placeName ?type
	ORDER BY DESC(?objCount)`,
	// Cultural heritage objects categorized
	queryHC: `PREFIX edm: <http://www.europeana.eu/schemas/edm/>
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX dc: <http://purl.org/dc/elements/1.1/>
	PREFIX dct: <http://purl.org/dc/terms/>
	PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	PREFIX hdlh: <https://hdl.handle.net/20.500.11840/termmaster>
		
	SELECT ?heritage ?category (COUNT(?obj) AS ?objCount) WHERE {
	  <https://hdl.handle.net/20.500.11840/termmaster5931> skos:narrower ?culHeritage . # Term: Culturele herkomst
	  ?obj edm:isRelatedTo ?cat .
	  ?cat skos:prefLabel ?category .
	  ?culHeritage skos:prefLabel ?heritage .
	}
	GROUP BY ?heritage ?category
	ORDER BY DESC(?objCount)`,
	// Total amount of objects of each type from a country in Asia
	queryATT: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX dc: <http://purl.org/dc/elements/1.1/>
	PREFIX dct: <http://purl.org/dc/terms/>
	PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	PREFIX edm: <http://www.europeana.eu/schemas/edm/>
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>
	
	SELECT ?placeName ?type (COUNT(?obj) AS ?objCount) WHERE {
		<https://hdl.handle.net/20.500.11840/termmaster7745> skos:narrower* ?place . # term: Azie
		?obj dc:type ?type ;
			 dct:spatial ?place .
		?place skos:prefLabel ?placeName .
	}
	GROUP BY ?placeName ?type
	ORDER BY DESC(?objCount)`,
	// Information from Geonames
	queryGeoNames: `PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
	PREFIX geo: <http://www.opengis.net/ont/geosparql#>
	PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	PREFIX gn: <http://www.geonames.org/ontology#> 
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	SELECT ?svcn ?lat ?long ?landLabel WHERE {
	  ?svcn skos:exactMatch/wgs84:lat ?lat .
	  ?svcn skos:exactMatch/wgs84:long ?long .
	  ?svcn skos:exactMatch/gn:countryCode ?landCode .
	  ?svcn skos:exactMatch/gn:parentCountry ?land .
	  ?land gn:name ?landLabel .
	}`,
	// CCT: Continent, Category, Total
	queryCCT: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX dc: <http://purl.org/dc/elements/1.1/>
	PREFIX dct: <http://purl.org/dc/terms/>
	PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	PREFIX edm: <http://www.europeana.eu/schemas/edm/>
		
	SELECT ?continent ?category (COUNT(?cho) AS ?objCount) WHERE {
		  
	# CONTINENTEN
	# zoekt alle continenten
	<https://hdl.handle.net/20.500.11840/termmaster2> skos:narrower ?geoTerm .
	?geoTerm skos:prefLabel ?continent .
		
	# geeft per continent de onderliggende geografische termen
	?geoTerm skos:narrower* ?allGeoTerms .
		
	# geeft objecten bij de onderliggende geografische termen
	?cho dct:spatial ?allGeoTerms .
		  
	# CATEGORIEEN
	# zoekt alle hoofdcategorieen
	<https://hdl.handle.net/20.500.11840/termmaster2802> skos:narrower ?catTerm .
	?catTerm skos:prefLabel ?category .
		  
	# geeft per categorie alle onderliggende categorische termen
	?catTerm skos:narrower* ?allCatTerms .
		  
	# geeft objecten bij alle onderliggende categorische termen
	?cho edm:isRelatedTo ?allCatTerms
		  
	}
	GROUP BY ?continent ?category
	ORDER BY DESC(?objCount)`,
	// CCCLatLongT: Continent, Country, Category, Latitude, Longitude, Total
	queryCCCLatLongT: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX hdlh: <https://hdl.handle.net/20.500.11840/termmaster>
    PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX gn: <http://www.geonames.org/ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?continent ?countryName ?lat ?long ?category (COUNT(?obj) AS ?objCount) WHERE {
      
      # CONTINENTEN
      # zoekt alle continenten
      <https://hdl.handle.net/20.500.11840/termmaster2> skos:narrower ?geoTerm .
      ?geoTerm skos:prefLabel ?continent .
    
      # geeft per continent de onderliggende geografische termen
      ?geoTerm skos:narrower* ?allGeoTerms .
    
      # geeft objecten bij de onderliggende geografische termen
      ?obj dct:spatial ?allGeoTerms .
    
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
      ?obj edm:isRelatedTo ?allCatTerms .
      
    } GROUP BY ?continent ?countryName ?lat ?long ?category
    ORDER BY DESC(?objCount)`
};

export { api, queries };