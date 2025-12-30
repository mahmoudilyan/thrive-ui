import { addons } from 'storybook/manager-api';
import { thriveTheme } from './thrive-theme';

addons.setConfig({
	theme: thriveTheme,
	panelPosition: 'bottom',
	selectedPanel: 'storybook/docs/panel',
});
