export function translateCountryToDutch(data) {
    data = data.map(item => {
        switch (item.continent) {
            case "Azië":
                switch (item.country) {
                    case "Indonesia":
                        item.country = "Indonesië";
                        break;
                    case "Yemen":
                        item.country = "Jemen";
                        break;
                    case "Philippines":
                        item.country = "Filipijnen";
                        break;
                    case "Turkey":
                        item.country = "Turkije";
                        break;
                    case "Saudi Arabia":
                        item.country = "Saudi-Arabië";
                        break;
                    case "Iraq":
                        item.country = "Irak";
                        break;
                    case "Syria":
                        item.country = "Syrië";
                        break;
                    case "Myanmar [Burma]":
                        item.country = "Myanmar";
                        break;
                    case "Malaysia":
                        item.country = "Maleisië";
                        break;
                    case "United Arab Emirates":
                        item.country = "Verenigde Arabische Emiraten";
                        break;
                    case "Lebanon":
                        item.country = "Libanon";
                        break;
                    case "Uzbekistan":
                        item.country = "Oezbekistan";
                        break;
                    case "South Korea":
                        item.country = "Zuid-Korea";
                        break;
                    case "Israel":
                        item.country = "Israël";
                        break;
                    case "Kuwait":
                        item.country = "Koeweit";
                        break;
                    case "East Timor":
                        item.country = "Oost-Timor";
                        break;
                    case "Tajikistan":
                        item.country = "Tadzjikistan";
                        break;
                    case "Jordan":
                        item.country = "Jordanië";
                        break;
                    case "Cambodia":
                        item.country = "Cambodja";
                        break;
                    case "Armenia":
                        item.country = "Armenië";
                        break;
                    case "Azerbaijan":
                        item.country = "Azerbeidzjan";
                        break;
                }
                break;
            case "Amerika":
                switch (item.country) {
                    case "Greenland":
                        item.country = "Groenland";
                        break;
                    case "Brazil":
                        item.country = "Brazilië";
                        break;
                    case "Chile":
                        item.country = "Chili";
                        break;
                    case "Argentina":
                        item.country = "Argentinië";
                        break;
                    case "Haiti":
                        item.country = "Haïti";
                        break;
                    case "French Guiana":
                        item.country = "Frans-Guyana";
                        break;
                }
                break;
            case "Oceanië":
                switch (item.country) {
                    case "Indonesia":
                        item.country = "Indonesië";
                        break;
                    case "Papua New Guinea":
                        item.country = "Papoea-Nieuw-Guinea";
                        break;
                    case "Australia":
                        item.country = "Australië";
                        break;
                    case "Micronesia":
                        item.country = "Micronesië";
                        break;
                    case "French Polynesia":
                        item.country = "Frans-Polynesië";
                        break;
                    case "New Zealand":
                        item.country = "Nieuw-Zeeland";
                        break;
                    case "Marshall Islands":
                        item.country = "Marshalleilanden";
                        break;
                    case "Wallis and Futuna":
                        item.country = "Wallis en Futuna";
                        break;
                }
                break;
            case "Afrika":
                switch (item.country) {
                    case "Egypt":
                        item.country = "Egypte";
                        break;
                    case "Morocco":
                        item.country = "Marokko";
                        break;
                    case "DR Congo":
                        item.country = "Congo";
                        break;
                    case "Kenya":
                        item.country = "Kenia";
                        break;
                    case "Cameroon":
                        item.country = "Kameroen";
                        break;
                    case "Ivory Coast":
                        item.country = "Ivoorkust";
                        break;
                    case "Tunisia":
                        item.country = "Tunesië";
                        break;
                    case "Algeria":
                        item.country = "Algerije";
                        break;
                    case "Ethiopia":
                        item.country = "Ethiopië";
                        break;
                    case "Central African Republic":
                        item.country = "Centraal-Afrikaanse Republiek";
                        break;
                    case "South Africa":
                        item.country = "Zuid-Afrika";
                        break;
                    case "Libya":
                        item.country = "Libië";
                        break;
                    case "Chad":
                        item.country = "Tsjaad";
                        break;
                    case "South Sudan":
                        item.country = "Zuid-Soedan";
                        break;
                    case "Rwanda":
                        item.country = "Ruwanda";
                        break;
                    case "Namibia":
                        item.country = "Namibië";
                        break;
                    case "São Tomé and Príncipe":
                        item.country = "Sao Tomé en Principe";
                        break;
                    case "Equatorial Guinea":
                        item.country = "Equatoriaal-Guinea";
                        break;
                    case "Saint Helena":
                        item.country = "Sint-Helena";
                        break;
                    case "Mauritania":
                        item.country = "Mauritanië";
                        break;
                }
                break;
            case "Eurazië":
                switch (item.country) {
                    case "Russia":
                        item.country = "Rusland";
                        break;
                    case "Sweden":
                        item.country = "Zweden";
                        break;
                    case "Norway":
                        item.country = "Noorwegen";
                        break;
                    case "Denmark":
                        item.country = "Denemarken";
                        break;
                }
                break;
        }
        return item;
    });
    return data;
}