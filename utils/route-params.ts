/**
 * Utility functions for extracting dynamic route parameters.
 * Based on the Lithia core routing logic.
 */

/**
 * Extracts dynamic parameter names from a route path.
 * @param path - Route path (e.g., '/users/:id/pets/:petId')
 * @returns Array of parameter names (e.g., ['id', 'petId'])
 */
export function extractDynamicParams(path: string): string[] {
  const paramMatches = path.match(/:([^/]+)/g) || [];
  return paramMatches.map((param) => param.slice(1));
}

/**
 * Extracts dynamic parameter info with unique keys for React.
 * @param path - Route path (e.g., '/users/:id/pets/:id')
 * @returns Array of parameter info with unique keys
 */
export function extractDynamicParamsWithKeys(path: string): Array<{
  name: string;
  key: string;
  position: number;
}> {
  const paramMatches = path.match(/:([^/]+)/g) || [];
  return paramMatches.map((param, index) => ({
    name: param.slice(1),
    key: `${param.slice(1)}_${index}`, // Unique key based on position
    position: index,
  }));
}

/**
 * Checks if a route has dynamic parameters.
 * @param path - Route path
 * @returns True if route has dynamic parameters
 */
export function hasDynamicParams(path: string): boolean {
  return /:([^/]+)/.test(path);
}

/**
 * Replaces dynamic parameters in a route path with provided values.
 * @param path - Route path with parameters (e.g., '/users/:id/pets/:petId')
 * @param params - Object with parameter values (e.g., { id: '123', petId: '456' })
 * @returns Path with parameters replaced (e.g., '/users/123/pets/456')
 */
export function replaceDynamicParams(
  path: string,
  params: Record<string, string>,
): string {
  let result = path;

  Object.entries(params).forEach(([key, value]) => {
    // Replace all instances of :key with the value
    const regex = new RegExp(
      `:${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=/|$)`,
      'g',
    );
    result = result.replace(regex, value);
  });

  return result;
}

/**
 * Validates if all required dynamic parameters are provided.
 * @param path - Route path
 * @param params - Provided parameters
 * @returns Object with validation result and missing parameters
 */
export function validateDynamicParams(
  path: string,
  params: Record<string, string>,
) {
  const requiredParams = extractDynamicParams(path);
  const providedParams = Object.keys(params);
  const missingParams = requiredParams.filter(
    (param) => !providedParams.includes(param),
  );

  return {
    isValid: missingParams.length === 0,
    missingParams,
    requiredParams,
  };
}
