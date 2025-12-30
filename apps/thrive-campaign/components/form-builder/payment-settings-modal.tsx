'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	Button,
	Text,
	Box,
} from '@thrive/ui';
import { useFormBuilderStore } from '@/store/form-builder/use-form-builder-store';

interface PaymentSettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function PaymentSettingsModal({ isOpen, onClose }: PaymentSettingsModalProps) {
	const { payment, updatePayment } = useFormBuilderStore();
	const [selectedDomain, setSelectedDomain] = useState(payment?.domainId?.toString() || '');
	const [selectedGateway, setSelectedGateway] = useState(
		payment?.gateway ? `${payment.gateway.name}-${payment.gateway.id}` : ''
	);

	const handleSave = () => {
		if (!selectedDomain) {
			alert('Please select an e-commerce store');
			return;
		}

		updatePayment({
			domainId: parseInt(selectedDomain),
		});

		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-xl">
				<DialogHeader>
					<DialogTitle>Payment Settings</DialogTitle>
					<DialogDescription>Configure payment options for your form</DialogDescription>
				</DialogHeader>

				<Box className="space-y-4 py-4">
					<div>
						<label className="block text-sm font-medium mb-2">E-commerce Store / Feed</label>
						<select
							value={selectedDomain}
							onChange={e => setSelectedDomain(e.target.value)}
							className="w-full border border-border rounded-md px-3 py-2 text-sm"
						>
							<option value="">-- Select Store --</option>
							<option value="1">My Store</option>
							<option value="2">Product Feed</option>
						</select>
					</div>

					{selectedDomain && (
						<div>
							<label className="block text-sm font-medium mb-2">Payment Gateway</label>
							<select
								value={selectedGateway}
								onChange={e => setSelectedGateway(e.target.value)}
								className="w-full border border-border rounded-md px-3 py-2 text-sm"
							>
								<option value="">-- Select Gateway --</option>
								<optgroup label="Stripe">
									<option value="stripe-1">Stripe Account 1</option>
									<option value="stripe-2">Stripe Account 2</option>
								</optgroup>
							</select>
						</div>
					)}

					{payment?.currency && (
						<Box className="p-3 bg-blue-50 rounded border border-blue-200">
							<Text className="text-sm">
								<strong>Currency:</strong> {payment.currency.name} ({payment.currency.sign})
							</Text>
						</Box>
					)}
				</Box>

				<DialogFooter>
					<Button variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleSave}>
						Save Settings
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
