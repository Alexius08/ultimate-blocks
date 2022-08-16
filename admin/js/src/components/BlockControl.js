// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import ToggleControl from "$Components/ToggleControl";
import MenuButton from "$Components/MenuButton";

/**
 * Menu block control component.
 *
 * This control will be used for both enabling/disabling blocks and showing info about them.
 * @constructor
 *
 * @param {Object} props component properties
 * @param {String} props.title block title
 * @param {String} props.blockId registry id of block
 * @param {Boolean} props.status block status
 */
function BlockControl( { title, blockId, status } ) {
	const initialRender = useRef( true );
	const [ innerStatus, setInnerStatus ] = useState( status );

	const howToUse = () => {
	// TODO [ErdemBircan] remove for production
		console.log( `showing how-to for ${ blockId }` );
	};

	useEffect( () => {
		if ( initialRender.current ) {
			initialRender.current = false;
		} else {
		// TODO [ErdemBircan] remove for production
			console.log( `change ${ blockId } status to: ${ innerStatus }` );
		}
	}, [ innerStatus ] );

	return (
		<div className={ 'block-control' } data-enabled={ JSON.stringify( innerStatus ) }>
			<div className={ 'block-title' }>
				<div>
					{ title }
				</div>
				<div>
					<ToggleControl onStatusChange={ setInnerStatus } status={ status } />
				</div>
			</div>
			<div className={ 'block-info' }></div>
			<div className={ 'block-howto' }>
				<MenuButton title={ 'How to Use' } status={ innerStatus } onClickHandler={ howToUse } />
			</div>
		</div>
	);
}

/**
 * @module BlockControl
 */
export default BlockControl;
