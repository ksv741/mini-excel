const CODES = {
  A: 65,
  Z: 90,
};

function createCell(cellContent = '') {
  return `
    <div class="cell" contenteditable>${cellContent}</div>
  `;
}

function createCol(columnContent = '') {
  return `
    <div class="column">${columnContent}</div>
  `;
}

function createRow(dataContent = '', infoContent = '') {
  return `
    <div class="row">
      <div class="row-info">${infoContent}</div>
      <div class="row-data">${dataContent}</div>
    </div>
  `;
}

export function createTable(rowsCount = 10, columnCount = 10) {
  const colsCount = Math.min(CODES.Z - CODES.A + 1, columnCount);
  const rows: string[] = [];

  const cols = new Array(colsCount)
    .fill('')
    .map((el, index) => String.fromCharCode(CODES.A + index))
    .map((el) => createCol(el))
    .join('');

  rows.push(createRow(cols));

  for (let i = 0; i < rowsCount; i++) {
    const cells = new Array(colsCount).fill(createCell()).join('');
    rows.push(createRow(cells, `${i + 1}`));
  }

  return rows.join('');
}
