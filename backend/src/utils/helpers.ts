export interface ArrayMap {
    [key: string]: Array<string | number> | readonly (string | number)[];
  }

  export const findNonEmptyArrays = (map: ArrayMap): string[] => {
    const keysWithNonEmptyArrays: string[] = [];
    
    for (const [key, value] of Object.entries(map)) {
      if (Array.isArray(value) && value.length > 0) {
        keysWithNonEmptyArrays.push(key);
      }
    }
    
    return keysWithNonEmptyArrays;
  };
