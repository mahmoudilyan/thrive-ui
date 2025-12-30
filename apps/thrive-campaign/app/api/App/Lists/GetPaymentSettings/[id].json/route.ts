import { NextRequest, NextResponse } from 'next/server';
import paymentProducts from '@/mock/form-builder/payment-products.json';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await context.params;

		// Return payment settings for this form/list
		return NextResponse.json({
			domainId: 1,
			currency: paymentProducts.currency,
			gateway: {
				id: 'stripe-1',
				name: 'Stripe',
			},
			products: [],
			shipping: {
				enabled: true,
			},
			billing: {
				enabled: true,
			},
			recurringIntervals: paymentProducts.recurringIntervals,
		});
	} catch (error) {
		console.error('Error fetching payment settings:', error);
		return NextResponse.json({ error: 'Failed to fetch payment settings' }, { status: 500 });
	}
}
