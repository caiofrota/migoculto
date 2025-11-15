type BaseErrorParams = {
  name: string;
  message: string;
  stack?: string;
  cause?: Error;
  action?: string;
  statusCode?: number;
  errorId?: string;
  requestId?: string;
  context?: Record<string, any>;
  errorLocationCode?: string;
  key?: string;
  type?: string;
  databaseErrorCode?: string;
};

export class BaseError extends Error {
  action: string | undefined;
  statusCode: number;
  errorId: string;
  requestId: string | undefined;
  context: Record<string, any> | undefined;
  errorLocationCode: string | undefined;
  key: string | undefined;
  type: string | undefined;
  databaseErrorCode: string | undefined;
  constructor(args: BaseErrorParams) {
    super();
    this.name = args.name;
    this.message = args.message;
    this.cause = args.cause;
    this.action = args.action;
    this.statusCode = args.statusCode || 500;
    this.errorId = args.errorId || crypto.randomUUID();
    this.requestId = args.requestId;
    this.context = args.context;
    this.stack = args.stack;
    this.errorLocationCode = args.errorLocationCode;
    this.key = args.key;
    this.type = args.type;
    this.databaseErrorCode = args.databaseErrorCode;
  }
}

export class InternalServerError extends BaseError {
  constructor(
    args: Pick<BaseErrorParams, "action" | "statusCode" | "requestId" | "errorId" | "stack" | "errorLocationCode"> & {
      message?: string;
    } = {},
  ) {
    super({
      name: "InternalServerError",
      message: args.message || "Um erro inesperado ocorreu.",
      action: args.action || "Por favor, entre em contato com o suporte com o valor 'error_id'.",
      statusCode: args.statusCode || 500,
      requestId: args.requestId,
      errorId: args.errorId,
      stack: args.stack,
      errorLocationCode: args.errorLocationCode,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(
    args: Pick<BaseErrorParams, "action" | "requestId" | "stack" | "errorLocationCode"> & {
      message?: string;
    } = {},
  ) {
    super({
      name: "UnauthorizedError",
      message: args.message || "Usuário não autenticado.",
      action: args.action || "Por favor, verifique se você está autenticado com uma sessão ativa e tente novamente.",
      requestId: args.requestId,
      statusCode: 401,
      stack: args.stack,
      errorLocationCode: args.errorLocationCode,
    });
  }
}
