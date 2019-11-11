/*jshint esversion: 6 */

// Function that multiplies a character in string
exports.multiplyCharactersInString = function (string, multiplyBy, start = 0, end = string.length) {
    if (start < end && multiplyBy >= 2) {
        let newString = "";
        // Loops over string and multiplies character
        for (start; start < end; start++) {
            newString = newString + string[start].repeat(multiplyBy);
        }
        if (end !== string.length) {
            newString = newString + string.slice(end, string.length);
        }
        return newString;
    }
    if (start === end) {
        console.info("start (", start, ") and end (", end, ") can't be the same number");
    }
    if (multiplyBy <= 1) {
        console.info("multiplier has to be higher than 2");
    }
};