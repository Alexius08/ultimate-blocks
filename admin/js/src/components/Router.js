import React, { useEffect, useState } from 'react';
import Route from '$Components/Route';

// use global hook methods to broadcast and listen events on document level
const { applyFilters } = wp.hooks;

/**
 * Router for different menu content.
 *
 * Router children components should be Route components. Else those will who are not will be ignored.
 *
 * @param {Object}               props          component properties
 * @param {Array<Route> | Route} props.children component route children
 */
function Router({ children }) {
	const [CurrentRouteContent, setCurrentRouteContent] = useState(null);

	// url search parameter for page property
	const [currentPageParameter, setCurrentPageParameter] = useState(null);

	// filtered route children only consists of Route components
	const [routeChildren, setRouteChildren] = useState([]);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const page = urlParams.get('page');
		setCurrentPageParameter(page);
	}, []);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		const filteredChildren = React.Children.toArray(children).filter(
			(child) => child.type === Route
		);

		setRouteChildren(filteredChildren);
	}, [children]);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		const matchedRouteContent = routeChildren.reduce(
			(carry, RouteInstance) => {
				if (
					RouteInstance?.props?.pageParameter === currentPageParameter
				) {
					carry = RouteInstance?.props?.children;
				}

				return carry;
			},
			null
		);

		// filter matched route content
		const finalMatchedRoute = applyFilters(
			'ubSettingsMenuRouteMatched',
			matchedRouteContent,
			currentPageParameter
		);

		setCurrentRouteContent(finalMatchedRoute);
	}, [currentPageParameter, routeChildren]);

	return CurrentRouteContent;
}

/**
 * @module Router
 */
export default Router;
