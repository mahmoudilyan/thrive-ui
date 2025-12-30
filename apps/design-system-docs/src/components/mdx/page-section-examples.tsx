'use client';

import { PageSection } from '@thrive/ui';
import { InteractiveCodeExample } from './interactive-code-example';

/**
 * Pre-built PageSection examples with onClick handlers
 * All JSX is created entirely on the client side to avoid serialization issues
 */

export function PageSectionWithActionsExample() {
	return (
		<InteractiveCodeExample
			title="Page with Actions"
			description="Primary and secondary actions for the page"
			code={`<PageSection
  pageTitle="User Management"
  primaryAction={{
    label: 'Add User',
    onClick: () => console.log('Add User clicked')
  }}
  secondaryActions={[
    {
      label: 'Import Users',
      href: '/import-users',
      onClick: () => console.log('Import Users clicked')
    },
    {
      label: 'Export CSV',
      href: '/export-csv',
      onClick: () => console.log('Export CSV clicked')
    }
  ]}
/>`}
		>
			<div className="bg-bg p-4 rounded-lg">
				<PageSection
					pageTitle="User Management"
					primaryAction={{
						label: 'Add User',
						onClick: () => console.log('Add User clicked'),
					}}
					secondaryActions={[
						{
							label: 'Import Users',
							href: '/import-users',
							onClick: () => console.log('Import Users clicked'),
						},
						{
							label: 'Export CSV',
							href: '/export-csv',
							onClick: () => console.log('Export CSV clicked'),
						},
					]}
				/>
			</div>
		</InteractiveCodeExample>
	);
}

export function PageSectionWithOverflowExample() {
	return (
		<InteractiveCodeExample
			title="Actions with Overflow"
			description="Additional actions in an overflow menu"
			code={`<PageSection
  pageTitle="Project Settings"
  primaryAction={{
    label: 'Save Changes',
    onClick: () => console.log('Save clicked')
  }}
  secondaryActions={[
    { label: 'Preview', href: '/preview', onClick: () => console.log('Preview clicked') }
  ]}
  otherActions={[
    { label: 'Settings', onClick: () => console.log('Settings clicked') },
    { label: 'Help', onClick: () => console.log('Help clicked') },
    { label: 'Archive Project', onClick: () => console.log('Archive clicked') }
  ]}
/>`}
		>
			<div className="bg-bg p-4 rounded-lg">
				<PageSection
					pageTitle="Project Settings"
					primaryAction={{
						label: 'Save Changes',
						onClick: () => console.log('Save clicked'),
					}}
					secondaryActions={[
						{ label: 'Preview', href: '/preview', onClick: () => console.log('Preview clicked') },
					]}
					otherActions={[
						{ label: 'Settings', onClick: () => console.log('Settings clicked') },
						{ label: 'Help', onClick: () => console.log('Help clicked') },
						{ label: 'Archive Project', onClick: () => console.log('Archive clicked') },
					]}
				/>
			</div>
		</InteractiveCodeExample>
	);
}

export function PageSectionWithSidebarToggleExample() {
	return (
		<InteractiveCodeExample
			title="Sidebar Integration"
			description="Show sidebar toggle button for mobile navigation"
			code={`<PageSection
  pageTitle="Dashboard"
  showSidebarToggle
/>`}
		>
			<div className="bg-bg p-4 rounded-lg">
				<PageSection pageTitle="Dashboard" showSidebarToggle />
			</div>
		</InteractiveCodeExample>
	);
}

export function PageSectionWizardExample() {
	return (
		<InteractiveCodeExample
			title="Wizard Layout"
			description="Specialized layout for multi-step forms"
			code={`<PageSection
  variant="create-wizard"
  breadcrumbs={[
    { label: 'Campaigns', href: '/campaigns' },
    { label: 'New Campaign' }
  ]}
  primaryAction={{
    label: 'Save Draft',
    onClick: () => console.log('Save Draft clicked')
  }}
  secondaryActions={[
    { label: 'Cancel', href: '/campaigns', onClick: () => console.log('Cancel clicked') }
  ]}
/>`}
		>
			<div className="bg-bg p-4 rounded-lg">
				<PageSection
					variant="create-wizard"
					breadcrumbs={[{ label: 'Campaigns', href: '/campaigns' }, { label: 'New Campaign' }]}
					primaryAction={{
						label: 'Save Draft',
						onClick: () => console.log('Save Draft clicked'),
					}}
					secondaryActions={[
						{ label: 'Cancel', href: '/campaigns', onClick: () => console.log('Cancel clicked') },
					]}
				/>
			</div>
		</InteractiveCodeExample>
	);
}
