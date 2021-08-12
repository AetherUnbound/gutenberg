/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalColorGradientControl as ColorGradientControl } from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

/**
 * Internal dependencies
 */

import { useSetting } from '../editor/utils';
import ColorPalettePanel from './color-palette-panel';

export function useHasColorPanel( { supports } ) {
	return (
		supports.includes( 'color' ) ||
		supports.includes( 'backgroundColor' ) ||
		supports.includes( 'background' ) ||
		supports.includes( 'linkColor' )
	);
}

export default function ColorPanel( {
	context: { supports, name },
	getStyle,
	setStyle,
	getSetting,
	setSetting,
} ) {
	const colors = useSetting( 'color.palette', name );
	const disableCustomColors = ! useSetting( 'color.custom', name );
	const gradients = useSetting( 'color.gradients', name );
	const disableCustomGradients = ! useSetting( 'color.customGradient', name );

	const settings = [];

	if ( supports.includes( 'color' ) ) {
		const color = getStyle( name, 'color' );
		const userColor = getStyle( name, 'color', 'user' );

		settings.push( {
			colorValue: color,
			onColorChange: ( value ) => setStyle( name, 'color', value ),
			label: __( 'Text color' ),
			clearable: color === userColor,
			isShownByDefault: true,
			hasValue: () => !! userColor,
			onDeselect: () => setStyle( name, 'color', undefined ),
		} );
	}

	let backgroundSettings = {};
	if ( supports.includes( 'backgroundColor' ) ) {
		const backgroundColor = getStyle( name, 'backgroundColor' );
		const userBackgroundColor = getStyle( name, 'backgroundColor', 'user' );
		backgroundSettings = {
			colorValue: backgroundColor,
			onColorChange: ( value ) =>
				setStyle( name, 'backgroundColor', value ),
			isShownByDefault: true,
			hasValue: () => !! userBackgroundColor,
			onDeselect: () => setStyle( name, 'backgroundColor', undefined ),
		};
		if ( backgroundColor ) {
			backgroundSettings.clearable =
				backgroundColor === userBackgroundColor;
		}
	}

	let gradientSettings = {};
	if ( supports.includes( 'background' ) ) {
		const gradient = getStyle( name, 'background' );
		const userGradient = getStyle( name, 'background', 'user' );
		gradientSettings = {
			gradientValue: gradient,
			onGradientChange: ( value ) =>
				setStyle( name, 'background', value ),
			isShownByDefault: true,
			hasValue: () => !! userGradient,
			onDeselect: () => setStyle( name, 'background', undefined ),
		};
		if ( gradient ) {
			gradientSettings.clearable = gradient === userGradient;
		}
	}

	if (
		supports.includes( 'background' ) ||
		supports.includes( 'backgroundColor' )
	) {
		settings.push( {
			...backgroundSettings,
			...gradientSettings,
			label: __( 'Background color' ),
		} );
	}

	if ( supports.includes( 'linkColor' ) ) {
		const color = getStyle( name, 'linkColor' );
		const userColor = getStyle( name, 'linkColor', 'user' );
		settings.push( {
			colorValue: color,
			onColorChange: ( value ) => setStyle( name, 'linkColor', value ),
			label: __( 'Link color' ),
			clearable: color === userColor,
			isShownByDefault: true,
			hasValue: () => !! userColor,
			onDeselect: () => setStyle( name, 'linkColor', undefined ),
		} );
	}

	const resetAll = () => {
		setStyle( name, 'color', undefined );
		setStyle( name, 'backgroundColor', undefined );
		setStyle( name, 'background', undefined );
		setStyle( name, 'linkColor', undefined );
	};

	return (
		<ToolsPanel
			label={ __( 'Color options' ) }
			header={ __( 'Color' ) }
			resetAll={ resetAll }
		>
			{ settings.map( ( setting, index ) => (
				<ToolsPanelItem
					key={ index }
					hasValue={ setting.hasValue }
					label={ setting.label }
					onDeselect={ setting.onDeselect }
					isShownByDefault={ setting.isShownByDefault }
				>
					<ColorGradientControl
						{ ...{
							colors,
							gradients,
							disableCustomColors,
							disableCustomGradients,
							clearable: false,
							label: setting.label,
							onColorChange: setting.onColorChange,
							colorValue: setting.colorValue,
						} }
					/>
				</ToolsPanelItem>
			) ) }
			<ColorPalettePanel
				key={ 'color-palette-panel-' + name }
				contextName={ name }
				getSetting={ getSetting }
				setSetting={ setSetting }
			/>
		</ToolsPanel>
	);
}
