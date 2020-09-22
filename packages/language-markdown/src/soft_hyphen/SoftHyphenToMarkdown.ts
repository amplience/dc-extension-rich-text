export const SoftHyphenToMarkdown = {
  soft_hyphen(state: any, node: any): void {
    state.write("&shy;");
  },
};
