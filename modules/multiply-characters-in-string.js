/*jshint esversion: 6 */

// Function that multiplies a character in string
exports.multiplyCharactersInString = function(string, multiplyBy, start = 0, end = string.length){
    let newString = "";
    // Loops over string and multiplies character
    for (start; start < end; start++){
    newString = newString + string[start].repeat(multiplyBy);
    }
    return newString;
};