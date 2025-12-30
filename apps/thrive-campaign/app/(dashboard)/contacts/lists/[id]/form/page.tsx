import { Suspense } from 'react';
import { FormBuilderWizard } from '@/components/form-builder/form-builder-wizard';

interface FormBuilderPageProps {
	params: Promise<{ id: string }>;
}

export default async function FormBuilderPage({ params }: FormBuilderPageProps) {
	const { id } = await params;

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<FormBuilderWizard listId={id} />
		</Suspense>
	);
}
