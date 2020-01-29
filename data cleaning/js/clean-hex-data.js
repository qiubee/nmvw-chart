export function makeCorrectHexCodes(data) {
    let newList = [];
    let listOfStrings = [];
    data.map(function (item) {
        Object.keys(item).map(function (key) {
            listOfStrings.push(item[key]);
        });
    });
    for (let item of listOfStrings) {
        item = item.trim().toUpperCase();
        if (item === "") {
            newList.push(item);
        } else if (/^#[A-F0-9]/.test(item) && item.length === 4 || item.length === 7) {
            if (item.length === 7) {
                newList.push(item);
            }
            if (item.length === 4) {
                item = addHash(multiplyCharactersOfString(item, 2, 1));
                newList.push(item);
            }
        } else if (item.indexOf("#") === -1 && /[^G-Z]/.test(item) && item.length === 6) {
            item = addHash(item);
            newList.push(item);
        } else if (item.indexOf("#") === -1 && item.length === 3) {
            item = addHash(multiplyCharactersOfString(item, 2));
            newList.push(item);
        } else if (item.indexOf("#") === -1 && /^[a-z\s]+$/i.test(item) === true) {
            if (/BL[AOU][AOU]W|BL(?=EU|UE)/.test(item)) {
                item = "#0000FF";
                newList.push(item);
            } else if (/RO{1,5}D|RE{1,5}D$/.test(item)) {
                item = "#FF0000";
                newList.push(item);
            } else if (/GE{1,5}L|YEL{1,4}O{1,4}W$/.test(item)) {
                item = "#FFFF00";
                newList.push(item);
            } else if (/GR?(IJ|EI|JI)S$|GRE{1,4}Y$/.test(item)) {
                item = "#808080";
                newList.push(item);
            } else {
                item = "";
                newList.push(item);
            }
        } else {
            item = "";
            newList.push(item);
        }
    }
    return newList;
}

function addHash(string) {
    string = "#" + string;
    return string;
}

function multiplyCharactersOfString(string, multiplyBy, start = 0, end = string.length) {
    let newString = "";
        for (start; start < end; start++) {
                newString = newString + string[start].repeat(multiplyBy);
            }
    return newString;
}