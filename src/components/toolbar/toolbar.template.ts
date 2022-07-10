import { ToolbarStateType } from 'components/toolbar/toolbar-types';
import { initialStyleState } from 'src/constants';

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

  return btns.map(btn => (Array.isArray(btn) ? toButtonGroup(btn) : toButton(btn))).join(' ');
}

function toButtonGroup(buttons: ButtonConfigType[]) {
  if (buttons.length === 1) return toButton(buttons[0]);
  const btns = buttons.map(btn => toButton(btn));

  return `
    <div class="button__group"> 
      ${btns.join('')}
    </div>
  `;
}

function toButton(button: ButtonConfigType) {
  const meta = `
    data-type="button"
    data-value='${JSON.stringify(button.value)}'
  `;

  return `
    <div class="button ${button.isActive ? 'active' : ''}"${meta}> 
      <i class="material-icons" ${meta}>${button.icon}</i>
    </div>
  `;
}
