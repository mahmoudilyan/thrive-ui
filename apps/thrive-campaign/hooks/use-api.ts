import { ApiEndpoint } from '@/services/config/api';
import { useQuery, useMutation, useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { env } from '../services/config/api';

interface QueryOptions<TParams = void> {
	params?: TParams;
	jsonFile?: string;
	enabled?: boolean;
}

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface MutationOptions<TParams = void, TBody = object> {
	body?: TBody;
	params?: TParams;
	method?: HttpMethod;
	jsonFile?: string;
}

const getParam = (param: string) => {
	if (typeof window === 'undefined') return '';
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param) || '';
};

const attachCsrf = data => {
	const csrf = document.cookie
		.split('; ')
		.filter(row => row.startsWith('VBT_CSRF_TOKEN='))
		.map(c => c.split('=')[1])[0];

	if (data) {
		if ('string' === typeof data) {
			data += '&VBT_CSRF_TOKEN=' + csrf;
		} else if ('[object Object]' === Object.prototype.toString.call(data)) {
			data.VBT_CSRF_TOKEN = csrf;
		} else if ('[object Array]' === Object.prototype.toString.call(data)) {
			data.push({ name: 'VBT_CSRF_TOKEN', value: csrf });
		} else if (data instanceof FormData) {
			data.set('VBT_CSRF_TOKEN', csrf);
		}
	}

	return data;
};

export const useApi = <TResponse = any, TParams = void>(
	apiConfig: ApiEndpoint<TParams>,
	options?: QueryOptions<TParams>,
	body?: object,
	dependencies?: object
) => {
	return useQuery<TResponse>({
		queryKey: [...apiConfig.createKey(options?.params), dependencies],
		queryFn: async () => {
			// if (options?.jsonFile && process.env.NODE_ENV === 'development') {
			//   const mockData = await import(`@/mock/${options.jsonFile}`);
			//   return mockData.default;
			// }
			if (getParam('dummyData') === 'yes') {
				if (env.isDev) {
					if (options?.jsonFile) {
						const mockData = await import(`../../server-mock/mock/${options.jsonFile}`);
						return mockData.default;
					}
				}
			}

			const method = apiConfig.method || 'GET';
			const url =
				typeof apiConfig.url === 'function' ? apiConfig.url(options?.params) : apiConfig.url;

			const headers = new Headers({
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			});

			let bodyData;
			if (method !== 'GET') {
				body = body || {};
				body = attachCsrf(body);

				if (apiConfig.contentType === 'form') {
					const formData = new URLSearchParams();
					for (const [key, value] of Object.entries(body)) {
						if (value !== undefined) {
							if (typeof value === 'object') {
								formData.append(key, JSON.stringify(value));
							} else {
								formData.append(key, value.toString());
							}
						}
					}
					bodyData = formData;
					headers.set('Content-Type', 'application/x-www-form-urlencoded');
				} else {
					bodyData = JSON.stringify(body);
					headers.set('Content-Type', 'application/json');
				}
			}

			const response = await fetch(url, {
				method,
				headers,
				body: bodyData,
				credentials: 'include',
			});

			return response.json();
		},
	});
};

export const useApiInfinite = <
	TData extends { after?: TPageParam | undefined },
	TParams extends object = object,
	TPageParam = string,
