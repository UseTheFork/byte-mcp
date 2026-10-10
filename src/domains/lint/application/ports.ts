export interface CommandOutput {
  exitCode: number;
  output: string;
}

export interface CommandRunner {
  run(argv: string[], cwd: string): Promise<CommandOutput>;
}
