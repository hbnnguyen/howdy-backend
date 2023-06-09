

// source: https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
export async function asyncFilter<T>(arr: T[], predicate: (arg: T) => Promise<boolean>) : Promise<T[]> {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
}