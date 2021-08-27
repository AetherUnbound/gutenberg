/**
 * Internal dependencies
 */

import { normaliseFormats } from './normalise-formats';
import { create } from './create';

/** @typedef {import('./create').RichTextValue} RichTextValue */

/**
 * Concats a pair of rich text values. Not that this mutates `a` and does NOT
 * normalise formats!
 *
 * @param {Object} a Value to mutate.
 * @param {Object} b Value to add read from.
 *
 * @return {Object} `a`, mutated.
 */
export function mergePair( a, b ) {
	a.formats = a.formats.concat( b.formats );
	for ( const [ format, selection ] of b._formats ) {
		const existingSelection = a._formats.get( format );
		a._formats.set( format, [
			existingSelection
				? existingSelection[ 0 ]
				: selection[ 0 ] + a.text.length,
			selection[ 1 ] + a.text.length,
		] );
	}
	a.replacements = a.replacements.concat( b.replacements );
	a.text += b.text;

	return a;
}

/**
 * Combine all Rich Text values into one. This is similar to
 * `String.prototype.concat`.
 *
 * @param {...RichTextValue} values Objects to combine.
 *
 * @return {RichTextValue} A new value combining all given records.
 */
export function concat( ...values ) {
	return normaliseFormats( values.reduce( mergePair, create() ) );
}
