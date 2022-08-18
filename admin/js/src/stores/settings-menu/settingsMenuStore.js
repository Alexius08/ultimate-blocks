import { configureStore } from "@reduxjs/toolkit";
import { FILTER_TYPES } from "$Components/BlockStatusFilterControl";
import assetsSlice from "$Stores/settings-menu/slices/assets";
import appSlice from "$Stores/settings-menu/slices/app";
import blocksSlice from "$Stores/settings-menu/slices/blocks";

/**
 * Create settings menu store.
 *
 * @return {Object} store
 */
function createStore() {
	const appData = { ...ubAdminMenuData };
	ubAdminMenuData = null;

	// add block infos to context data
	const registeredBlocks = wp.data.select( 'core/blocks' ).getBlockTypes();
	const registeredUbBlocks = registeredBlocks.filter( blockData => {
		return blockData.deprecated === undefined && blockData.parent === undefined;
	} );

	const { statusData } = appData.blocks;
	const allowedKeys = [ 'icon', 'name', 'title' ];
	const reducedBlocks = registeredUbBlocks.reduce( ( carry, current ) => {
		const newBlockObject = {};

		allowedKeys.map( ( key ) => {
			newBlockObject[ key ] = current[ key ];
		} );

		newBlockObject.icon = newBlockObject.icon.src;

		let blockStatus = false;
		statusData.map( ( { name, active } ) => {
			if ( name === newBlockObject.name ) {
				blockStatus = active;
			}
		} );
		newBlockObject.active = blockStatus;

		carry.push( newBlockObject );

		return carry;
	}, [] );

	const preloadedState = {
		assets: appData.assets,
		app: {
			blockFilter: FILTER_TYPES._DEFAULT,
		},
		blocks: {
			registered: reducedBlocks,
		},
	};

	return configureStore( {
		reducer: {
			assets: assetsSlice,
			app: appSlice,
			blocks: blocksSlice,
		},
		middleware: ( getDefaultMiddleware ) => getDefaultMiddleware( {
			serializableCheck: false,
		} ),
		preloadedState,
	} );
}

/**
 * @module createStore
 */
export default createStore;
