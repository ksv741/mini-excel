import { ToolbarStateType } from 'components/toolbar/toolbar-types';
import { isLargestFontSize, isSmallestFontSize } from 'core/utils';
import { fontFamilies, fontSizes, initialStyleState } from 'src/constants';

type ButtonConfigType = {
  icon: string;
  isActive: boolean;
  value: ToolbarStateType;
};

export function createToolbar(state: ToolbarStateType): string {
  const btns: (ButtonConfigType | ButtonConfigType[])[] = [
    [
      {
        icon: 'format_bold',
        isActive: state.fontWeight === 'bold',
        value: {
          fontWeight: state.fontWeight === 'bold' ? initialStyleState.fontWeight : 'bold',
        },
      },
      {
        icon: 'format_italic',
        isActive: state.fontStyle === 'italic',
        value: {
          fontStyle: state.fontStyle === 'italic' ? initialStyleState.fontStyle : 'italic',
        },
      },
      {
        icon: 'format_underline',
        isActive: state.textDecoration === 'underline',
        value: {
          textDecoration: state.textDecoration === 'underline' ? initialStyleState.textDecoration : 'underline',
        },
      },
    ],
    [
      {
        icon: 'format_align_left',
        isActive: state.justifyContent === 'start',
        value: {
          justifyContent: 'start',
        },
      },
      {
        icon: 'format_align_center',
        isActive: state.justifyContent === 'center',
        value: {
          justifyContent: state.justifyContent === 'center' ? initialStyleState.justifyContent : 'center',
        },
      },
      {
        icon: 'format_align_right',
        isActive: state.justifyContent === 'end',
        value: {
          justifyContent: state.justifyContent === 'end' ? initialStyleState.justifyContent : 'end',
        },
      },
    ],
    [
      {
        icon: 'vertical_align_bottom',
        isActive: state.alignItems === 'end',
        value: {
          alignItems: state.alignItems === 'end' ? initialStyleState.alignItems : 'end',
        },
      },
      {
        icon: 'vertical_align_center',
        isActive: state.alignItems === 'center',
        value: {
          alignItems: state.alignItems === 'center' ? initialStyleState.alignItems : 'center',
        },
      },
      {
        icon: 'vertical_align_top',
        isActive: state.alignItems === 'start',
        value: {
          alignItems: state.alignItems === 'start' ? initialStyleState.alignItems : 'start',
        },
      },
    ],
  ];

  const buttons = btns.map(btn => (Array.isArray(btn) ? createButtonsFromConfigGroup(btn) : createButtonFromConfig(btn)));

  const selectGroup = createGroup(createFontSizeButton(state.fontSize), createFontFamilyButton(state.fontFamily));
  const increaseDecreaseFontSize = createSizeUpDownButtons(state.fontSize);

  buttons.push(increaseDecreaseFontSize);
  buttons.push(selectGroup);
  buttons.push(createAddRowTable());

  return buttons.join('');
}

function createSizeUpDownButtons(currentSize = initialStyleState.fontSize) {
  const buttons = ['increase', 'decrease'];

  return buttons.map(btn => {
    const disable = btn === 'increase' ? isLargestFontSize(currentSize) : isSmallestFontSize(currentSize);
    return `
      <div class="button${disable ? ' disable' : ''}" data-change-size="${btn}"> 
        <i class="material-icons">text_${btn}</i>
      </div>
    `;
  }).join('');
}

function createFontSizeButton(currentSize = initialStyleState.fontSize) {
  const options = fontSizes.map(size => {
    // remove 'px' part
    const sizeValue = size.slice(0, -2);
    return size === currentSize
      ? `<option value="${sizeValue}" selected>${sizeValue}</option>`
      : `<option value="${sizeValue}">${sizeValue}</option>`;
  });

  return `
    <div class="button">
      <select class="button__size" id="button-size">
        ${options.join('')}
      </select>
    </div>
  `;
}

function createFontFamilyButton(font = initialStyleState.fontFamily) {
  const options = fontFamilies.map(fontName => createFontFamilyOption(fontName, fontName === font));

  function createFontFamilyOption(name: string, selected: boolean) {
    return selected
      ? `<option value="${name}" style="font-family: ${name}" selected >${name}</option>`
      : `<option value="${name}" style="font-family: ${name}">${name}</option>`;
  }

  return `
    <div class="button">
      <select class="button__font" id="button-font">
        ${options.join('')}
      </select>
    </div>
  `;
}

function createGroup(...btns: string[]) {
  return `
    <div class="button__group"> 
      ${btns.join('')}
    </div>
  `;
}

function createButtonsFromConfigGroup(buttons: ButtonConfigType[]) {
  if (buttons.length === 1) return createButtonFromConfig(buttons[0]);
  const btns = buttons.map(btn => createButtonFromConfig(btn));

  return createGroup(...btns);
}

function createButtonFromConfig(btnConfig: ButtonConfigType) {
  const meta = `
    data-type="button"
    data-value='${JSON.stringify(btnConfig.value)}'
  `;

  return `
    <div class="button ${btnConfig.isActive ? 'active' : ''}"${meta}> 
      <i class="material-icons" ${meta}>${btnConfig.icon}</i>
    </div>
  `;
}

function createAddRowTable() {
  return `
    <div class="button" data-addbtn>
      <i class="material-icons" data-addbtn>add_circle</i>
    </div>
  `;
}
