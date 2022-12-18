const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;
const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
import icon, { listItemIcon } from "./icon";
import EditorComponent, {
	OldEditorComponent,
	StyledListItem,
} from "./components";

/*registerBlockType("ub/styled-list", {
	title: __("Styled List"),
	icon: icon,
	category: "ultimateblocks",
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		list: {
			type: "text",
			default: [...Array(3).keys()]
				.map((i) => `<li>${__(`Item ${i + 1}`)}</li>`)
				.join(),
		},
		//retained for reverse compatibility
		listItem: {
			type: "array",
			default: Array(3).fill({
				text: "",
				selectedIcon: "check",
				indent: 0,
			}),
		},
		selectedIcon: {
			type: "string",
			default: "check",
		},
		alignment: {
			type: "string",
			default: "left",
		},
		iconColor: {
			type: "string",
			default: "#000000",
		},
		iconSize: {
			type: "number",
			default: 5,
		},
		fontSize: {
			type: "number",
			default: 0, //set to current style's font size when font size customization is enabled
		},
		itemSpacing: {
			type: "number",
			default: 0, //in pixels
		},
		columns: {
			type: "number",
			default: 1,
		},
		maxMobileColumns: {
			type: "number",
			default: 2,
		},
	},
	transforms: {
		from: [
			{
				type: "block",
				blocks: "core/list",
				transform: (attributes) =>
					createBlock("ub/styled-list", { list: attributes.values }),
			},
		],
	},
	keywords: [__("List"), __("Styled List"), __("Ultimate Blocks")],
	edit: withSelect((select, ownProps) => {
		const { getBlock, getClientIdsWithDescendants } =
			select("core/block-editor") || select("core/editor");

		return {
			block: getBlock(ownProps.clientId),
			getBlock,
			getClientIdsWithDescendants,
		};
	})(OldEditorComponent),

	save: () => null,
});*/

registerBlockType("ub/styled-list", {
	title: __("Styled List"),
	icon: icon,
	category: "ultimateblocks",
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		list: {
			type: "text",
			default: "",
		},
		selectedIcon: {
			type: "string",
			default: "check",
		},
		alignment: {
			type: "string",
			default: "left",
		},

		iconColor: {
			type: "string",
			default: "#000000",
		},
		iconSize: {
			type: "number",
			default: 5,
		},
		/*fontSize: {
			type: "number",
			default: 0, //set to current style's font size when font size customization is enabled
		},*/
		itemSpacing: {
			type: "number",
			default: 0, //in pixels
		},
		columns: {
			type: "number",
			default: 1,
		},
		maxMobileColumns: {
			type: "number",
			default: 2,
		},
	},
	keywords: [__("List"), __("Styled List"), __("Ultimate Blocks")],
	//insert transform method here
	edit: compose([
		withSelect((select, ownProps) => {
			const {
				getBlock,
				getBlockParentsByBlockName,
				getClientIdsOfDescendants,
				getClientIdsWithDescendants,
			} = select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getBlockParentsByBlockName,
				getClientIdsOfDescendants,
				getClientIdsWithDescendants,
			};
		}),
		withDispatch((dispatch) => {
			const { replaceInnerBlocks, updateBlockAttributes } =
				dispatch("core/block-editor") || dispatch("core/editor");

			return { replaceInnerBlocks, updateBlockAttributes };
		}),
	])(EditorComponent),
	save: () => null,
});

registerBlockType("ub/styled-list-item", {
	title: __("Styled List Item"),
	icon: listItemIcon,
	category: "ultimateblocks",
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		itemText: {
			type: "string",
			default: "",
		},
		selectedIcon: {
			type: "string",
			default: "check",
		},
		setCommonIcon: {
			type: "boolean",
			default: true, //should be copied to all items on the same level
		},
		iconColor: {
			type: "string",
			default: "#000000",
		},
		iconSize: {
			type: "number",
			default: 5,
		},
		fontSize: {
			type: "number",
			default: 0, //set to current style's font size when font size customization is enabled
		},
	},
	inserter: false,
	keywords: [__("List"), __("Styled List"), __("Ultimate Blocks")],
	edit: compose([
		withSelect((select, ownProps) => {
			const {
				getBlock,
				getBlockIndex,
				getBlockParents,
				getBlockParentsByBlockName,
				getClientIdsWithDescendants,
				getNextBlockClientId,
				getPreviousBlockClientId,
			} = select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getBlockIndex,
				currentBlockIndex: getBlockIndex(ownProps.clientId),
				getBlockParents,
				listRootClientId: getBlockParents(ownProps.clientId, true)[0],
				getBlockParentsByBlockName,
				getClientIdsWithDescendants,
				getNextBlockClientId,
				getPreviousBlockClientId,
			};
		}),
		withDispatch((dispatch) => {
			const {
				insertBlock,
				moveBlocksToPosition,
				removeBlock,
				replaceBlocks,
				updateBlockAttributes,
			} = dispatch("core/block-editor") || dispatch("core/editor");

			return {
				insertBlock,
				moveBlocksToPosition,
				removeBlock,
				replaceBlocks,
				updateBlockAttributes,
			};
		}),
	])(StyledListItem),
	save: () => null,
});
