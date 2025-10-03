'use client';

import {
	MantineColorsTuple,
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
	createTheme,
	Button,
} from '@mantine/core';

const yellow: MantineColorsTuple = [
	'#fffde1',
	'#fff9cb',
	'#fff29a',
	'#ffea64',
	'#ffe438',
	'#ffe01d',
	'#ffdd00',
	'#e3c500',
	'#caaf00',
	'#ae9600',
];

export const theme = createTheme({
	white: 'var(--white)',
	black: 'var(--black)',
	primaryColor: 'yellow',
	fontFamily: 'var(--body-font)',
	headings: {
		fontFamily: 'var(--headline-font)',
	},
	defaultRadius: 2,
	components: {
		Button: Button.extend({
			defaultProps: {
				color: 'yellow',
				variant: 'outline',
				radius: 'xl',
			},
			styles: {
				root: {
					color: 'black',
				},
			},
		}),
	},
	colors: {
		yellow,
	},
});
