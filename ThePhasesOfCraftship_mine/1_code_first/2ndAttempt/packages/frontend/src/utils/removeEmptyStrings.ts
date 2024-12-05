export const removeEmptyStrings = (object: Record<string, unknown>) => {
  const result: Record<string, unknown> = {};

  for (const key in object) {
    let value = object[key];

    if (typeof value === "string") {
      value = value.trim();
    }

    if (value !== "") {
      result[key] = object[key];
    }
  }

  return result;
};
