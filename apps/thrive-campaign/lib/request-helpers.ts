import { NextRequest } from 'next/server';

type Primitive = string | number | boolean | null;

type ParsedBody = Record<string, Primitive | Primitive[] | Record<string, Primitive>>;

function parseFormData(formData: FormData): ParsedBody {
	const result: ParsedBody = {};

	for (const [key, value] of formData.entries()) {
		const existing = result[key];
		const serializedValue = typeof value === 'string' ? value : (value.name ?? '');

		if (existing === undefined) {
			result[key] = serializedValue;
			continue;
		}

		if (Array.isArray(existing)) {
			existing.push(serializedValue);
			continue;
		}

		result[key] = [existing as Primitive, serializedValue];
	}

	return result;
}

function parseUrlEncoded(body: string): ParsedBody {
	const searchParams = new URLSearchParams(body);
	const result: ParsedBody = {};

	for (const [key, value] of searchParams.entries()) {
		const existing = result[key];

		if (existing === undefined) {
			result[key] = value;
			continue;
		}

		if (Array.isArray(existing)) {
			existing.push(value);
			continue;
		}

		result[key] = [existing as Primitive, value];
	}

	return result;
}

export async function parseRequestBody<TBody extends ParsedBody = ParsedBody>(
	request: NextRequest
): Promise<TBody> {
	const contentType = request.headers.get('content-type') ?? '';

	if (contentType.includes('application/json')) {
		return (await request.json()) as TBody;
	}

	if (contentType.includes('application/x-www-form-urlencoded')) {
		const bodyText = await request.text();
		return parseUrlEncoded(bodyText) as TBody;
	}

	if (contentType.includes('multipart/form-data')) {
		const formData = await request.formData();
		return parseFormData(formData) as TBody;
	}

	if (request.method === 'GET' || request.method === 'HEAD') {
		return {} as TBody;
	}

	try {
		return (await request.json()) as TBody;
	} catch (error) {
		console.warn('Failed to parse request body, returning empty object.', error);
		return {} as TBody;
	}
}

