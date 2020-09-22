// Process &shy;

export function soft_hyphen_from(state: any, silent: any): boolean {
  const pos = state.pos;

  if (state.src.slice(pos, pos + 5) !== "&shy;") {
    return false;
  }

  if (!silent) {
    const content = state.src.slice(pos, pos + 5);

    const token    = state.push('soft_hyphen', 'shy', 0);
    token.attrs    = [];
    token.content  = content;
  }

  state.pos = pos + 5;

  return true;
};