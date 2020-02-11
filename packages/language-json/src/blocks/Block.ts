export interface Block {
  type: string;
  data: any;
}

export interface BlockConverter {
  canSerialize: (schema: any, node: any) => boolean;
  serialize: (schema: any, nodes: any[]) => Block[];
  canParse: (schema: any, block: Block) => boolean;
  parse: (schema: any, blocks: Block[]) => any[];
}
