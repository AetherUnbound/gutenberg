/**
 * Internal dependencies
 */
import { ZWNBSP } from '../../special-characters';

export function getSparseArrayLength( array ) {
	return array.reduce( ( accumulator ) => accumulator + 1, 0 );
}

const em = { type: 'em' };
const strong = { type: 'strong' };
const img = { type: 'img', attributes: { src: '' } };
const a = { type: 'a', attributes: { href: '#' } };
const ul = { type: 'ul' };
const ol = { type: 'ol' };

export const spec = [
	{
		description: 'should create an empty value',
		html: '',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 0,
			endContainer: element,
		} ),
		startPath: [ 0, 0 ],
		endPath: [ 0, 0 ],
		record: {
			start: 0,
			end: 0,
			formats: [],
			_formats: new Map(),
			replacements: [],
			text: '',
		},
	},
	{
		description: 'should replace characters to format HTML with space',
		html: '\n\n\r\n\t',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 1,
			endContainer: element,
		} ),
		startPath: [ 0, 0 ],
		endPath: [ 0, 1 ],
		record: {
			start: 0,
			end: 1,
			formats: [ , ],
			_formats: new Map(),
			replacements: [ , ],
			text: ' ',
		},
	},
	{
		description: 'should preserve non breaking space',
		html: 'test\u00a0 test',
		createRange: ( element ) => ( {
			startOffset: 5,
			startContainer: element.firstChild,
			endOffset: 5,
			endContainer: element.firstChild,
		} ),
		startPath: [ 0, 5 ],
		endPath: [ 0, 5 ],
		record: {
			start: 5,
			end: 5,
			formats: [ , , , , , , , , , , ],
			_formats: new Map(),
			replacements: [ , , , , , , , , , , ],
			text: 'test\u00a0 test',
		},
	},
	{
		description: 'should create an empty value from empty tags',
		html: '<em></em>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 1,
			endContainer: element,
		} ),
		startPath: [ 0, 0 ],
		endPath: [ 0, 0 ],
		record: {
			start: 0,
			end: 0,
			formats: [],
			_formats: new Map(),
			replacements: [],
			text: '',
		},
	},
	{
		description: 'should create a value without formatting',
		html: 'test',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element.firstChild,
			endOffset: 4,
			endContainer: element.firstChild,
		} ),
		startPath: [ 0, 0 ],
		endPath: [ 0, 4 ],
		record: {
			start: 0,
			end: 4,
			formats: [ , , , , ],
			_formats: new Map(),
			replacements: [ , , , , ],
			text: 'test',
		},
	},
	{
		description: 'should preserve emoji',
		html: '🍒',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 1,
			endContainer: element,
		} ),
		startPath: [ 0, 0 ],
		endPath: [ 0, 2 ],
		record: {
			start: 0,
			end: 2,
			formats: [ , , ],
			_formats: new Map(),
			replacements: [ , , ],
			text: '🍒',
		},
	},
	{
		description: 'should preserve emoji in formatting',
		html: '<em>🍒</em>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 1,
			endContainer: element,
		} ),
		startPath: [ 0, 0, 0 ],
		endPath: [ 0, 0, 2 ],
		record: {
			start: 0,
			end: 2,
			formats: [ [ em ], [ em ] ],
			_formats: new Map().set( em, [ 0, 2 ] ),
			replacements: [ , , ],
			text: '🍒',
		},
	},
	{
		description: 'should create a value with formatting',
		html: '<em>test</em>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element.firstChild,
			endOffset: 1,
			endContainer: element.firstChild,
		} ),
		startPath: [ 0, 0, 0 ],
		endPath: [ 0, 0, 4 ],
		record: {
			start: 0,
			end: 4,
			formats: [ [ em ], [ em ], [ em ], [ em ] ],
			_formats: new Map().set( em, [ 0, 4 ] ),
			replacements: [ , , , , ],
			text: 'test',
		},
	},
	{
		description: 'should create a value with nested formatting',
		html: '<em><strong>test</strong></em>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 1,
			endContainer: element,
		} ),
		startPath: [ 0, 0, 0, 0 ],
		endPath: [ 0, 0, 0, 4 ],
		record: {
			start: 0,
			end: 4,
			formats: [
				[ em, strong ],
				[ em, strong ],
				[ em, strong ],
				[ em, strong ],
			],
			_formats: new Map().set( em, [ 0, 4 ] ).set( strong, [ 0, 4 ] ),
			replacements: [ , , , , ],
			text: 'test',
		},
	},
	{
		description: 'should create a value with formatting for split tags',
		html: '<em>te</em><em>st</em>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element.querySelector( 'em' ),
			endOffset: 1,
			endContainer: element.querySelector( 'em' ),
		} ),
		startPath: [ 0, 0, 0 ],
		endPath: [ 0, 0, 2 ],
		record: {
			start: 0,
			end: 2,
			formats: [ [ em ], [ em ], [ em ], [ em ] ],
			_formats: new Map().set( em, [ 0, 4 ] ),
			replacements: [ , , , , ],
			text: 'test',
		},
	},
	{
		description: 'should create a value with formatting with attributes',
		html: '<a href="#">test</a>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 1,
			endContainer: element,
		} ),
		startPath: [ 0, 0, 0 ],
		endPath: [ 0, 0, 4 ],
		record: {
			start: 0,
			end: 4,
			formats: [ [ a ], [ a ], [ a ], [ a ] ],
			_formats: new Map().set( a, [ 0, 4 ] ),
			replacements: [ , , , , ],
			text: 'test',
		},
	},
	{
		description: 'should create a value with image object',
		html: '<img src="">',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 1,
			endContainer: element,
		} ),
		startPath: [ 0 ],
		endPath: [ 0 ],
		record: {
			start: 0,
			end: 0,
			formats: [ , ],
			_formats: new Map(),
			replacements: [ img ],
			text: '\ufffc',
		},
	},
	{
		description: 'should create a value with image object and formatting',
		html: '<em><img src=""></em>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element.querySelector( 'img' ),
			endOffset: 1,
			endContainer: element.querySelector( 'img' ),
		} ),
		startPath: [ 0, 0 ],
		endPath: [ 0, 0 ],
		record: {
			start: 0,
			end: 1,
			formats: [ [ em ] ],
			_formats: new Map().set( em, [ 0, 1 ] ),
			replacements: [ img ],
			text: '\ufffc',
		},
	},
	{
		description: 'should create a value with image object and text before',
		html: 'te<em>st<img src=""></em>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 2,
			endContainer: element,
		} ),
		startPath: [ 0, 0 ],
		endPath: [ 1, 1 ],
		record: {
			start: 0,
			end: 5,
			formats: [ , , [ em ], [ em ], [ em ] ],
			_formats: new Map().set( em, [ 2, 5 ] ),
			replacements: [ , , , , img ],
			text: 'test\ufffc',
		},
	},
	{
		description: 'should create a value with image object and text after',
		html: '<em><img src="">te</em>st',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 2,
			endContainer: element,
		} ),
		startPath: [ 0, 0 ],
		endPath: [ 1, 2 ],
		record: {
			start: 0,
			end: 5,
			formats: [ [ em ], [ em ], [ em ], , , ],
			_formats: new Map().set( em, [ 0, 3 ] ),
			replacements: [ img, , , , , ],
			text: '\ufffctest',
		},
	},
	{
		description: 'should handle br',
		html: '<br>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 1,
			endContainer: element,
		} ),
		startPath: [ 0 ],
		endPath: [ 0 ],
		record: {
			start: 0,
			end: 0,
			formats: [ , ],
			_formats: new Map(),
			replacements: [ , ],
			text: '\n',
		},
	},
	{
		description: 'should handle br with text',
		html: 'te<br>st',
		createRange: ( element ) => ( {
			startOffset: 1,
			startContainer: element,
			endOffset: 2,
			endContainer: element,
		} ),
		startPath: [ 1 ],
		endPath: [ 2, 0 ],
		record: {
			start: 2,
			end: 3,
			formats: [ , , , , , ],
			_formats: new Map(),
			replacements: [ , , , , , ],
			text: 'te\nst',
		},
	},
	{
		description: 'should handle br with formatting',
		html: '<em><br></em>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 1,
			endContainer: element,
		} ),
		startPath: [ 0, 0 ],
		endPath: [ 0, 0 ],
		record: {
			start: 0,
			end: 1,
			formats: [ [ em ] ],
			_formats: new Map().set( em, [ 0, 1 ] ),
			replacements: [ , ],
			text: '\n',
		},
	},
	{
		description: 'should handle double br',
		html: 'a<br><br>b',
		createRange: ( element ) => ( {
			startOffset: 2,
			startContainer: element,
			endOffset: 3,
			endContainer: element,
		} ),
		startPath: [ 2 ],
		endPath: [ 3, 0 ],
		record: {
			formats: [ , , , , ],
			_formats: new Map(),
			replacements: [ , , , , ],
			text: 'a\n\nb',
			start: 2,
			end: 3,
		},
	},
	{
		description: 'should handle selection before br',
		html: 'a<br><br>b',
		createRange: ( element ) => ( {
			startOffset: 2,
			startContainer: element,
			endOffset: 2,
			endContainer: element,
		} ),
		startPath: [ 2 ],
		endPath: [ 2 ],
		record: {
			formats: [ , , , , ],
			_formats: new Map(),
			replacements: [ , , , , ],
			text: 'a\n\nb',
			start: 2,
			end: 2,
		},
	},
	{
		description: 'should handle empty multiline value',
		multilineTag: 'p',
		html: '<p></p>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element.firstChild,
			endOffset: 0,
			endContainer: element.firstChild,
		} ),
		startPath: [ 0, 0, 0 ],
		endPath: [ 0, 0, 0 ],
		record: {
			start: 0,
			end: 0,
			formats: [],
			_formats: new Map(),
			replacements: [],
			text: '',
		},
	},
	{
		description: 'should handle multiline value',
		multilineTag: 'p',
		html: '<p>one</p><p>two</p>',
		createRange: ( element ) => ( {
			startOffset: 1,
			startContainer: element.querySelector( 'p' ).firstChild,
			endOffset: 0,
			endContainer: element.lastChild,
		} ),
		startPath: [ 0, 0, 1 ],
		endPath: [ 1, 0, 0 ],
		record: {
			start: 1,
			end: 4,
			formats: [ , , , , , , , ],
			_formats: new Map(),
			replacements: [ , , , , , , , ],
			text: 'one\u2028two',
		},
	},
	{
		description: 'should handle multiline list value',
		multilineTag: 'li',
		multilineWrapperTags: [ 'ul', 'ol' ],
		html:
			'<li>one<ul><li>a</li><li>b<ol><li>1</li><li>2</li></ol></li></ul></li><li>three</li>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 1,
			endContainer: element.querySelector( 'ol > li' ).firstChild,
		} ),
		startPath: [ 0, 0, 0 ],
		endPath: [ 0, 2, 1, 2, 0, 1, 0 ],
		record: {
			start: 0,
			end: 9,
			formats: [ , , , , , , , , , , , , , , , , , ],
			_formats: new Map(),
			replacements: [
				,
				,
				,
				[ ul ],
				,
				[ ul ],
				,
				[ ul, ol ],
				,
				[ ul, ol ],
				,
				,
				,
				,
				,
				,
				,
			],
			text: 'one\u2028a\u2028b\u20281\u20282\u2028three',
		},
	},
	{
		description: 'should handle empty list value',
		multilineTag: 'li',
		multilineWrapperTags: [ 'ul', 'ol' ],
		html: '<li></li>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element.firstChild,
			endOffset: 0,
			endContainer: element.firstChild,
		} ),
		startPath: [ 0, 0, 0 ],
		endPath: [ 0, 0, 0 ],
		record: {
			start: 0,
			end: 0,
			formats: [],
			_formats: new Map(),
			replacements: [],
			text: '',
		},
	},
	{
		description: 'should handle nested empty list value',
		multilineTag: 'li',
		multilineWrapperTags: [ 'ul', 'ol' ],
		html: '<li><ul><li></li></ul></li>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element.querySelector( 'ul > li' ),
			endOffset: 0,
			endContainer: element.querySelector( 'ul > li' ),
		} ),
		startPath: [ 0, 1, 0, 0, 0 ],
		endPath: [ 0, 1, 0, 0, 0 ],
		record: {
			start: 1,
			end: 1,
			formats: [ , ],
			_formats: new Map(),
			replacements: [ [ ul ] ],
			text: '\u2028',
		},
	},
	{
		description: 'should handle middle empty list value',
		multilineTag: 'li',
		multilineWrapperTags: [ 'ul', 'ol' ],
		html: '<li></li><li></li><li></li>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element.firstChild.nextSibling,
			endOffset: 0,
			endContainer: element.firstChild.nextSibling,
		} ),
		startPath: [ 1, 0, 0 ],
		endPath: [ 1, 0, 0 ],
		record: {
			start: 1,
			end: 1,
			formats: [ , , ],
			_formats: new Map(),
			replacements: [ , , ],
			text: '\u2028\u2028',
		},
	},
	{
		description: 'should handle multiline value with empty',
		multilineTag: 'p',
		html: '<p>one</p><p></p>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element.lastChild,
			endOffset: 0,
			endContainer: element.lastChild,
		} ),
		startPath: [ 1, 0, 0 ],
		endPath: [ 1, 0, 0 ],
		record: {
			start: 4,
			end: 4,
			formats: [ , , , , ],
			_formats: new Map(),
			replacements: [ , , , , ],
			text: 'one\u2028',
		},
	},
	{
		description: 'should handle multiline value with element selection',
		multilineTag: 'li',
		multilineWrapperTags: [ 'ul', 'ol' ],
		html: '<li>one</li>',
		createRange: ( element ) => ( {
			startOffset: 1,
			startContainer: element.firstChild,
			endOffset: 1,
			endContainer: element.firstChild,
		} ),
		startPath: [ 0, 1, 0 ],
		endPath: [ 0, 1, 0 ],
		record: {
			start: 3,
			end: 3,
			formats: [ , , , ],
			_formats: new Map(),
			replacements: [ , , , ],
			text: 'one',
		},
	},
	{
		description: 'should ignore formats at line separator',
		multilineTag: 'p',
		startPath: [],
		endPath: [],
		record: {
			formats: [ [ em ], [ em ], [ em ], [ em ], [ em ], [ em ], [ em ] ],
			_formats: new Map().set( em, [ 0, 7 ] ),
			replacements: [ , , , , , , , ],
			text: 'one\u2028two',
		},
	},
	{
		description: 'should remove padding',
		html: ZWNBSP,
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 1,
			endContainer: element,
		} ),
		startPath: [ 0, 0 ],
		endPath: [ 0, 0 ],
		record: {
			start: 0,
			end: 0,
			formats: [],
			_formats: new Map(),
			replacements: [],
			text: '',
		},
	},
	{
		description: 'should filter format boundary attributes',
		html: '<strong data-rich-text-format-boundary="true">test</strong>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 1,
			endContainer: element,
		} ),
		startPath: [ 0, 0, 0 ],
		endPath: [ 0, 0, 4 ],
		record: {
			start: 0,
			end: 4,
			formats: [ [ strong ], [ strong ], [ strong ], [ strong ] ],
			_formats: new Map().set( strong, [ 0, 4 ] ),
			replacements: [ , , , , ],
			text: 'test',
		},
	},
	{
		description: 'should not error with overlapping formats (1)',
		html: '<a href="#"><em>1</em><strong>2</strong></a>',
		createRange: ( element ) => ( {
			startOffset: 1,
			startContainer: element.firstChild,
			endOffset: 1,
			endContainer: element.firstChild,
		} ),
		startPath: [ 0, 1, 0, 0 ],
		endPath: [ 0, 1, 0, 0 ],
		record: {
			start: 1,
			end: 1,
			formats: [
				[ a, em ],
				[ a, strong ],
			],
			_formats: new Map()
				.set( a, [ 0, 2 ] )
				.set( em, [ 0, 1 ] )
				.set( strong, [ 1, 2 ] ),
			replacements: [ , , ],
			text: '12',
		},
	},
	{
		description: 'should not error with overlapping formats (2)',
		html: '<em><a href="#">1</a></em><strong><a href="#">2</a></strong>',
		createRange: ( element ) => ( {
			startOffset: 1,
			startContainer: element.firstChild,
			endOffset: 1,
			endContainer: element.firstChild,
		} ),
		startPath: [ 1, 0, 0, 0 ],
		endPath: [ 1, 0, 0, 0 ],
		record: {
			start: 1,
			end: 1,
			formats: [
				[ em, a ],
				[ strong, a ],
			],
			_formats: new Map()
				.set( em, [ 0, 1 ] )
				.set( a, [ 0, 1 ] )
				.set( strong, [ 1, 2 ] )
				.set( { ...a }, [ 1, 2 ] ),
			replacements: [ , , ],
			text: '12',
		},
	},
	{
		description: 'should disarm script',
		html: '<script>alert("1")</script>',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 0,
			endContainer: element,
		} ),
		startPath: [ 0 ],
		endPath: [ 0 ],
		record: {
			start: 0,
			end: 0,
			formats: [ , ],
			_formats: new Map(),
			replacements: [
				{
					attributes: { 'data-rich-text-script': 'alert(%221%22)' },
					type: 'script',
				},
			],
			text: '\ufffc',
		},
	},
	{
		description: 'should disarm on* attribute',
		html: '<img onerror="alert(\'1\')">',
		createRange: ( element ) => ( {
			startOffset: 0,
			startContainer: element,
			endOffset: 0,
			endContainer: element,
		} ),
		startPath: [ 0 ],
		endPath: [ 0 ],
		record: {
			start: 0,
			end: 0,
			formats: [ , ],
			_formats: new Map(),
			replacements: [
				{
					attributes: {
						'data-disable-rich-text-onerror': "alert('1')",
					},
					type: 'img',
				},
			],
			text: '\ufffc',
		},
	},
];