>(
	apiConfig: ApiEndpoint<TParams>,
	options?: QueryOptions<TParams> & { initialPageParam?: TPageParam },
	requestBody?: object,
	dependencies?: object
) => {
	const resolvedInitialPageParam = options?.initialPageParam;

	return useInfiniteQuery<
		TData,
		Error,
		InfiniteData<TData, TPageParam>,
		ReadonlyArray<unknown>,
		TPageParam | undefined
	>({
		queryKey: [
			...apiConfig.createKey(options?.params as TParams),
			dependencies,
			requestBody,
		] as const,
		queryFn: async ({ pageParam }) => {
			const { params: staticParams, jsonFile } = options || {};

			if (getParam('dummyData') === 'yes' && env.isDev && jsonFile) {
				const mockModule = await import(`../../server-mock/mock/${jsonFile}`);
				return mockModule.default as TData;
			}

			const method = apiConfig.method || 'GET';

			const effectiveParams: Record<string, any> = { ...staticParams };
			const pageQueryKey = apiConfig.pageParamKey || 'after';

			if (pageParam !== undefined) {
				effectiveParams[pageQueryKey] = pageParam;
			}

			let finalUrl: string;
			if (typeof apiConfig.url === 'function') {
				finalUrl = apiConfig.url(effectiveParams as TParams);
			} else {
				finalUrl = apiConfig.url;
				const urlSearchParams = new URLSearchParams();
				for (const [key, value] of Object.entries(effectiveParams)) {
					if (value !== undefined && value !== null) {
						if (Array.isArray(value)) {
							value.forEach(v => urlSearchParams.append(key, String(v)));
						} else {
							urlSearchParams.append(key, String(value));
						}
					}
				}
				const queryString = urlSearchParams.toString();
				if (queryString) {
					finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryString;
				}
			}

			const headers = new Headers({
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			});

			let bodyDataToSend;
			if (method !== 'GET' && requestBody) {
				let processedBody = { ...requestBody };
				processedBody = attachCsrf(processedBody);

				if (apiConfig.contentType === 'form') {
					const formData = new URLSearchParams();
					for (const [key, value] of Object.entries(processedBody)) {
						if (value !== undefined) {
							if (value !== null && typeof value === 'object' && !(value instanceof File)) {
								formData.append(key, JSON.stringify(value));
							} else {
								formData.append(key, (value as any)?.toString() ?? '');
							}
						}
					}
					bodyDataToSend = formData;
					headers.set('Content-Type', 'application/x-www-form-urlencoded');
				} else {
					bodyDataToSend = JSON.stringify(processedBody);
					headers.set('Content-Type', 'application/json');
				}
			}

			const response = await fetch(finalUrl, {
				method,
				headers,
				body: bodyDataToSend,
				credentials: 'include',
			});

			if (!response.ok) {
				let errorData;
				try {
					errorData = await response.json();
				} catch (e) {
					errorData = { message: response.statusText || 'Request failed' };
				}
				throw new Error(errorData.message || `Request failed with status ${response.status}`);
			}

			return response.json() as Promise<TData>;
		},
		initialPageParam: resolvedInitialPageParam,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		getNextPageParam: (lastPage: TData) => {
			return ((lastPage as any).after as TPageParam | undefined) ?? undefined;
		},
		enabled: options?.enabled,
	});
};

export const useApiMutation = <TResponse = any, TParams = void, TBody = object>(
	apiConfig: ApiEndpoint<TParams>,
	options?: MutationOptions<TParams, TBody>
) => {
	return useMutation<TResponse, Error, TBody>({
		mutationFn: async (body: TBody) => {
			if (getParam('dummyData') === 'yes' && env.isDev && options?.jsonFile) {
				const mockData = await import(`../../server-mock/mock/${options.jsonFile}`);
				return mockData.default;
			}

			const method = options?.method || 'POST';
			const url =
				typeof apiConfig.url === 'function' ? apiConfig.url(options.params) : apiConfig.url;
			const headers = new Headers({
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			});

			let bodyData;
			if (body) {
				if (apiConfig.contentType === 'form') {
					const formData = new URLSearchParams();

					const appendToFormData = (obj: any, prefix = '') => {
						for (const [key, value] of Object.entries(obj)) {
							if (value !== undefined) {
								const formKey = prefix ? `${prefix}[${key}]` : key;
								if (value !== null && typeof value === 'object' && !(value instanceof File)) {
									appendToFormData(value, formKey);
								} else {
									formData.append(formKey, value?.toString() ?? '');
								}
							}
						}
					};

					appendToFormData(body);
					bodyData = formData;
					headers.set('Content-Type', 'application/x-www-form-urlencoded');
				} else {
					bodyData = JSON.stringify(body);
					headers.set('Content-Type', 'application/json');
				}
			}

			const response = await fetch(url, {
				method,
				headers,
				body: bodyData,
				credentials: 'include',
			});

			return response.json();
		},
	});
};
