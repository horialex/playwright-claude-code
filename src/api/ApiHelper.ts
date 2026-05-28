import { APIRequestContext, APIResponse } from '@playwright/test';

type Headers = Record<string, string>;
type QueryParams = Record<string, string | number | boolean>;
type RequestBody =
    | Record<string, unknown>
    | unknown[]
    | string
    | number
    | boolean
    | null;

type FormBody = Record<string, string | number | boolean>;
type MultipartBody = Record<string, string | number | boolean>;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';



export class ApiHelper {
    readonly apiContext: APIRequestContext;
    private readonly shouldLog: boolean;

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
        this.shouldLog = process.env.LOG_API === 'true';
    }

    get request(): ApiRequest {
        return new ApiRequest(this);
    }

    log(method: HttpMethod, path: string, status: number): void {
        if (this.shouldLog) {
            console.log(`[API LOG] ${method} ${path} → ${status}`);
        }
    }
}

class ApiRequest {
    private readonly api: ApiHelper;

    private requestPath = '';
    private requestHeaders: Headers = {};
    private requestQuery?: QueryParams;
    private requestBody?: RequestBody;
    private requestForm?: FormBody;
    private requestMultipart?: MultipartBody;
    private expectedStatus?: number;
    private bearerTokenValue?: string;

    constructor(api: ApiHelper) {
        this.api = api;
    }

    path(path: string): this {
        this.requestPath = path;
        return this;
    }

    bearerToken(token: string): this {
        this.bearerTokenValue = token;
        return this;
    }

    header(name: string, value: string): this {
        this.requestHeaders[name] = value;
        return this;
    }

    headers(headers: Headers): this {
        this.requestHeaders = {
            ...this.requestHeaders,
            ...headers,
        };

        return this;
    }

    contentTypeJson(): this {
        this.requestHeaders['Content-Type'] = 'application/json';
        return this;
    }

    query(params: QueryParams): this {
        this.requestQuery = params;
        return this;
    }

    body(body: RequestBody): this {
        this.requestBody = body;
        this.requestForm = undefined;
        return this;
    }

    form(form: FormBody): this {
        this.requestForm = form;
        this.requestBody = undefined;
        return this;
    }

    multipart(data: MultipartBody): this {
        this.requestMultipart = data;
        this.requestBody = undefined;
        this.requestForm = undefined;
        return this;
    }

    expectStatus(status: number): this {
        this.expectedStatus = status;
        return this;
    }

    async get(): Promise<APIResponse> {
        return this.send('GET');
    }

    async post(): Promise<APIResponse> {
        return this.send('POST');
    }

    async put(): Promise<APIResponse> {
        return this.send('PUT');
    }

    async patch(): Promise<APIResponse> {
        return this.send('PATCH');
    }

    async delete(): Promise<APIResponse> {
        return this.send('DELETE');
    }

    // unmarshal methods
    async getJson<T>(): Promise<T> {
        const response = await this.get();
        return response.json() as Promise<T>;
    }

    async postJson<T>(): Promise<T> {
        const response = await this.post();
        return response.json() as Promise<T>;
    }

    async putJson<T>(): Promise<T> {
        const response = await this.put();
        return response.json() as Promise<T>;
    }

    async patchJson<T>(): Promise<T> {
        const response = await this.patch();
        return response.json() as Promise<T>;
    }

    // Only use this if DELETE returns JSON - usually DELETE returns 204 and no response body
    async deleteJson<T>(): Promise<T> {
        const response = await this.delete();
        return response.json() as Promise<T>;
    }

    private async send(method: HttpMethod): Promise<APIResponse> {
        if (!this.requestPath) {
            throw new Error(
                'API request path was not provided. Use .path("/endpoint") before calling the HTTP method.'
            );
        }

        const headers = this.resolveHeaders();

        const options = {
            headers,
            params: this.requestQuery,
            data: this.requestBody,
            form: this.requestForm,
            multipart: this.requestMultipart,
        };

        const response = await this.execute(method, options);

        this.api.log(method, this.requestPath, response.status());

        await this.validateStatus(method, response);

        return response;
    }

    private resolveHeaders(): Headers {
        if (!this.bearerTokenValue) {
            return this.requestHeaders;
        }

        return {
            Authorization: `Bearer ${this.bearerTokenValue}`,
            ...this.requestHeaders,
        };
    }

    private async execute(
        method: HttpMethod,
        options: {
            headers: Headers;
            params?: QueryParams;
            data?: RequestBody;
            form?: FormBody;
            multipart?: MultipartBody;
        }
    ): Promise<APIResponse> {
        switch (method) {
            case 'GET':
                return this.api.apiContext.get(this.requestPath, options);

            case 'POST':
                return this.api.apiContext.post(this.requestPath, options);

            case 'PUT':
                return this.api.apiContext.put(this.requestPath, options);

            case 'PATCH':
                return this.api.apiContext.patch(this.requestPath, options);

            case 'DELETE':
                return this.api.apiContext.delete(this.requestPath, options);

            default:
                throw new Error(`Unsupported method: ${method}`);
        }
    }

    private async validateStatus(method: HttpMethod, response: APIResponse): Promise<void> {
        if (this.expectedStatus === undefined) {
            return;
        }

        if (response.status() === this.expectedStatus) {
            return;
        }

        const responseBody = await this.safeResponseBody(response);

        throw new Error(
            [
                `Unexpected API response status.`,
                `Request: ${method} ${this.requestPath}`,
                `Expected: ${this.expectedStatus}`,
                `Actual: ${response.status()}`,
                `Body: ${responseBody}`,
            ].join('\n')
        );
    }

    private async safeResponseBody(response: APIResponse): Promise<string> {
        try {
            return await response.text();
        } catch {
            return '<could not read response body>';
        }
    }
}