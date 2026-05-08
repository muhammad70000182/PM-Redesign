export function keysToPascalCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => keysToPascalCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    Object.keys(obj).forEach(key => {
      const newKey = key.charAt(0).toUpperCase() + key.slice(1);
      newObj[newKey] = keysToPascalCase(obj[key]);
    });
    return newObj;
  }
  return obj; // primitive value
}