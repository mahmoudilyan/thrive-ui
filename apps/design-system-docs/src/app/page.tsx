import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Hero } from '@/components/home/hero';
import { GetStarted } from '@/components/home/get-started';
import { FoundationsShowcase } from '@/components/home/foundations-showcase';
import { ComponentsGallery } from '@/components/home/components-gallery';
import { QuickStart } from '@/components/home/quick-start';
import { baseOptions } from '@/lib/layout.shared';

export default function HomePage() {
	return (
		<div className="flex flex-col">
			<Hero />
			<GetStarted />
			<FoundationsShowcase />
			<ComponentsGallery />
			<QuickStart />
		</div>
	);
}
