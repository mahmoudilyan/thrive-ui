'use client';

import { useState } from 'react';
import { Button } from '@thrive/ui';

export function TestS3Paths() {
	const [results, setResults] = useState<any[]>([]);

	const testKey = async (key: string) => {
		console.log('Testing key:', key);
		const result: any = { key, tests: [] };

		// Test list API
		try {
			const listResponse = await fetch('https://uix.vbout.com/Dashboard3/api/s3/list?path=/');
			const items = await listResponse.json();
			result.tests.push({
				name: 'List API',
				success: true,
				message: `Found ${items.length} items`,
				sampleKey: items[0]?.key,
			});
		} catch (error) {
			result.tests.push({
				name: 'List API',
				success: false,
				error: error.message,
			});
		}

		// Test signed URL
		try {
			const signedResponse = await fetch(
				`https://uix.vbout.com/Dashboard3/api/s3/signed-url?key=${encodeURIComponent(key)}`
			);
			const signedData = await signedResponse.json();
			result.tests.push({
				name: 'Signed URL',
				success: signedResponse.ok,
				url: signedData.url,
				error: signedData.error,
			});
		} catch (error) {
			result.tests.push({
				name: 'Signed URL',
				success: false,
				error: error.message,
			});
		}

		// Test proxy image
		try {
			const proxyUrl = `https://uix.vbout.com/Dashboard3/api/s3/proxy-image?key=${encodeURIComponent(
				key
			)}`;
			const proxyResponse = await fetch(proxyUrl, { method: 'HEAD' });
			result.tests.push({
				name: 'Proxy Image',
				success: proxyResponse.ok,
				status: proxyResponse.status,
				contentType: proxyResponse.headers.get('content-type'),
			});
		} catch (error) {
			result.tests.push({
				name: 'Proxy Image',
				success: false,
				error: error.message,
			});
		}

		setResults(prev => [...prev, result]);
	};

	const testCommonKeys = () => {
		// Test different key formats
		const keysToTest = [
			'25441803782_ed79053d45_o.jpg',
			'ai-images/25441803782_ed79053d45_o.jpg',
			'/ai-images/25441803782_ed79053d45_o.jpg',
			'public/files/1029/ai-images/25441803782_ed79053d45_o.jpg',
		];

		keysToTest.forEach(key => testKey(key));
	};

	return (
		<div className="p-4">
			<h2 className="text-lg mb-4">S3 Path Testing</h2>
			<Button onClick={testCommonKeys} className="mb-4">
				Test Common Key Formats
			</Button>

			{results.map((result, idx) => (
				<div key={idx} className="mb-4 p-4 bg-gray-50 rounded-md">
					<p className="font-bold">Key: {result.key}</p>
					{result.tests.map((test: any, testIdx: number) => (
						<div
							key={testIdx}
							className={`mt-2 p-2 rounded ${test.success ? 'bg-green-50' : 'bg-red-50'}`}
						>
							<p className="font-medium">{test.name}</p>
							<pre className="text-xs font-mono bg-white p-2 rounded mt-1 overflow-auto">
								{JSON.stringify(test, null, 2)}
							</pre>
						</div>
					))}
				</div>
			))}
		</div>
	);
}
