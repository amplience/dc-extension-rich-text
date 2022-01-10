import { isMarkActive } from "@dc-extension-rich-text/common";

function rangeHasFilteredMark(
  doc: any,
  from: number,
  to: number,
  type: any,
  filter: (mark: any) => boolean
): boolean {
  let found = false;
  if (to > from) {
    doc.nodesBetween(from, to, (node: any) => {
      if (type.isInSet(node.marks) && node.marks.filter(filter).length > 0) {
        found = true;
      }
      return !found;
    });
  }
  return found;
}

export function isFilteredMarkActive(
  state: any,
  type: any,
  filter: (mark: any) => boolean
): boolean {
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    if (!type.isInSet(state.storedMarks || $from.marks())) {
      return false;
    }
    const validMarks = (state.storedMarks || $from.marks()).filter(filter);
    return validMarks.length > 0;
  } else {
    return rangeHasFilteredMark(state.doc, from, to, type, filter);
  }
}

function getMarkFromRange(
  state: any,
  from: number,
  to: number,
  markType: any
): any | undefined {
  let result: any;
  if (to > from) {
    state.doc.nodesBetween(from, to, (node: any) => {
      if (markType.isInSet(node.marks)) {
        result = node.marks.find((x: any) => x.type === markType);
        return false;
      }
      return true;
    });
  }
  return result;
}

function getStoredMark(state: any, markType: any): any | undefined {
  const ref = state.selection;
  const $cursor = ref.$cursor;

  if ($cursor) {
    return (state.storedMarks || $cursor.marks()).find(
      (x: any) => x.type === markType
    );
  }
}

function mergeAttrs(oldAttrs: any, newAttrs: any): any {
  if (/amp-text-colour/.test(oldAttrs.class) && /amp-text-colour/.test(newAttrs.class)) {
    const mainClass = oldAttrs.class.split(' ')[0];
    return {
      ...oldAttrs,
      ...newAttrs,
      "class": `${mainClass} ${newAttrs.class}`
    };
  }

  if (/amp-text-colour/.test(newAttrs.class)) {
    return {
      ...oldAttrs,
      ...newAttrs,
      "class": `${oldAttrs.class} ${newAttrs.class}`
    };
  }

  return {
    ...oldAttrs,
    ...newAttrs
  };
}

export function setMarkAttributes(
  markType: any,
  attrs: any
): (state: any, dispatch: any) => void {
  return (state: any, dispatch: any): boolean => {
    const ref = state.selection;
    const $cursor = ref.$cursor;
    const ranges = ref.ranges;
    if (dispatch) {
      if ($cursor) {
        if (markType.isInSet(state.storedMarks || $cursor.marks())) {
          const existingMark = getStoredMark(state, markType);
          dispatch(state.tr.removeStoredMark(markType));
          if (existingMark) {
            dispatch(
              state.tr.addStoredMark(
                markType.create(mergeAttrs(existingMark.attrs, attrs))
              )
            );
          }
        } else {
          dispatch(state.tr.addStoredMark(markType.create(attrs)));
        }
      } else {
        let has = false;
        const tr = state.tr;
        for (let i = 0; !has && i < ranges.length; i++) {
          const ref$1 = ranges[i];
          const $from = ref$1.$from;
          const $to = ref$1.$to;
          has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
        }
        for (const ref$2 of ranges) {
          const $from$1 = ref$2.$from;
          const $to$1 = ref$2.$to;
          if (has) {
            const markAttrs = {
              ...getMarkFromRange(state, $from$1.pos, $to$1.pos, markType).attrs
            };
            tr.removeMark($from$1.pos, $to$1.pos, markType);
            tr.addMark(
              $from$1.pos,
              $to$1.pos,
              markType.create(mergeAttrs(markAttrs, attrs))
            );
          } else {
            let classesSplitted = attrs.class.split(" ");
            classesSplitted = classesSplitted[classesSplitted.length - 1];
            if (attrs && attrs.class && /amp-text-colour/.test(attrs.class)) {
              const nodeBefore = $from$1.nodeBefore;

              if (nodeBefore && nodeBefore.marks && nodeBefore.marks.length) {
                const parentClass = nodeBefore.marks.find((el: any) => el.type.name === "inline_styles" && !/amp-text-colour/.test(el.attrs.class));

                if (parentClass) {
                  attrs.class = parentClass.attrs.class + " " + classesSplitted;
                }
              } else {
                attrs.class = classesSplitted;
              }
            }
            tr.addMark($from$1.pos, $to$1.pos, markType.create(attrs));
          }
        }
        dispatch(tr.scrollIntoView());
      }
    }
    return true;
  };
}
