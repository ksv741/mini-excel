const CODES = {
  A: 65,
  Z: 90,
};

function createCell(cellContent = '', index = 1) {
  return `
    <div class="cell" contenteditable data-col="${index}">${cellContent}</div>
  `;
}

function createCol(columnContent = '', index = 1) {
  return `
    <div class="column" data-type="resizable" data-col="${index}">
        ${columnContent}
        <div class="col-resize" data-resize="col"></div>
    </div>
  `;
}

function createRow(dataContent = '', infoContent = '', needResize = true) {
  return `
    <div class="row" data-type="resizable">
      <div class="row-info">
        ${infoContent}
        ${needResize ? '<div class="row-resize" data-resize="row"></div>' : ''}
      </div>
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
    .map((el, index) => createCol(el, index))
    .join('');

  rows.push(createRow(cols, '', false));

  for (let i = 0; i < rowsCount; i++) {
    const cells = new Array(colsCount)
      .fill('')
      .map((el, index) => createCell('', index))
      .join('');
    rows.push(createRow(cells, `${i + 1}`));
  }

  return rows.join('');
}
