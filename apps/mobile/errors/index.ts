type BaseErrorParams = {
  name: string;
  message: string;
  action?: string;
  statusCode?: number;
  errorId?: string;
  type?: string;
};

export class CustomError extends Error {
  action: string | undefined;
  statusCode: number;
  errorId: string | undefined;
  requestId: string | undefined;
  context: Record<string, any> | undefined;
  errorLocationCode: string | undefined;
  key: string | undefined;
  type: string | undefined;
  databaseErrorCode: string | undefined;
  constructor(
    args: BaseErrorParams = {
      name: "CustomError",
      message: "Ocorreu um erro inesperado.",
      action: "Por favor, entre em contato com o suporte caso o problema persista.",
    },
  ) {
    super();
    this.name = args.name;
    this.message = args.message;
    this.action = args.action;
    this.statusCode = args.statusCode || 500;
    this.errorId = args.errorId;
    this.type = args.type;
  }
}

export class NetworkError extends CustomError {
  constructor(
    args: Pick<BaseErrorParams, "action" | "statusCode"> & {
      message?: string;
    } = {},
  ) {
    super({
      name: "NetworkError",
      message: args.message || "Não foi possível conectar ao servidor.",
      action: args.action || "Verifique sua conexão com a internet e tente novamente.",
      statusCode: 503,
    });
  }
}
