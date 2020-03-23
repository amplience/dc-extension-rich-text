export function inBlock(state: any) {
  const { $from } = state.selection;
  return $from.depth > 1;
}

export function isMarkActive(state: any, type: any): boolean {
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    return type.isInSet(state.storedMarks || $from.marks());
  } else {
    return state.doc.rangeHasMark(from, to, type);
  }
}

export function getSelectionMarks(state: any): any[] {
  const { $from, $to } = state.selection;
  const currentMarks: any[] = [];
  state.doc.nodesBetween($from.pos, $to.pos, (node: any) => {
    node.marks.forEach((mark: any) => currentMarks.push(mark));
  });
  return currentMarks;
}

export function hasMarkup(state: any, type: any, atts: any): boolean {
  const { $from, to, node } = state.selection;
  if (node) {
    return node.hasMarkup(type, atts);
  }
  return to <= $from.end() && $from.parent.hasMarkup(type, atts);
}

export function canInsert(state: any, type: any): boolean {
  const $from = state.selection.$from;
  for (let d = $from.depth; d >= 0; d--) {
    const index = $from.index(d);
    if ($from.node(d).canReplaceWith(index, index, type)) {
      return true;
    }
  }
  return false;
}

export function clearAllMarks(): (state: any, dispatch: any) => boolean {
  return (state: any, dispatch: any): boolean => {
    const ref = state.selection;
    const $cursor = ref.$cursor;
    const ranges = ref.ranges;
    if (dispatch) {
      if ($cursor) {
        const marks = state.storedMarks || $cursor.marks();
        for (const mark of marks) {
          dispatch(state.tr.removeStoredMark(mark.type));
        }
      } else {
        const { tr } = state;

        for (const range of ranges) {
          for (const markName of Object.keys(state.schema.marks)) {
            tr.removeMark(
              range.$from.pos,
              range.$to.pos,
              state.schema.marks[markName]
            );
          }
        }

        dispatch(tr);
      }
    }
    return true;
  };
}
