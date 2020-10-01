const defaultRowWidth = 8;

function tableRemoveNewlines(input: string): string {
  return input.trimEnd().replace(/\\?\n/g, '<br>').padEnd(defaultRowWidth, ' ');
}

function withTableEscapes(state: any, action: () => void): void {
  const start = state.out.length;
  action();
  state.out = state.out.substr(0, start) + tableRemoveNewlines(state.out.substr(start));
  state.closed = false;
}

export const TableToMarkdown = {
  table(state: any, node: any): void {
    const rows = [];

    for (let i = 0; i < node.childCount; i++) {
      const child = node.maybeChild(i);

      if (child != null && child.type.name === 'table_row') {
        rows.push(child);
      }
    }

    if (rows.length === 0) {
      return;
    }

    // First row is the header row. Get column count, and draw it.

    state.render(rows[0]);
    const columnCount = rows[0].childCount; // Assumes first row is header.
    
    // Draw divider using the number of columns.
    state.write('\n');
    for (let i = 0; i < columnCount; i++) {
      state.write('|----------');
    }
    state.write('|');
    
    // Second row onwards are regular rows.
  
    for (let i = 1; i < rows.length; i++) {
      state.write('\n')
      state.render(rows[i]);
    }
  
    state.closeBlock(node);
  },

  table_row(state: any, node: any): void {
    state.write('| ');
    for (let i = 0; i < node.childCount; i++) {
      const child = node.maybeChild(i);
      if (child != null) {
        if (i > 0) {
          state.write(' | ');
        }
        withTableEscapes(state, () => {
          state.renderInline(child);
        });
      }
    }
    state.write(' |');
  },

  table_cell(state: any, node: any): void {
    state.renderInline(node);
  },

  table_header(state: any, node: any): void {
    state.renderInline(node);
  },
};
