// This error class helps guide users (and us) when an error occurs to indicate an obvious bug, with context, and what to do about it.
export class InternalError extends Error {
  constructor(message: string) {
    super(
      `Internal error: ${message}. This is a bug, please report the message and the stack trace to the maintainer at https://github.com/nebrius/honeyhive-interview/issues`
    );
  }
}
