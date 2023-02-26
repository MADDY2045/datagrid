import React from 'react';
import {
  CellTemplate,
  Cell,
  Compatible,
  Uncertain,
  UncertainCompatible,
  isNavigationKey,
  getCellProperty,
  isAlphaNumericKey,
  keyCodes,
} from '@silevis/reactgrid';

export default class FlagCellTemplate {
  getCompatibleCell(uncertainCell) {
    //console.log('uncertainCell::::', uncertainCell);
    const text = getCellProperty(uncertainCell, 'text', 'string');
    const value = text;
    return { ...uncertainCell, text, value };
  }

  handleKeyDown(cell, keyCode, ctrl, shift, alt) {
    if (!ctrl && !alt && isAlphaNumericKey(keyCode))
      return { cell, enableEditMode: true };
    return {
      cell,
      enableEditMode:
        keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER,
    };
  }

  update(cell, cellToMerge) {
    return this.getCompatibleCell({ ...cell, text: cellToMerge.text });
  }

  render(cell, isInEditMode, onCellChanged) {
    console.log('entered render mode::::', cell, isInEditMode);

    if (!isInEditMode) {
      let text = 'Maddy';
      return (
        <>
          <input
            style={{ padding: '12px' }}
            type="text"
            disabled
            defaultValue={cell.text}
          />
        </>
      );
    }
    return (
      <>
        <input
          ref={(input) => {
            input && input.focus();
          }}
          onClick={(e) => e.target.focus()}
          defaultValue={cell.text}
          onChange={(e) =>
            onCellChanged(
              this.getCompatibleCell({ ...cell, text: e.currentTarget.value }),
              false
            )
          }
          onCopy={(e) => e.stopPropagation()}
          onCut={(e) => e.stopPropagation()}
          onPaste={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (isAlphaNumericKey(e.keyCode) || isNavigationKey(e.keyCode))
              e.stopPropagation();
          }}
        />
        <i
          onMouseOver={(e) =>
            console.log('moving over anomolus', e.target, cell)
          }
          className="fa-regular fa-lock"
        ></i>
        <i
          onMouseOver={(e) =>
            console.log('moving over anomolus', e.target, cell)
          }
          className="fa-solid fa-xmark"
        ></i>
      </>
    );
  }
}
