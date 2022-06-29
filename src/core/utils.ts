export function capitalize(string: string): string {
  if (!string) return '';

  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function storage(key: string, data: any = null): any {
  if (!data) return JSON.parse(localStorage.getItem(key));

  localStorage.setItem(key, JSON.stringify(data));

  return true;
}
