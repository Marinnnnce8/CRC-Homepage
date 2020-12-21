/**
 * Main JS
 *
 * @copyright 2020 NB Communication Ltd
 *
 */

var main = {

	init: function() {

		var horizontalContainer = document.getElementsByClassName('testimonials-cards')[0];
		// var isTablet = window.matchMedia("(max-width: 1200px)").matches;
		// if(!isTablet) {
			
		// 	var scroll = new LocomotiveScroll({
		// 		el: document.querySelector('[data-scroll-container]'),
		// 		smooth: true
		// 	});

		// 	scroll.on('scroll', function() {
				
		// 	});
		// }

		// if(horizontalContainer) {
		// 	this.addMultiListener(window, 'load resize', main.horizontalScroll);
		// }

		main.toggleNavigation();

		nb.profilerStart('main.init');

		// Content
		var blocks = uk.$$('.content');
		if (blocks.length) {

			var alignments = ['left', 'right', 'center'];
			blocks.forEach(function(block) {

				// Apply UIkit table component
				uk.$$('table', block).forEach(function(el) {
					uk.addClass(el, 'uk-table');
					uk.wrapAll(el, '<div class="uk-overflow-auto">');
				});

				// Inline Images UIkit Lightbox/Scrollspy
				(uk.$$('a[href]', block).filter(function(a) {
					return uk.attr(a, 'href').match(/\.(jpg|jpeg|png|gif|webp)/i);
				})).forEach(function(a) {

					var figure = a.parentElement;
					var caption = uk.$('figcaption', figure);

					// uk-lightbox
					uk.attr(figure, 'data-uk-lightbox', 'animation: fade');
					if (caption) uk.attr(a, 'data-caption', nb.wrap(uk.html(caption), 'div'));

					// uk-scrollspy
					for (var i = 0, n = alignments.length, align; i < n; i++) {
						align = alignments[i];
						if (uk.hasClass(figure, 'align_' + align)) {
							UIkit.scrollspy(figure, {
								cls: ('uk-animation-slide-' + (align === 'center' ? 'bottom' : align) + '-small')
							});
						}
					}
				});
			});

			nb.loadComponents();
		}

		nb.profilerStop('main.init');
	},

	renderItems: function(items, config) {

		nb.profilerStart('main.renderItems');

		var metas = ['date_pub', 'dates', 'location'];
		var clsTag = 'uk-label uk-label-primary uk-margin-small-right';

		var out = '';
		for (var i = 0, n = items.length; i < n; i++) {

			var item = items[i];

			// Meta
			var meta = '';
			for (var j = 0, l = metas.length; j < l; j++) {
				var v = item[metas[j]];
				if (v) meta += nb.wrap(v, 'uk-text-meta');
			}

			// Tags
			var tags = '';
			if (config.showTemplate && item.template) {
				tags += nb.wrap(uk.ucfirst(item.template), clsTag);
			}
			if (Array.isArray(item.tags)) {
				item.tags.forEach(function(tag) {
					tags += nb.wrap(tag.title, clsTag);
				});
			}

			// Summary
			var summary = (item.getSummary ? nb.wrap(item.getSummary, 'p') : '');

			out += nb.wrap(
				nb.wrap(
					// Image
					(item.getImage ? nb.wrap(
						nb.link(
							item.url,
							nb.img(item.getImage, {
								alt: item.title,
								sizes: '(min-width: 640px) 50.00vw',
							})
						),
						'uk-card-media-top'
					) : '') +
					// Title / Meta / Tags
					nb.wrap(
						nb.wrap(
							nb.link(item.url, item.title, 'uk-link-reset'),
							'uk-card-title'
						) +
						meta +
						tags,
						'uk-card-header'
					) +
					// Summary
					(summary ? nb.wrap(
						summary,
						'uk-card-body'
					) : '') +
					// CTA
					(config.cta ? nb.wrap(
						nb.link(item.url, config.cta, 'uk-button uk-button-text'),
						'uk-card-footer'
					) : ''),
					'uk-card uk-card-default'
				),
				'div'
			);
		}

		out = nb.wrap(out, {
			class: [
				'uk-child-width-1-2@s',
				'uk-child-width-1-3@m',
				'uk-grid-match',
				'uk-flex-center',
			],
			dataUkGrid: true,
			dataUkScrollspy: {
				target: '> div',
				cls: 'uk-animation-slide-bottom-small',
				delay: NBkit.options.duration,
			}
		}, 'div');

		nb.profilerStop('main.renderItems');

		return out;
	},

	//combining multiple event listeners
	addMultiListener: function(element, eventNames, listener) {
		var events = eventNames.split(' ');
		for (var i=0, iLen=events.length; i<iLen; i++) {
			element.addEventListener(events[i], listener, false);
		}
	},

	//nav toggle
	toggleNavigation: function() {
		var navToggleButton = document.querySelector('.nb-navbar-toggle');
		navToggleButton.addEventListener('click', function() {
			var nav = document.getElementById('nav');
			var header = document.querySelector('.header');
			var navIcon = document.querySelector('.nav-icon');
			if(nav.getAttribute('aria-hidden') === 'false') {
				document.querySelector('html').classList.remove('has-nav-opened');
				nav.setAttribute('aria-hidden', 'true');
				header.classList.remove('nav-open');
				setTimeout(function(){
					nav.setAttribute('hidden', true);
					navIcon.setAttribute('hidden', true);
				}, 470);
			} else {
				document.querySelector('html').classList.add('has-nav-opened');
				header.classList.add('nav-open');
				nav.removeAttribute('hidden');
				nav.setAttribute('aria-hidden', 'false');
				navIcon.removeAttribute('hidden');
			}
		});
	},

	// horizontalScroll: function() {
	// 	var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
	// 	if(isIE11) {
	// 		return;
	// 	}
	// 	var isDesktop = window.matchMedia("(min-width: 1200px)").matches;
	// 	var spaceHolder = document.querySelector('.testimonials-holder');

	// 	if (isDesktop) {
	// 		var horizontal = document.querySelector('.testimonials-inner');
	// 		spaceHolder.style.height = calcDynamicHeight(horizontal) + 'px';

	// 		function calcDynamicHeight(ref) {
	// 			var vw = window.innerWidth;
	// 			var vh = window.innerHeight;
	// 			var objectWidth = ref.scrollWidth;
	// 			return objectWidth - vw + vh + 150;
	// 		}
			
	// 		var horizontalTitle = document.querySelector('.testimonials-title');
	// 		var sticky = document.querySelector('.testimonials-sticky');
	// 		horizontal.style.transform = 'translateX(-' + sticky.offsetTop + 'px)';
	// 		console.log(sticky.offsetTop);

	// 		var dynamicHeight = calcDynamicHeight(horizontal);
	// 		if(sticky.offsetTop > dynamicHeight / 1.25){
	// 			horizontalTitle.setAttribute("data-uk-sticky", "bottom: #sticky-stop");
	// 		} else {
	// 			horizontalTitle.setAttribute("data-uk-sticky", "");
	// 		}

	// 		window.addEventListener('resize', function () {
	// 			var isDesktop = window.matchMedia("(min-width: 1200px)").matches;
	// 			if (isDesktop) {
	// 				spaceHolder.style.height = calcDynamicHeight(horizontal) + 'px';
	// 			}
	// 		});
	// 	} else {
	// 		spaceHolder.style.height = 0;
	// 		spaceHolder.style.height = 100 + "%";
	// 	}
	// }
};

uk.ready(function() {
	main.init();
});
