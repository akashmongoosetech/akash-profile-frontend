// Escape a value for safe inclusion in a CSV export.
// Wraps in quotes, escapes embedded quotes, and neutralises spreadsheet
// formula injection (values starting with =, +, -, @, tab or CR).
export const escapeCsvCell = (value: unknown): string => {
  let str = value === null || value === undefined ? '' : String(value);

  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  return `"${str.replace(/"/g, '""')}"`;
};

export const buildCsv = (rows: unknown[][]): string => {
  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n');
};
