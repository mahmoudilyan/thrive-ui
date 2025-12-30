import CampaignWizard from '@/components/campaigns/campaign-wizard';
import { PageSection } from '@thrive/ui';
import { Suspense } from 'react';

export default function CreateCampaignPage() {
	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<CampaignWizard editedCampaignId={null} />
			</Suspense>
		</>
	);
}
