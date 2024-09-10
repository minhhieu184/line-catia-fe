export const AppErrors = {
  Other: ["unknown", 500],
  Invalid: ["invalid-request", 400],
  Authn: ["authentication", 401],
  Authz: ["authorization", 403],
  NotExist: ["resource-not-found", 404],
  Exist: ["resource-already-exists", 409],
  Validation: ["validation", 422],
  Captcha: ["captcha", 422],
  RateLimiting: ["rate-limiting", 429],
  Database: ["database-query", 500],
  Service: ["internal-service-failure", 500],
} as const;

export class AppError extends Error {
  code: string;
  httpCode: number;
  constructor(code: keyof typeof AppErrors | string, message: string) {
    const err = Object.entries(AppErrors).find(
      (v) => v[0] === code || v[1][0] === code
    );

    if (!err) {
      throw new Error(message);
    }

    super(`Error: ${err[0]}`, {
      cause: message,
    });
    this.code = err[0];
    this.httpCode = err[1][1];
  }
}
