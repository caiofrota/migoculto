import { Prisma } from "@prisma/client";
import { BaseError } from "errors";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { $ZodError, $ZodRawIssue } from "zod/v4/core";

type Handler = (req: NextRequest, params?: any) => Promise<NextResponse> | NextResponse;

export async function withErrorHandling(handler: Handler): Promise<Handler> {
  z.config({ customError });
  return async (req, params) => {
    try {
      return await handler(req, params);
    } catch (error) {
      if (error instanceof BaseError) {
        return NextResponse.json(
          {
            status: "error",
            error: error.name,
            message: error.message,
            action: error.action,
            error_id: error.errorId,
          },
          { status: error.statusCode },
        );
      } else if (error instanceof $ZodError) {
        return NextResponse.json(
          {
            status: "error",
            error: "BadRequestError",
            message: error.issues.map((issue) => issue.message),
            error_id: crypto.randomUUID(),
          },
          { status: 400 },
        );
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            {
              status: "error",
              error: "NotFoundError",
              message: "Recurso não encontrado.",
              action: "Por favor, verifique os dados fornecidos e tente novamente.",
              error_id: crypto.randomUUID(),
            },
            { status: 404 },
          );
        } else if (error.code === "P2002") {
          return NextResponse.json(
            {
              status: "error",
              error: "ConflictError",
              message: "Conflito de dados.",
              action: "Os dados fornecidos já existem. Por favor, verifique e tente novamente.",
              error_id: crypto.randomUUID(),
            },
            { status: 409 },
          );
        } else if (error.code === "P2003") {
          return NextResponse.json(
            {
              status: "error",
              error: "ForeignKeyConstraintError",
              message: "Violação de chave estrangeira.",
              action: "Os dados fornecidos referenciam um recurso inexistente. Por favor, verifique e tente novamente.",
              error_id: crypto.randomUUID(),
            },
            { status: 400 },
          );
        } else if (error.code === "P2004") {
          return NextResponse.json(
            {
              status: "error",
              error: "ConstraintViolationError",
              message: "Violação de restrição.",
              action: "Os dados fornecidos violam uma restrição. Por favor, verifique e tente novamente.",
              error_id: crypto.randomUUID(),
            },
            { status: 400 },
          );
        } else if (error.code === "P2005") {
          return NextResponse.json(
            {
              status: "error",
              error: "InvalidDataError",
              message: "Dados inválidos.",
              action: "Os dados fornecidos são inválidos para um ou mais campos. Por favor, verifique e tente novamente.",
              error_id: crypto.randomUUID(),
            },
            { status: 400 },
          );
        }
      }
      console.error(error);
      return NextResponse.json(
        {
          status: "error",
          error: "InternalServerError",
          message: "Um erro inesperado ocorreu.",
          action: "Por favor, entre em contato com o suporte com o valor 'error_id'.",
          error_id: crypto.randomUUID(),
        },
        { status: 500 },
      );
    }
  };
}

function customError(issue: $ZodRawIssue) {
  if (issue.path && issue.path.length > 0) {
    if (issue.code === "too_small") {
      if (issue.minimum === 1 && issue.type === "string") {
        return `Campo '${pathToLabel(issue.path)}' é obrigatório.`;
      } else if (issue.type === "number") {
        return `Campo '${pathToLabel(issue.path)}' deve ser maior ou igual a ${issue.minimum}.`;
      }
    } else if (issue.code === "invalid_type") {
      if (issue.expected === "string") {
        if (issue.received !== "undefined") {
          return `Campo '${pathToLabel(issue.path)}' é obrigatório.`;
        } else {
          return `Campo '${pathToLabel(issue.path)}' deve ser uma string.`;
        }
      }
      if (issue.expected === "number") {
        return `Campo '${pathToLabel(issue.path)}' deve ser um número.`;
      }
    } else if (issue.code === "invalid_format") {
      if (issue.format === "email") {
        return `Campo '${pathToLabel(issue.path)}' deve ser um endereço de email válido.`;
      }
    }
  }
  return issue.message;
}

function pathToLabel(pathname: PropertyKey[]): string {
  return pathname
    .map((part) => (typeof part === "number" ? `[${part}]` : part))
    .join(".")
    .replace(/\.?\[(\d+)\]/g, "[$1]");
}
