Array.from(
	document.getElementsByClassName('wp-block-ub-content-toggle')
).forEach(toggleContainer => {
	let parentIsHidden = false;
	let parentClassIsHidden = false;

	let targetElement = toggleContainer;

	while (
		!(parentIsHidden || parentClassIsHidden) &&
		!targetElement.parentElement.classList.contains('entry-content')
	) {
		targetElement = targetElement.parentElement;
		if (targetElement.style.display === 'none') {
			parentIsHidden = true;
		}

		if (getComputedStyle(targetElement).display === 'none') {
			parentClassIsHidden = true;
		}
	}

	if (parentClassIsHidden || parentIsHidden) {
		toggleContainer.parentElement.style.setProperty(
			'display',
			'block', //make the parent block display to give way for height measurements
			'important' //just in case blocks from other plugins use !important
		);
	}

	Array.from(
		toggleContainer.getElementsByClassName(
			'wp-block-ub-content-toggle-accordion-title-wrap'
		)
	).forEach(instance => {
		const indicator = instance.querySelector(
			'.wp-block-ub-content-toggle-accordion-state-indicator'
		);

		const panelContent = instance.nextSibling;

		let panelHeight = 0;

		const initialHide =
			panelContent.style.height === '0px' ||
			panelContent.style.display === 'none';
		if (initialHide) {
			//temporarily show panel contents to enable taking panel height measurements
			panelContent.style.height = '';
			panelContent.style.paddingTop = '';
			panelContent.style.paddingBottom = '';
			panelContent.style.display = '';
		}
		panelHeight = panelContent.offsetHeight;

		if (initialHide) {
			panelContent.style.height = '0px';
			panelContent.style.paddingTop = '0';
			panelContent.style.paddingBottom = '0';
			panelContent.style.marginTop = '0';
			panelContent.style.marginBottom = '0';
		}

		instance.addEventListener('click', function(e) {
			e.stopImmediatePropagation();
			if (
				indicator.classList.contains('open') &&
				panelHeight !== panelContent.offsetHeight
			) {
				panelHeight = panelContent.offsetHeight;
			}

			if (panelContent.style.height === '') {
				panelContent.style.height = `${panelHeight}px`;
			}
			panelContent.style.transition = 'all 0.5s ease-in-out';
			indicator.classList.toggle('open');
		});

		indicator.addEventListener('transitionstart', function() {
			if (
				!indicator.classList.contains('open') &&
				panelHeight !== panelContent.offsetHeight
			) {
				panelHeight = panelContent.offsetHeight;
			}

			const newVal = indicator.classList.contains('open') ? '' : '0';
			panelContent.style.paddingTop = newVal;
			panelContent.style.paddingBottom = newVal;
			panelContent.style.marginTop = newVal;
			panelContent.style.marginBottom = newVal;
			panelContent.style.height = `${
				indicator.classList.contains('open') ? panelHeight : 0
			}px`;
		});

		panelContent.addEventListener('transitionend', function() {
			panelContent.style.transition = '';
			if (panelContent.style.height !== '0px') {
				panelContent.style.height = '';
			}
		});
	});

	//hide the parent element again;
	if (parentIsHidden) {
		toggleContainer.parentElement.style.display = 'none';
	}

	if (parentClassIsHidden) {
		toggleContainer.parentElement.style.display = '';
	}
});
