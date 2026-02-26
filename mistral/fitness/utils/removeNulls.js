export function removeNulls(obj) {
  // If not an object or if it's null, return the value as-is
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    return obj
      .map((v) => removeNulls(v)) // Recurse into elements
      .filter((v) => v !== null && v !== undefined); // Remove null/undefined from array
  }

  // Handle Objects
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const cleanedValue = removeNulls(value); // Recurse

    // Only add to the accumulator if the value isn't null or undefined
    if (cleanedValue !== null && cleanedValue !== undefined) {
      acc[key] = cleanedValue;
    }

    return acc;
  }, {});
}
