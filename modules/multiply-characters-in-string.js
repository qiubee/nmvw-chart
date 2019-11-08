function multiplyCharactersOfString(string, multiplyBy, start = 0, end = string.length) {
    let newString = "";
        for (start; start < end; start++) {
                newString = newString + string[start].repeat(multiplyBy);
            }
    return newString;
}

module.exports = multiplyCharactersOfString;