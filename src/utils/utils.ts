export const createEnumObject= ( arr: readonly string[] )=> {
  return arr.reduce(( acc, curr )=> {
    acc[ curr ]= curr;
    return acc;
  }, {} as Record<string, string> );
};