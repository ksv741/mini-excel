const CODES = {
  A: 65,
  Z: 90,
};

function createCell(cellContent = '', colIndex = 1, rowIndex = 1) {
  return `
    <div 
      class="cell" 
      contenteditable 
      data-col="${colIndex}" 
      data-id="${rowIndex}:${colIndex}"
      data-type="cell"
    >
      ${cellContent}
    </div>
    
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

function createRow(dataContent = '', infoContent = '', needResize = true, rowIndex = -1) {
  return `
    <div class="row" data-type="resizable" data-row="${rowIndex}">
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

  for (let row = 0; row < rowsCount; row++) {
    const cells = new Array(colsCount)
      .fill('')
      .map((el, index) => createCell('', index, row))
      .join('');

    rows.push(createRow(cells, `${row + 1}`, true, row));
  }

  return rows.join('');
}
