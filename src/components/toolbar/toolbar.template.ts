import { ToolbarStateType } from 'components/toolbar/toolbar-types';
import { initialStyleState } from 'src/constants';

type ButtonConfigType = {
  icon: string;
  isActive: boolean;
  value: {
    [k: string]: string | number
  }
};

export function createToolbar(state: ToolbarStateType): string {
  const btns: ButtonConfigType[] = [
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
    {
      icon: 'format_align_left',
      isActive: state.textAlign === 'left',
      value: {
        textAlign: 'left',
      },
    },
    {
      icon: 'format_align_center',
      isActive: state.textAlign === 'center',
      value: {
        textAlign: state.textAlign === 'center' ? initialStyleState.textAlign : 'center',
      },
    },
    {
      icon: 'format_align_right',
      isActive: state.textAlign === 'right',
      value: {
        textAlign: state.textAlign === 'right' ? initialStyleState.textAlign : 'right',
      },
    },
  ];

  return btns.map(btn => toButton(btn)).join(' ');
}

function toButton(button: ButtonConfigType) {
  const meta = `
    data-type="button"
    data-value='${JSON.stringify(button.value)}'
  `;

  return `
    <div 
    class="button ${button.isActive && 'active'}"
    ${meta}
    > 
      <i class="material-icons" ${meta}>${button.icon}</i>
    </div>
  `;
}
