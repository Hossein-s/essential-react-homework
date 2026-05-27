export function validateRequiredFields<T extends Record<string, string>>(
  values: T,
  keys: (keyof T)[],
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const key of keys) {
    if (!values[key].trim()) {
      errors[key] = 'Required';
    }
  }

  return errors;
}
