import { ValidationError } from "apollo-server-express";
import { GraphQLFormattedError } from "graphql";

// custom formatError callback
/**
 * @description playground custom Error Filter
 * @param err 
 * @returns 
 */
export const formatError = (err: any): GraphQLFormattedError => {
    let { message, extensions } = err;
    // (property) formatError?: (formattedError: GraphQLFormattedError, error: unknown) => GraphQLFormattedError

    console.log('message', message, extensions)

    // class-validator and graphql validation exception handling
    if (err instanceof ValidationError || message.startsWith("Argument")) {
        extensions = { status: 400 };
    }

    // Nest.js HTTP exception
    if (extensions && extensions.exception && extensions.exception.response) {
        return {
            message: extensions?.code || "SERVER_ERROR",
            extensions: {
                content: extensions?.content || '',
                serviceName: extensions?.serviceName || '',
                status: extensions?.originalError?.statusCode || extensions?.originalError || (extensions && extensions.status ? extensions.status : 500),
            }
        };
    }

    return {
        message: extensions?.code || "SERVER_ERROR",
        extensions: {
            content: extensions?.content || '',
            serviceName: extensions?.serviceName || '',
            status: extensions?.originalError?.statusCode || extensions?.originalError || (extensions && extensions.status ? extensions.status : 500),
        }
    };
};