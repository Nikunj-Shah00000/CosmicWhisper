import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { HealthStatus, WhisperMessage, WhisperMessageInput } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetWhisperMessagesUrl: () => string;
/**
 * Returns the last 50 messages from the whisper wall
 * @summary Get recent whisper wall messages
 */
export declare const getWhisperMessages: (options?: RequestInit) => Promise<WhisperMessage[]>;
export declare const getGetWhisperMessagesQueryKey: () => readonly ["/api/whisper/messages"];
export declare const getGetWhisperMessagesQueryOptions: <TData = Awaited<ReturnType<typeof getWhisperMessages>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWhisperMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWhisperMessages>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWhisperMessagesQueryResult = NonNullable<Awaited<ReturnType<typeof getWhisperMessages>>>;
export type GetWhisperMessagesQueryError = ErrorType<unknown>;
/**
 * @summary Get recent whisper wall messages
 */
export declare function useGetWhisperMessages<TData = Awaited<ReturnType<typeof getWhisperMessages>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWhisperMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getPostWhisperMessageUrl: () => string;
/**
 * @summary Post a message to the whisper wall
 */
export declare const postWhisperMessage: (whisperMessageInput: WhisperMessageInput, options?: RequestInit) => Promise<WhisperMessage>;
export declare const getPostWhisperMessageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof postWhisperMessage>>, TError, {
        data: BodyType<WhisperMessageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof postWhisperMessage>>, TError, {
    data: BodyType<WhisperMessageInput>;
}, TContext>;
export type PostWhisperMessageMutationResult = NonNullable<Awaited<ReturnType<typeof postWhisperMessage>>>;
export type PostWhisperMessageMutationBody = BodyType<WhisperMessageInput>;
export type PostWhisperMessageMutationError = ErrorType<unknown>;
/**
* @summary Post a message to the whisper wall
*/
export declare const usePostWhisperMessage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof postWhisperMessage>>, TError, {
        data: BodyType<WhisperMessageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof postWhisperMessage>>, TError, {
    data: BodyType<WhisperMessageInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map