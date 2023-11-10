export interface IToken {
  generate: (userId: string) => Promise<string>;
  validate: (token: string) => Promise<string>;
}