export const specWithRegistration = [
	{
		description: 'should create format by matching the class',
		formatName: 'my-plugin/link',
		formatType: {
			title: 'Custom Link',
			tagName: 'a',
			className: 'custom-format',
			edit() {},
		},
		html: '<a class="custom-format">a</a>',
		value: {
			formats: [
				[
					{
						type: 'my-plugin/link',
						attributes: {},
						unregisteredAttributes: {},
					},
				],
			],
			_formats: new Map().set(
				{
					type: 'my-plugin/link',
					attributes: {},
					unregisteredAttributes: {},
				},
				[ 0, 1 ]
			),
			replacements: [ , ],
			text: 'a',
		},
	},
	{
		description: 'should retain class names',
		formatName: 'my-plugin/link',
		formatType: {
			title: 'Custom Link',
			tagName: 'a',
			className: 'custom-format',
			edit() {},
		},
		html: '<a class="custom-format test">a</a>',
		value: {
			formats: [
				[
					{
						type: 'my-plugin/link',
						attributes: {},
						unregisteredAttributes: {
							class: 'test',
						},
					},
				],
			],
			_formats: new Map().set(
				{
					type: 'my-plugin/link',
					attributes: {},
					unregisteredAttributes: {
						class: 'test',
					},
				},
				[ 0, 1 ]
			),
			replacements: [ , ],
			text: 'a',
		},
	},
	{
		description: 'should create base format',
		formatName: 'core/link',
		formatType: {
			title: 'Link',
			tagName: 'a',
			className: null,
			edit() {},
		},
		html: '<a class="custom-format">a</a>',
		value: {
			formats: [
				[
					{
						type: 'core/link',
						attributes: {},
						unregisteredAttributes: {
							class: 'custom-format',
						},
					},
				],
			],
			_formats: new Map().set(
				{
					type: 'core/link',
					attributes: {},
					unregisteredAttributes: {
						class: 'custom-format',
					},
				},
				[ 0, 1 ]
			),
			replacements: [ , ],
			text: 'a',
		},
	},
	{
		description: 'should create fallback format',
		html: '<a class="custom-format">a</a>',
		value: {
			formats: [
				[
					{
						type: 'a',
						attributes: {
							class: 'custom-format',
						},
					},
				],
			],
			_formats: new Map().set(
				{
					type: 'a',
					attributes: {
						class: 'custom-format',
					},
				},
				[ 0, 1 ]
			),
			replacements: [ , ],
			text: 'a',
		},
	},
	{
		description: 'should not create format if editable tree only',
		formatName: 'my-plugin/link',
		formatType: {
			title: 'Custom Link',
			tagName: 'a',
			className: 'custom-format',
			edit() {},
			__experimentalCreatePrepareEditableTree() {},
		},
		html: '<a class="custom-format">a</a>',
		value: {
			formats: [ , ],
			_formats: new Map(),
			replacements: [ , ],
			text: 'a',
		},
		noToHTMLString: true,
	},
	{
		description:
			'should create format if editable tree only but changes need to be recorded',
		formatName: 'my-plugin/link',
		formatType: {
			title: 'Custom Link',
			tagName: 'a',
			className: 'custom-format',
			edit() {},
			__experimentalCreatePrepareEditableTree() {},
			__experimentalCreateOnChangeEditableValue() {},
		},
		html: '<a class="custom-format">a</a>',
		value: {
			formats: [
				[
					{
						type: 'my-plugin/link',
						attributes: {},
						unregisteredAttributes: {},
					},
				],
			],
			_formats: new Map().set(
				{
					type: 'my-plugin/link',
					attributes: {},
					unregisteredAttributes: {},
				},
				[ 0, 1 ]
			),
			replacements: [ , ],
			text: 'a',
		},
	},
];
