"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncFilter = void 0;
// source: https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
async function asyncFilter(arr, predicate) {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_v, index) => results[index]);
}
exports.asyncFilter = asyncFilter;
