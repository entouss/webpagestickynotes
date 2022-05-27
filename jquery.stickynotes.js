(function ($, chrome) {
	$.fn.wpsn = wpsn;

	wpsn.transparent = 'hsla(0, 0%, 50%, 0)';
	wpsn.commands = {};
	function wpsn(options) {
		wpsn.allNotes = {};
		wpsn.notes = [];
		wpsn.defaultSettings = {
			defaultIconSize: 20
		};
		wpsn.version = null;
		wpsn.versionPrevious = null;
		wpsn.versionUpdate = null;
		wpsn.options = null;
		wpsn.enableSelection = true;
		wpsn.hasSelection = false;
		wpsn.magnetEnabled = false;
		wpsn.currentlyEditedNoteIds = new Array();
		wpsn.keys = {
			'page': location.url,
			'domain': 'wpsn.DOMAIN.' + location.hostname,
			'global': 'wpsn.GLOBAL'
		};
		wpsn.mainmenu_left = ['maximize', 'minimize', 'fullscreen', 'lookandfeel', 'refresh', 'lock', 'mode', 'zoom', 'scope', 'target', 'order', 'position', 'rss', 'record', 'media', 'snapshot', 'checklist','code', 'diagram'];
		wpsn.mainmenu_right = ['synchronize', 'export', 'clone', 'add', 'more', 'remove', 'removePopup', 'tips', 'about', 'manager', 'settings', 'whatsnew'];
		wpsn.mainmenu_weight = ['maximize', 'more', 'remove', 'minimize', 'add', 'clone', 'lookandfeel', 'snapshot', 'zoom', 'lock', 'settings', 'manager', 'tips', 'about', 'whatsnew', 'fullscreen', 'export', 'synchronize', 'removePopup', 'refresh', 'scope', 'target', 'order', 'position', 'rss', 'record', 'media', 'checklist', 'code', 'diagram', 'mode'];
		wpsn.filters = {
			'blur': { max: 4, unit: 'px', value: 0, step: 0.25, division: 4 },
			'grayscale': { max: 100, unit: '%', value: 0, step: 1, division: 4 },
			'sepia': { max: 100, unit: '%', value: 0, step: 1, division: 4 },
			'saturate': { max: 200, unit: '%', value: 100, step: 1, division: 4 },
			'hue-rotate': { max: 360, unit: 'deg', value: 0, step: 1, division: 4 },
			'invert': { max: 100, unit: '%', value: 0, step: 1, division: 4 },
			'opacity': { max: 100, unit: '%', value: 100, step: 1, division: 4 },
			'brightness': { max: 200, unit: '%', value: 100, step: 1, division: 4 },
			'contrast': { max: 200, unit: '%', value: 100, step: 1, division: 4 },
			//'drop-shadow':{max:20,unit:'px'}
		};
		wpsn.transforms = {
			'scaleX': { max: 4, unit: '', value: 1, step: 0.25, division: 4 },
			'scaleY': { max: 4, unit: '', value: 1, step: 0.25, division: 4 },
			'scaleZ': { max: 4, unit: '', value: 1, step: 0.25, division: 4 },
			'rotateX': { max: 360, unit: 'deg', value: 0, step: 1, division: 4 },
			'rotateY': { max: 360, unit: 'deg', value: 0, step: 1, division: 4 },
			'rotateZ': { max: 360, unit: 'deg', value: 0, step: 1, division: 4 },
			'skewX': { max: 360, unit: 'deg', value: 0, step: 1, division: 4 },
			'skewY': { max: 360, unit: 'deg', value: 0, step: 1, division: 4 }
		};
		wpsn.tracers = {
			//Tracing
			//'ltres':{max:1,unit:'',value:1,step:0.01,division:10},
			//'qtres':{max:1,unit:'',value:1,step:0.01,division:10},
			//'pathomit':{max:8,unit:'',value:8,step:1,division:8},
			//'rightangleenhance':{max:1,unit:'',value:1,step:1,division:2},//T/F
			//Color
			//'colorsampling':{max:2,unit:'',value:2,step:1,division:2},//T/F/?
			'numberofcolors': { max: 64, unit: '', value: 32, step: 1, division: 32 },
			//'mincolorratio':{max:1,unit:'',value:0,step:0.1,division:10},
			//'colorquantcycles':{max:10,min:1,unit:'',value:3,step:1,division:4},
			//Rendering
			'strokewidth': { max: 10, unit: '', value: 1, step: 0.1, division: 100 },
			//'linefilter':{max:1,unit:'',value:0,step:1,division:2},//T/F
			//'scale':{max:1,min:0.1,unit:'',value:1,step:0.1,division:10},
			//'roundcoords':{max:10,unit:'',value:1,step:1,division:10},
			//'lcpr':{max:10,unit:'',value:0,step:1,division:10},//?
			//'qcpr':{max:10,unit:'',value:0,step:1,division:10},//?
			//'desc':{max:1,unit:'',value:0,step:1,division:2},//T/F
			//'viewbox':{max:1,unit:'',value:0,step:1,division:2},//T/F
			//Blur
			//'blurradius':{max:10,unit:'',value:0,step:1,division:10},
			//'blurdelta':{max:100,unit:'',value:20,step:1,division:10}//?
		};

		wpsn.defaultMode = wpsn.menu.mode.modes.markdown.id;
		wpsn.lockModes = {
			all: 1,
			editable: 2
		};
		wpsn.cropEnabledOption = true;
		wpsn.memeEnabledOption = true;
		wpsn.adEnabled = false;
		wpsn.domainNotes = [];
		wpsn.globalNotes = [];
		wpsn.fonts = {};
		wpsn.defaultZIndex = 2100000000;
		wpsn.defaultZIndexPopup = 2101000000;
		wpsn.defaultPadding = 14;
		wpsn.defaultFonts = ['Arial', 'Calibri', 'Cambria', 'Comic Sans MS', 'Consolas', 'Corsiva', 'Courier New', 'Georgia', 'Impact', 'Times New Roman', 'Trebuchet MS', 'Verdana'];
		wpsn.defaultFonts.sort();
		wpsn.defaultGoogleFonts = ['Roboto', 'Pangolin', 'Sansita', 'Open Sans', 'Slabo 27px', 'Lato', 'Barrio', 'Oswald', 'Roboto Condensed', 'Source Sans Pro', 'Montserrat', 'Bahiana', 'Raleway', 'PT Sans', 'Roboto Slab', 'Merriweather', 'Open Sans Condensed', 'Droid Sans', 'Sahitya', 'Lora', 'Ubuntu', 'Droid Serif', 'Playfair Display', 'Arimo', 'Titillium Web', 'Caveat Brush', 'Noto Sans', 'PT Sans Narrow', 'PT Serif', 'Muli', 'Indie Flower', 'Bitter', 'Nunito', 'Nunito Sans', 'Poppins', 'Dosis', 'Inconsolata', 'Arsenal', 'Hind', 'Rubik', 'Fjalla One', 'Oxygen', 'Cabin', 'Arvo', 'Noto Serif', 'Anton', 'Lobster', 'Catamaran', 'Yanone Kaffeesatz', 'Crimson Text', 'Fira Sans Extra Condensed', 'Libre Baskerville', 'Josefin Sans', 'Bree Serif', 'Abel', 'Abril Fatface', 'Quicksand', 'Gloria Hallelujah', 'Fira Sans', 'Exo 2', 'Roboto Mono', 'Merriweather Sans', 'Ubuntu Condensed', 'VT323', 'Varela Round', 'Asap', 'Karla', 'Amatic SC', 'Signika', 'Archivo Narrow', 'Questrial', 'Shadows Into Light', 'Play', 'Kanit', 'Cuprum', 'PT Sans Caption', 'Work Sans', 'Dancing Script', 'Vollkorn', 'Alegreya', 'Francois One', 'Pathway Gothic One', 'Rokkitt', 'Orbitron', 'Patua One', 'Exo', 'Maven Pro', 'Source Code Pro', 'Acme', 'Della Respira', 'Ropa Sans', 'Alegreya Sans', 'EB Garamond', 'Crete Round', 'Architects Daughter', 'Lobster Two', 'Josefin Slab', 'Comfortaa', 'Monda', 'Source Serif Pro', 'Russo One', 'Quattrocento Sans', 'News Cycle', 'Noticia Text', 'Mukta Vaani', 'Cinzel', 'ABeeZee', 'Righteous', 'Hammersmith One', 'Yantramanav', 'Satisfy', 'Yellowtail', 'Pontano Sans', 'Quattrocento', 'Sanchez', 'Gudea', 'Domine', 'Old Standard TT', 'Arapey', 'Courgette', 'Permanent Marker', 'Mada', 'Kaushan Script', 'Poiret One', 'Libre Franklin', 'Passion One', 'Armata', 'Istok Web', 'BenchNine', 'Economica', 'Archivo Black', 'Vidaloka', 'Tinos', 'Oleo Script', 'Playfair Display SC', 'Ruda', 'Cardo', 'Cookie', 'Teko', 'Overpass', 'Risque', 'Alfa Slab One', 'Handlee', 'Trirong', 'Taviraj', 'Chewy', 'Philosopher', 'Kalam', 'Coming Soon', 'Cabin Condensed', 'Days One', 'Cormorant Garamond', 'Great Vibes', 'Rajdhani', 'Audiowide', 'Antic Slab', 'Kreon', 'Tangerine', 'Ek Mukta', 'Droid Sans Mono', 'Playball', 'Didact Gothic', 'Shadows Into Light Two', 'Bevan', 'Changa One', 'Neuton', 'Sintony', 'Fredoka One', 'Bangers', 'Shrikhand', 'Cantarell', 'Glegoo', 'Rock Salt', 'Copse', 'Actor', 'Marck Script', 'Rambla', 'Bad Script', 'Overpass Mono', 'Damion', 'Volkhov', 'Coda', 'Sorts Mill Goudy', 'Proza Libre', 'Gentium Book Basic', 'Adamina', 'Cantata One', 'Gochi Hand', 'Signika Negative', 'Varela', 'Alice', 'Jura', 'Sigmar One', 'Patrick Hand', 'Eczar', 'Paytone One', 'BioRhyme', 'Luckiest Guy', 'Gentium Basic', 'Nothing You Could Do', 'Nobile', 'Antic', 'Sarala', 'Homemade Apple', 'Special Elite', 'Hind Vadodara', 'Squada One', 'Julius Sans One', 'Molengo', 'Alex Brush', 'Jaldi', 'Covered By Your Grace', 'Rancho', 'PT Mono', 'Unica One', 'Heebo', 'Cousine', 'Convergence', 'NTR', 'Ultra', 'Homenaje', 'Kameron', 'Electrolize', 'Enriqueta', 'Scada', 'Calligraffitti', 'Viga', 'Neucha', 'Hind Siliguri', 'Basic', 'Pinyon Script', 'Martel', 'Pragati Narrow', 'Overlock', 'Carme', 'Prata', 'Share', 'PT Serif Caption', 'Syncopate', 'Caveat', 'Iceland', 'Ubuntu Mono', 'Bubblegum Sans', 'Cabin Sketch', 'Just Another Hand', 'Ruslan Display', 'Reenie Beanie', 'Share Tech Mono', 'Fugaz One', 'Arima Madurai', 'Press Start 2P', 'Ceviche One', 'Black Ops One', 'Frank Ruhl Libre', 'Padauk', 'Cherry Cream Soda', 'Allura', 'Alef', 'Aldrich', 'Michroma', 'Freckle Face', 'Niconne', 'Alegreya Sans SC', 'Nixie One', 'Yrsa', 'Allerta Stencil', 'Cairo', 'Lustria', 'Advent Pro', 'Montserrat Alternates', 'Marvel', 'Oranienbaum', 'Fanwood Text', 'Limelight', 'Marmelad', 'Telex', 'Rochester', 'Fauna One', 'Spinnaker', 'Fontdiner Swanky', 'Marcellus', 'Chivo', 'Hanuman', 'Monoton', 'Khula', 'Allerta', 'Leckerli One', 'Average', 'Parisienne', 'Puritan', 'Slabo 13px', 'Grand Hotel', 'Average Sans', 'Annie Use Your Telescope', 'Carter One', 'Quantico', 'Sue Ellen Francisco', 'Goudy Bookletter 1911', 'Crafty Girls', 'Coustard', 'Allan', 'Modak', 'Carrois Gothic', 'Marcellus SC', 'Concert One', 'Fredericka the Great', 'Port Lligat Slab', 'Cinzel Decorative', 'Cutive', 'Yesteryear', 'Italianno', 'Rufina', 'Radley', 'Aclonica', 'Schoolbell', 'Alegreya SC', 'Merienda', 'Doppio One', 'Prompt', 'Magra', 'Anonymous Pro', 'Rosario', 'Waiting for the Sunrise', 'Six Caps', 'Pattaya', 'Graduate', 'Slackey', 'Metrophobic', 'Caudex', 'Trocchi', 'Gruppo', 'Inder', 'Lalezar', 'Montez', 'Andika', 'Averia Serif Libre', 'Assistant', 'Strait', 'Happy Monkey', 'Anaheim', 'Capriola', 'Oregano', 'Lilita One', 'Duru Sans', 'Mako', 'Wire One', 'Lekton', 'Rammetto One', 'Belleza', 'Alike', 'Odor Mean Chey', 'Martel Sans', 'Quando', 'Merienda One', 'Just Me Again Down Here', 'Tenor Sans', 'Zeyada', 'Karma', 'The Girl Next Door', 'Unkempt', 'IM Fell Double Pica', 'Corben', 'GFS Didot', 'Clicker Script', 'Delius', 'Kranky', 'Crushed', 'Bentham', 'Tillana', 'Rasa', 'Prosto One', 'Herr Von Muellerhoff', 'Knewave', 'Oxygen Mono', 'Vesper Libre', 'Space Mono', 'Kumar One Outline', 'Baloo Paaji', 'Bowlby One SC', 'Mr De Haviland', 'Brawler', 'Amiko', 'Farsan', 'Abhaya Libre', 'Baumans', 'Judson', 'Lemon', 'Ramabhadra', 'Biryani', 'Pompiere', 'IM Fell English', 'Chelsea Market', 'Bowlby One', 'Poly', 'Kavoon', 'Ewert', 'Fruktur', 'Reem Kufi', 'Alike Angular', 'Carrois Gothic SC', 'Nova Square', 'Kurale', 'Gafata', 'Loved by the King', 'Fira Mono', 'Imprima', 'Voces', 'Shojumaru', 'Oleo Script Swash Caps', 'Short Stack', 'Holtwood One SC', 'Changa', 'Bungee Inline', 'Londrina Outline', 'Gabriela', 'Megrim', 'Finger Paint', 'Chau Philomene One', 'Lily Script One', 'Orienta', 'Norican', 'Belgrano', 'Cherry Swash', 'Stalemate', 'Itim', 'Kristi', 'Over the Rainbow', 'Patrick Hand SC', 'Stardos Stencil', 'Headland One', 'Euphoria Script', 'Simonetta', 'Bilbo Swash Caps', 'Cutive Mono', 'Vast Shadow', 'Wendy One', 'Fenix', 'Raleway Dots', 'Cambo', 'IM Fell DW Pica', 'Palanquin', 'Mouse Memoirs', 'Seaweed Script', 'Averia Sans Libre', 'Prociono', 'Expletus Sans', 'Revalia', 'Scheherazade', 'Bungee Hairline', 'Timmana', 'Kotta One', 'Salsa', 'Balthazar', 'Amethysta', 'Engagement', 'Italiana', 'Delius Swash Caps', 'Cedarville Cursive', 'Podkova', 'Medula One', 'Ledger', 'Life Savers', 'Englebert', 'Sofia', 'Dawning of a New Day', 'Irish Grover', 'Inika', 'Kadwa', 'Sree Krushnadevaraya', 'Gurajada', 'Rye', 'Sunshiney', 'Mate SC', 'Sail', 'IM Fell French Canon', 'Cormorant SC', 'Cormorant Unicase', 'Rosarivo', 'Fjord One', 'Metamorphous', 'Mitr', 'Pridi', 'McLaren', 'IM Fell DW Pica SC', 'Share Tech', 'Mystery Quest', 'Habibi', 'Montserrat Subrayada', 'Cantora One', 'Artifika', 'Quintessential', 'Lemonada', 'Nokora', 'Vampiro One', 'Codystar', 'Buenard', 'David Libre', 'Hind Madurai', 'Atma', 'Cormorant Upright', 'Coiny', 'Baloo Da', 'Chathura', 'BioRhyme Expanded', 'Maiden Orange', 'Flamenco', 'Averia Libre', 'Amatica SC', 'Donegal One', 'Milonga', 'Dekko', 'Krona One', 'Coda Caption', 'Kumar One', 'Jomhuria', 'Katibeh', 'Bungee Outline', 'Vibur', 'Angkor', 'Wallpoet', 'Stoke', 'Junge', 'Condiment', 'Harmattan', 'Aref Ruqaa', 'IM Fell French Canon SC', 'Miniver', 'El Messiri', 'IM Fell Great Primer', 'Poller One', 'Rozha One', 'Stint Ultra Condensed', 'Paprika', 'League Script', 'Sumana', 'Piedra', 'Battambang', 'Ruluko', 'IM Fell Double Pica SC', 'Chonburi', 'Sriracha', 'Meera Inimai', 'Delius Unicase', 'Palanquin Dark', 'Cagliostro', 'Stint Ultra Expanded', 'Almendra', 'Secular One', 'Kavivanar', 'Sancreek', 'Linden Hill', 'Antic Didone', 'New Rocker', 'Nova Round', 'Galada', 'Trykker', 'Overlock SC', 'Offside', 'IM Fell Great Primer SC', 'Glass Antiqua', 'Nosifer', 'Henny Penny', 'Ruthie', 'Iceberg', 'Ribeye', 'Port Lligat Sans', 'GFS Neohellenic', 'Sarina', 'Pirata One', 'Monsieur La Doulaise', 'Lovers Quarrel', 'Wellfleet', 'Nova Slim', 'Amita', 'Jacques Francois', 'Jolly Lodger', 'Snippet', 'Oldenburg', 'Atomic Age', 'Joti One', 'Bubbler One', 'Redressed', 'UnifrakturCook', 'Germania One', 'Meie Script', 'MedievalSharp', 'Akronim', 'Peralta', 'Taprom', 'Laila', 'Bokor', 'Ramaraja', 'Koulen', 'Monofett', 'Croissant One', 'Faster One', 'Montaga', 'Chango', 'Nova Flat', 'Sura', 'Miltonian Tattoo', 'Moul', 'Griffy', 'Purple Purse', 'Original Surfer', 'Gorditas', 'Rum Raisin', 'Rhodium Libre', 'Nova Oval', 'Dr Sugiyama', 'Trochut', 'Keania One', 'Lancelot', 'Freehand', 'Caesar Dressing', 'Astloch', 'Content', 'Modern Antiqua', 'Ranchers', 'Smythe', 'Ribeye Marrow', 'Averia Gruesa Libre', 'Kdam Thmor', 'Jacques Francois Shadow', 'Elsie Swash Caps', 'Diplomata', 'Passero One', 'Fascinate', 'Underdog', 'Macondo Swash Caps', 'Felipa', 'Romanesco', 'Seymour One', 'Metal', 'Marko One', 'Miltonian', 'Nova Script', 'Devonshire', 'Londrina Shadow', 'Plaster', 'Ranga', 'Sofadi One', 'Nova Cut', 'Mrs Sheppards', 'Dangrek', 'Smokum', 'Sirin Stencil', 'Geostar', 'Butterfly Kids', 'Arbutus', 'Metal Mania', 'Uncial Antiqua', 'Combo', 'Aubrey', 'Chenla', 'Sevillana', 'Erica One', 'Stalinist One', 'Jim Nightshade', 'Diplomata SC', 'Bonbon', 'Almendra Display', 'Mr Bedfort', 'Eater', 'Chela One', 'Flavors', 'Ruge Boogie', 'Unlock', 'Emblema One', 'Butcherman', 'Tenali Ramakrishna', 'Suravaram', 'Fasthand', 'Gidugu', 'Moulpali', 'Kantumruy', 'Peddana', 'Dhurjati', 'Hanalei Fill', 'Hanalei'];
		wpsn.loadedFonts = [];
		wpsn.fittextcompressor = 1.2;
		wpsn.fittextoptions = { minFontSize: '12px', maxFontSize: '36px' };
		wpsn.defaultGoogleFonts.sort();
		wpsn.defaultFontSizes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
		wpsn.resizableOptions = {
			snap: '.wpsn-snappable', handles: 'all'/*,aspectRatio:hasMedia*/, 
			resize: function (event, ui) {
				let $el = ui.originalElement;
				//$el.find('.wpsn-frame').addClass('wpsn-resizing');
				let _note = wpsn.getNoteFromDiv($el);
				if (!wpsn.cropEnabled(_note)) {
					wpsn.cropMedia(_note, $el);
				} else {
					let $media = $el.find('.wpsn-media').eq(0);
					let top = $media.offset().top - $(window).scrollTop();
					let left = $media.offset().left - $(window).scrollLeft();
					$media.css({ 'width': $media.width(), 'height': $media.height() })
						.css({ 'position': 'fixed', 'top': top, 'left': left });
				}
				//wpsn.resizeMedia(_note);
				$el.find('.wpsn-watermark.wpsn-size').remove();
				$el.append($('<span/>').append($el.width() + ' x ' + $el.height()).addClass('wpsn-watermark').addClass('wpsn-size'));
				$el.find('.wpsn-auto-fit-text').fitText(wpsn.fittextcompressor, wpsn.fittextoptions);
				if (wpsn.magnetEnabled) {
					wpsn.resizeSnappedElements(_note, ui, false);
				}
			}, stop: function (event, ui) {
				let $el = ui.originalElement;
				$el.resizable('option', 'aspectRatio', false).data('uiResizable')._aspectRatio = false;
				$el.find('.wpsn-frame').addClass('wpsn-resizing');
				$el.find('.wpsn-watermark.wpsn-size').remove();
				let _note = wpsn.getNoteFromDiv($el);
				let notes = wpsn.getNotesFromDivs(wpsn.getSnappedAndSelectedDivs(_note));
				wpsn.saveNoteStateForUndo(notes);
				wpsn.resizeSelectedElements(_note, ui, true);
				if (wpsn.magnetEnabled) {
					wpsn.resizeSnappedElements(_note, ui, true);
				}
				wpsn.resizedNote(_note, ui);
				wpsn.settings.enableAutoresizeHeight?wpsn.autoResizeHeight(_note):false;
				$el.find('.wpsn-auto-fit-text').fitText(wpsn.fittextcompressor, wpsn.fittextoptions);
			}
		};
		wpsn.resizeSelectedElements = function(note, ui, save) {
			let selectedNotes = wpsn.getSelectedNotes();
			for (let tnote of selectedNotes) {
				if (tnote.id == note.id) { continue; }
				let tnoteDiv = wpsn.getNoteDiv(tnote);
				tnoteDiv.width(note.width);
				tnoteDiv.height(note.height);
				if (save) { wpsn.resizedNote(tnote); } 
			}
		}
		wpsn.resizeSnappedElements = function(note, ui, save) {
			let snapped = wpsn.getSnappedNotes(note);
			let oldLeft = ui.originalPosition.left;
			let oldTop = ui.originalPosition.top;
			let newLeft = ui.position.left;
			let newTop = ui.position.top;
			let oldWidth = ui.originalSize.width;
			let oldHeight = ui.originalSize.height;
			let newWidth = ui.size.width;
			let newHeight = ui.size.height;

			if (oldLeft != newLeft) {
				for (let tnote of snapped.left.left) {
					let $tnote = wpsn.getNoteDiv(tnote);
					$tnote.css('left', newLeft);
					$tnote.width(tnote.width - (newLeft - oldLeft));
					if (save) { wpsn.resizedNote(tnote); }
				}
				for (let tnote of snapped.left.right) {
					let $tnote = wpsn.getNoteDiv(tnote);
					$tnote.width(tnote.width + (newLeft - oldLeft));
					if (save) { wpsn.resizedNote(tnote); }
				}
			}
			if (oldTop != newTop) {
				for (let tnote of snapped.top.top) {
					let $tnote = wpsn.getNoteDiv(tnote);
					$tnote.css('top', newTop);
					$tnote.height(tnote.height - (newTop - oldTop));
					if (save) { wpsn.resizedNote(tnote); }
				}
				for (let tnote of snapped.top.bottom) {
					let $tnote = wpsn.getNoteDiv(tnote);
					$tnote.height(tnote.height + (newTop - oldTop));
					if (save) { wpsn.resizedNote(tnote); }
				}
			}
			if ((oldLeft + oldWidth) != (newLeft + newWidth)) {
				for (let tnote of snapped.right.left) {
					let $tnote = wpsn.getNoteDiv(tnote);
					$tnote.css('left', tnote.pos_x + ((newLeft + newWidth) - (oldLeft + oldWidth)));
					$tnote.width(tnote.width - ((newLeft + newWidth) - (oldLeft + oldWidth)));
					if (save) { wpsn.resizedNote(tnote); }
				}
				for (let tnote of snapped.right.right) {
					let $tnote = wpsn.getNoteDiv(tnote);
					$tnote.width(tnote.width + ((newLeft + newWidth) - (oldLeft + oldWidth)));
					if (save) { wpsn.resizedNote(tnote); }
				}
			}
			if ((oldTop + oldHeight) != (newTop + newHeight)) {
				for (let tnote of snapped.bottom.top) {
					let $tnote = wpsn.getNoteDiv(tnote);
					$tnote.css('top', tnote.pos_y + ((newTop + newHeight) - (oldTop + oldHeight)));
					$tnote.height(tnote.height - ((newTop + newHeight) - (oldTop + oldHeight)));
					if (save) { wpsn.resizedNote(tnote); }
				}
				for (let tnote of snapped.bottom.bottom) {
					let $tnote = wpsn.getNoteDiv(tnote);
					$tnote.height(tnote.height + ((newTop + newHeight) - (oldTop + oldHeight)));
					if (save) { wpsn.resizedNote(tnote); }
				}
			}
		};

		wpsn.rotatableOptions = {
			snap: '.wpsn-snappable', step: 5, wheelRotate: false,
			stop: function (event, ui) {
				let $el = ui.element;
				let _note = wpsn.getNoteFromDiv($el);
				wpsn.saveNoteStateForUndo(_note);
				wpsn.rotatedNote(_note, ui);
				let selectedNotes = wpsn.getSelectedNotes();
				for (let i = 0; i < selectedNotes.length; i++) {
					let selectedNote = selectedNotes[i];
					wpsn.saveNoteStateForUndo(selectedNote);
					wpsn.rotatedNote(selectedNote, ui);
				}
			}
		};
		wpsn.options = $.extend({}, wpsn.defaults, options);
		wpsn.prepareContainer(this);
		wpsn.load();
		
		if (wpsn.enableSelection) {
			$(this).unbind('click.wpsn').bind('click.wpsn', function () {
				wpsn.deselectElement($('.wpsn-selected'));
			});
		}

		if (!wpsn.markdownConverter) {
			wpsn.markdownConverter = window.marked;
			wpsn.markdownConverter.setOptions({
				gfm: true,
				tables: true,
				breaks: true,
				pedantic: false,
				sanitize: false,
				smartLists: true,
				smartypants: true
			});
		}
	}
	//wpsn.getMode(note)
	//wpsn.getModeKey(note)
	//wpsn.getModeKeys()
	//wpsn.modes = { 'key' : {name:'name',id:0,render:wpsn.renderFunction} }

	wpsn.cropEnabled = function (note) {
		let $noteDiv = wpsn.getNoteDiv(note);
		let $cropImg = $noteDiv.find('.wpsn-media-crop').eq(0);
		if ($cropImg && $cropImg.attr('src') && $cropImg.attr('src').indexOf('crop.svg') > -1) {
			return true;
		}
		return false;
	};
	wpsn.cropMedia = function (note, $noteDiv) {
		if (!note) { return; }
		let cropEnabled = wpsn.cropEnabled(note);
		let props = note[wpsn.menu.media.modes.media.id];
		if (!props || !props.crop) { return; }
		$noteDiv = $noteDiv || wpsn.getNoteDiv(note);
		let $media = $('.wpsn-frame .wpsn-media', $noteDiv);
		let cropwidth = props.crop.cropwidth;
		let cropheight = props.crop.cropheight;
		let width = cropEnabled ? props.crop.width : ((props.crop.width * ($noteDiv.width())) / cropwidth);
		let height = cropEnabled ? props.crop.height : ((props.crop.height * ($noteDiv.height())) / cropheight);
		let top = cropEnabled ? props.crop.top : ((($noteDiv.height()) * props.crop.top) / cropheight);
		let left = cropEnabled ? props.crop.left : ((($noteDiv.width()) * props.crop.left) / cropwidth);
		$media.css({ 'position': 'relative', 'top': top, 'left': left, 'width': width, 'height': height });
	};
	wpsn.resizeMedia = function (note) {
		if (wpsn.cropEnabled(note)) {
			let $noteDiv = wpsn.getNoteDiv(note);
			let $media = $('.wpsn-frame .wpsn-media', $noteDiv);
			if ($media) {
				let cropwidth = $noteDiv.width();
				let cropheight = $noteDiv.height();
				let width = $media.width();
				let height = $media.height();
				let top = $media.offset().top - $noteDiv.offset().top - (note.canvas == 'frameless' ? 0 : wpsn.defaultPadding);
				let left = $media.offset().left - $noteDiv.offset().left - (note.canvas == 'frameless' ? 0 : wpsn.defaultPadding);

				$media.css({ 'position': 'relative' });

				let props = note[wpsn.menu.media.modes.media.id];
				props.crop = {
					top: top,
					left: left,
					cropwidth: cropwidth,
					cropheight: cropheight,
					width: width,
					height: height
				};
			}
			wpsn.cropMedia(note);
		}
	};

	wpsn.uncropMedia = function (note) {
		let props = note[wpsn.menu.media.modes.media.id];
		delete props.crop;
		wpsn.refreshNote(note);
	};

	wpsn.getModeMenuId = function (mode) {
		for (let menuKey in wpsn.menu) {
			let menu = wpsn.menu[menuKey];
			if (menu && menu.modes) {
				let menuModes = menu.modes;
				for (let modeKey in menuModes) {
					if (menuModes[modeKey].id == mode) {
						return menuKey;
					}
				}
			}
		}
		return null;
	};

	wpsn.getModes = function () {
		let modes = {};
		for (let menuKey in wpsn.menu) {
			let menu = wpsn.menu[menuKey];
			if (menu && menu.modes) {
				let menuModes = menu.modes;
				for (let modeKey in menuModes) {
					if (menuModes[modeKey]) {
						modes[modeKey] = menuModes[modeKey];
					}
				}
			}
		}
		return modes;
	};
	wpsn.isTextMode = function (note) {
		let noteMode = wpsn.getMode(note);
		if (!noteMode || !noteMode.id) { return true; }
		for (let modeName in wpsn.menu.mode.modes) {
			let mode = wpsn.menu.mode.modes[modeName];
			if (mode && mode.id && mode.id == noteMode.id) {
				return true;
			}
		}
		return false;
	};
	wpsn.getModeId = function (modeKey) {
		let mode = wpsn.getModes()[modeKey];
		if (mode) return mode.id;
		return null;
	};
	wpsn.getMode = function (note) {
		return wpsn.getModes()[wpsn.getModeKey(note)];
	};
	wpsn.getModeKey = function (note) {
		let modes = wpsn.getModes();
		for (let mode in modes) {
			if ('' + note.mode === '' + modes[mode].id) {
				return mode;
			}
		}
		return wpsn.defaultMode;
	};
	wpsn.getModeKeys = function (modes) {
		let modeKeys = [];
		if (!modes) { modes = wpsn.getModes(); }
		for (let mode in modes) {
			modeKeys.push(mode);
		}
		return modeKeys;
	};
	wpsn.getStorage = function (note, mode) {
		mode = mode || note.mode;
		if (mode) {
			return note[mode];
		}
		return null;
	};
	wpsn.getStorageValue = function (note, propertyName) {
		return wpsn.getStorage(note, note.mode, propertyName);
	};
	wpsn.getStorageValue = function (note, mode, propertyName) {
		let storage = wpsn.getStorage(note, mode);
		if (storage && storage[propertyName]) {
			return storage[propertyName];
		}
		return '';
	};

	wpsn.renderText = async function (note, callback) {
		try {
			if (wpsn.getMode(note).render) {
				await wpsn.getMode(note).render(note, callback);
			} else {
				wpsn.renderAsIs(note, callback);
			}
		} catch (err) {
			wpsn.renderAsIs(note, callback);
		}
		wpsn.renderJQText(note, callback);
	};
	wpsn.renderJQText = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let noteFrame = $('.wpsn-frame', noteDiv).addClass('wpsn-scrollbar');
		if (note.jqText && note.jqText instanceof $) {
			noteFrame.empty().append(note.jqText);
			delete note.jqText;
		}
	};
	wpsn.windowLoad = function (func) {
		let oldonload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = func;
		} else {
			window.onload = function () {
				if (oldonload) {
					oldonload();
				}
				func();
			};
		}
	};

	wpsn.clickOutSetup = function () {
		$('body').unbind('click.wpsn-clickout');
		if (wpsn.notes) {
			for (let i = 0; i < wpsn.notes.length; i++) {
				let note = wpsn.notes[i];
				if (note.autominimize) {
					$('body').bind('click.wpsn-clickout', wpsn.clickOut);
					break;
				}
			}
		}
	};

	wpsn.clickOut = function () {
		for (let i = 0; i < wpsn.notes.length; i++) {
			let note = wpsn.notes[i];
			if (note.autominimize) {
				wpsn.minimizeEffectiveNotes(note);
			}
		}
	};

	wpsn.prepareContainer = function (container) {
		if ($('.wpsn-container', container).size() == 0) {
			$(container).append(
				$('<div id="wpsn-container" class="wpsn-container"></div>').css({
					'position': 'absolute',
					'top': 0,
					'left': 0
				}).click(function () {
					wpsn.stopEditingNotes();
				})
			).append(
				$('<div id="wpsn-popup-container" class="wpsn-popup-container"></div>').css({
					'position': 'fixed',
					'top': 0,
					'left': 0
				}).hide().unbind('click.wpsn-popupContainer').bind('click.wpsn-popupContainer', function () {
					wpsn.clearPopups();
				})
			);
		}
	};

	wpsn.clearPopups = function () {
		wpsn.deleteNote(wpsn.getNoteFromDiv($('.wpsn-popup').closest('.wpsn-sticky')));
		$('#wpsn-popup-container').hide();
	};

	wpsn.getNonPopupNotes = function () {
		if (!wpsn.notes) { return []; }
		let notes = [];
		for (let i = 0; i < wpsn.notes.length; i++) {
			let note = wpsn.notes[i];
			if (!note.isPopup && !note.deleted) {
				notes.push(note);
			}
		}
		return notes;
	};

	wpsn.getNoteIndex = function (note_id) {
		let index = -1;
		$.each(wpsn.notes, function (_index, note) {
			if (note.id == note_id) {
				index = _index;
				return false;
			}
		});
		return index;
	};

	wpsn.updateNoteIndex = function (id, newNote) {
		let note = wpsn.allNotes['' + id];
		if (note) { wpsn.allNotes['' + id] = newNote; }
		note = (wpsn.notes ? wpsn.notes[wpsn.getNoteIndex(id)] : null);
		if (note && wpsn.notes) { wpsn.notes[wpsn.getNoteIndex(id)] = newNote; }
	};

	wpsn.getNote = function (note_id) {
		let note = wpsn.allNotes['' + note_id];
		note = note || (wpsn.notes ? wpsn.notes[wpsn.getNoteIndex(note_id)] : null);
		note = note || (wpsn.previewNotes ? wpsn.previewNotes[note_id] : null);
		return note;
	};
	wpsn.getNoteDiv = function (note) {
		return $('#note-' + note.id);
	};
	wpsn.getNoteDivs = function(notes) {
		let divs = [];
		if (notes) { 
			for (let note of notes) {
				divs.push(wpsn.getNoteDiv(note));
			}
		}
		return divs;
	};
	wpsn.getNoteDivElements = function(notes) {
		let divs = [];
		for (let noteDiv of wpsn.getNoteDivs(notes)) {
			divs.push(noteDiv.get()[0]);
		}
		return divs;
	};
	wpsn.getNoteId = function (note) {
		return '#note-' + note.id;
	};
	wpsn.getNoteFrame = function (note) {
		return $('#wpsn-frame-' + note.id);
	};
	wpsn.getNoteFrameId = function (note) {
		return '#wpsn-frame-' + note.id;
	};
	wpsn.getNoteFromDiv = function (note_div) {
		if (!note_div || !note_div.attr('id')) { return null; }
		return wpsn.getNote(note_div.attr('id').replace(/note-/, ''));
	};
	wpsn.getNoteFromDivElement = function (note_div) {
		if (!note_div || !note_div.id) { return null; }
		return wpsn.getNote(note_div.id.replace(/note-/, ''));
	};
	wpsn.getNotesFromDivs = function (note_divs) {
		let notes = [];
		note_divs.each(function(index, note_div){
			notes.push(wpsn.getNoteFromDiv(note_div));
		});
		return notes;
	};
	wpsn.getNotesFromDivElements = function (note_divs) {
		let notes = [];
		for (let note_div of note_divs) {
			notes.push(wpsn.getNoteFromDivElement(note_div));
		}
		return notes;
	};

	wpsn.newNote = async function (note) {
		await wpsn.getSettings();
		if (!note) { note = {}; }
		note.id = note.id ? note.id : Math.floor((Math.random() * 1000000000) + 1);
		//note.text = note.text ? note.text : '';
		note.width = note.width ? note.width : wpsn.settings.defaultWidth || 600;
		note.height = note.height ? note.height : wpsn.settings.defaultHeight || 600;
		note.pos_x = note.pos_x != null ? note.pos_x : Math.max(0, $(window).scrollLeft() + window.innerWidth / 2 - note.width / 2);
		note.pos_y = note.pos_y != null ? note.pos_y : Math.max(0, $(window).scrollTop() + window.innerHeight / 2 - note.height / 2);
		note.background = note.background ? note.background : wpsn.settings.background || '#ffa';
		note.textcolor = note.textcolor ? note.textcolor : wpsn.settings.textcolor || '#444';
		note.bordercolor = note.bordercolor ? note.bordercolor : wpsn.settings.bordercolor || '#aaa';
		note.font = note.font ? note.font : (wpsn.settings.font ? $.extend(true, {}, wpsn.settings.font) : { family: 'Verdana' });
		note.font.family = note.font.family || 'Verdana';
		note.font.size = note.font.size;
		//note.htmlMode	= note.htmlMode		? note.htmlMode		: true;
		note.scope = note.scope ? note.scope : wpsn.getScope();
		note.created_date = note.created_date ? note.created_date : new Date().getTime();
		note.mode = note.mode ? note.mode : wpsn.settings.defaultMode || wpsn.defaultMode;

		return note;
	};

	wpsn.createNote = async function (note, callback) {
		await wpsn.getSettings();
		let editMode = !note;

		note = await wpsn.newNote(note);

		if ((!wpsn.notes || wpsn.notes.length == 0) && wpsn.settings.enableBookmarks) {
			chrome.extension.sendMessage({ bookmark: { url: location.href, title: document.title } });
		}
		wpsn.loadFonts([note.font.family]);
		if (!wpsn.notes) { wpsn.notes = []; }
		wpsn.notes.push(note);

		wpsn.renderNote(note, callback);
		wpsn.allNotes[note.id] = note;
		let _note_div = wpsn.getNoteDiv(note);
		//_note_div.find('>.wpsn-submenu-colors').show();

		if (!note.isPopup && !note.deleted) {
			wpsn.save(note);
		}

		if (note && !note.isPopup && !note.deleted) {
			$.each(wpsn.notes, function (index, currentNote) {
				if (currentNote && currentNote.mode == wpsn.menu.manager.modes.notes_manager.id) {
					wpsn.reRenderNote(currentNote);
				}
			});
		}
		wpsn.generateAd(note);

		if (editMode) {
			_note_div.mouseover().find('#wpsn-frame-' + note.id).dblclick();//edit mode on create
		}

		return note;
	};

	wpsn.updateHasSelection = function () {
		wpsn.hasSelection = $('.wpsn-selected').size() > 0;
	};

	wpsn.stopEditingNotes = function () {
		let notes = wpsn.currentlyEditedNotes();
		for (let i = notes.length - 1; i >= 0; i--) {
			if (!notes[i]) { continue; }
			let note = notes[i];
			if (note != null) {
				wpsn.stopEditing(note);
			}
		}

		window.sessionStorage.removeItem('wpsn-childnote');
		wpsn.deselectElement($('.wpsn-selected'));
		wpsn.updateHasSelection();
	};

	wpsn.stopEditing = async function (note, initiallyEmpty) {
		wpsn.saveNoteStateForUndo(note);
		let noteDiv = wpsn.getNoteDiv(note);
		noteDiv.removeClass('wpsn-editing')
		let noteTextArea = noteDiv.find('.wpsn-textarea,.wpsn-frame');
		if (noteTextArea.is('.wpsn-textarea')) {
			note.text = noteTextArea.val();
		} //else if (noteTextArea.prop('contenteditable')){
		//note.text = noteTextArea.text();
		//}
		if (note.text == '<p><br data-mce-bogus="1"></p>') {
			note.text = '';
		}
		delete note.title;
		if (note.text) {
			let lines = note.text.split('\n');
			if (lines.length > 0) {
				let firstLine = $.trim(lines[0]);
				if (firstLine.length > 0) {
					let title = $.trim(firstLine);
					note.title = title;
					noteDiv.find('.wpsn-menu-maximize').attr('title', title);
				}
			}
		}
		let _note_frame = $(document.createElement('div')).attr('id', 'wpsn-frame-' + note.id).addClass('wpsn-frame');
		wpsn.updateFont(note, _note_frame);
		_note_frame.removeAttr('contenteditable');
		if (note.htmlMode) {
			_note_frame.html(note.text).addClass('htmlMode');
		} else {
			_note_frame.removeClass('htmlMode');
		}
		if (!noteTextArea.hasClass('wpsn-frame')) {
			_note_frame.html(noteTextArea.val());
			noteTextArea.replaceWith(_note_frame);
		}
		//wpsn.renderText(note);
		_note_frame.dblclick(function () {
			if (!note.lock || note.lockmode == wpsn.lockModes.editable) {
				wpsn.getNoteDiv(note).mouseout();
				wpsn.editNote(note);
			}
		});
		wpsn.removeCurrentlyEditedNote(note);
		if (wpsn.options.editCallback) {
			wpsn.options.editCallback(note);
		}
		if (note.tmp_freeze) {
			if (note.tmp_draggable) {
				wpsn.unfreezeNote(note);
			}
			delete note.tmp_draggable;
			delete note.tmp_freeze;
			wpsn.unfreezeParentNotes(note);
		}
		await wpsn.refreshNote(note, { undock: true });
		if (!wpsn.settings.disableAutoresize && !note.fullscreen && initiallyEmpty && $.trim(_note_frame.html()).length > 0) {
			wpsn.autoResize(note);
		}
		if (note && !note.isPopup && !note.deleted) {
			wpsn.setupDrop(note);
		}

		wpsn.reorderNote(note);
		wpsn.settings.enableAutoresizeHeight?wpsn.autoResizeHeight(note):false;
	};

	wpsn.cloneProvidedNotes = function (noteOrNotes, selectNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, function (notes) { wpsn.cloneNote(notes[0], true); }, '', true, false, selectNotes);
	};

	wpsn.cloneFavoriteNotes = async function () {
		return wpsn.cloneNote(await wpsn.getFavoriteNote(), true);
	};

	wpsn.cloneEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.cloneNote, 'Are you sure you want to clone {0}?');
	};

	wpsn.cloneNote = function (note, updateScopeToCurrentScope, keepOriginalCoordinates) {
		let newNote = JSON.parse(JSON.stringify(note));//clone
		if (updateScopeToCurrentScope && !wpsn.inScope(note)) {
			newNote.scope = newNote.scope || [];
			newNote.scope = [].concat(newNote.scope);
			newNote.scope.push(wpsn.getScope());
		}
		newNote.id = Math.floor((Math.random() * 1000000000) + 1);
		wpsn.renderNote(newNote);
		if (updateScopeToCurrentScope && !keepOriginalCoordinates) { wpsn.centerNote(newNote); }
		wpsn.notes.push(newNote);
		wpsn.save();
	};
	wpsn.cloneNotes = function (notes, updateScopeToCurrentScope, keepOriginalCoordinates) {
		if (notes) {
			for (let i = 0; i < notes.length; i++) {
				wpsn.cloneNote(notes[i], updateScopeToCurrentScope, keepOriginalCoordinates);
			}
		}
	};

	wpsn.noteOrNotesToArray = function(noteOrNotes) {
		if (!noteOrNotes) return [];
		return noteOrNotes = noteOrNotes instanceof Array ? noteOrNotes : [noteOrNotes];
	};

	wpsn.deleteEffectiveNotes = function (noteOrNotes, confirmForAll) {
		let tNoteOrNotes = wpsn.noteOrNotesToArray(noteOrNotes);
		if (confirmForAll && tNoteOrNotes.length > 0) {
			let tConfirmForAll = false;
			for (let note of tNoteOrNotes) {
				if (note.text || note.mode != wpsn.menu.mode.modes.markdown.id) {
					tConfirmForAll = true;
				}
			}
			confirmForAll = tConfirmForAll;
		}
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.deleteNote, confirmForAll ? 'Are you sure you want to delete {0}?' : '', false, confirmForAll);
	};

	wpsn.cleanupDeletedNotes = function() {
		Object.keys(wpsn.allNotes).forEach(function(key) {
			let note = wpsn.allNotes[key];
			if (note && note.id && note.deleted) {
				wpsn.deleteNote(note);
			}
		});
	};

	wpsn.deleteNote = function (note) {
		if (!note) { return false; }
		//wpsn.saveNoteStateForUndo(note);
		if (note.deleted) {
			note.redeleted = true;
		}
		note.deleted = true;
		if (note && note.preview) {
			$(note.preview).unbind('keyup.wpsn-preview,change.wpsn-preview');
		}

		wpsn.eraseNote(note);
		$.each(wpsn.notes, function (index, currentNote) {
			if (currentNote && note && currentNote.id == note.id) {
				//wpsn.notes.splice(index, 1);
				if ((!wpsn.notes || wpsn.notes.length == 0) && wpsn.settings.enableBookmarks) {
					chrome.extension.sendMessage({ bookmark: { url: location.href, title: document.title, remove: true } });
				}

				return;
			}
		});

		if (note.deleted && !note.redeleted && !note.isPopup) {
			Object.keys(note).forEach(function(key) { if (key != 'id' && key != 'modified_date') { delete note[key]; }});
			note.deleted = true;
			wpsn.save(note);
		} else {
			wpsn.removeFromAll('wpsn.note.' + note.id);
		}
		//chrome.storage.local.remove('wpsn.note.'+note.id);
		if (note && !note.isPopup && !note.deleted) {
			$.each(wpsn.notes, function (index, currentNote) {
				if (currentNote && currentNote.mode == wpsn.menu.manager.modes.notes_manager.id) {
					wpsn.reRenderNote(currentNote);
				}
			});
		}
		if (note.isPopup) {
			$('#wpsn-popup-container.' + note.id).hide();
		}
		wpsn.updateCount();
	};

	wpsn.fullscreenNote = function (note, isHash, dontSave) {
		let noteDiv = wpsn.getNoteDiv(note);
		noteDiv.css({
			'position': 'fixed',
			'top': 0,
			'left': 0,
			'width': '100%',
			'height': '100%'
		});
		wpsn.freezeNote(note);
		if (!isHash) { note.fullscreen = true; }
		if (!dontSave) {
			wpsn.save(note);
		}
		window.scrollTo(0, 0);
		noteDiv.addClass('wpsn-fullscreen');
	};

	wpsn.actOnEffectiveNotes = async function (note, func, confirmationPrompt, noLoopNotes, confirmForAll, selectNotes, info={}) {
		try {
			let effective = await wpsn.getEffectiveNotes(note, selectNotes);
			let anchorNote;
			if (effective && effective.notes && effective.notes.length > 0) {
				anchorNote = JSON.parse(JSON.stringify(effective.notes[0]));
			}
			info.effectiveNotes = effective;
			info.anchorNote = anchorNote;

			if (!confirmForAll && (!confirmationPrompt || effective.type == 'current' || effective.type == 'notes' || effective.type == 'hovered' || effective.type == 'edited')) {
				wpsn.saveNoteStateForUndo(effective.notes);
				if (noLoopNotes) {
					await func(effective.notes, info);
				} else {
					for (let enote of effective.notes) { 
						await func(enote, info); 
					}
				}
			} else {
				await wpsn.confirm(
					{},
					'<div class="alert alert-warning">' + wpsn.format(confirmationPrompt, effective.label) + '</div>'
				);
				let promises = [];
				if (effective.notes.length > 0) {
					if (noLoopNotes) {
						func(effective.notes, info);
					} else {
						for (let enote of effective.notes) { func(enote, info); }
					}
				}
				await Promise.all(promises);
			}
		} catch (err) { wpsn.error(err); }
	};

	wpsn.actOnEffectiveNotesWithPrompt = async function (note, confirmationPrompt, promptFunc, formCallback) {
		let effectiveNotes = await wpsn.getEffectiveNotes(note);
		if (!confirmationPrompt || effectiveNotes.type == 'current' || effectiveNotes.type == 'notes') {
			let form = await promptFunc();
			wpsn.saveNoteStateForUndo(effectiveNotes.notes);
			for (let enote of effectiveNotes.notes) {
				await formCallback(enote, form);
			}
		} else {
			await wpsn.confirm(
				{},
				'<div class="alert alert-warning">' + wpsn.format(confirmationPrompt, effectiveNotes.label) + '</div>'
			);
			let form = await promptFunc();
			for (let enote of effectiveNotes.notes) {
				await formCallback(enote, form);
			}
		}
		return;
	};

	wpsn.minimizeNote = function (note) {
		note.minimized = true;
		note.fullscreen = false;
		wpsn.refreshNote(note);
	};

	wpsn.minimizeEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.minimizeNote, 'Are you sure you want to minimize {0}?');
	};

	wpsn.maximizeNote = async function (note) {
		note.minimized = false;
		note.fullscreen = false;
		wpsn.refreshNote(note);
	};

	wpsn.maximizeEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.maximizeNote, 'Are you sure you want to maximize {0}?');
	};

	wpsn.editNote = async function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		noteDiv.addClass('wpsn-editing')
		let noteFrame = noteDiv.find('#wpsn-frame-' + note.id);
		if (note && !note.isPopup && !note.deleted) {
			let textarea = $(document.createElement('textarea'))
				.attr('id', 'wpsn-textarea-' + note.id)
				.addClass('wpsn-textarea')
				.addClass('wpsn-scrollbar')
				.css('color', noteFrame.css('color'))
				.css('background', noteFrame.css('background-color'))
				.css('zoom', (note.zoom || 100) + '%')
				.val(
					note.text
					/*
					wpsn.htmlDecode(noteDiv
					.find('.wpsn-frame')
					.html().toString().replace(/<br\/?>/g,"\n").replace(/(&nbsp;)/g," "))
					*/
				);
			if (wpsn.isMedia(note)) {
				textarea.css('color', (note.textcolor || wpsn.settings.textcolor || '#fff;'));
			}
			if (note.textshadow && note.textshadow != 'false') {
				textarea.addClass('wpsn-text-shadow');
				textarea.css('color', '#fff');
			}
			//if (note.textposition) {
			//textarea.addClass('wpsn-text-'+note.textposition);
			//}
			if (note.htmlMode) {
				if (note.text == null) { note.text = ''; }
				textarea.val(note.text);
			}
			if (note.htmlMode) {
				textarea = $('#wpsn-frame-' + note.id);
				let sticky = textarea.parents('.wpsn-sticky:eq(0)');
				let draggable = !sticky.is('.ui-draggable-disabled');
				if (!note.tmp_freeze) {
					note.tmp_draggable = draggable;
					note.tmp_freeze = true;
					wpsn.freezeNote(note);
					wpsn.freezeParentNotes(note);
				}
				noteFrame.attr('contenteditable', true);
				if (!textarea.data('tinymce')) {
					tinymce.init({
						forced_root_block: false,
						selector: '#' + textarea.attr('id'),
						inline: true,
						menubar: false,
						//plugins: [
						//	"advlist"
						//],
						toolbar: 'styleselect | bullist numlist outdent indent'// | advlist"
					});
					textarea.data('tinymce', true);
				}
			} else if (!textarea.hasClass('wpsn-frame')) {
				$('#wpsn-frame-' + note.id).replaceWith(textarea);
			}
			let initiallyEmpty = $.trim(textarea.val() + textarea.html()).length === 0;
			//textarea.focus();


			var currentNote = note;
			textarea.data('initiallyEmpty', initiallyEmpty)
			textarea.unbind('blur').blur(function (e) {
				currentNote.text = $(this).html();
				if (!e || !e.relatedTarget || !e.relatedTarget.className || e.relatedTarget.className.indexOf('mce-widget') < 0) {
					if (!$(this).data('wpsn_dont_stop_editing')) {
						wpsn.stopEditingCurrentlyEditedNotes(null, textarea.data('initiallyEmpty'));
					} else {
						$(this).removeData('wpsn_dont_stop_editing').focus();
					}
				}
			});

			if (wpsn.settings.enableSmartPaste && wpsn.getModeKey(note) == wpsn.menu.mode.modes.markdown.id) {
				textarea.unbind('paste').bind('paste', function (e) {
					e.preventDefault();
					let text = (e.originalEvent || e).clipboardData.getData('text/html') || (e.originalEvent || e).clipboardData.getData('text/plain');
					window.document.execCommand('insertText', false, text);
				});
			}
			$('.wpsn-menu-delete').mousedown(async function (e) {
				e.preventDefault;
				textarea.data('initiallyEmpty', false);
			});
			let preview = $('<img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/right_arrow.svg" class="wpsn-side-menu wpsn-preview" title="Click to preview input in another note" width="'+(wpsn.settings.defaultIconSize||14)+'" style="top:'+(wpsn.settings.defaultIconSize||14)+'"/>');
			preview.mousedown(async function (e) {
				e.preventDefault;
				textarea.data('wpsn_dont_stop_editing', true);
				let previewNote = $.extend(true, {}, note);
				previewNote.discard = true;
				delete previewNote.position;
				let $noteDiv = wpsn.getNoteDiv(note);
				let $window = $(window);
				let pos_x = $noteDiv.position().left;
				let pos_y = $noteDiv.position().top;
				let width = $noteDiv.width();
				let height = $noteDiv.height();

				let rightPosx = pos_x + width + 1;
				let leftPosx = pos_x - width - 1;
				let bottomPosy = pos_y + height;
				let topPosy = pos_y - height;

				let differenceRight = $window.width() - (rightPosx + width);
				let differenceLeft = leftPosx;
				let differenceTop = topPosy;
				let differenceBottom = $window.height() - (bottomPosy + height);

				if (differenceRight > differenceTop ||
					differenceRight > differenceBottom ||
					differenceLeft > differenceTop ||
					differenceLeft > differenceBottom) {
					if (differenceRight > differenceLeft) {
						previewNote.pos_x = rightPosx;
					} else {
						previewNote.pos_x = leftPosx;
					}
					previewNote.pos_y = pos_y;
				}
				else {
					if (differenceBottom > differenceTop) {
						previewNote.pos_y = bottomPosy;
					} else {
						previewNote.pos_y = topPosy;
					}
					previewNote.pos_x = pos_x;
				}
				previewNote.width = $noteDiv.width();
				previewNote.height = $noteDiv.height();
				previewNote.previewMode = 'raw';
				previewNote.preview = '#wpsn-textarea-' + note.id;
				previewNote.id += 'p';
				previewNote.isPopup = true;
				previewNote.isNotPopup = true;
				//previewNote.menu = ["removePopup"];
				await wpsn.refreshNote(previewNote);
				wpsn.previewNotes = wpsn.previewNotes || {};
				wpsn.previewNotes[previewNote.id] = previewNote;
			});
			if ($('#wpsn-frame-' + note.id + 'p').size() > 0) {
				wpsn.previewNotes = wpsn.previewNotes || {};
				await wpsn.refreshNote(wpsn.previewNotes[note.id + 'p']);
			}
			textarea.after(preview);
			wpsn.updateFont(note, textarea);

			if (((noteDiv.offset().top + noteDiv.height()) > $(window).height()) || textarea[0].clientHeight != textarea[0].scrollHeight) {
				if (textarea.is('textarea')) {
					textarea.get(0).setSelectionRange(0, 0);
				}
				textarea.focus();
			} else {
				textarea.focus();
				textarea.scrollTop(textarea[0].scrollHeight);
			}
			wpsn.setCurrentlyEditedNote(note);

			wpsn.zIndex(textarea.parents('.wpsn-sticky:eq(0)'), 2);
		}
	};

	wpsn.stopEditingCurrentlyEditedNotes = function (exceptNoteIds, initiallyEmpty) {
		let notes = wpsn.currentlyEditedNotes();
		//let textarea = $(this);
		for (let i = notes.length - 1; i >= 0; i--) {
			if (!notes[i]) { continue; }
			let note = notes[i];
			if (note != null && (!exceptNoteIds || $.inArray(note.id, exceptNoteIds) < 0)) {
				wpsn.stopEditing(note, initiallyEmpty);
			}
		}
	};
	wpsn.currentlyEditedNotes = function () {
		return wpsn.currentlyEditedNoteIds;
	};

	wpsn.setCurrentlyEditedNote = function (note) {
		wpsn.currentlyEditedNoteIds.push(note);
	};

	wpsn.removeCurrentlyEditedNote = function (note) {
		let notes = wpsn.currentlyEditedNotes();
		let pos = -1;
		for (let i = notes.length - 1; i >= 0; i--) {
			if (!notes[i]) { continue; }
			if (notes[i].id == note.id) {
				pos = i;
				break;
			}
		}
		wpsn.currentlyEditedNoteIds.splice(pos, 1);
	};

	wpsn.isCurrentlyEditedNote = function (note) {
		let notes = wpsn.currentlyEditedNotes();
		for (let i = notes.length - 1; i >= 0; i--) {
			if (!notes[i]) { continue; }
			if (notes[i].id == note.id) {
				return true;
			}
		}
		return false;
	};

	wpsn.eraseNotes = function () {
		for (let i = 0; i < wpsn.notes.length; i++) {
			wpsn.eraseNote(wpsn.notes[i]);
		}
	};

	wpsn.eraseNote = function (note) {
		if (note) {
			for (let i = 0; i < wpsn.notes.length; i++) {
				if (!wpsn.notes[i]) { continue; }
				if (wpsn.notes[i].target === '#note-' + note.id) {
					let cNote = wpsn.notes[i];
					//delete cNote.target;
					cNote.pos_x = 0;
					cNote.pos_y = 0;
					let cHtmlNote = $('#note-' + cNote.id);
					if (cHtmlNote.size() == 0) { continue; }
					let $container = $('#wpsn-container').append(cHtmlNote);
					cHtmlNote.position().top = 0;
					cHtmlNote.position().left = 0;
					for (let j = 0; j < $('> .wpsn-sticky', $container).size(); j++) {
						let tHtmlNote = $('> .wpsn-sticky', $container).eq(j);
						if (tHtmlNote.attr('id') != 'note-' + cNote.id) {
							if (Math.floor(cHtmlNote.position().top) === Math.floor(tHtmlNote.position().top)
								&& Math.floor(cHtmlNote.position().left) === Math.floor(tHtmlNote.position().left)) {
								cHtmlNote.position().top += 5;
								cHtmlNote.position().left += 2;
							}
						}
					}
				}
			}
			let noteDiv = $('#note-' + note.id);
			noteDiv.find('>.wpsn-menu-maximize').eq(0).remove();
			noteDiv.remove();
			if (note.isPopup && !note.lock) {
				$('#wpsn-popup-container.' + note.id).hide();
			}
		}
		$('form.wpsn-highlight').removeClass('wpsn-highlight');
	};
	wpsn.upload = function (note, files) {
		for (let i = 0; i< files.length; i++) {
			const f = files[i];
			let isWPSN = f.name.endsWith('.wpsn');
			let isHTML = f.name.endsWith('.html');
			if (f.type.match('image.*') || isWPSN || isHTML) {
				let reader = new FileReader();
				reader.onloadend = async function () {
					let data = reader.result;
					try {
						JSON.parse(data);
					} catch(err) {
						try {
							data = CryptoJS.AES.decrypt(data,chrome.runtime.id).toString(CryptoJS.enc.Utf8);
						} catch(err) {}
					}
					if (isHTML) {
						try {
							data = steg.decode($('<div/>').append($(data)).find('#wpsn-snapshot').attr('src'));
						} catch (err) { wpsn.error(err); }
					}
					if (isWPSN || isHTML) {
						await wpsn.confirm({}, '<div class="alert alert-warning">Are you sure you want to import the note(s)?</div>');
						let importedNotes = await wpsn.saveNotes(JSON.parse(data));
						let message = '<div class="alert alert-success">The following note(s) have been imported</div>';
						wpsn.manager.renderManagerNotes(null, importedNotes, message);
					} else {
						if (data.length < 100000) {
							wpsn.saveStegBeforeMedia(note, data);
							wpsn.menu.about.leftClick.action(note);
						} else {
							wpsn.alert({}, 'File upload of more than 10KB not allowed due to storage size limitations.');
							wpsn.saveStegBeforeMedia(note, data, null, true);
						}
					}
				};
				if (isWPSN || isHTML) {
					reader.readAsText(f);
				} else {
					reader.readAsDataURL(f);
				}
			}
		}
	};
	wpsn.setupDrop = function (note) {
		let $noteDiv = $('.wpsn-frame', wpsn.getNoteDiv(note));
		$noteDiv.unbind('dragenter').bind('dragenter', function (e) {
			e.stopPropagation();
			e.preventDefault();
		});
		$noteDiv.unbind('dragover').bind('dragover', function (e) {
			e.stopPropagation();
			e.preventDefault();
			$(this).closest('.wpsn-sticky').addClass('wpsn-droppable');
		});
		$noteDiv.unbind('dragleave').bind('dragleave', function () {
			$(this).closest('.wpsn-sticky').removeClass('wpsn-droppable');
		});
		$noteDiv.unbind('drop').bind('drop', function (e) {
			$(this).closest('.wpsn-sticky').removeClass('wpsn-droppable');
			e.stopPropagation();
			e.preventDefault();

			let dt = e.originalEvent.dataTransfer;
			let files = dt.files;
			let html = dt ? dt.getData('text/html') || dt.getData('text/plain') : null;
			let URL = dt ? dt.getData('URL') : null;
			if (files && files.length > 0) {
				wpsn.upload(note, files);
			} else if (!URL && html) {
				note.text = html;
				note.mode = wpsn.menu.mode.modes.markdown.id;
				wpsn.refreshNote(note);
			} else {
				wpsn.saveStegBeforeMedia(note, URL, html);
			}
		});
	};
	wpsn.saveStegBeforeMedia = function (note, URL, html, dontSaveMedia) {
		let img = new Image();
		img.onload = function () {
			try {
				let newNotes = JSON.parse(steg.decode(img));
				if (!Array.isArray(newNotes)) {
					newNotes = [newNotes];
				}
				for (let i = 0; i < newNotes.length; i++) {
					let newNote = newNotes[i];
					if (newNotes.length == 1) {
						newNote.id = note.id;
						newNote.pos_x = note.pos_x;
						newNote.pos_y = note.pos_y;
					} else {
						newNote.id = Math.floor((Math.random() * 1000000000) + 1);
					}
					newNote.scope = note.scope;
					wpsn.refreshNote(newNote);
				}
			} catch (err) {
				if (!dontSaveMedia) {
					wpsn.menu.media.saveMedia(note, URL, html);
				}
			}
		};
		img.onerror = function () {
			if (!dontSaveMedia) {
				wpsn.menu.media.saveMedia(note, URL, html);
			}
		};
		img.crossOrigin = 'Anonymous';
		img.src = URL;
	};

	wpsn.getTargetNoteId = function (note) {
		return note.target ? note.target.replace(/#note-/, '') : null;
	};

	wpsn.isMedia = function (note) {
		let props = note ? note[wpsn.menu.media.modes.media.id] : null;
		return props && props.media;
	};
	wpsn.isMeme = function (note) {

		return ((note && note.meme == 'true') || (note.meme != 'false' && !wpsn.settings.disableMemeModeByDefault)) && wpsn.isMedia(note);
	};

	wpsn.setting = function(property) {
		return wpsn.settings && wpsn.settings[property];
	};

	wpsn.scopedProp = function(note, prop) {
		return (note[location.href] && note[location.href][prop]) || note[prop];
	};

	wpsn.setScopedProp = function(note, prop, val) {
		note[location.href] = note[location.href] || {};
		note[location.href][prop] = val;
	};

	wpsn.isMultiPosition = function(note) {
		return note.multiPosition != undefined ? note.multiPosition : wpsn.setting('multiPosition');
	};

	wpsn.posx = function(note) {
		return (wpsn.isMultiPosition(note) && wpsn.scopedProp(note,'pos_x')) || note.pos_x;
	};

	wpsn.posy = function(note) {
		return (wpsn.isMultiPosition(note) && wpsn.scopedProp(note,'pos_y')) || note.pos_y;
	};

	wpsn.renderNote = async function (note, callback, options = {}) {
		let $container = $('#wpsn-container');
		let previewedElement = null;
		if (note.preview) {
			previewedElement = $(note.preview);
			if (previewedElement.size() > 0) {
				previewedElement = previewedElement.first();
			}
		}
		if (previewedElement) {
			previewedElement.unbind('keyup.wpsn-preview,change.wpsn-preview').bind('keyup.wpsn-preview,change.wpsn-preview', function () {
				let previousText = note.previewText;
				try { note.previewText = $(this).val() || (note.previewMode == 'raw' ? $(this).get(0).innerText : $(this).get(0).innerHTML); } catch (err) { wpsn.error(err); }
				if (previousText != note.previewText) {
					wpsn.refreshNote(note);
				}
			});
			try { note.previewText = previewedElement.val() || ((note.previewMode == 'raw' && previewedElement.get(0)) ? previewedElement.get(0).innerText : previewedElement.get(0).innerHTML); } catch (err) { wpsn.error(err); }
		}
		let _note_frame = $('<div id="wpsn-frame-' + note.id + '" class="wpsn-frame" style="zoom:' + (note.zoom || 100) + '%;text-align:'+(note.textAlign?note.textAlign:'left')+';"/>');
		note.font = note.font ? note.font : { family: 'Verdana' };
		wpsn.loadFont(note);
		wpsn.updateFont(note, _note_frame);
		if (note.htmlMode) {
			_note_frame.html(note.previewText || note.text).addClass('htmlMode');
		} else {
			_note_frame.removeClass('htmlMode');
		}
		let _background = note.background;
		let _bordercolor = note.bordercolor;
		if (note.canvas) {
			let _canvasColors = note.canvas.split('|');
			_background = _canvasColors[0] || _background;
			_bordercolor = _canvasColors[1] || _bordercolor;
		}
		let _popupClass = '';
		let _alertClass = '';
		let _noteClass = options.class;
		if (note.isPopup && !note.lock && !note.preview) {
			_background = '';
			_popupClass = 'wpsn-popup';
		}
		if (note.isAlert) {
			_alertClass = 'wpsn-alert';
		}
		let _div_note = $('<div class="wpsn-note ' + _popupClass + ' ' + _alertClass + ' ' + _noteClass +'" style="background:' + _background + ';color:' + note.textcolor + ';box-shadow:0px 0px 1px 0px ' + _bordercolor + '"></div>');
		let _top_bar = $('<div class="wpsn-topbar">&nbsp;</div>');
		if (note.canvas == 'frameless') {
			_div_note.addClass('wpsn-frameless');
		}
		_div_note.append(_top_bar);
		_div_note.append(_note_frame);

		let meme = wpsn.isMeme(note);

		let $mediaFilter = $('<img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/filter.svg" width="'+(wpsn.settings.defaultIconSize||14)+'" style="top:'+(wpsn.settings.defaultIconSize||14)+'" class="wpsn-media-filter" title="Left click: apply filters/transformations to media\n---\nRight click: remove filters/transformations"/>');
		let $mediaCrop = $('<img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/crop_off.svg" width="'+(wpsn.settings.defaultIconSize||14)+'" style="top:'+2*(wpsn.settings.defaultIconSize||14)+'" class="wpsn-media-crop" title="Left click: toggle crop mode\n---\nRight click: uncrop media"/>');
		let $mediaMeme = $('<img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/smiley' + (!meme ? '_off' : '') + '.svg" width="'+(wpsn.settings.defaultIconSize||14)+'" style="top:'+3*(wpsn.settings.defaultIconSize||14)+'" class="wpsn-media-meme" title="Left click: toggle meme mode. Note text will be in the font of memes. Note text with line break will show above and below note."/>');

		$mediaFilter.click(function () {
			wpsn.mediaFilterPrompt(note);
		}).bind('contextmenu', function () {
			delete note.mediaFilter;
			delete note.colorToTransparent;
			wpsn.refreshNote(note);
			return false;
		});
		_note_frame.after($mediaFilter);
		if (wpsn.cropEnabledOption) {
			$mediaCrop.click(function () {
				let $img = $(this);
				if ($img.attr('src') == ('chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/crop_off.svg')) {
					$img.attr('src', 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/crop.svg');
					$img.closest('.wpsn-sticky').removeClass('wpsn-cropping').addClass('wpsn-cropping');
				} else {
					$img.attr('src', 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/crop_off.svg');
					$img.closest('.wpsn-sticky').removeClass('wpsn-cropping');
				}
				wpsn.initResizable(note);
			}).bind('contextmenu', function () {
				wpsn.uncropMedia(note);
				return false;
			});
			_note_frame.after($mediaCrop);
		}
		if (wpsn.memeEnabledOption) {
			$mediaMeme.click(function () {
				let $img = $(this);
				let meme = wpsn.isMeme(note);
				if (!meme) {
					$img.attr('src', 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/smiley.svg');
					note.meme = 'true';
				} else {
					$img.attr('src', 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/smiley_off.svg');
					note.meme = 'false';
				}
				wpsn.refreshNote(note);
			});
			_note_frame.after($mediaMeme);
		}
		//note.order = note.order || wpsn.nextOrder();

		let _div_wrap = $('<div id="note-' + note.id + '" style="z-index:' + wpsn.getZIndex(note) + ';position:absolute;'+
		(wpsn.posx(note)?'left:' + wpsn.posx(note) + ';':'')+
		(wpsn.posy(note)?'top:' + wpsn.posy(note) + ';':'')+
		(note.width?'width:' + note.width + 'px;':'')+
		(note.angle?'transform: rotate(' + note.angle + 'rad);':'')+
		(note.minWidth?'min-width:' + note.minWidth + 'px;':'')+
		(note.maxWidth?'max-width:' + note.maxWidth + 'px;':'')+
		(note.height?'height:' + note.height + 'px;':'')+
		(note.minHeight?'min-height:' + note.minHeight + 'px;':'')+
		(note.maxHeight?'max-height:' + note.maxHeight + 'px;':'')+
		'"><a name="' + note.id + '"/></div>').append(_div_note);

		if (!wpsn.inScope(note)) {
			//_div_wrap.hide();
		}
		if (_bordercolor != wpsn.transparent) {
			if (wpsn.getSavePath(note) == wpsn.keys.global) {
				_div_wrap.addClass('wpsn-global');
			}
			if (wpsn.getSavePath(note) == wpsn.keys.domain) {
				_div_wrap.addClass('wpsn-domain');
			}
		}
		if (note.isPopup && !note.isNotPopup && !note.lock) {
			_div_wrap.css('z-index', _div_wrap.css('z-index') + 2);
			$('#wpsn-popup-container').attr('class', note.id).show();
		}

		wpsn.generateMainMenu(note, _div_wrap);

		_div_wrap.blur(function () {
			$(this).find('>.wpsn-submenu').hide('slide');
		});

		if (note.scope == 'domain') {
			_div_wrap.addClass('wpsn-domain');
		}
		if (note.scope == 'global') {
			_div_wrap.addClass('wpsn-global');
		}
		if (note.minimized) {
			//wpsn.zIndex(_div_wrap, -2, false, true);
			_div_wrap.css({ width: 0, height: 0 });
			//TODO_div_delete.hide();
		}

		_div_wrap.addClass('wpsn-sticky');
		_div_wrap.addClass('wpsn-snappable')
		if (note.clazz) {
			_div_wrap.addClass(note.clazz);
		}
		_div_wrap.unbind('click').click(function (e) {
			wpsn.stopEditingCurrentlyEditedNotes([note.id]);
			try {
				if (window.sessionStorage.getItem('wpsn-childnote')) {
					let childNoteId = window.sessionStorage.getItem('wpsn-childnote');
					if (childNoteId != note.id) {
						let childNote = wpsn.getNote(childNoteId);
						childNote.target = '#' + $(this).attr('id');
						//wpsn.refreshNote(childNote);
						wpsn.refreshAllNotes();
					} else {
						wpsn.deselectElement(wpsn.getNoteDiv(note));
						wpsn.updateHasSelection();
					}
					window.sessionStorage.removeItem('wpsn-childnote');
				}
			} catch(err) {
				console.log(err);
			}
			e.stopPropagation();
		});

		_div_wrap.unbind('mouseover').mouseover(function () {
			let $this = $(this);
			wpsn.zIndex($this, 2, note.lock);
			for (let i = 0; i < wpsn.notes.length; i++) {
				if (!wpsn.notes[i] || wpsn.notes[i].target != '#note-' + note.id) { continue; }
				wpsn.zIndex(wpsn.getNoteDiv(wpsn.notes[i]), 2, false, true);
			}
			$this.addClass('wpsn-mouseover');
		});
		_div_wrap.unbind('mouseout').mouseout(function () {
			wpsn.zIndex($(this), -2, note.lock);
			$(this).find('>.wpsn-menu-maximize').css('visibility', 'visible');
			for (let i = 0; i < wpsn.notes.length; i++) {
				if (!wpsn.notes[i] || wpsn.notes[i].target != '#note-' + note.id) { continue; }
				wpsn.zIndex(wpsn.getNoteDiv(wpsn.notes[i]), -2, false, true);
			}
			$(this).removeClass('wpsn-mouseover');
		});

		try {
			let targetElement = null;
			if (note.target) {
				targetElement = $(note.target);
				if (targetElement.size() > 0) {
					targetElement = targetElement.first();
				}
			}

			let top = wpsn.posy(note);
			let left = wpsn.posx(note);
			if ((!note.isPopup && !note.deleted) || note.isNotPopup || note.lock) {
				$container.append(_div_wrap);
			} else {
				$('#wpsn-popup-container').append(_div_wrap);
			}
			if (targetElement) {
				top = 0;
				left = 0;
				if (targetElement.is('.wpsn-sticky')) {
					targetElement.append(_div_wrap);					
					_div_wrap.css({
						'z-index': '999',
						'top': wpsn.defaultPadding,
						'left': 0
					});
					if (_div_wrap.draggable) {
						//_div_wrap.draggable('disable');
					}
					top = _div_wrap.position().top;
					left = _div_wrap.position().left;
				} else {
					if (note.targetUpdate) {
						targetElement.html(note.text)
					}
					if (targetElement.offset()) {
						top = targetElement.offset().top - 6;
						left = targetElement.offset().left + targetElement.width() - 8;
					}

					if (_div_wrap.draggable) {
						try {
							_div_wrap.draggable('disable');//'option','containment',[_div_wrap.position().left,_div_wrap.position().top,_div_wrap.position().left,_div_wrap.position().top]);
						} catch (err) { wpsn.error(err); }
					}
					_div_wrap.find('.wpsn-note').css('cursor', 'default');
				}
			}
			for (let i = 0; i < wpsn.notes.length; i++) {
				let tempNote = wpsn.notes[i];
				if (!tempNote) { continue; }
				let tempNoteDiv = $('#note-' + tempNote.id);
				if (wpsn.getTargetNoteId(tempNote) == note.id) {
					//wpsn.reRenderNote(tempNote);
				}
				if (tempNote.id != note.id && tempNoteDiv.position()
					&& ((Math.floor(tempNoteDiv.position().left) === Math.floor(left)
						&& Math.floor(tempNoteDiv.position().top) === Math.floor(top))
						|| (Math.ceil(tempNoteDiv.position().left) === Math.ceil(left)
							&& Math.ceil(tempNoteDiv.position().top) === Math.ceil(top)))) {
					if (targetElement && targetElement.is('.wpsn-sticky')) {
						if (tempNote.target === note.target) {
							top += 13;
							//left += 0;
						}
					} else if (!note.modified_date) {
						top += 5;
						left += 2;
					}
				}
			}
			_div_wrap.css({
				'top': top, 'left': left
			});
		} catch (err) {
			wpsn.log(err);
			if (note && !note.error && note.error != err) {
				alert(err);
				note.error = err;
				wpsn.save(note);
			}
			$('#wpsn-container').append(_div_wrap);
		}


		let isHash = note.id == wpsn.getHash();
		if (note.fullscreen || isHash) {
			wpsn.fullscreenNote(note, isHash, true);
		}
		$(_note_frame).dblclick(function () {
			if (!note.lock || note.lockmode == wpsn.lockModes.editable) {
				_div_wrap.data('dockToggle', true);
				_div_wrap.mouseout();
				_div_wrap.data('dockToggle', false);
				let frame = $(this);
				if (frame.size() > 0) {
					wpsn.editNote(note);
				}
			}
		});
		if (note.target) {
			let targetNote = wpsn.getNote(wpsn.getTargetNoteId(note));
			if (targetNote && targetNote.minimized) {
				_div_wrap.hide();
			}
		}

		wpsn.initResizable(note, {});
		wpsn.initDraggable(note, {});

		await wpsn.renderText(note, callback);
		$('a[data-wpsn-command').click(function(){
			wpsn.command($(this).data('wpsn-command'), note);
			return false;
		});
		if (note.lock || note.fullscreen) {
			try {
				_div_wrap.draggable('disable');
				_div_wrap.resizable('disable');
				_div_wrap.rotatable('disable');
			} catch (err) { wpsn.error(err,true); }
		} else {
			wpsn.initRotatable(note, {});
			//wpsn.settings.enableAutoresizeHeight?wpsn.autoResizeHeight(note):false;
		}

		if (note.position && !note.minimized && !note.fullscreen) {
			let dockedSize = (wpsn.settings.defaultIconSize||14);
			if (note.position == 'right') {
				_div_wrap.removeClass('wpsn-position-top').removeClass('wpsn-position-right').removeClass('wpsn-position-bottom').removeClass('wpsn-position-left')
					.addClass('wpsn-position-right').css({ 'right': (note.docked && !options.undock ? (dockedSize - note.width) : 0), 'width': note.width });
			} else if (note.position == 'bottom') {
				_div_wrap.removeClass('wpsn-position-top').removeClass('wpsn-position-right').removeClass('wpsn-position-bottom').removeClass('wpsn-position-left')
					.addClass('wpsn-position-bottom').css({ 'bottom': (note.docked && !options.undock ? (dockedSize - note.height) : 0), 'width': '100%' });
			} else if (note.position == 'left') {
				_div_wrap.removeClass('wpsn-position-top').removeClass('wpsn-position-right').removeClass('wpsn-position-bottom').removeClass('wpsn-position-left')
					.addClass('wpsn-position-left').css({ 'left': (note.docked && !options.undock ? (dockedSize - note.width) : 0), 'width': note.width });
			} else if (note.position == 'top') {
				_div_wrap.removeClass('wpsn-position-top').removeClass('wpsn-position-right').removeClass('wpsn-position-bottom').removeClass('wpsn-position-left')
					.addClass('wpsn-position-top').css({ 'top': (note.docked && !options.undock ? (dockedSize - note.height) : 0), 'height': note.height });
			}

			if (note.dockable || note.docked) {
				_div_wrap.unbind('mouseenter.wpsn-docked').bind('mouseenter.wpsn-docked', function () {
					let $this = $(this);
					clearTimeout($this.data('delayClose'));
					let delayOpen = setTimeout(function () {
						if (!$this.data('dockToggle')) {
							$this.data('dockToggle', true);
							if (!wpsn.isCurrentlyEditedNote(note)) {
								$this.animate(note.position == 'top' ? { top: 0 } : note.position == 'right' ? { right: 0 } : note.position == 'bottom' ? { bottom: 0 } : note.position == 'left' ? { left: 0 } : {}, 200, function () {
									$(this).removeData('dockToggle');
								});
							}
						}
					}, 500);
					$this.data('delayOpen', delayOpen);
				}).unbind('mouseleave.wpsn-docked').bind('mouseleave.wpsn-docked', function () {
					let $this = $(this);
					clearTimeout($this.data('delayOpen'));
					let delayClose = setTimeout(function () {
						if (!$this.data('dockToggle')) {
							$this.data('dockToggle', true);
							let width = note.fullscreen ? note.width : note.width;
							let height = note.fullscreen ? note.height : note.height;
							if (!wpsn.isCurrentlyEditedNote(note)) {
								$this.animate(note.position == 'top' ? { top: (dockedSize - height) } : note.position == 'right' ? { right: (dockedSize - width) } : note.position == 'bottom' ? { bottom: (dockedSize - height) } : note.position == 'left' ? { left: (dockedSize - width) } : {}, 200, function () {
									$(this).removeData('dockToggle');
								});
							}
						}
					}, 500);
					$this.data('delayClose', delayClose);
				}).unbind('mousedown.wpsn-docked').bind('mousedown.wpsn-docked', function () {
					$(this).data('dockToggle', true);
				}).unbind('mouseup.wpsn-docked').bind('mouseup.wpsn-docked', function () {
					$(this).removeData('dockToggle');
				});
			}
			_div_wrap.removeClass('wpsn-draggable');
			try {
				//_div_wrap.resizable('disable');
				_div_wrap.draggable('disable');
			} catch (err) { wpsn.error(err); }
			//$('.wpsn-frame',_div_wrap).unbind('dblclick');

		}

		if (note.class) {
			_div_wrap.removeClass(note.class).addClass(note.class);
		}

		wpsn.updateNote(note);
		if (note && !note.isPopup && !note.deleted) {
			wpsn.setupDrop(note);
		}

		if (!note.nextInterval) {
			wpsn.fetchData(note);
			wpsn.fetchNote(note);
		}
		else { delete note.nextInterval; }

		wpsn.updateTabWithTextAndFaviconColorOrImage(note.documentTitle, note.documentFavicon)
		
		return note;
	};

	wpsn.fetchData = async function (note) {
		if (note && note.fetchData) {
			let fetch = note.fetchData;
			if (!(fetch instanceof Array)) {
				fetch = [fetch];
			}
			for (let i = 0; i < fetch.length; i++) {
				if (fetch[i].url) {
					await wpsn.fetch(note, fetch[i].url, fetch[i].interval, fetch[i].script, 'data');
				}
			}
		}
	};

	wpsn.fetchNote = function (note) {
		if (note && note.fetchNote && note.fetchNote.url) {
			wpsn.fetch(note, note.fetchNote.url, note.fetchNote.interval, note.fetchNote.script, 'note');
		}
	};

	wpsn.absoluteUrl = function(url) {
		var link = document.createElement("a");
    	link.href = url;
    	return link.href;
	};

	wpsn.fetch = async function (note, url, interval, script, fetchWhat) {
		let func = async function () {

			let data = await wpsn.getUrlData(wpsn.absoluteUrl(url), interval);
			if (fetchWhat == 'note') {
				let tnote;
				try {
					tnote = JSON.parse(data);
				}
				catch (err) {
					tnote = JSON.parse($('.blob-wrapper.data tbody', data).text());
				}
				if (tnote instanceof Array) {
					tnote = tnote[0];
				}
				Object.assign(note, tnote, {
					nextInterval: true,
					id: note.id,
					fetch: note.fetch,
					pos_x: note.pos_x,
					pos_y: note.pos_y,
					width: note.width,
					height: note.height,
					scope: note.scope,
					background: note.background,
					textcolor: note.textcolor,
					bordercolor: note.bordercolor,
					font: note.font,
					position: note.position,
					angle: note.angle,
					zoom: note.zoom,
					zIndex: note.zIndex,
					fullscreen: note.fullscreen,
					minimized: note.minimized,
					lock: note.lock,
					lockMode: note.lockMode
				});
				wpsn.reRenderNote(note);
			} else {
				window[url] = data;
				if (window[url + '_callback']) {
					window[url + '_callback'](data);
				}
				if (script) {
					let wpsn_callback;
					let $note = wpsn.getNoteDiv(note).find('.wpsn-frame');
					eval('wpsn_callback = async function(data, note, $note, document){' + script + '}');
					await wpsn_callback(data, note, $note, document);
				}
			}
		};
		clearInterval(window[url + '_interval']);
		await func();

		if (interval && parseInt(interval) > 0) {
			window[url + '_interval'] = setInterval(func, parseInt(interval) * 1000);
		}
	};

	wpsn.colorPicker = function($input) {
		$input.colorPicker();
	}

	wpsn.mediaFilterPrompt = async function (note) {
		{
			$('.wpsn-media-filter-prompt').remove();
			let filters = wpsn.filters;
			let transforms = wpsn.transforms;
			let tracers = wpsn.tracers;
			let filtersTransformsInit = {};
			let promptHTML = '<table><tbody><tr><td style="vertical-align:top;border:0"><div class="panel panel-default"><div class="panel-heading">Media Filter:</div><div class="panel-body" style="height:455px"><table width="100%">';
			for (let filter in filters) {
				let options = '';
				for (let i = (filters[filter].min || 0); i <= filters[filter].max; i = i + ((filters[filter].max - (filters[filter].min || 0)) / filters[filter].division)) {
					options += '<option>' + i + '</option>';
				}
				promptHTML += '<tr><td>' + filter + '</td><td><input type="range" style="width:150px;" name="wpsn_' + filter + '" min="' + (filters[filter].min || 0) + '" max="' + filters[filter].max + '" step="' + (filters[filter].step || 1) + '" data-filter="' + filter + '" data-display="wpsn-' + filter + '" class="wpsn-filter" value="' + filters[filter].value + '" ' + (filters[filter].division ? 'list="wpsn-' + filter + '-list"' : '') + '>' + (filters[filter].division ? '<datalist id="wpsn-' + filter + '-list">' + options + '</datalist>' : '') + '</input></td><td><span class="wpsn-' + filter + '" style="padding-left:5px;">' + filters[filter].value + filters[filter].unit + '</span></td></tr>';

				filtersTransformsInit['wpsn_' + filter] = note.mediaFilter ? note.mediaFilter[filter] || filters[filter].value : filters[filter].value;
			}
			promptHTML += '</table></div></div></td>';
			promptHTML += '<td style="vertical-align:top;border:0"><div class="panel panel-default"><div class="panel-heading">Media Transform:</div><div class="panel-body" style="height:455px"><table width="100%">';
			for (let transform in transforms) {
				let options = '';
				for (let i = (transforms[transform].min || 0); i <= transforms[transform].max; i = i + ((transforms[transform].max - (transforms[transform].min || 0)) / transforms[transform].division)) {
					options += '<option>' + i + '</option>';
				}
				promptHTML += '<tr><td>' + transform + '</td><td><input type="range" style="width:150px;" name="wpsn_' + transform + '" min="' + (transforms[transform].min || 0) + '" max="' + transforms[transform].max + '" step="' + (transforms[transform].step || 1) + '" data-transform="' + transform + '" data-display="wpsn-' + transform + '" class="wpsn-transform" value="' + transforms[transform].value + '" ' + (transforms[transform].division ? 'list="wpsn-' + transform + '-list"' : '') + '>' + (transforms[transform].division ? '<datalist id="wpsn-' + transform + '-list">' + options + '</datalist>' : '') + '</input></td><td><span class="wpsn-' + transform + '" style="padding-left:5px;">' + transforms[transform].value + transforms[transform].unit + '</span></td></tr>';

				filtersTransformsInit['wpsn_' + transform] = note.mediaTransform ? note.mediaTransform[transform] || transforms[transform].value : transforms[transform].value;
			}
			promptHTML += '</table></div></div></td>';
			promptHTML += '</tr><tr>';

			filtersTransformsInit['wpsn_media_tracer_enabled'] = note.mediaTracer ? note.mediaTracer.enabled ? 'true' : 'false' : 'false';
			promptHTML += '<td style="vertical-align:top;border:0" class="wpsn-media-tracer-td"><div class="panel panel-default"><div class="panel-heading">Convert To SVG <input type="checkbox" name="wpsn_media_tracer_enabled" class="wpsn_media_tracer_enabled" value="true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/>:</div><div class="panel-body" style="height:496px"><table width="100%">';
			for (let tracer in tracers) {
				let options = '';
				for (let i = (tracers[tracer].min || 0); i <= tracers[tracer].max; i = i + ((tracers[tracer].max - (tracers[tracer].min || 0)) / tracers[tracer].division)) {
					options += '<option>' + i + '</option>';
				}
				promptHTML += '<tr><td>' + tracer + '</td><td><input type="range" style="width:150px;" name="wpsn_' + tracer + '" min="' + (tracers[tracer].min || 0) + '" max="' + tracers[tracer].max + '" step="' + (tracers[tracer].step || 1) + '" data-tracer="' + tracer + '" data-display="wpsn-' + tracer + '" class="wpsn-tracer" value="' + tracers[tracer].value + '" ' + (tracers[tracer].division ? 'list="wpsn-' + tracer + '-list"' : '') + '>' + (tracers[tracer].division ? '<datalist id="wpsn-' + tracer + '-list">' + options + '</datalist>' : '') + '</input></td><td><span class="wpsn-' + tracer + '" style="padding-left:5px;">' + tracers[tracer].value + tracers[tracer].unit + '</span></td></tr>';

				filtersTransformsInit['wpsn_' + tracer] = note.mediaTracer ? note.mediaTracer[tracer] || tracers[tracer].value : tracers[tracer].value;
			}
			promptHTML += '</table></div></div></td>';

			filtersTransformsInit['wpsn_transparency_color'] = note.colorToTransparent ? note.colorToTransparent.color || '#ffffff' : '#ffffff';
			filtersTransformsInit['wpsn_transparency_threshold'] = note.colorToTransparent ? note.colorToTransparent.threshold || 0 : 0;
			promptHTML += '<td style="vertical-align:top;border:0" class="wpsn-color-to-transparent-td"><div class="panel panel-default"><div class="panel-heading">Media Color to Transparent:</div><div class="panel-body" style="height:500px"><table width="100%">';
			promptHTML += '<input type="text" name="wpsn_transparency_color" class="wpsn_transparency_color" value="' + filtersTransformsInit['wpsn_transparency_color'] + '"/><br/><br/>Threshold:<br/><input type="range" style="width:100%;" name="wpsn_transparency_threshold" class="wpsn_transparency_threshold" min="0" max="255" step="5" value="' + filtersTransformsInit['wpsn_transparency_threshold'] + '"><span class="wpsn_transparency_threshold_display"/>';
			promptHTML += '</table></div></div></td>';

			promptHTML += '</tr></tbody></table>';
			promptHTML = '<div>' + promptHTML + '</div>';
			let $noteDiv = wpsn.getNoteDiv(note);
			let originalNote = note;

			let imageAndCanvas = await wpsn.takeScreenshot($(document.body),{canvasWidth:1000});
			let canvas = imageAndCanvas.canvas;

			await wpsn.prompt(
				{
					'maxWidth': 1200, note: { clazz: 'wpsn-media-filter-prompt', discard: true, isPopup: true, htmlMode: true, isNotPopup: true, pos_x: note.pos_x + parseInt(note.width), pos_y: note.pos_y, 'menu': ['removePopup', 'snapshot'] }, load: function () {
						let $media = $('.wpsn-media', $noteDiv);
						$('input.wpsn-filter').bind('change', function () {
							let filterValues = [];
							$('input.wpsn-filter').each(function () {
								let $this = $(this);
								let value = $this.val();
								let name = $this.data('filter');
								let unit = filters[name].unit;
								filterValues.push(name + '(' + value + unit + ')');
								$('span.' + $this.data('display')).text(value + unit);
							});
							$media.css('-webkit-filter', filterValues.join(' '));
						}).change();
						$('input.wpsn-transform').bind('change', function () {
							let transformValues = [];
							$('input.wpsn-transform').each(function () {
								let $this = $(this);
								let value = $this.val();
								let name = $this.data('transform');
								let unit = transforms[name].unit;
								transformValues.push(name + '(' + value + unit + ')');
								$('span.' + $this.data('display')).text(value + unit);
							});
							$media.css('-webkit-transform', transformValues.join(' '));
						}).change();

						let tracerValues = {};
						let transparentOptions = { color: '#ffffff', threshold: 0 };

						let $tracer = $('input.wpsn-tracer').bind('change', function () {
							$('input.wpsn-tracer').each(function () {
								let $this = $(this);
								let value = $this.val();
								let name = $this.data('tracer');
								let unit = tracers[name].unit;
								tracerValues[name] = value + unit;
								$('span.' + $this.data('display')).text(value + unit);
							});
							wpsn.menu.media.renderTransparentAndVectorizer(originalNote, { transparentOptions: transparentOptions, vectorizerOptions: tracerValues });
						});
						
						let $mediaTracerEnabled = $('input.wpsn_media_tracer_enabled');
						$mediaTracerEnabled.bind('change', function () {
							tracerValues.enabled = $(this).prop('checked');
							if ($tracer) {
								$tracer.eq(0).change();
							}
							//$('.wpsn-color-to-transparent-td>div').toggle(!$(this).prop('checked'));
						}).change();
						

					

						$tracer.eq(0).change();

						let $color = $('input.wpsn_transparency_color').bind('change', function () {
							transparentOptions.color = $(this).val();
							wpsn.menu.media.renderTransparentAndVectorizer(originalNote, { transparentOptions: transparentOptions, vectorizerOptions: tracerValues });
						}).data('predefinedColors', '#ffa|#fc9|#fcf|#faa|#aaf|#9cf|#aff|#afa|#eee|#fff');
						wpsn.colorInput($color, canvas);

						$('.alpha.slider').hide();
						let $threshold = $('.wpsn_transparency_threshold').bind('change', function () {
							transparentOptions.threshold = parseInt($(this).val() || 0);
							$('span.wpsn_transparency_threshold_display').text(transparentOptions.threshold);
							wpsn.menu.media.renderTransparentAndVectorizer(originalNote, { transparentOptions: transparentOptions, vectorizerOptions: tracerValues });
						}).change();
						$threshold.each(function () {
							$('span.wpsn_transparency_threshold_display').text($(this).val());
						});

					}
				}, promptHTML,
				filtersTransformsInit,
				function (form, noteId) {
					let note = wpsn.getNote(noteId);
					if (!note.isPopup && !note.deleted) {
						wpsn.saveNoteStateForUndo(note);
					}
					if (form) {
						note.mediaFilter = note.mediaFilter || {};
						for (let filter in filters) {
							note.mediaFilter[filter] = form['wpsn_' + filter];
						}
						note.mediaTransform = note.mediaTransform || {};
						for (let transform in transforms) {
							note.mediaTransform[transform] = form['wpsn_' + transform];
						}
						note.mediaTracer = note.mediaTracer || {};
						for (let tracer in tracers) {
							note.mediaTracer[tracer] = form['wpsn_' + tracer];
						}
					}
					note.mediaTracer.enabled = form['wpsn_media_tracer_enabled'] == 'true';
					note.colorToTransparent = note.colorToTransparent || {};
					note.colorToTransparent.color = form['wpsn_transparency_color'] || '#ffffff';
					note.colorToTransparent.threshold = parseInt(form['wpsn_transparency_threshold']);
					if (!note.colorToTransparent.threshold) {
						delete note.colorToTransparent;
					}
					if (!note.isPopup && !note.deleted) {
						wpsn.refreshNote(note);
					}
				},
				note.id
			);
		}
	};

	wpsn.initRotatable = function (note, opts) {
		let noteDiv = wpsn.getNoteDiv(note);
		try { noteDiv.rotatable('destroy'); } catch (err) { wpsn.error(err,true); }
		let options = $.extend(true, opts, wpsn.rotatableOptions);
		options.angle = note.angle;
		noteDiv.rotatable(options);
	};

	wpsn.initDraggable = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		noteDiv.addClass('wpsn-draggable').draggable({
			cancel: 'a,input,textarea,button,select,option,.wpsn-no-draggable',
			scroll: false,
			snap: '.wpsn-snappable',
			start: function () {

			},
			drag: function (event, ui) {
				let $this = $(this);
				try {
					let snapElements = $this.data('uiDraggable').snapElements;
					for (let i = snapElements.length - 1; i >= 0; i--) {
						if ($(snapElements[i].item).is('.ui-rotatable-handle')) {
							snapElements.splice(i, 1);
						}
					}
				} catch (err) { wpsn.error(err); }
				
				let dt = ui.position.top - $this.offset().top, dl = ui.position.left - $this.offset().left;
				for (let el of wpsn.getSnappedAndSelectedDivs(note, true).get()) {
					// create the variable for we don't need to keep calling $("this")
					// el = current element we are on
					// off = what position was this element at when it was selected, before drag
					let $el = $(el), off = $el.offset();
					$el.css({ top: off.top + dt, left: off.left + dl });
				};
				
				let dragFunction = $(this).data('dragFunction');
				if (dragFunction) { dragFunction(); }
			},
			stop: function (event, ui) {
				wpsn.moveSnappedAndSelectedDivs(note, ui, true);
				wpsn.movedNote(note);
				$('#wpsn-drag-helper').remove();
			}
		});
	};

	wpsn.getSnappedAndSelectedDivs = function(note, notNote) {
		let noteDivs = new Set();
		let selected = wpsn.getSelectedNotes();
		let snapped = wpsn.magnetEnabled ? wpsn.getSnappedNotes(note).all : [];
		let all = [].concat(selected).concat(snapped);
		for (let tnote of all) {
			if (notNote && tnote.id == note.id) { continue; }
			noteDivs.add(wpsn.getNoteDiv(tnote));
		}
		return $(Array.from(noteDivs));
	}

	

	wpsn.moveSnappedAndSelectedDivs = function(note, ui, save) {
		let snapped = wpsn.getSnappedAndSelectedDivs(note, true);
		let notes = wpsn.getNotesFromDivs(snapped);
		if (save) { wpsn.saveNoteStateForUndo(notes.concat(note)); }
		let oldLeft = ui.originalPosition.left;
		let oldTop = ui.originalPosition.top;
		let newLeft = ui.position.left;
		let newTop = ui.position.top;
		
		for (let tnote of notes) {
			let $tnote = wpsn.getNoteDiv(tnote);
			tnote.pos_x = $tnote.position().left;
			tnote.pos_y = $tnote.position().top;
			if (save) { wpsn.refreshNote(tnote); }
		}
	}

	wpsn.initResizable = function (note, opts) {
		let noteDiv = wpsn.getNoteDiv(note);
		try { noteDiv.resizable('destroy'); } catch (err) {wpsn.error(err,true);}
		let options = $.extend(true, opts, wpsn.resizableOptions);
		/*if (wpsn.cropEnabled(note)){
			options.containment = '#note-'+note.id+' .wpsn-media:eq(0)';
		}*/
		options.maintainAspectRatio = options.aspectRatio;
		delete options.aspectRatio;
		options.start = function (e) {
			if (options.maintainAspectRatio && $(e.originalEvent.target).attr('class').match(/\b(ui-resizable-se|ui-resizable-sw|ui-resizable-ne|ui-resizable-nw)\b/)) {
				// Keep aspect ratio when resizing using the corners
				noteDiv.resizable('option', 'aspectRatio', true).data('uiResizable')._aspectRatio = true;
			}
		};
		noteDiv.resizable(options);
		if (!note.isPopup && !note.deleted) {
			//let hasMedia = $('.wpsn-media',noteDiv).size() > 0;
			//noteDiv.resizable($.extend(true,{},wpsn.resizableOptions));
			//noteDiv.resizable("option", "grid", [1, 1]);
			noteDiv.resizable('option', 'handles', 'all');
		}
		if (!note.fullscreen && !wpsn.cropEnabled(note)) {
			$('>.ui-resizable-s,>.ui-resizable-n', noteDiv).dblclick(function (e) {
				e.stopPropagation();
				wpsn.saveNoteStateForUndo(note);
				wpsn.autoResizeHeight(note);
				wpsn.settings.enableAutoresizeHeight?wpsn.autoResizeHeight(note):false;
				let selectedNotes = wpsn.getSelectedNotes();
				for (let i = 0; i < selectedNotes.length; i++) {
					let selectedNote = selectedNotes[i];
					wpsn.autoResizeHeight(selectedNote);
					wpsn.settings.enableAutoresizeHeight?wpsn.autoResizeHeight(selectedNote):false;
				}
			});
			$('>.ui-resizable-e,>.ui-resizable-w', noteDiv).dblclick(function (e) {
				e.stopPropagation();
				wpsn.saveNoteStateForUndo(note);
				wpsn.autoResizeWidth(note);
				wpsn.settings.enableAutoresizeHeight?wpsn.autoResizeHeight(note):false;
				let selectedNotes = wpsn.getSelectedNotes();
				for (let i = 0; i < selectedNotes.length; i++) {
					let selectedNote = selectedNotes[i];
					wpsn.autoResizeWidth(selectedNote);
					wpsn.settings.enableAutoresizeHeight?wpsn.autoResizeHeight(selectedNote):false;
				}
			});
			$('>.ui-resizable-se,>.ui-resizable-ne,>.ui-resizable-sw,>.ui-resizable-nw', noteDiv).dblclick(function (e) {
				e.stopPropagation();
				wpsn.saveNoteStateForUndo(note);
				wpsn.autoResize(note);
				wpsn.settings.enableAutoresizeHeight?wpsn.autoResizeHeight(note):false;
				let selectedNotes = wpsn.getSelectedNotes();
				for (let i = 0; i < selectedNotes.length; i++) {
					let selectedNote = selectedNotes[i];
					wpsn.autoResize(selectedNote);
					wpsn.settings.enableAutoresizeHeight?wpsn.autoResizeHeight(selectedNote):false;
				}
			}).bind('contextmenu', function () {
				wpsn.resizeNote(note);
				return false;
			}).attr('title', 'Double click edges to auto fit the note to the content\n---\nRight Click to resize note');
		}
	};

	wpsn.generateMainMenuArray = function (note) {
		let _main_menu = [];
		let max = (note.fullscreen || wpsn.hashMatchesNote) ? $(window).width() : parseInt((note.width / (wpsn.settings.defaultIconSize||14))) - 1;//-1 due to button zoom overflow defect //2 = removePopup and maximize which shouldn't show on mainMenu
		let activeMenu = wpsn.getModeMenuId(note.mode);
		let mainmenu_customleft = wpsn.mainmenu_left.slice(0);
		let mainmenu_customright = wpsn.mainmenu_right.slice(0);
		let mainmenu_customweigth = wpsn.mainmenu_weight.slice(0);
		if (activeMenu) {
			let index = mainmenu_customweigth.indexOf(activeMenu);
			if (index > -1) { mainmenu_customweigth.splice(index, 1); }
			if (wpsn.mainmenu_left.indexOf(activeMenu) > -1 && mainmenu_customleft.indexOf(activeMenu) == -1) {
				mainmenu_customleft.push(activeMenu);
			}
			if (wpsn.mainmenu_right.indexOf(activeMenu) > -1 && mainmenu_customright.indexOf(activeMenu) == -1) {
				mainmenu_customright.push(activeMenu);
			}
			mainmenu_customweigth.splice(4, 0, activeMenu);
		}
		for (let i = 0; i < mainmenu_customleft.length; i++) {
			let _menuProperty = mainmenu_customleft[i];
			if (wpsn.menu[_menuProperty].exclude && (wpsn.menu[_menuProperty].exclude === true || wpsn.menu[_menuProperty].exclude() === true)) { continue; }
			if ($.inArray(_menuProperty, mainmenu_customweigth.slice(0, max + 1)) < 0) { continue; }
			if ($.inArray(_menuProperty, _main_menu) >= 0) { continue; }
			_main_menu.push(_menuProperty);
		}
		for (let _menuProperty in wpsn.menu) {
			if (wpsn.menu[_menuProperty].exclude && (wpsn.menu[_menuProperty].exclude === true || wpsn.menu[_menuProperty].exclude() === true)) { continue; }
			if ($.inArray(_menuProperty, mainmenu_customleft) >= 0) { continue; }
			if ($.inArray(_menuProperty, mainmenu_customright) >= 0) { continue; }
			if (_main_menu.length + mainmenu_customright.length >= max) { continue; }
			if ($.inArray(_menuProperty, _main_menu) >= 0) { continue; }
			_main_menu.push(_menuProperty);
		}
		for (let i = 0; i < mainmenu_customright.length; i++) {
			let _menuProperty = mainmenu_customright[i];
			if (wpsn.menu[_menuProperty].exclude && (wpsn.menu[_menuProperty].exclude === true || wpsn.menu[_menuProperty].exclude() === true)) { continue; }
			if ($.inArray(_menuProperty, mainmenu_customweigth.slice(0, max + 1)) < 0) { continue; }
			if ($.inArray(_menuProperty, _main_menu) >= 0) { continue; }
			_main_menu.push(_menuProperty);
		}
		if (_main_menu.length == 1) {
			_main_menu.push(mainmenu_customweigth[1]);
		}
		return _main_menu;
	};
	wpsn.menuSize = function () {
		let count = 0;
		for (let _menuProperty in wpsn.menu) {
			if (wpsn.menuEnabled(_menuProperty)) {
				count++;
			}
		}
		return count;
	};

	wpsn.menuEnabled = function(_menuProperty) {
		let _menu = wpsn.menu[_menuProperty];
		let menuSettings = (wpsn.settings ? wpsn.settings.menu : {}) || {};
		let _menuItemSettings = menuSettings[_menuProperty] || {};
		return !(!_menu || ((typeof wpsn.menu[_menuProperty].exclude == 'function' && wpsn.menu[_menuProperty].exclude()) || wpsn.menu[_menuProperty].exclude) || (!_menu.required && (_menuItemSettings.enabled == false || (_menu.optional && !_menuItemSettings.enabled))));
	};

	wpsn.generateMainMenu = function (note, $div_wrap) {
		$div_wrap = $div_wrap || wpsn.getNoteDiv(note);
		$('>.wpsn-menu', $div_wrap).remove();
		let _main_menu = note.menu || wpsn.generateMainMenuArray(note);
		let allItemsFit = wpsn.menuSize() - _main_menu.length <= 0;
		let menuSettings = (wpsn.settings ? wpsn.settings.menu : {}) || {};
		for (let a = _main_menu.length - 1; a >= 0; a--) {
			let _menuProperty = _main_menu[a];
			let _menu = wpsn.menu[_menuProperty];
			let _menuItemSettings = menuSettings[_menuProperty] || {};
			if (!wpsn.menuEnabled(_menuProperty)) { continue; }
			if (_menu.extension) {
				let menuExtensionInStorage = false;
				try {
					menuExtensionInStorage = window.sessionStorage[_menu.extension];
				} catch(err) {
					console.log(err);
				}
				if (menuExtensionInStorage) {
					//delete window.sessionStorage[_menu.extension];
					//delete _menu.extension;
				} else {
					continue;
				}
			}
			let _menuDivs = wpsn.generateMenuDiv(_menu, note, $div_wrap);
			let $menuBar = $('.wpsn-note', $div_wrap);
			for (let i = 0; i < _menuDivs.length; i++) {
				if (allItemsFit && _menuProperty == 'more') { continue; }
				if ((!note.isPopup && !note.deleted && _menuProperty != 'removePopup') ||
					(note.isPopup && (_menuProperty == 'removePopup' || _menuProperty == 'snapshot' || (note.menu && $.inArray(_menuProperty, note.menu) >= 0)))) {
					let $menuItem = $(_menuDivs[i]).css('visibility', 'hidden');
					$menuBar.after($menuItem);
					if (note.minimized && _menuProperty == 'maximize') { $menuItem.css('visibility', 'visible'); }
				}
			}
			if (_menu.submenu) {
				let $submenuUL = $('<ul/>').addClass('wpsn-submenu').addClass('wpsn-submenu-' + _menuProperty).css('top',(wpsn.settings.defaultIconSize||14)).css('width',(wpsn.settings.defaultIconSize||14));
				for (let _submenuProperty in _menu.submenu) {
					let _submenu = _menu.submenu[_submenuProperty];
					let _submenuDivs = wpsn.generateMenuDiv(_submenu, note, $div_wrap);
					for (let i = 0; i < _submenuDivs.length; i++) {
						let $submenuLI = $('<li/>').addClass('wpsn-submenu-' + _menuProperty + '-' + _submenuProperty).append(_submenuDivs[i]);
						$submenuUL.append($submenuLI);
					}
				}
				$div_wrap.find('.wpsn-submenu-' + _menuProperty).remove();
				$menuBar.after($submenuUL);
			}
		}
	};

	wpsn.selectElement = function($element) {
		let selected = $element.hasClass('wpsn-selected');
		$element.removeClass('wpsn-selected').addClass('wpsn-selected');
		if (!selected) {
			wpsn.zIndex($element, 4);
		}
	};

	wpsn.deselectElement = function($element) {
		let selected = $element.hasClass('wpsn-selected');
		$element.removeClass('wpsn-selected');
		if (selected) {
			wpsn.zIndex($element, -4);
		}
	};

	wpsn.zIndex = function (divWrap, difference, menuOnly, dontHideMenu) {
		if (divWrap) {
			if (!menuOnly) {
				divWrap.css('z-index', parseInt(divWrap.css('z-index')) + difference);
			}
			$('>.wpsn-submenu', divWrap).each(function () {
				$(this).css('z-index', parseInt($(this).css('z-index')) + difference);
			});
			$('>.wpsn-menu', divWrap).each(function () {
				$(this).css('z-index', parseInt($(this).css('z-index')) + difference);
				$(this).css('visibility', !dontHideMenu && difference < 0 ? 'hidden' : 'visible');
			});
		}
	};

	wpsn.freezeNote = function (note) {
		let _div_wrap = wpsn.getNoteDiv(note).removeClass('wpsn-draggable');
		try {
			_div_wrap.resizable('disable');
			_div_wrap.draggable('disable');
		} catch (err) { wpsn.error(err, true); }
	};

	wpsn.freezeParentNotes = function (note) {
		let _div_wrap = wpsn.getNoteDiv(note);
		_div_wrap.parents('.wpsn-sticky').each(function () {
			let sticky = $(this);
			let draggable = !sticky.is('.ui-draggable-disabled');
			sticky.data('wpsn-draggable', draggable);
			sticky.draggable('disable');
		});
	};

	wpsn.unfreezeNote = function (note) {
		let _div_wrap = wpsn.getNoteDiv(note).addClass('wpsn-draggable');
		try {
			_div_wrap.resizable('enable');
			_div_wrap.draggable('enable');
		} catch (err) { wpsn.error(err); }
	};

	wpsn.unfreezeParentNotes = function (note) {
		let _div_wrap = wpsn.getNoteDiv(note);
		_div_wrap.parents('.wpsn-sticky').each(function () {
			let sticky = $(this);
			let draggable = sticky.data('wpsn-draggable');
			sticky.removeData('wpsn-draggable');
			if (draggable) {
				sticky.draggable('enable');
			}
		});
	};

	wpsn.serializeFormJSON = function (form) {
		let o = {};
		let a = form.serializeArray();
		$.each(a, function () {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	wpsn.alert = function (props, html) {
		props = props || {};
		props.isAlert = true;
		props.hideCancelButton = true;
		return wpsn.popup(props, html);
	};

	wpsn.confirm = function (props, html) {
		return wpsn.popup(props, html);
	};

	wpsn.simplePrompt = function (object, promptProperties) {
		return wpsn.prompt(
			promptProperties.popup,
			promptProperties.form ? promptProperties.form() : '',
			object,
			function (form) {
				if (form) {
					/*for (let field in form) {
						object[field] = wpsn.htmlEncode(form[field]);
					}*/
					if (promptProperties.callback) {
						//promptProperties.callback(object);
						promptProperties.callback(form);
					}
				}
			},
			object
		);
	};

	wpsn.pluginPrompt = function (note, promptProperties) {
		promptProperties.popup = promptProperties.popup || {};
		promptProperties.popup.currentNote = note;
		if (promptProperties.mode) {
			wpsn.prompt(
				promptProperties.popup,
				promptProperties.form ? promptProperties.form(note) : '',
				note.mode ? note[note.mode] : {},
				function (form, noteId) {
					if (form) {
						let note = wpsn.getNote(noteId);
						wpsn.saveNoteStateForUndo(note);
						note.mode = promptProperties.mode;
						note[note.mode] = note[note.mode] || {};
						for (let field in form) {
							note[note.mode][field] = wpsn.htmlEncode(form[field]);
						}
						//for checkbox
						for (let field in note[note.mode]) {
							note[note.mode][field] = wpsn.htmlEncode(form[field]);
						}
						if (promptProperties.store) {
							promptProperties.store(note[note.mode]);
						}
						if (promptProperties.callback) {
							promptProperties.callback(note);
						}
						wpsn.save(note);
						if (promptProperties.refresh) {
							wpsn.reRenderNote(note);
						} else {
							wpsn.renderText(note);
							if (!promptProperties.autoResize) {
								wpsn.autoResize(note);
							} else if (promptProperties.autoResize == 'width') {
								wpsn.autoResizeWidth(note);
							} else if (promptProperties.autoResize == 'height') {
								wpsn.autoResizeHeight(note);
							}
						}
					}
				},
				note.id
			);
		} else {
			wpsn.error('No mode was specified in prompt properties');
		}
	};

	wpsn.prompt = function (props, html, defaultInputJSON, func, funcVariablesJSON) {
		let variables = {};
		variables.func = func;
		variables.funcVariables = funcVariablesJSON;

		return wpsn.popup(props, html, defaultInputJSON, async function (form, variables) {
			if (!variables) { variables = {}; }
			if (variables.func) {
				let formParam = form;
				await variables.func(formParam, variables.funcVariables);
			}
		}, variables);
	};

	wpsn.promptWithTextInput = async function (props, html, defaultInput) {
		html += '<br/><div><input type="text" name="wpsn_prompt" class="wpsn-prompt" style="display:block"/></div><br/>';
		let defaultInputJSON = { 'wpsn_prompt': defaultInput };
		let form = await wpsn.prompt(props, html, defaultInputJSON);
		return form.wpsn_prompt;
	};

	wpsn.promptWithTextarea = async function (props, html, defaultInput) {
		let prompt = $('<textarea spellcheck="false"/>').attr('name', 'wpsn_prompt').addClass('wpsn-prompt');
		html += '<br/>' + $('<div/>').append(prompt).html() + '<br/>';
		let defaultInputJSON = { 'wpsn_prompt': defaultInput };
		let form = await wpsn.prompt(props, html, defaultInputJSON);
		return form.wpsn_prompt;
	};

	wpsn.popup = function (props, html, defaultInput, func, funcVariablesJSON) {
		return new Promise(async function (resolve, reject) {
			props = props || {};
			let hideCancelButton = props.hideCancelButton;
			let hideOkButton = props.hideOkButton;
			let clazz = props.class;

			let note = {
				isPopup: true,
				htmlMode: true,
				order: 10000
			};
			if (props.note) {
				note = $.extend(true, note, props.note);
			}
			let centerNote = !note.pos_x && !note.pos_y;
			//note.height = '100%';
			let form = $(
				`<form class="wpsn_form" style="display:block;min-width:250px" autocomplete="on">
				${html}
				<div class="wpsn-popup-buttons">
				<input type="submit" name="ok" class="btn btn-success wpsn-ok" value="OK" style="position:relative;float:right"/>
				<input type="button" name="cancel" class="btn btn-danger wpsn-cancel" value="Cancel" style="position:relative;float:right;margin-right:5px;"/>
				</div>
				</form>`
			).submit(async function (event) {
				let $this = $(this);
				if ($this.data('submit')) {
					$this.data('submit')(event);
				}
				event.preventDefault();
				let formJSON = wpsn.serializeFormJSON($(this));
				let promise;
				if (func) {
					if (!funcVariablesJSON) {
						promise = func(formJSON);
					} else if (!formJSON || $.isEmptyObject(formJSON)) {
						promise = func(funcVariablesJSON);
					} else {
						promise = func(formJSON, funcVariablesJSON);
					}
				}
				let note = wpsn.getNoteFromDiv($(this).closest('.wpsn-sticky'));

				await wpsn.deleteNote(note);
				if (promise && promise.then) {
					promise.then(function () { resolve(formJSON); });
				} else {
					resolve();
				}
			});
			let $cancel = $('.wpsn-cancel', form).off('click').on('click', function () {
				let note = wpsn.getNoteFromDiv($(this).closest('.wpsn-sticky'));
				wpsn.deleteNote(note);
				reject();
			});
			let $ok = $('.wpsn-ok', form)
			if (hideCancelButton) { $cancel.hide(); }
			if (hideOkButton) { $ok.hide(); }
			if (props.onloadCallback) {
				props.onloadCallback(form, props.currentNote);
			}
			for (let key in defaultInput) {
				$('[name=' + key + ']', form).each(function () {
					let $this = $(this);
					if ($this.prop('type') == 'radio' || $(this).prop('type') == 'checkbox') {
						if ($this.attr('value') == defaultInput[key]) {
							$this.prop('checked', 'checked');
						}
					} else {
						$this.val(defaultInput[key]);
					}
				});
			}
			if (props.note) {
				note = props.note;
			}
			props.maxWidth = props.maxWidth || $(window).width();
			props.maxHeight = props.maxHeight || $(window).height();

			for (let prop in props) {
				if (prop == 'note') { continue; }
				note[prop] = props[prop] ? props[prop] : note[prop];
			}
			note.jqText = form;
			note.isAlert = props.isAlert;
			if (props.note && note.id) {
				await wpsn.renderNote(note);
			} else {
				await wpsn.createNote(note);
			}
			let noteDiv = wpsn.getNoteDiv(note);
			$('.wpsn-frame', noteDiv).unbind('dblclick');


			let firstInput = $('input, textarea, select', noteDiv).eq(0);
			if (firstInput) {
				firstInput.focus();
				if (!firstInput.is('textarea')) {
					firstInput.keyup(function (e) {
						let code = (e.keyCode ? e.keyCode : e.which);
						if (code == 13) { //Enter keycode
							let $active = $(document.activeElement);
							if (!$active.is('textarea')) {
								let $download = $('.wpsn-download');
								if ($download.size() > 0) {
									$download.click();
								} else {
									$('.wpsn-ok').click();
								}
							}
						}
						if (code == 27) { //ESC keycode
							$('.wpsn-cancel').click();
						}
					});
				}
			}
			if (props.load) {
				props.load(note);
			}

			setTimeout(function () {//Ugly, this should be on new DOM fully loaded event instead
				if (!props.fullscreen) {
					if (!props.width) { wpsn.autoResizeWidth(note); }
					if (!props.height) { wpsn.autoResizeHeight(note); }
					if (centerNote) {
						wpsn.centerNote(note);
					}
				}
				$('.wpsn-popup-buttons', noteDiv).followTo();
			}, 0);

		});
	};

	wpsn.topLeftNote = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);

		noteDiv.css('position', 'fixed');
		noteDiv.css('top', 0);
		noteDiv.css('left', 0);

		return note;
	};

	wpsn.topNote = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);

		noteDiv.css('position', 'fixed');
		noteDiv.css('top', 0);

		return note;
	};

	wpsn.centerNote = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let popupContainer = noteDiv.parents('#wpsn-popup-container');
		if (popupContainer.size() > 0) {
			note.pos_x = Math.max(0, ((popupContainer.width()) / 2) - noteDiv.width() / 2);
			note.pos_y = Math.max(0, ((popupContainer.height()) / 2) - noteDiv.height() / 2);
		} else {
			note.pos_x = Math.max(0, $(window).scrollLeft() + window.innerWidth / 2 - note.width / 2);
			note.pos_y = Math.max(0, $(window).scrollTop() + window.innerHeight / 2 - note.height / 2);
		}

		noteDiv.css('top', note.pos_y);
		noteDiv.css('left', note.pos_x);

		return note;
	};

	wpsn.updateNote = function (note) {
		let _div_wrap = $('#note-' + note.id);
		let _div_link = _div_wrap.find('>.wpsn-link');

		let _link = location.href;
		if (_link.indexOf('#') > -1) {
			_link = _link.split('#')[0];
		}
		_link += '#' + escape('[' + JSON.stringify(note) + ']');
		_div_link.attr('href', _link);

		return note;
	};

	wpsn.movedNote = function (note) {
		wpsn.saveNoteStateForUndo(note);
		let notes = [note];
		if (wpsn.enableSelection) {
			$('.wpsn-draggable.wpsn-selected').each(function () {
				let $this = $(this).removeData('wpsn-offset');
				let _note = wpsn.getNoteFromDiv($this);
				notes.push(_note);
			});
		}
		for (let i = 0; i < notes.length; i++) {
			let _note = notes[i];
			wpsn.saveNoteStateForUndo(_note);
			let oldPosX = _note.pos_x;
			let oldPosY = _note.pos_y;
			let _noteDiv = wpsn.getNoteDiv(_note);
			if (_note.angle) {
				_noteDiv.css('transform','rotate(0rad)');
			}
			_note.pos_x = _noteDiv.position().left;
			_note.pos_y = _noteDiv.position().top;
			if (_note.angle) {
				_noteDiv.css('transform','rotate('+_note.angle+'rad)');
			}
			if (wpsn.isMultiPosition(_note)) {
				wpsn.setScopedProp(_note,'pos_x',_note.pos_x);
				wpsn.setScopedProp(_note,'pos_y',_note.pos_y);
			}
			if (wpsn.options.moveCallback) {
				wpsn.options.moveCallback(_note);
			}
			wpsn.save(_note);
		}

		return note;
	};

	wpsn.resizeSVG = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let svg = $('.wpsn-frame svg', noteDiv).get(0);
		if (svg) {
			let bbox = svg.getBBox();

			svg.setAttribute('viewBox', (bbox.x - 10) + ' ' + (bbox.y - 10) + ' ' + (bbox.width + 20) + ' ' + (bbox.height + 20));
			svg.setAttribute('width', (bbox.width + 20) + 'px');
			svg.setAttribute('height', (bbox.height + 20) + 'px');
		}
	};

	wpsn.updateCount = function () {
		chrome.extension.sendMessage(wpsn.getNoteCountProps());
	};

	wpsn.reset = function () {
		window.sessionStorage.clear();
	};

	wpsn.htmlEncode = function (value) {
		let values = [];
		if (value && value.constructor === Array) {
			values = [].concat(value);
		} else if (value) {
			values.push(value);
		}
		for (let i = 0; i < values.length; i++) {
			values[i] = $('<div/>').text(values[i]).html();
		}
		return values.length > 1 ? values : values.length == 1 ? values[0] : '';
	};

	wpsn.htmlDecode = function (value) {
		return $('<div/>').html(value).text();
	};

	wpsn.removeDuplicates = function (array) {
		let a = array.concat();
		for (let i = 0; i < a.length; ++i) {
			for (let j = i + 1; j < a.length; ++j) {
				if (JSON.stringify(a[i]) === JSON.stringify(a[j]))
					a.splice(j--, 1);
			}
		}

		return a;
	};

	wpsn.defaults = {
		notes: [],
		resizable: true,
		controls: true,
		editCallback: false,
		createCallback: false,
		deleteCallback: false,
		moveCallback: false,
		resizeCallback: function (note) {
			wpsn.resizeSVG(note);
			wpsn.resizeMedia(note);
		}
	};
	wpsn.getSettings = async function() {
		return new Promise(function(resolve){
			chrome.storage.local.get(['wpsn.settings'], function (result) {
				wpsn.settings = result ? ((result['wpsn.settings']) || wpsn.defaultSettings) : wpsn.defaultSettings;
				resolve(wpsn.settings);
			});
		});
	};
	wpsn.saveSettings = function () {
		let settingsToStore = {};
		settingsToStore['wpsn.settings'] = wpsn.settings || wpsn.defaultSettings;
		//storage.sync
		chrome.storage.local.set(settingsToStore);
	};
	wpsn.save = async function (noteOrNotes, props={}) {
		wpsn.settings = wpsn.settings || wpsn.defaultSettings;
		if (!noteOrNotes) {
			noteOrNotes = wpsn.notes;
		}
		let notes = [];
		props = props || {};
		if (noteOrNotes instanceof Array) {
			notes = noteOrNotes;
		} else {
			if (noteOrNotes.isPopup) {
				return;
			}
			notes.push(noteOrNotes);
		}
		let notesToStore = {};
		notes = wpsn.removeNonNotes(notes);
		for (let i = 0; i < notes.length; i++) {
			let note = notes[i];
			if (!note || note.isPopup || note.discard) { continue; }
			wpsn.updateNote(note);
			if (!props.unmodified) {
				note.modified_date = new Date().getTime();
			}
			if (wpsn.inScope(note)) {
				let persistedNote = wpsn.getNote(note.id);
				if (persistedNote == null) {
					await wpsn.renderNote(note);
					wpsn.notes.push(note);
					wpsn.allNotes[note.id] = note;
					wpsn.updateCount();
				} else {
					wpsn.updateNoteIndex(note.id, note);
					if (wpsn.getNoteDiv(note).size() == 0) {
						await wpsn.renderNote(note);
					}
				}
			}
			notesToStore['wpsn.note.' + note.id] = note;
		}
		if (props.saveToFileOnly) {
			await wpsn.saveToFile(notesToStore);
			wpsn.updateCount();
		} else if (props.saveToBrowserOnly) {
			await wpsn.saveToStorage(notesToStore);
			wpsn.updateCount();
		} else {
			await wpsn.saveToAll(notesToStore);
			wpsn.updateCount();
		}
		if (wpsn.settings.enableSynchronization && !props.noAutoSynchronize) {
			chrome.extension.sendMessage({
				'synchronize': true,
				'fetch' : true,
				'autosynchronize' : true
			});
		}
	};

	wpsn.loadJSCSSFile = function (filename, filetype) {
		let fileref;
		if (filetype == 'js') { //if filename is a external JavaScript file
			fileref = document.createElement('script');
			fileref.setAttribute('type', 'text/javascript');
			fileref.setAttribute('src', filename);
		}
		else if (filetype == 'css') { //if filename is an external CSS file
			fileref = document.createElement('link');
			fileref.setAttribute('rel', 'stylesheet');
			fileref.setAttribute('type', 'text/css');
			fileref.setAttribute('href', filename);
		}
		if (typeof fileref != 'undefined')
			document.getElementsByTagName('head')[0].appendChild(fileref);
	};
	wpsn.fontSize = function (note) {
		if (note && note.font && note.font.size) {
			let fontSize = note.font.size;
			if (!isNaN(fontSize)) {
				fontSize += 'px';
				return fontSize;
			}
		}
		return null;
	};
	wpsn.updateFont = function (note, element) {
		if (note && note.font && note.font.family) {
			element.css('font-family', note.font.family);
		} else {
			element.css('font-family', 'inherit');
		}
		if (note && note.font && note.font.size) {
			let fontSize = note.font.size;
			if (!isNaN(fontSize)) {
				fontSize += 'px';
			}
			element.css('font-size', fontSize);
			element.css('line-height', (parseInt(note.font.size) + 9) + 'px');
		} else {
			element.css('font-size', 'inherit');
			element.css('line-height', 'inherit');
		}
	};
	wpsn.loadFont = function (note) {
		if (note && note.font && note.font.family) {
			wpsn.loadFonts([note.font.family]);
		}
	};
	wpsn.loadFonts = function (fontFamilies) {
		wpsn.fonts.families = wpsn.fonts.families || [];
		if (!fontFamilies) {
			for (let n = 0; n < wpsn.notes.length; n++) {
				let note = wpsn.notes[n];
				if (note.font && note.font.family) {
					wpsn.fonts.families.push(note.font.family);
				}
			}
			fontFamilies = wpsn.fonts.families;
		}
		if (fontFamilies && fontFamilies.length > 0) {
			for (let i = 0; i < fontFamilies.length; i++) {
				let fontFamily = fontFamilies[i];
				if (fontFamily && $.inArray(fontFamily, wpsn.defaultFonts) < 0) {
					wpsn.loadJSCSSFile('https://fonts.googleapis.com/css?family=' + fontFamily, 'css');
				}
			}
		}
	};

	wpsn.getHash = function () {
		return location.hash.replace('#', '');
	};
	wpsn.loadHash = async function () {
		try {
			let hash = unescape(wpsn.getHash());
			if (hash.indexOf('[') > -1 && hash.indexOf('{') > -1 && hash.indexOf('"') > -1 && hash.indexOf('id') > -1) {
				let data = JSON.parse(hash);
				await wpsn.confirm({}, '<div class="alert alert-warning">Are you sure you want to import the note(s)?</div>');
				let importedNotes = await wpsn.saveNotes(data);
				let message = '<div class="alert alert-success">The following note(s) have been imported</div>';
				await wpsn.manager.renderManagerNotes(null, importedNotes, message);
			}
		} catch (err) { wpsn.error(err); }
	};

	
	wpsn.load = function () {
		$('.wpsn-sticky').remove();
		return new Promise(async function (resolve) {
			wpsn.notes = [];
			wpsn.allNotes = {};
			await wpsn.loadHash();
			//storage.sync
			wpsn.getSettings().then(function(){
				wpsn.updateNoteboardTab();
				wpsn.loadFromAll().then(function (result) {
					//chrome.storage.local.get(null, function (result) {
					wpsn.resolveStorageContent(result, false).then(function (notes) {
						resolve(notes);
						if (wpsn.installDetails && wpsn.installDetails.reason == 'install' && !wpsn.versionUpdated) {
							wpsn.menu.whatsnew.whatsNew();
						}
						$('body').addClass('wpsn-snappable');
					});
				});
			});
		});
	};

	wpsn.updateNoteboardTab = function() {
		if (wpsn.settings.noteboard_url && location.href.indexOf(wpsn.settings.noteboard_url.replace(/{.*}/g,'')) > -1) {
			document.title = location.hash.replace('#','');
			let link = document.querySelector('link[rel*=\'icon\']') || document.createElement('link');
			link.type = 'image/x-icon';
			link.rel = 'shortcut icon';
			link.href = 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/logo/wpsn-logo.png';
			document.getElementsByTagName('head')[0].appendChild(link);
		}
	};

	wpsn.resolveStorageContent = function (result) {
		return new Promise(function (resolve) {
			if (result) {
				wpsn.previousFormNoteId = result['wpsn-form-note'];
				wpsn.previousFormNoteId = result['wpsn-form-note'];
				wpsn.version = result['wpsn-version'];
				wpsn.versionPrevious = result['wpsn-version-previous'];
				wpsn.versionUpdated = result['wpsn-version-updated'];
				wpsn.installDetails = result['wpsn-install-details'];
				//wpsn.installDetails.reason = 'install';
				if (!wpsn.versionUpdated) {
					try {
						window.sessionStorage.setItem('wpsn.menu.whatsnew', 'true');
					} catch(err) {
						console.log(err);
					}
				}
				//wpsn.removeFromAll('wpsn-form-note');
				//chrome.storage.local.remove('wpsn-form-note');
				let notesById = wpsn.notesById(wpsn.notes, 'wpsn.note.');
				let notes = wpsn.getNotesFromStorageResult(Object.assign({}, result, notesById));
				//chrome.storage.local.clear();
				if (!notes || notes.length == 0) {
					wpsn.cleanStorageResult(result);
					notes = wpsn.getNotesFromStorageResult(Object.assign({}, result, notesById));
				}
				wpsn.notes = wpsn.removeNonNotes(notes);
				for (let i = 0; i < wpsn.notes.length; i++) {
					let note = wpsn.notes[i];
					wpsn.allNotes[note.id] = note;
				}
				wpsn.notes = wpsn.getNotesInScope(wpsn.notes);
				wpsn.reorderNotes();
				wpsn.loadFonts();
				if (wpsn.notes.length > 0) {
					wpsn.loadFonts(['Verdana']);
					if (wpsn.settings && wpsn.settings.font) {
						wpsn.loadFonts([wpsn.settings.font.family]);
					}
				}
				//wpsn.reRenderAllNotes();
				wpsn.renderNotes();
				wpsn.uploadNotes();
			}
			wpsn.updateAffiliateId();
			wpsn.clickOutSetup();
			resolve(wpsn.notes);
		});
	};

	wpsn.uploadNotes = async function () {
		if (location.pathname.endsWith('.wpsn')) {
			try {
				let data;
				try {
					let text = $('body > pre').text();
					try {
						data = JSON.parse(text);
					} catch(err) {
						text = CryptoJS.AES.decrypt(text,chrome.runtime.id).toString(CryptoJS.enc.Utf8);
						data = JSON.parse(text);
					}
				} catch (err) {
					let text = $('.blob-wrapper.data tbody').text();
					try {
						data = JSON.parse(text);
					} catch(err) {
						text = CryptoJS.AES.decrypt(text,chrome.runtime.id).toString(CryptoJS.enc.Utf8);
						data = JSON.parse(text);
					}
				}
				await wpsn.confirm({}, '<div class="alert alert-warning">Are you sure you want to import the note(s)?</div>');
				let importedNotes = await wpsn.saveNotes(data);
				let message = '<div class="alert alert-success">The following note(s) have been imported</div>';
				wpsn.manager.renderManagerNotes(null, importedNotes, message);
			} catch (err) { wpsn.error(err); }
		}
	};

	wpsn.compareNotesByOrder = function (a, b) {
		if (a.order < b.order)
			return -1;
		if (a.order > b.order)
			return 1;
		return 0;
	};

	wpsn.cleanStorageResult = function (result) {
		if (result) {
			result['wpsn.notes'] = result['wpsn.notes'] || [];
			let keysToDelete = [];
			for (let key in result) {
				if (!key || key == 'wpsn.notes' || key == 'wpsn.settings' || key.indexOf('wpsn.note.') == 0 || key.indexOf('wpsn.') != 0) { continue; }
				let value = result[key];
				if (!value || (value instanceof Array && value.length == 0) || (value instanceof Object && value.length == 0)) {
					keysToDelete.push(key);
				}
				if (value instanceof Array) {
					let href = key.substring('wpsn.'.length);
					let isNotes = false;
					for (let i = 0; i < value.length; i++) {
						let note = value[i];
						if (note && note.id && note.background) {
							note.scope = note.scope || wpsn.getScope(href);
							result['wpsn.notes'].push(note);
							isNotes = true;
						}
					}
					if (isNotes) { keysToDelete.push(key); }
				}
			}
			let notesToSave = {};
			for (let i = 0; i < result['wpsn.notes'].length; i++) {
				let note = result['wpsn.notes'][i];
				if (!note) { continue; }
				notesToSave['wpsn.note.' + note.id] = note;
				result['wpsn.note.' + note.id] = note;
			}
			for (let i = 0; i < keysToDelete.length; i++) {
				delete result[keysToDelete[i]];
			}
			delete result['wpsn.notes'];
			wpsn.removeFromAll(keysToDelete);
			//chrome.storage.local.remove(keysToDelete);
			wpsn.saveToAll(notesToSave);
			//chrome.storage.local.set(notesToSave);
		}
	};
	wpsn.getNotesFromStorageResult = function (result) {
		let notes = [];
		if (result) {
			for (let key in result) {
				if (!key || key.indexOf('wpsn.note.') != 0 || !result[key] || !(result[key] instanceof Object)) { continue; }
				notes.push(result[key]);
			}
		}
		return notes;
	};

	wpsn.notesById = function (notesArray, prefix) {
		let notesById = {};
		if (notesArray instanceof Array) {
			for (let note of notesArray) {
				if (note && note.id) {
					notesById[(prefix || '') + note.id] = note;
				}
			}
		} else if (notesArray instanceof Object) {
			if (!notesArray.id) {
				notesById = Object.assign(notesById, notesArray);
			} else {
				let note = notesArray;
				notesById[(prefix || '') + note.id] = note;
			}
		}
		return notesById;
	};

	wpsn.notesByIdFromKeys = function (keysToRemove) {
		let tempKeysToRemove = [];
		if (typeof keysToRemove === 'object') {
			for (let prop in keysToRemove) {
				tempKeysToRemove.push(prop);
			}
		} else if (typeof keysToRemove === 'string') {
			tempKeysToRemove.push(keysToRemove);
		} else {
			tempKeysToRemove = keysToRemove;
		}

		let notesById = {};
		for (let noteKey of tempKeysToRemove) {
			let id = noteKey.replace('wpsn.note.', '');
			notesById[id] = wpsn.allNotes[id];
		}
		return notesById;
	};

	wpsn.noteKeys = function (notesById) {
		let noteKeys = [];
		if (notesById instanceof Object) {
			for (let id in notesById) {
				noteKeys.push('wpsn.note.' + id);
			}
		}
		return noteKeys;
	};

	wpsn.notesArray = function (notesById) {
		let notesArray = [];
		if (notesById instanceof Object) {
			for (let prop in notesById) {
				if (prop && notesById[prop] && notesById[prop].id) {
					notesArray.push(notesById[prop]);
				}
			}
		}
		return notesArray;
	};

	wpsn.resolveConflict = function (oldNotes, newNotes, props = { resolveConflictStrategy: null, inverse: false }) {
		let outNotes = {
			newNotes: [],
			oldNotes: [],
			currentNotes: [],
			sameNotes: []
		};
		let oldNotesById = wpsn.notesById(oldNotes);
		let notesPromise = new Promise(function (resolve) { resolve(); });
		if (!newNotes) { return false; }
		try {
			if (newNotes instanceof Array) {
				wpsn.conflictResolution = props.resolveConflictStrategy;
				wpsn.conflictResolutionApplyAll = (props.resolveConflictStrategy != null);
				for (let i = 0; i < newNotes.length; i++) {
					if (!newNotes[i]) { continue; }
					let newNote = newNotes[i];
					(function (newNote, outNotes) {
						let oldNote = oldNotesById[newNote.id];
						if (oldNote == null) {
							outNotes.newNotes.push(newNote);
						} else if (oldNote.modified_date == newNote.modified_date) {
							outNotes.sameNotes.push(newNote);
						} else if (!props.inverse && oldNote.modified_date <= newNote.modified_date) {
							outNotes.oldNotes.push(oldNote);
							outNotes.newNotes.push(newNote);
						} else if (props.inverse && oldNote.modified_date >= newNote.modified_date) {
							outNotes.oldNotes.push(newNote);
							outNotes.newNotes.push(oldNote);
						} else {
							let promptHTML = '<div class="panel panel-default">' +
								'<div class="alert alert-warning" style="margin-bottom:0px;text-align:center">A note with the same id (' + newNote.id + ') but with different modification date already exists in storage !</div>' +
								'<div class="panel-body">' +
								'<h3>Hover on the links below to preview the two</h3>' +
								'<a class="wpsn_new" style="float:right">New (Last Modified: ' + wpsn.formatDate(new Date(newNote.modified_date)) + ')</a>' +
								'<a class="wpsn_old" style="float:left">Current (Last Modified: ' + wpsn.formatDate(new Date(oldNote.modified_date)) + ')</a><br/>' +
								'<h3>Conflict Resolution</h3>' +
								'<input type="radio" name="wpsn_conflictResolution" id="wpsn_conflictResolution_keep" value="keep" checked="checked" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/><label for="wpsn_conflictResolution_keep"><b>Keep current note & discard new note</b></label>' +
								'<br/><input type="radio" name="wpsn_conflictResolution" id="wpsn_conflictResolution_replace" value="replace" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/><label for="wpsn_conflictResolution_replace"><b>Replace current note with new note</b></label>' +
								'<br/><input type="radio" name="wpsn_conflictResolution" id="wpsn_conflictResolution_duplicate" value="duplicate" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/><label for="wpsn_conflictResolution_duplicate"><b>Keep old note & import new note with new ID</b></label>' +
								'<br/><br/><input type="checkbox" name="wpsn_applyAll" id="wpsn_conflictResolution_applyAll" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/><label for="wpsn_conflictResolution_applyAll"><b>Apply resolution to next conflicts</b></label>' +
								'</div>' +
								'</div><br/>';
							notesPromise = notesPromise.then(function () {
								return new Promise(function (resolve) {
									if (wpsn.conflictResolutionApplyAll) {
										let tNote = wpsn.resolveNoteConflict(newNote, wpsn.conflictResolution);
										if (tNote) {
											outNotes.newNotes.push(tNote);
											let oldNote = oldNotesById[newNote.id];
											if (oldNote) {
												if (oldNote.id != tNote.id) {
													outNotes.currentNotes.push(oldNote);
												} else {
													outNotes.oldNotes.push(oldNote);
												}
											}
										}
										resolve();
										return null;
									} else {
										wpsn.prompt(
											{
												'maxWidth': 1000, load: function () {
													$('.wpsn_old,.wpsn_new')
														.off('click').on('click', function () {
															return false;
														})
														.off('mouseenter').on('mouseenter', function (e) {
															e.preventDefault();
															let noteId = newNote.id;
															let tnote = oldNotesById[noteId];
															if ($(this).is('.wpsn_new')) {
																tnote = newNote;
															}
															wpsn.renderNote(tnote, { disablePosition: e.ctrlKey });
															wpsn.topLeftNote(tnote);
															let $note = $('#note-' + noteId);
															$note.addClass('wpsn-mouseover').off('mouseenter').on('mouseenter', function (e) {
																e.preventDefault();
																if ($(this).is('.wpsn-mouseover')) {
																	$(this).removeClass('wpsn-mouseover').addClass('wpsn-mouseover2');
																}
															}).off('mouseleave').on('mouseleave', function (e) {
																e.preventDefault();
																if ($(this).is('.wpsn-mouseover2')) {
																	$(this).remove();
																}
															});
														}).off('mouseleave').on('mouseleave', function (e) {
															e.preventDefault();
															window.setTimeout(function () {
																let noteId = newNote.id;
																let tnote = oldNotesById[noteId];
																if ($(this).is('.wpsn_new')) {
																	tnote = newNote;
																}
																wpsn.eraseNote(tnote);
															}, 10);
														});
												}
											},
											promptHTML
										).then(function (form) {
											if (form) {
												if (form.wpsn_applyAll) {
													wpsn.conflictResolution = form.wpsn_conflictResolution;
													wpsn.conflictResolutionApplyAll = true;
												}
												let oldId = newNote.id;
												let tNote = wpsn.resolveNoteConflict(newNote, form.wpsn_conflictResolution);
												if (tNote) {
													outNotes.newNotes.push(tNote);
													let oldNote = oldNotesById[oldId];
													if (oldNote) {
														if (oldNote.id != tNote.id) {
															outNotes.currentNotes.push(oldNote);
														} else {
															outNotes.oldNotes.push(oldNote);
														}
													}
												} else {
													outNotes.oldNotes.push(newNote);
													let oldNote = oldNotesById[newNote.id];
													if (oldNote) {
														outNotes.currentNotes.push(oldNote);
													}
												}
											}
											resolve();
										});
									}
								});
							});
						}
					})(newNote, outNotes);
				}
			} else if (oldNotesById[newNotes.id] == null) {
				outNotes.newNotes.push(newNotes);
			}
		} catch (err) { alert('An error occured while evaluating the stateless representation you inputted.\n\n' + err); wpsn.log(newNotes); }
		(function (outNotes) {
			notesPromise = notesPromise.then(function () { return outNotes; });
		})(outNotes);
		return notesPromise;
	};

	wpsn.resolveNoteConflict = function (note, resolution) {
		if (note && resolution) {
			if (resolution == 'replace') {
				return note;
			} else if (resolution == 'duplicate') {
				note.id = Math.floor((Math.random() * 1000000000) + 1);
				return note;
			} else {
				return null;
			}
		}
	};


	wpsn.loadFromAll = function (props = { resolveConflictStrategy: null }) {
		let results = {};
		return new Promise(function (resolve) {
			wpsn.loadFromStorage().then(function (resultsA) {
				results = $.extend({}, results, resultsA);
				resolve(results);
			});
		});
	};

	wpsn.loadFromStorage = function () {
		return new Promise(function (resolve) {
			chrome.storage.local.get(null, function (results) {
				resolve(results);
			});
		});
	};

	wpsn.saveToAll = function (notesToStore) {
		return new Promise(function (resolve) {
			wpsn.saveToStorage(notesToStore).then(function () {
				resolve(notesToStore);
			});
		});
	};

	wpsn.saveToStorage = function (notesToStore) {
		return new Promise(function (resolve) {
			chrome.storage.local.set(notesToStore);
			resolve(notesToStore);
		});
	};

	wpsn.removeFromAll = function (keysToRemove) {
		return new Promise(function (resolve) {
			wpsn.removeFromStorage(keysToRemove).then(function () {
				resolve(keysToRemove);
			});
		});
	};

	wpsn.removeFromStorage = function (keysToRemove) {
		let notesToRemove = wpsn.notesByIdFromKeys(keysToRemove);
		let tempKeysToRemove = wpsn.noteKeys(notesToRemove);
		return new Promise(function (resolve) {
			chrome.storage.local.remove(tempKeysToRemove);
			resolve(notesToRemove);
		});
	};


	wpsn.synchronizeNotes = async function() {
		wpsn.alert({hideCancelButton:true, hideOkButton: true, class: 'wpsn-no-remove'}, 'Synchronizing notes with Google Drive...')
		chrome.extension.sendMessage({
			synchronize:true,
			fetch: true
		});
	};

	wpsn.synchronizeLogout = async function() {
		wpsn.alert({hideCancelButton:true, hideOkButton: true, class: 'wpsn-no-remove'}, 'Disconnecting Google Drive account...')
		chrome.extension.sendMessage({
			synchronize:true,
			logout: true
		});
	};

	wpsn.saveNotes = async function (newNotes) {
		let outNotes = await wpsn.resolveConflict(wpsn.allNotes, newNotes);
		if (outNotes.newNotes instanceof Array) {
			for (let i = 0; i < outNotes.newNotes.length; i++) {
				let note = outNotes.newNotes[i];
				wpsn.saveNewNote(note);
				//TODO chain promises
			}
			return outNotes.newNotes;
		}
	};

	wpsn.saveNewNote = function (note) {
		return new Promise(function (resolve) {
			if (wpsn.inScope(note)) {
				wpsn.renderNote(note);
				wpsn.notes.push(note);
			}
			wpsn.save(note, { unmodified: true });
			wpsn.allNotes[note.id] = note;
			resolve(note);
		});
	};

	wpsn.getZIndex = function (note) {
		if (note.zIndex) { return note.zIndex; }
		let zIndex = wpsn.defaultZIndex;
		if (note.isAlert) {
			zIndex = wpsn.defaultZIndexPopup;
		}
		if (note.lock) {
			zIndex -= 1;
		}
		if (note.minimized) {
			zIndex -= 2;
		}
		return zIndex;
	}

	wpsn.reorderNote = function (note) {
		let index = wpsn.getNoteIndex(note.id);
		let $this = wpsn.getNoteDiv(note);
		if (index == 0 && wpsn.notes.length > 1) {
			let $after = wpsn.getNoteDiv(wpsn.notes[index + 1]);
			$this.insertBefore($after);
		} else if (index > 0) {
			let $before = wpsn.getNoteDiv(wpsn.notes[index - 1]);
			$this.insertAfter($before);
		}
	};

	wpsn.reorderNotes = function () {
		if (!wpsn.notes) { return; }
		wpsn.notes.sort(wpsn.compareNotesByOrder);
		wpsn.notesToSort = {
			all: []
		};
		for (let i = 0; i < wpsn.notes.length; i++) {
			let note = wpsn.notes[i];
			if (!note) { continue; }
			if (!note.isPopup && !note.deleted) {
				if (note.target) {
					wpsn.notesToSort[note.target] = wpsn.notesToSort[note.target] || [];
					wpsn.notesToSort[note.target].push(note);
				}
				wpsn.notesToSort.all.push(note);
			}
		}
		wpsn.notesToSort.sorted = [];
		for (let j = 0; j < wpsn.notesToSort.all.length; j++) {
			let note = wpsn.notesToSort.all[j];
			if (!note) { continue; }
			wpsn.notesToSort.sorted.push(note);
			let childNotes = wpsn.notesToSort['#note-' + note.id];
			if (childNotes) {
				childNotes.sort(wpsn.compareNotesByOrder);
				for (let k = 0; k < childNotes.length; k++) {
					let childNote = childNotes[k];
					if (!childNote) { continue; }
					wpsn.notesToSort.sorted.push(childNote);
				}
			}
		}
		wpsn.notes = wpsn.notesToSort.sorted;
	};

	wpsn.renderNotes = function () {
		let container = $('#wpsn-container');
		if ($('.wpsn-preloadfont', container).size() == 0) { container.append($('<span class="wpsn-preloadfont" style="visibility:hidden">a</span>')); }

		$('.wpsn-sticky:not(.wpsn-no-remove)').remove();
		wpsn.reorderNotes();
		for (let i = 0; i < wpsn.notes.length; i++) {
			let note = wpsn.notes[i];
			if (!note) { continue; }
			if (!note.isPopup && !note.deleted) {
				wpsn.renderNote(note);
			}
		}
		wpsn.updateCount();
	};

	wpsn.getNotesInScope = function (notes, url, parts) {
		wpsn.hashMatchesNote = false;
		if (location.hash && wpsn.notes) {
			let hashValue = location.hash.substring(1);
			let noteIds = hashValue.split(',');
			for (let i = 0; i < noteIds.length; i++) {
				let noteId = noteIds[i];
				for (let j = 0; j < wpsn.notes.length; j++) {
					let note = wpsn.notes[j];
					if (note && note.id == noteId) {
						wpsn.hashMatchesNote = true;
						break;
					}
				}
				if (wpsn.hashMatchesNote) { break; }
			}
		}
		let inScope = [];
		if (notes && notes instanceof Array) {
			for (let i = 0; i < notes.length; i++) {
				let note = notes[i];
				if (!note) { continue; }
				if (wpsn.inScope(note, url, parts)) {
					inScope.push(note);
				}
			}
		}
		return inScope;
	};

	wpsn.getScope = function (href) {
		let scope = {};
		if (!href) {
			scope.protocol = !wpsn.settings.scope || !wpsn.settings.scope.protocol ? undefined : location.protocol;
			scope.hostname = wpsn.settings.scope && !wpsn.settings.scope.hostname ? undefined : location.hostname;
			scope.port = wpsn.settings.scope && !wpsn.settings.scope.port ? undefined : location.port;
			scope.pathname = wpsn.settings.scope && !wpsn.settings.scope.pathname ? undefined : location.pathname;
			scope.search = wpsn.settings.scope && !wpsn.settings.scope.search ? undefined : location.search;
			scope.hash = wpsn.settings.scope && !wpsn.settings.scope.hash ? undefined : location.hash;
			scope.title = !wpsn.settings.scope || !wpsn.settings.scope.title ? undefined : document.title;
		} else {
			let link = document.createElement('a');
			link.setAttribute('href', href);
			scope.protocol = !wpsn.settings.scope || !wpsn.settings.scope.protocol ? undefined : link.protocol;
			scope.hostname = wpsn.settings.scope && !wpsn.settings.scope.hostname ? undefined : link.hostname;
			scope.port = wpsn.settings.scope && !wpsn.settings.scope.port ? undefined : link.port;
			scope.pathname = wpsn.settings.scope && !wpsn.settings.scope.pathname ? undefined : link.pathname;
			scope.search = wpsn.settings.scope && !wpsn.settings.scope.search ? undefined : link.search;
			scope.hash = wpsn.settings.scope && !wpsn.settings.scope.hash ? undefined : link.hash;
			scope.title = !wpsn.settings.scope || !wpsn.settings.scope.title ? undefined : document.title;
		}
		return scope;
	};

	wpsn.regexEscape = function (s) {
		if (typeof s != 'string') { return s; }
		let s_ = s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
		s_ = s_.replace(/\\\*/g, '.*');
		return s_;
	};

	wpsn.inScope = function (note, url, parts) {
		if (!note || note.deleted) { return false; }
		let link = location;
		if (url) {
			link = document.createElement('a');
			link.href = url;
		}
		if (link.hash) {
			let hashValue = location.hash.substring(1);
			let noteIds = hashValue.split(',');
			for (let i = 0; i < noteIds.length; i++) {
				if (note.id == noteIds[i]) {
					return true;
				}
			}
			if (wpsn.hashMatchesNote) {
				return false;
			}
		}
		if (!note.scope) return true;

		let scopes = [];
		if (note.scope instanceof Array) {
			scopes = note.scope;
		} else {
			scopes.push(note.scope);
		}

		for (let scope of scopes) {
			if ((!parts||!parts.protocol||parts.protocol.include) && !wpsn.regexmatch(scope.protocol, link.protocol, true)) continue;
			if ((!parts||!parts.hostname||parts.hostname.include) && !wpsn.regexmatch(scope.hostname, link.hostname, true)) continue;
			if ((!parts||!parts.port||parts.port.include) && !wpsn.regexmatch(scope.port, link.port, true)) continue;
			if ((!parts||!parts.pathname||parts.pathname.include) && !wpsn.regexmatch(scope.pathname, link.pathname, true)) continue;
			if ((!parts||!parts.search||parts.search.include) && !wpsn.regexmatch(scope.search, link.search, true)) continue;
			if ((!parts||!parts.hash||parts.hash.include) && !wpsn.regexmatch(scope.hash, link.hash, true)) continue;
			if ((!parts||!parts.title||parts.title.include) && !wpsn.regexmatch(scope.title, document.title, true)) continue;
			return true;
		}
		return false;
	};

	wpsn.regexmatch = function (obj, str, nullObjIsTrue) {
		if (!obj || obj == null && nullObjIsTrue) { return true; }
		if (obj && obj != null && typeof obj == 'string' && str.match(new RegExp('^' + wpsn.regexEscape(obj) + '$')) != null) return true;
		if (typeof obj == 'object') {
			for (let prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					if (wpsn.regexmatch(obj[prop], str)) {
						return true;
					}
				}
			}
		}
		return false;
	};

	wpsn.getSavePath = function (note) {
		if (note.scope && note.scope.hostname != location.hostname) return wpsn.keys.global;
		if (note.scope && (
			note.scope.pathname != location.pathname ||
			note.scope.search != location.search ||
			note.scope.hash != location.hash
		)) return wpsn.keys.domain;
		return location.href;
	};

	wpsn.getNoteCountProps = function () {
		let count = wpsn.getNoteCount();
		let visible = $('#wpsn-container').is(':visible');
		return { stickyCount: '' + count, stickyInvisible: !visible, url: location.href };
	};
	wpsn.getNoteCount = function () {
		let count = 0;
		if (wpsn.notes) {
			for (let i = 0; i < wpsn.notes.length; i++) {
				let note = wpsn.notes[i];
				if (!note) { continue; }
				if (note.id && !note.isPopup && !note.deleted && wpsn.inScope(note)) {
					count++;
				}
			}
		}
		return count;
	};

	wpsn.getPasteContent = function (formatted) {
		return new Promise(function (resolve) {
			$('.wpsn-container').append($('<textarea class="wpsn-paste" style="position:fixed"/>').off('paste.wpsn_formatted').on('paste.wpsn_formatted', function (e) {
				e.preventDefault();
				let text = (e.originalEvent || e).clipboardData.getData('text/plain');
				if (formatted) {
					text = (e.originalEvent || e).clipboardData.getData('text/html') || (e.originalEvent || e).clipboardData.getData('text/plain');
					try {
						let $div = $('<div/>');
						$div.html(text);
						text = $div.html();//trims out <html><body> tags among other things
					} catch (err) { wpsn.error(err); }
				}
				resolve(text);
				$(this).remove();
			}));
			$('.wpsn-container').find('.wpsn-paste').focus();
			document.execCommand('Paste', false, null);
		});
	};

	wpsn.smartCopy = function () {
		wpsn.copy().then(function () {
			wpsn.getPasteContent().then(function (text) {
				wpsn.copyToClipboard(wpsn.indent(wpsn.csvToFlatFile(text)));
			});
		});
	};

	wpsn.copy = function () {
		return new Promise(function (resolve) {
			document.execCommand('Copy', false, null);
			setTimeout(function () {
				resolve();
			}, 100);
		});
	};
	wpsn.copyTextToNote = function (formatted) {
		return new Promise(function (resolve) {
			wpsn.copy().then(function () {
				wpsn.getPasteContent(formatted).then(async function (text) {
					let note = await wpsn.createNote({ text: text });
					wpsn.stopEditing(note);
					wpsn.autoResize(note);
					resolve(note);
				});
			});
		});
	};

	wpsn.location = function (href) {
		let l = document.createElement('a');
		l.href = href;
		return l;
	};

	$(window).unload(function () {
		chrome.extension.sendMessage({ stickyCount: '0', url: location.href });
	});

	wpsn.command_actions = {
		'share': function (commandName, info) {
			//TODO: eventually
			navigator.share({
				title: 'Shared via WebPageStickyNotes.com',
				text: $(document.activeElement).html() || '',
				url: info.linkUrl || info.srcUrl,
			});
		},
		'c-add-media': async function (commandName, info) {
			if (info.srcUrl) {
				let note = await wpsn.createNote();
				await wpsn.addMedia(note, info.srcUrl);

				if (note.width > 500) {
					note.width = 500;
				}
				await wpsn.refreshNote(note);
				await wpsn.autoResizeHeight(note);
				await wpsn.centerNote(note);
			} else {
				setTimeout(async function () {
					let note = await wpsn.createNote();
					wpsn.pluginPrompt(note, wpsn.menu.media.leftClick.prompt);
				}, 0);
			}
		},
		'c-copy-media': async function (commandName, info) {
			if (info.srcUrl) {
				let note = await wpsn.createNote();
				await wpsn.addMedia(note, info.srcUrl);

				if (note.width > 500) {
					note.width = 500;
				}
				await wpsn.refreshNote(note);
				await wpsn.autoResizeHeight(note);
				await wpsn.cutEffectiveNotes(note);
			}
		},
		'c-add-rss': async function () {
			let note = await wpsn.createNote();
			setTimeout(function () {
				wpsn.pluginPrompt(note, wpsn.menu.rss.leftClick.prompt);
			}, 0);
		},
		'b-paste-clipboard-to-note': async function () {
			let note = await wpsn.copyTextToNote(false);
			wpsn.autoResize(note);
			wpsn.centerNote(note);
			wpsn.save(note);
		},
		'b-paste-formatted-clipboard-to-note': async function () {
			let note = await wpsn.copyTextToNote(true);
			wpsn.autoResize(note);
			wpsn.centerNote(note);
			wpsn.save(note);
		},
		'b-download-clipboard-as-html': async function () {
			let note = await wpsn.copyTextToNote(true);
			note = await wpsn.downloadAsHTML(note);
			wpsn.deleteNote(note);
		},
		'b-paste-clipboard-to-note-prettify': async function () {
			let note = await wpsn.copyTextToNote(false);
			note.mode = wpsn.menu.code.modes.code.id;
			await wpsn.refreshNote(note);
			wpsn.autoResize(note);
			wpsn.centerNote(note);
			wpsn.save(note);
		},
		'b-copy-to-note-prettify': async function () {
			let note = await wpsn.copyTextToNote(false);
			note.mode = wpsn.menu.code.modes.code.id;
			await wpsn.refreshNote(note);
			wpsn.autoResize(note);
			wpsn.centerNote(note);
			wpsn.save(note);
		},
		'b-prettify-and-download-as-html': async function () {
			let note = await wpsn.copyTextToNote(false);
			note.mode = wpsn.menu.code.modes.code.id;
			await wpsn.refreshNote(note);
			wpsn.autoResize(note);
			wpsn.centerNote(note);
			await wpsn.downloadAsHTML(note);
			wpsn.deleteNote(note);
		}
	};

	wpsn.command_index = {
		'a-a-add-note': async function () { await wpsn.createNote(); },
		'a-c-manage-notes': async function () { await wpsn.manager.manageNotes(); },
		'a-c-a-note-board': async function () { await wpsn.noteboard.openBoard(); },
		'a-c-b-sync-notes': async function () { await wpsn.synchronizeNotes(); },
		'a-c-c-sync-logout': async function () { await wpsn.synchronizeLogout(); },
		'a-toggle-notes': async function () { await wpsn.toggleNotes(); },
		'a-d-settings': async function () { await wpsn.menu.settings.leftClick.action(); },
		'a-e-about': async function () { await wpsn.menu.about.rightClick.action(); },
		'a-f-demo': async function () { await wpsn.menu.about.doubleClick.action(); },
		'a-g-backup': async function () { await wpsn.backup(); },
		'a-a-undo': async function () { await wpsn.undo(); },
		'a-b-redo': async function () { await wpsn.redo(); },
		'a-g-goto-url': async function () { await wpsn.gotoUrl(); },
		'share': async function (commandName, info) { await wpsn.command_actions[commandName](commandName, info); },
		'b-select-all-notes': async function () { await wpsn.selectAllNotes(); },
		'b-export-note': async function (commandName, info) { await wpsn.exportEffectiveNotes(info.note); },
		'b-export-provided-notes': async function () { await wpsn.exportEffectiveNotes(null, 'notes'); },
		'b-import-note': async function () { await wpsn.import(); },
		'b-clone-note': async function (commandName, info) { await wpsn.cloneEffectiveNotes(info.note); },
		'b-clone-provided-notes': async function () { await wpsn.cloneProvidedNotes(null, 'note'); },
		'b-clone-favorite-note': async function () { await wpsn.cloneFavoriteNotes(); },
		'b-copy-note': async function (commandName, info) { await wpsn.copyEffectiveNotes(info.note); },
		'b-cut-note': async function (commandName, info) { await wpsn.cutEffectiveNotes(info.note); },
		'b-commit-to-github': async function (commandName, info) { await wpsn.commitToGitHubEffectiveNotes(info.note); },
		'b-compare-github-repos': async function (commandName, info) { await wpsn.compareRepos(info.note); },
		'b-paste-copied-notes': async function (commandName, info) { await wpsn.pasteCopiedNotes(info.text, false); },
		'b-paste-copied-notes-original-coordinates': async function (commandName, info) { await wpsn.pasteCopiedNotes(info.text, true); },
		'b-stop-editing-note':  async function (commandName, info) { await wpsn.stopEditingEffectiveNotes(info.note); },
		'minimize-note': async function (commandName, info) { await wpsn.minimizeEffectiveNotes(info.note); },
		'maximize-note': async function (commandName, info) { await wpsn.maximizeEffectiveNotes(info.note); },
		'zoom-in-note': async function (commandName, info) { await wpsn.zoomInEffectiveNotes(info.note); },
		'zoom-out-note': async function (commandName, info) { await wpsn.zoomOutEffectiveNotes(info.note); },
		'zoom-on-note': async function (commandName, info) { await wpsn.zoomOnEffectiveNotes(info.note); },
		'create-checklist': async function (commandName, info) { await wpsn.createChecklist(); },
		'render-checklist': async function (commandName, info) { await wpsn.renderChecklistEffectiveNotes(info.note); },
		'indent-prettify-note': async function (commandName, info) { await wpsn.indentPrettifyEffectiveNotes(info.note); },
		'minify-prettify-note': async function (commandName, info) { await wpsn.minifyPrettifyEffectiveNotes(info.note); },
		'json-schema-viewer-note': async function (commandName, info) { await wpsn.jsonSchemaViewerEffectiveNotes(info.note); },
		'indent-minify-prettify-note-undo': async function (commandName, info) { await wpsn.undoIndentMinifyPrettifyEffectiveNotes(info.note); },
		'bring-to-top-note': async function (commandName, info) { await wpsn.bringToTopEffectiveNotes(info.note); },
		'send-to-bottom-note': async function (commandName, info) { await wpsn.sendToBottomEffectiveNotes(info.note); },
		'snapshot-note': async function (commandName, info) { await wpsn.snapshotEffectiveNotes(info.note); },
		'position-note': async function (commandName, info) { await wpsn.positionEffectiveNotes(info.note); },
		'position-notes-to-grid': async function () { await wpsn.manager.notesToGrid(); },
		'remove-position-note': async function (commandName, info) { await wpsn.removePositionEffectiveNotes(info.note); },
		'toggle-docking-note': async function (commandName, info) { await wpsn.toggleDockingEffectiveNotes(info.note); },
		'toggle-canvas-mode-note': async function (commandName, info) { await wpsn.toggleEffectiveNotesCanvasMode(info.note); },
		'update-scope-note': async function (commandName, info) { await wpsn.commands.updateScope(info.note); },
		'update-time-scope-note': async function (commandName, info) { await wpsn.updateEffectiveNotesTimeScope(info.note); },
		'delete-note': async function (commandName, info) { await wpsn.deleteEffectiveNotes(info.note, true); },
		'c-autofit-selected-notes': async function (commandName, info) { await wpsn.autoFitEffectiveNotes(info.note); },
		'c-add-media': async function (commandName, info) { await wpsn.command_actions[commandName](commandName, info); },
		'c-copy-media': async function (commandName, info) { await wpsn.command_actions[commandName](commandName, info); },
		'c-add-rss': async function (commandName, info) { await wpsn.command_actions[commandName](commandName, info); },
		'b-paste-clipboard-to-note': async function (commandName, info) { await wpsn.command_actions[commandName](commandName, info); },
		'b-paste-formatted-clipboard-to-note': async function (commandName, info) { await wpsn.command_actions[commandName](commandName, info); },
		'b-download-note-as-html': async function (commandName, info) { await wpsn.downloadAsHTML(info.note); },
		'b-download-clipboard-as-html': async function (commandName, info) { await wpsn.command_actions[commandName](commandName, info); },
		'b-paste-clipboard-to-note-prettify': async function (commandName, info) { await wpsn.command_actions[commandName](commandName, info); },
		'b-smart-copy-to-clipboard': async function () { await wpsn.smartCopy(); },
		'b-copy-to-note': async function () { await wpsn.copyTextToNote(false); },
		'b-copy-html-to-note': async function () { await wpsn.copyTextToNote(true); },
		'b-copy-to-note-prettify': async function (commandName, info) { await wpsn.command_actions[commandName](commandName, info); },
		'b-prettify-and-download-as-html': async function (commandName, info) { await wpsn.command_actions[commandName](commandName, info); },
		'b-prettify-and-download-clipboard-as-html': async function (commandName, info) { await wpsn.command_actions['b-prettify-and-download-as-html'](commandName, info); },
		'b-copy-link-and-text': async function (commandName, info) { if (info) { await wpsn.copyLinkAndText(info); } },
		'a-markdown-cheatsheet': async function () { await wpsn.menuCommand(wpsn.getMouseoverNote(), 'tips', 'leftClick'); },
		'a-tips-and-tricks': async function () { await wpsn.menuCommand(wpsn.getMouseoverNote(), 'tips', 'rightClick'); },
		'a-menu-cheatsheet': async function () { await wpsn.menuCommand(wpsn.getMouseoverNote(), 'tips', 'doubleClick'); },
		'toggle-fullscreen-note': async function (commandName, info) { await wpsn.toggleFullscreenEffectiveNotes(info.note); },
		'resize-note-paper-ratio': async function (commandName, info) { await wpsn.resizeEffectiveNotesToPaperRatio(info.note); },
		'refresh-note': async function (commandName, info) { await wpsn.refreshEffectiveNotes(info.note, info); },
		'update-lookandfeel-note': async function (commandName, info) { await wpsn.updateLookAndFeelForEffectiveNotes(info.note); },
		'toggle-lock-note': async function (commandName, info) { await wpsn.toggleLockEffectiveNotes(info.note); },
		'update-mode-note': async function (commandName, info) { await wpsn.updateEffectiveNotesMode(info.note); },


	};

	wpsn.commandDiscrepencies = function () {
		let unindexed = [];
		for (let c1 of Object.keys(wpsn.commands.commands)) {
			let found = false;
			for (let c2 of Object.keys(wpsn.command_index)) {
				if (c1 == c2) { found = true; break; }
			}
			if (!found) { unindexed.push(c1); }
		}
		wpsn.error('Commands not indexed:' + JSON.stringify(unindexed));
		unindexed = [];
		for (let c1 of Object.keys(wpsn.command_index)) {
			let found = false;
			for (let c2 of Object.keys(wpsn.commands.commands)) {
				if (c1 == c2) { found = true; break; }
			}
			if (!found) { unindexed.push(c1); }
		}
		wpsn.error('Commands not found:' + JSON.stringify(unindexed));
	};

	wpsn.command = async function (commandName, info) {
		if (commandName != 'a-a-undo' && commandName != 'a-b-redo') {
			let effectiveNotes = await wpsn.getEffectiveNotes(info && info.note);
			wpsn.saveNoteStateForUndo(effectiveNotes.notes);
		}
		try {
			if (wpsn.command_index[commandName]) { await wpsn.command_index[commandName](commandName, info || {}); }
		} catch (err) {
			wpsn.undo();
		}
	};

	wpsn.menuCommand = function (note, menuName, clickName) {
		wpsn.menu[menuName][clickName].action(note);
	};

	chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
		if (request.command) {
			wpsn.command(request.command, request.options);
		}
		if (request.commands) {
			wpsn.commands.commands = {};
			for (let i = 0; i < request.commands.length; i++) {
				let command = request.commands[i];
				wpsn.commands.commands[command.name] = command;
			}
		}
		if (request.synchronize) {
			if (request.result) {
				wpsn.resolveConflict(wpsn.notesArray(wpsn.allNotes), wpsn.notesArray(request.result), {inverse:true}).then(function (outNotes) {
					wpsn.resolveStorageContent(wpsn.notesById(outNotes.newNotes,'wpsn.note.'), true).then(function(){
						wpsn.save(null, {noAutoSynchronize: true}).then(function(){
							chrome.storage.local.get(null, function (results) {
								chrome.extension.sendMessage({synchronize:true, result: results});
							});
						});
					});
				});
			}
			if (request.synchronized){
				wpsn.clearPopups();
				wpsn.cleanupDeletedNotes();
			}
			if (request.loggedout) {
				wpsn.clearPopups();
			}
		}
		if (request.toExtensionId) {
			wpsn.log(request);
		}
		if (request.stickyCountRequest) {
			sendResponse(wpsn.getNoteCountProps());
			//wpsn.updateCount();
			wpsn.loadFromStorage({ resolveConflictStrategy: 'keep' }).then(function (results) {
				let tNotes = wpsn.getNotesFromStorageResult(results);
				if (wpsn.notes)
					for (let i = 0; i < tNotes.length; i++) {
						let tNote = tNotes[i];
						if (tNote && wpsn.inScope(tNote)) {
							let cNote = wpsn.getNote(tNote.id);
							if (!cNote || tNote.modified_date > cNote.modified_date) {
								wpsn.allNotes[tNote.id] = tNote;
								//wpsn.reRenderNote(tNote);
							}
						}
					}
			});
		}
		if (request.loadNotesResponse) {
			wpsn.load(request.loadNotesResponse);
		}
		if (request.uploaded) {
			wpsn.uploaded(request.uploaded);
		}
		if (request.committed) {
			if (request.committed.content && request.committed.content.download_url) {
				wpsn.log(request.committed);
				wpsn.alert({},
					'<div class="panel panel-default">' +
					'<div class="panel-heading">Commit was successful!</div>' +
					'<div class="panel-body">' +
					'<a href="' + request.committed.content.html_url + '" target="_blank">Note(s)</a><br/>' +
					'<a href="' + request.committed.commit.html_url + '" target="_blank">Commit Details</a>' +
					'</div>' +
					'</div>');
			} else {
				wpsn.alert({}, request.committed);
			}
		}
	});

	wpsn.resizeNote = function (note) {
		wpsn.simplePrompt(
			{
				wpsn_defaultWidth: note.width || 500,
				wpsn_defaultHeight: note.height || 500
			},
			{
				popup: {
					load: function () {
						let sizeInput = $('.wpsn_slider').bind('change', function () {
							$('span.' + $(this).data('display')).text($(this).val() + 'px');
						});
						sizeInput.each(function () {
							$('span.' + $(this).data('display')).text($(this).val() + 'px');
						});
					}
				},
				form: function () {
					return '<div class="panel panel-default">' +
						'<div class="panel-heading">Width & Height:</div>' +
						'<div class="panel-body">' +
						'<span style="display:inline-block;width:50px">Width:</span><input type="range" class="wpsn_slider" style="width:100%;" name="wpsn_defaultWidth" min="25" max="1000" step="25" data-display="wpsn_defaultWidth" list="wpsn_defaultWidth"><datalist id="wpsn_defaultWidth"><option>25</option><option>250</option><option>500</option><option>750</option><option>1000</option></datalist></input><span class="wpsn_defaultWidth" style="padding-left:5px;"></span><br/><br/>' +
						'<span style="display:inline-block;width:50px">Height:</span><input type="range" class="wpsn_slider" style="width:100%;" name="wpsn_defaultHeight" min="25" max="1000" step="25" data-display="wpsn_defaultHeight" list="wpsn_defaultHeight"><datalist id="wpsn_defaultHeight"><option>25</option><option>250</option><option>500</option><option>750</option><option>1000</option></datalist></input><span class="wpsn_defaultHeight" style="padding-left:5px;"></span><br/><br/>' +
						'<br/><input type="checkbox" name="wpsn_applyToAll" id="wpsn_applyAll" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn_applyAll">Apply to all notes</label>' +
						'</div>' +
						'</div>';
				},
				callback: async function (form) {

					if (form.wpsn_applyToAll) {
						let notesClone = wpsn.getSelectedOrAllNotes().slice(0);
						if (notesClone.length == 0) {
							notesClone = wpsn.notes.slice(0);
						}
						for (let i = 0; i < notesClone.length; i++) {
							if (!notesClone[i]) { continue; }
							let tempNote = notesClone[i];
							wpsn.saveNoteStateForUndo(tempNote);
							if (form.wpsn_defaultWidth) { tempNote.width = form.wpsn_defaultWidth; }
							if (form.wpsn_defaultHeight) { tempNote.height = form.wpsn_defaultHeight; }
							await wpsn.refreshNote(tempNote);
						}
					} else {
						if (form.wpsn_defaultWidth) { note.width = form.wpsn_defaultWidth; }
						if (form.wpsn_defaultHeight) { note.height = form.wpsn_defaultHeight; }
						await wpsn.refreshNote(note);
					}
				}
			}
		);
	};
	wpsn.addMedia = function (note, url) {
		return new Promise(function (resolve) {
			note.canvas = 'frameless';
			wpsn.menu.media.saveMedia(note, url).then(function (note) {
				resolve(note);
			});
		});
	};
	wpsn.copyLinkAndText = function (link) {
		let linkAndText = '<a href="' + link.linkUrl + '">' + $(document.activeElement).html() + '</a>';
		wpsn.copyToClipboard(linkAndText);
	};
	wpsn.generateMenuDiv = function (_menu, note, noteDiv) {
		let _menuDivs = [];
		if (_menu.icons) {
			for (let i = 0; i < _menu.icons.length; i++) {
				let _icon_menu = $.extend(true, {}, _menu);//clone
				_icon_menu.icon = _menu.icons[i];
				delete _icon_menu.icons;
				_menuDivs.push(wpsn.generateMenuDiv(_icon_menu, note, noteDiv));
			}
			return _menuDivs;
		}

		let _background = null;
		let _backgroundImage = null;
		let _color = null;
		if (_menu.icon) {
			_color = _menu.icon;
			if (_menu.icon.indexOf('#') === 0 || _menu.icon.indexOf('.') === -1) {
				_background = _menu.icon;

			} else {
				_backgroundImage = 'url(\'' + _menu.icon + '\')';
			}
		}
		let _menuDiv = $('<div data-note-id="' + note.id + '" class="wpsn-menu wpsn-menu-' + _menu.name + '" ' + (_color ? 'data-color="' + _color + '"' : '') + ' style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'px;' + (_background ? 'background:' + _background + ';' : '') + (_backgroundImage ? 'background-image:' + _backgroundImage + ';' : '') + '"/>');

		_menuDiv.data('menu', _menu);

		if (_menu.doubleClick) {
			_menuDiv.dblclick(function (e) {
				let $that = $(this);
				let _menu = $that.data('menu');
				window['wpsn_' + note.id + '_' + (_menu ? _menu.name : '') + '_dblclick'] = 2;
				window.setTimeout(function () {
					delete window['wpsn_' + note.id + '_' + (_menu ? _menu.name : '') + '_dblclick'];
				}, 2000);
				if (_menu.doubleClick) {
					if (_menu.doubleClick.action) {
						_menu.doubleClick.action(note, $that, noteDiv, e);
					} else if (_menu.doubleClick.prompt) {
						wpsn.pluginPrompt(note, _menu.doubleClick.prompt);
					} else if (_menu.doubleClick.command) {
						wpsn.command(_menu.doubleClick.command, { note: (_menu.doubleClick.applyToAll && e.altKey ? null : note), menuButton: $that, noteDiv: noteDiv, e });
					}
				}
			});
		}
		
		_menuDiv.click(function (e) {
			e.stopPropagation();
		}).mouseenter(async function () {
			let $this = $(this);
			$this.attr('title', await wpsn.menuDescription(note, _menu));
			$this.closest('.wpsn-sticky').removeClass('wpsn-mouseover-menu').addClass('wpsn-mouseover-menu');
		}).mouseleave(function () {
			$(this).closest('.wpsn-sticky').removeClass('wpsn-mouseover-menu');
		}).mousedown(function (e) {
			let $this = $(this);
			let _menu = $this.data('menu');
			if (e.which === 1) { // left click
				if (_menu.name === 'maximize') {
					$this.data('mousedown', true);
				}
			}
			e.stopPropagation();
		}).mouseup(function (e) {
			let $that = $(this);
			let _menu = $that.data('menu');
			if (e.which === 3) {// right click

			} else if (e.which === 2) {// middle click
				if (_menu.middleClick) {
					if (_menu.middleClick.action) {
						_menu.middleClick.action(note, $that, noteDiv, e);
					} else if (_menu.middleClick.prompt) {
						wpsn.pluginPrompt(note, _menu.middleClick.prompt);
					} else if (_menu.middleClick.command) {
						wpsn.command(_menu.middleClick.command, { note: (_menu.middleClick.applyToAll && e.altKey ? null : note), menuButton: $that, noteDiv: noteDiv, e });
					}
				}
			} else {// left click
				let $that = $(this);
				window.setTimeout(function () {
					let _menu = $that.data('menu');
					let dblclick = parseInt(window['wpsn_' + note.id + '_' + (_menu ? _menu.name : '') + '_dblclick'], 10) || 0;
					if (dblclick < 2) {
						delete window['wpsn_' + note.id + '_' + (_menu ? _menu.name : '') + '_dblclick'];
						if (_menu && _menu.leftClick) {
							if (_menu.leftClick.action) {
								if (_menu.name === 'maximize') {
									if (!(e.ctrlKey || e.metaKey) && $that.data('mousedown') === true) {
										_menu.leftClick.action(note, $that, noteDiv, e);
									}
								} else {
									_menu.leftClick.action(note, $that, noteDiv, e);
								}
							} else if (_menu.leftClick.prompt) {
								wpsn.pluginPrompt(note, _menu.leftClick.prompt);
							} else if (_menu.leftClick.command) {
								wpsn.command(_menu.leftClick.command, { note: (_menu.leftClick.applyToAll && e.altKey ? null : note), menuButton: $that, noteDiv: noteDiv, e });
							}
						}
					}
				}, _menu.doubleClick ? 500 : 0);
			
				if (_menu.name != 'more' && _menu.name != 'color') {
					noteDiv.find('>.wpsn-submenu').hide('slide');
				}
				e.stopPropagation();
			}
		});
		if (_menu.rightClick) {
			_menuDiv.bind('contextmenu', function (e) {
				let $that = $(this);
				let _menu = $that.data('menu');
				if (_menu.rightClick) {
					if (_menu.rightClick.action) {
						_menu.rightClick.action(note, $(this), noteDiv, e);
					} else if (_menu.rightClick.prompt) {
						wpsn.pluginPrompt(note, _menu.rightClick.prompt);
					} else if (_menu.rightClick.command) {
						wpsn.command(_menu.rightClick.command, { note: (_menu.rightClick.applyToAll && e.altKey ? null : note), menuButton: $that, noteDiv: noteDiv, e });
					}
				}
				return false;
			});
		}
		//TODO: Double Click


		if (note.minimized && _menu.name != 'maximize') { _menuDiv.hide(); }

		if (_menu.load) { _menu.load(note, _menuDiv, noteDiv); }

		_menuDivs.push(_menuDiv);
		return _menuDivs;
	};

	wpsn.menuDescriptionString = function (description, note) {
		if (description) {
			if (typeof description === 'function') {
				return description(note);
			}
			return description;
		}
		return '';
	};

	wpsn.clickDescription = async function (clickConfig, note) {
		let desc = typeof clickConfig.description === 'function' ? await clickConfig.description(note) : clickConfig.description;
		desc = desc || '';
		let command = clickConfig.command;
		command = command || '';
		let commandDesc = command ? await wpsn.commandDescription(command, clickConfig.applyToAll, clickConfig.appendDescription) : '';
		commandDesc = commandDesc || '';

		return desc ? (desc + (command ? ' ' + wpsn.shortcut(command) : '')) : commandDesc;
	};

	wpsn.menuDescription = async function (note, _menu) {
		let _menuTitle = '';
		let _desc_array = [];
		let name = typeof _menu.name === 'function' ? _menu.name(note) : _menu.name;
		name = name || '';
		let desc = typeof _menu.description === 'function' ? _menu.description(note) : _menu.description;
		desc = desc || '';
		let nameDesc = wpsn.capitalize(name) + '\n' + (desc ? '\n' + desc + '\n' : '');
		let menuDesc = await wpsn.menuDescriptionString(nameDesc, note);
		if (name === 'maximize' && note.title) { menuDesc = note.title + '\n\n---\n' + menuDesc; }
		if (menuDesc) { _desc_array.push(menuDesc); }
		let clicks = {
			'leftClick': { name: 'Left click' },
			'rightClick': { name: 'Right click' },
			'middleClick': { name: 'Middle click' },
			'doubleClick': { name: 'Double click' },
		};
		for (let clickKey of Object.keys(clicks)) {
			if (_menu[clickKey]) {
				let clickDesc = await wpsn.menuDescriptionString(await wpsn.clickDescription(_menu[clickKey], note), note);
				if (clickDesc) {
					_desc_array.push(clicks[clickKey].name + ':\t' + clickDesc);
				}
			}
		}

		for (let i = 0; i < _desc_array.length; i++) {
			let _desc = _desc_array[i];
			if (i > 0) {
				_menuTitle += '\n - ';
			}
			_menuTitle += _desc;
		}
		return _menuTitle;
	};

	wpsn.refreshAllNotes = function () {
		wpsn.save();
		$('.wpsn-sticky').remove();
		wpsn.renderNotes();
	};

	wpsn.reRenderAllNotes = function () {
		$('.wpsn-sticky').remove();
		for (let i = 0; i < wpsn.notes.length; i++) {
			wpsn.reRenderNote(wpsn.notes[i]);
		}
	};

	wpsn.reRenderNote = function (note) {
		let jqText = note.jqText;
		delete note.jqText;
		wpsn.eraseNote(note);
		note.jqText = jqText;
		wpsn.renderNote(note);
		return note;
	};

	wpsn.refreshEffectiveNotes = function (noteOrNotes, info) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.refreshNote, ''/*'Are you sure you want to refresh {0}?'*/, null, null, null, info);
	};

	wpsn.refreshNote = async function (note, options = {}) {
		let jqText = note.jqText;
		await wpsn.save(note);
		delete note.jqText;
		wpsn.eraseNote(note);
		note.jqText = jqText;
		if (wpsn.inScope(note)) {
			await wpsn.renderNote(note, null, options);
		}
		return note;
	};

	wpsn.adjustForCropAfterAutoResize = function (note, $noteDiv, forWidth, forHeight) {
		if (!note) { return; }
		let props = note[wpsn.menu.media.modes.media.id];
		if (!props || !props.crop) { return; }
		$noteDiv = $noteDiv || wpsn.getNoteDiv(note);
		let $frame = $noteDiv.find('#wpsn-frame-' + note.id);
		if (forWidth) {
			let cropwidth = props.crop.cropwidth;
			let width = ($frame.width() * cropwidth) / props.crop.width;
			$noteDiv.width(width);
			$frame.removeClass('wpsn-resizing-width');
		}
		if (forHeight) {
			let cropheight = props.crop.cropheight;
			let cropwidth = props.crop.cropwidth;
			let height = ($frame.width() * cropheight) / cropwidth;
			$noteDiv.height(height);
			$frame.removeClass('wpsn-resizing-height');
		}
	};

	wpsn.autoResizeWidth = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let frame = noteDiv.find('#wpsn-frame-' + note.id);
		let zoom = frame.css('zoom') ? parseFloat(frame.css('zoom')) : 1;
		let sticky = frame.closest('.wpsn-sticky');
		if (frame.html()) {
			let width = noteDiv.width();
			let hasScrollbar = frame.hasClass('wpsn-scrollbar');
			frame.removeClass('wpsn-scrollbar');
			frame.addClass('wpsn-resizing-width');
			wpsn.adjustForCropAfterAutoResize(note, noteDiv, true, false);
			if (noteDiv.width() > $(window).width()) {
				noteDiv.width($(window).width() - 2 * wpsn.defaultPadding);
			}
			let frameWidth = frame.width() * zoom;
			let s = Math.pow((width - frameWidth), 2);
			if (s != 0 && s != Math.pow(2 * wpsn.defaultPadding, 2) && frameWidth > 0) {
				noteDiv.width(frameWidth + 2 * wpsn.defaultPadding);
			}

			if (hasScrollbar) {
				frame.addClass('wpsn-scrollbar');
			}

			frame.addClass('wpsn-width-check');
			let frameHeight = frame.height();
			let noteDivHeight = noteDiv.height();
			let stickyHeight = sticky.height();

			frame.removeClass('wpsn-resizing-width');

			let runawayCount = 0;
			let increment = 1;
			while (frameHeight < frame.height() || noteDivHeight < noteDiv.height() || stickyHeight < sticky.height()) {
				let noteDivWidth = noteDiv.width();
				while (noteDivWidth == noteDiv.width()) {
					noteDiv.width(noteDiv.width() + increment);
					if (noteDivWidth == noteDiv.width()) {//To account when zoomed in
						increment++;
						runawayCount++;
						if (runawayCount > 100) { break; }
					}
				}
				runawayCount++;
				if (runawayCount > 100) { break; }
			}

			frame.removeClass('wpsn-width-check');



			if (noteDiv.width() > $(window).width()) {
				noteDiv.width($(window).width() - 2 * wpsn.defaultPadding);
			}
			let newWidth = noteDiv.width();

			if (width != newWidth) {
				if (note[wpsn.menu.media.modes.media.id] && note[wpsn.menu.media.modes.media.id].media) {
					wpsn.cropMedia(note);
					wpsn.autoResizeHeight(note);
				}
				wpsn.resizedNote(note, null);
			}
		}
		return note;
	};

	wpsn.autoResizeHeight = function (note, limitToWindowHeight) {
		let noteDiv = wpsn.getNoteDiv(note);
		let frame = noteDiv.find('#wpsn-frame-' + note.id);
		let zoom = frame.css('zoom') ? parseFloat(frame.css('zoom')) : 1;
		if (frame.html()) {
			let height = noteDiv.height();
			let hasScrollbar = frame.hasClass('wpsn-scrollbar');
			frame.removeClass('wpsn-scrollbar');
			frame.addClass('wpsn-resizing-height');
			//let s = Math.pow((height - frameHeight),2)
			//if (s != 0 && s != Math.pow(2*14,2) && frameHeight > 0) {
			noteDiv.height(frame.height() * zoom + (noteDiv.hasClass('wpsn-frameless') ? 0 : (2 * wpsn.defaultPadding)));
			//}
			if (hasScrollbar) {
				frame.addClass('wpsn-scrollbar');
			}
			frame.removeClass('wpsn-resizing-height');

			let runawayCount = 0;
			while (frame.get(0).clientHeight * zoom < frame.get(0).scrollHeight * zoom) {
				noteDiv.height(noteDiv.height() + 1);
				runawayCount++;
				if (runawayCount > 100) { break; }
			}
			if (runawayCount > 30) {
				noteDiv.height(noteDiv.height() + 1);
			}
			if (runawayCount > 40) {
				noteDiv.height(noteDiv.height() + 1);
			}

			if (limitToWindowHeight && noteDiv.height() > $(window).height()) {
				noteDiv.height($(window).height());
			}
			wpsn.adjustForCropAfterAutoResize(note, noteDiv, false, true);
			let newHeight = noteDiv.height();
			if (height != newHeight) {
				wpsn.resizedNote(note, null);
			}
		}
		return note;
	};

	wpsn.resizedNote = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let pos = noteDiv.position();
		note.width = noteDiv.width();
		note.height = noteDiv.height();
		note.pos_x = pos.left;
		note.pos_y = pos.top;
		if (wpsn.options.resizeCallback) {
			wpsn.options.resizeCallback(note);
		}
		wpsn.cropMedia(note);
		wpsn.generateMainMenu(note, noteDiv);
		wpsn.save(note);
		noteDiv.find('.wpsn-auto-fit-text').fitText(wpsn.fittextcompressor, wpsn.fittextoptions);
		return note;
	};

	wpsn.rotatedNote = function (note, ui) {
		note.angle = ui.angle.current;
		wpsn.save(note);
		return note;
	};

	wpsn.autoResize = function (note) {
		wpsn.autoResizeWidth(note);
		wpsn.autoResizeHeight(note);
		wpsn.autoResizeWidth(note);
		return note;
	};

	wpsn.autoResizeIframe = function (iframe) {
		let newheight;
		let newwidth;

		if (document.getElementById) {
			newheight = iframe.contentWindow.document.body.scrollHeight;
			newwidth = iframe.contentWindow.document.body.scrollWidth;
		}

		iframe.height = (newheight) + 'px';
		iframe.width = (newwidth) + 'px';
	};

	wpsn.selector = function (jqEl) {
		let path, node = jqEl;
		while (node.length) {
			let realNode = node[0], name = realNode.localName;
			if (!name) break;
			name = name.toLowerCase();

			let parent = node.parent();

			let siblings = parent.children(name);
			if (siblings.length > 1) {
				name += ':eq(' + siblings.index(realNode) + ')';
			}

			path = name + (path ? '>' + path : '');
			node = parent;
		}

		return path;
	};

	wpsn.formatDate = function (date, forFileName) {
		let local = new Date(date);
		local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
		let st = local.toISOString();
		if (forFileName) {
			return st.replace('T', '-').replace(':', '-').replace(':', '-').substring(0, st.indexOf('.'));
		} else {
			return st.replace('T', ' ').substring(0, st.indexOf('.'));
		}
	};

	wpsn.properties = function (obj) {
		let keys = [];
		if (obj && obj instanceof Object) {
			for (let key in obj) {
				keys.push(key);
			}
		}
		return keys.sort();
	};
	wpsn.propertiesSize = function (obj) {
		let size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	};

	wpsn.exportEffectiveNotes = function (noteOrNotes, selectNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.export, ''/*'Are you sure you want to export {0}?'*/, true, false, selectNotes);
	};

	wpsn.export = async function (notes, options) {
		options = options || {};
		let effectiveNotes = options.effectiveNotes || await wpsn.getEffectiveNotes(notes);
		let label = effectiveNotes.label;
		let isCurrentNote = label == 'current note';

		let notesToExportString = JSON.stringify(effectiveNotes.notes);
		let escapedNotesToExportString = escape(notesToExportString);
		wpsn.prompt(
			{
				width: 1000,
				load: function () {
					$('.wpsn-prompt').change(function () {
						let content = $(this).val();
						content = CryptoJS.AES.encrypt(content,chrome.runtime.id).toString()
						let blob = new Blob([content], { type: 'text/plain' });
						let url = URL.createObjectURL(blob);
						//let url = 'data:plain/text,'+encodeURIComponent($(this).val());
						$('.wpsn-download').attr('href', url);
						try { $('.wpsn-selected-notes-count').html(JSON.parse($('.wpsn-prompt').val()).length); } catch (err) { wpsn.error(err); }
					}).change();
					$('.wpsn-download-name').keyup(function () {
						let name = $(this).val() || 'webpagestickynotes';
						$('.wpsn-download').attr('download', name + '.wpsn');
					}).val(options.downloadname || '').keyup();
					try { $('.wpsn-selected-notes-count').html(notes.length); } catch (err) { wpsn.error(err); }
				}
			},
			(options.downloadonly ? '<input type="hidden" name="wpsn-export" class="wpsn-prompt" spellcheck="false"/>' :
				'<div class="panel panel-default"><div class="panel-heading">Export ' + label + ':</div><div class="panel-body">' +
				'<textarea name="wpsn-export" class="wpsn-prompt" spellcheck="false"></textarea><br/>' +
				'<ol>' +
				'<li>Copy the above.</li>' +
				'<li>Right click <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/plus.svg" width="'+(wpsn.settings.defaultIconSize||14)+'"/> in another note.</li>' +
				'<li>Paste the above.</li>' +
				'</ol>' +
				(isCurrentNote ? '<br/>Any changes made in the field above will be saved when you click OK.' : '') + '</div></div>'
			) +
			(escapedNotesToExportString.length < 200000 ?
			'<div class="panel panel-default"><div class="panel-heading">Link ' + label + ':</div><div class="panel-body form-inline">' +
			'Copy <a href="#'+escapedNotesToExportString+'">link</a> and share it. On opening link, ' + label + ' can be seamlessly imported by others.' +
			'</div></div>' : ''
		    ) +
			'<div class="panel panel-default"><div class="panel-heading">' + (options.downloadlabel || 'Download') + ' ' + label + ':</div><div class="panel-body form-inline">' +
			'<input type="text" class="wpsn-download-name form-control" placeholder="Download As"/><a class="wpsn-download btn btn-default" download="webpagestickynotes.wpsn">' + (options.downloadlabel || 'Download') + '</a>' +
			'<br/>On another computer...' +
			'<ul>' +
			'<li>drag the downloaded [file].wpsn into another note.</li>' +
			'<li>or drag the downloaded [file].wpsn into the browser (Only if the extension option <a href="https://docs.google.com/document/d/11M9mK0Z5x1TTA6V9M-39ubQ1ZQAEGG6lzgSZWB9Nx9Y/pub#h.cuw0wves9ame">"Allow access to file URLs"</a> is enabled).</li>' +
			'<li>or right click <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/plus.svg" width="'+(wpsn.settings.defaultIconSize||14)+'"/> in another note and <button>Choose Files</button>.</li>' +
			'</ul></li>' +
			'</div></div>' +
			(isCurrentNote ? '<div class="panel panel-default"><div class="panel-heading">Tip:</div><div class="panel-body">You can also export this note by taking its snapshot by clicking <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/camera.svg" width="'+(wpsn.settings.defaultIconSize||14)+'"/>.<br/>On another computer...' +
				'<ul>' +
				'<li>Drag the original, non-modified, non-compressed snapshot into another note.</li>' +
				'<li>or right click <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/plus.svg" width="'+(wpsn.settings.defaultIconSize||14)+'"/> in another note and <button>Choose Files</button>.</li>' +
				'</ul> Neat!</div></div>' : ''),
			{ 'wpsn-export': notesToExportString },
			async function (form) {
				if (isCurrentNote) {
					let notes = JSON.parse(form['wpsn-export']);
					for (let i = 0; i < notes.length; i++) {
						await wpsn.refreshNote(notes[i]);
					}
				}
			}
		);
	};

	wpsn.lengthInUtf8Bytes = function (str) {
		// Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
		let m = encodeURIComponent(str).match(/%[89ABab]/g);
		return str.length + (m ? m.length : 0);
	};










	//######################### Commands ###########################	


	wpsn.toggleFullscreenEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.toggleFullscreenNote, 'Are you sure you want to toggle fullscreen for {0}?');
	};

	wpsn.toggleFullscreenNote = async function (note) {
		note.fullscreen = !note.fullscreen;
		note.minimized = false;
		await wpsn.refreshNote(note);
		if (note.fullscreen && wpsn.isTextMode(note)) {
			setTimeout(function () { wpsn.getNoteDiv(note).mouseover().find('#wpsn-frame-' + note.id).dblclick(); }, 0);//edit mode
		}
	};

	wpsn.resizeEffectiveNotesToPaperRatio = async function (noteOrNotes) {
		try {
			let effectiveNotes = await wpsn.getEffectiveNotes(noteOrNotes);
			return await wpsn.actOnEffectiveNotesWithPrompt(
				noteOrNotes,
				'',//'Are you sure you want to resize {0} to paper ratio?', 
				function () {
					return wpsn.prompt({ minWidth: 900 }, wpsn.noteRatioHtml('Size ratio for ' + effectiveNotes.label), {});
				},
				wpsn.resizeNoteToPaperRatio
			);
		} catch (err) { wpsn.error(err); }
	};

	wpsn.resizeNoteToPaperRatio = function (note, form) {
		if (form) {
			let padding = wpsn.defaultPadding;
			let maxWidth = $(window).width() - 2 * padding;
			let maxHeight = $(window).height() - 2 * padding;
			let ratio = form.wpsn_size.split(' × ');
			let ratiox = parseInt(ratio[0]);
			let ratioy = parseInt(ratio[1]);
			let orientation = form.wpsn_orientation;
			let width = maxWidth;
			let height = maxHeight;
			if (orientation == 'portrait') {
				height = width * ratioy / ratiox;
				if (height > maxHeight) {
					height = maxHeight;
					width = height * ratiox / ratioy;
				}
			} else {
				height = width * ratiox / ratioy;
				if (height > maxHeight) {
					height = maxHeight;
					width = height * ratioy / ratiox;
				}
			}
			note.width = width;
			note.height = height - 2;
			wpsn.refreshNote(note);
		}
	};


	wpsn.noteRatioHtml = function (header) {
		return '' +
			'<div class="panel panel-default"><div class="panel-heading">' + header + ':</div><div class="panel-body">' +
			'<table>' +
			'<tr><th>Format</th><th colspan="3">A series</th><th colspan="3">B series</th><th colspan="3">C series</th></tr>' +
			'<tr><th>Size</th><th></th><th>mm × mm</th><th>in × in</th><th></th><th>mm × mm</th><th>in × in</th><th></th><th>mm × mm</th><th>in × in</th></tr>' +
			'<tr><td>0</td><td><input type="radio" name="wpsn_size" value="841 × 1189" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>841 × 1189</td><td>33.1 × 46.8</td><td><input type="radio" name="wpsn_size" value="1000 × 1414" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>1000 × 1414</td><td>39.4 × 55.7</td><td><input type="radio" name="wpsn_size" value="917 × 1297" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>917 × 1297</td><td>36.1 × 51.1</td></tr>' +
			'<tr><td>1</td><td><input type="radio" name="wpsn_size" value="594 × 841" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>594 × 841</td><td>23.4 × 33.1</td><td><input type="radio" name="wpsn_size" value="707 × 1000" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>707 × 1000</td><td>27.8 × 39.4</td><td><input type="radio" name="wpsn_size" value="648 × 917" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>648 × 917</td><td>25.5 × 36.1</td></tr>' +
			'<tr><td>2</td><td><input type="radio" name="wpsn_size" value="420 × 594" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>420 × 594</td><td>16.5 × 23.4</td><td><input type="radio" name="wpsn_size" value="500 × 707" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>500 × 707</td><td>19.7 × 27.8</td><td><input type="radio" name="wpsn_size" value="458 × 648" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>458 × 648</td><td>18.0 × 25.5</td></tr>' +
			'<tr><td>3</td><td><input type="radio" name="wpsn_size" value="297 × 420" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>297 × 420</td><td>11.7 × 16.5</td><td><input type="radio" name="wpsn_size" value="353 × 500" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>353 × 500</td><td>13.9 × 19.7</td><td><input type="radio" name="wpsn_size" value="324 × 458" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>324 × 458</td><td>12.8 × 18.0</td></tr>' +
			'<tr><td>4</td><td><input type="radio" name="wpsn_size" value="210 × 297" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>210 × 297</td><td>8.27 × 11.7</td><td><input type="radio" name="wpsn_size" value="250 × 353" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>250 × 353</td><td>9.84 × 13.9</td><td><input type="radio" name="wpsn_size" value="229 × 324" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>229 × 324</td><td>9.02 × 12.8</td></tr>' +
			'<tr><td>5</td><td><input type="radio" name="wpsn_size" value="148 × 210" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>148 × 210</td><td>5.83 × 8.27</td><td><input type="radio" name="wpsn_size" value="176 × 250" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>176 × 250</td><td>6.93 × 9.84</td><td><input type="radio" name="wpsn_size" value="162 × 229" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>162 × 229</td><td>6.38 × 9.02</td></tr>' +
			'<tr><td>6</td><td><input type="radio" name="wpsn_size" value="105 × 148" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>105 × 148</td><td>4.13 × 5.83</td><td><input type="radio" name="wpsn_size" value="125 × 176" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>125 × 176</td><td>4.92 × 6.93</td><td><input type="radio" name="wpsn_size" value="114 × 162" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>114 × 162</td><td>4.49 × 6.38</td></tr>' +
			'<tr><td>7</td><td><input type="radio" name="wpsn_size" value="74 × 105" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>74 × 105</td><td>2.91 × 4.13</td><td><input type="radio" name="wpsn_size" value="88 × 125" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>88 × 125</td><td>3.46 × 4.92</td><td><input type="radio" name="wpsn_size" value="81 × 114" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>81 × 114</td><td>3.19 × 4.49</td></tr>' +
			'<tr><td>8</td><td><input type="radio" name="wpsn_size" value="52 × 74" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>52 × 74</td><td>2.05 × 2.91</td><td><input type="radio" name="wpsn_size" value="62 × 88" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>62 × 88</td><td>2.44 × 3.46</td><td><input type="radio" name="wpsn_size" value="57 × 81" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>57 × 81</td><td>2.24 × 3.19</td></tr>' +
			'<tr><td>9</td><td><input type="radio" name="wpsn_size" value="37 × 52" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>37 × 52</td><td>1.46 × 2.05</td><td><input type="radio" name="wpsn_size" value="44 × 62" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>44 × 62</td><td>1.73 × 2.44</td><td><input type="radio" name="wpsn_size" value="40 × 57" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>40 × 57</td><td>1.57 × 2.24</td></tr>' +
			'<tr><td>10</td><td><input type="radio" name="wpsn_size" value="26 × 37" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>26 × 37</td><td>1.02 × 1.46</td><td><input type="radio" name="wpsn_size" value="31 × 44" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>31 × 44</td><td>1.22 × 1.73</td><td><input type="radio" name="wpsn_size" value="28 × 40" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>28 × 40</td><td>1.10 × 1.57</td></tr>' +
			'</table>' +
			'<br/>' +
			'<table>' +
			'<tr><th>Format</th><th colspan="3">North American</th>' +
			'<tr><th>Size</th><th></th><th>mm × mm</th><th>in × in</th>' +
			'<tr><td>Letter</td><td><input type="radio" name="wpsn_size" value="216 × 279" checked="checked" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>216 × 279</td><td>8.5 × 11</td>' +
			'<tr><td>Legal</td><td><input type="radio" name="wpsn_size" value="216 × 356" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td><td>216 × 356</td><td>8.5 × 14</td>' +
			'</table>' +
			'</div></div>' +
			'<div class="panel panel-default"><div class="panel-heading">Orientation:</div><div class="panel-body">' +
			'<input type="radio" name="wpsn_orientation" value="landscape" id="wpsn_landscape" checked="checked" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn_landscape">Landscape</label><br/>' +
			'<input type="radio" name="wpsn_orientation" value="portrait" id="wpsn_portrait" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn_portrait">Portrait</label><br/>' +
			'</div></div>';
	};

	wpsn.updateLookAndFeelForEffectiveNotes = async function (noteOrNotes) {
		let effectiveNotes = await wpsn.getEffectiveNotes(noteOrNotes);
		let note = effectiveNotes.notes[0];

		return await wpsn.actOnEffectiveNotesWithPrompt(
			noteOrNotes,
			'',//'Are you sure you want to update the font for {0}?', 
			async function () {
				let imageAndCanvas = await wpsn.takeScreenshot($(document.body),{canvasWidth:1000});
				let canvas = imageAndCanvas.canvas;
				return await wpsn.prompt(
					{
						load: function(note, preventResize){
							wpsn.fontPromptLoad(note, preventResize);
							
							$('input[name="wpsn_background"]').data('predefinedColors', '#ffa|#fc9|#fcf|#faa|#aaf|#9cf|#aff|#afa|#eee|#fff|'+wpsn.transparent);
							$('input[name="wpsn_textcolor"]').data('predefinedColors', '#000|#222|#444|#666|#888|#aaa|#ccc|#eee|#fff');
							$('input[name="wpsn_bordercolor"]').data('predefinedColors', '#000|#222|#444|#666|#888|#aaa|#ccc|#eee|#fff|'+wpsn.transparent);

							let $input = $('input[name="wpsn_background"],input[name="wpsn_textcolor"],input[name="wpsn_bordercolor"]');
							
							wpsn.colorInput($input, canvas);
						},
						minWidth: 600
					},
					'<div class="panel panel-default"><div class="panel-heading">Specify look and feel properties for ' + effectiveNotes.label + '</div><div class="panel-body">' + wpsn.fontPromptHTML(note[wpsn.menu.media.modes.media.id] != null) + '</div></div>',
					{
						'wpsn_font_family': note.font ? note.font.family : '',
						'wpsn_font_size': note.font ? note.font.size || '0' : '0',
						'wpsn_background': note.background || '',
						'wpsn_textcolor': note.textcolor || '',
						'wpsn_textposition': note.textposition || '',
						'wpsn_textshadow': note.textshadow || '',
						'wpsn_bordercolor': note.bordercolor || '',
						'wpsn_text_align': note.textAlign || ''
					}
				);
			},
			wpsn.updateLookAndFeelForNote
		);
	};

	wpsn.updateLookAndFeelForNote = function (note, form) {
		if (form) {
			note.font = note.font || {};
			note.font.family = form.wpsn_font_family;
			note.font.size = parseInt(form.wpsn_font_size) || null;
			note.background = form.wpsn_background;
			note.textcolor = form.wpsn_textcolor;
			note.textposition = form.wpsn_textposition;
			note.textshadow = form.wpsn_textshadow;
			note.bordercolor = form.wpsn_bordercolor;
			note.textAlign = form.wpsn_text_align;
			wpsn.refreshNote(note);
		}
	};

	wpsn.updateSampleNote = function(note, preventResize) {
		let $noteDiv = wpsn.getNoteDiv(note);

		let $sampleTextDiv = $noteDiv.find('.wpsn_sample_text_div');
		let $sampleText = $sampleTextDiv.find('.wpsn_sample_text');
		let $sampleTextSpan = $sampleText.children('span');

		let $fontFamily = $noteDiv.find('[name="wpsn_font_family"]');
		let $fontSize = $noteDiv.find('[name="wpsn_font_size"]');
		let $backgroundColor = $noteDiv.find('[name="wpsn_background"]');
		let $borderColor = $noteDiv.find('[name="wpsn_bordercolor"]');
		let $textColor = $noteDiv.find('[name="wpsn_textcolor"]');
		let $textPosition = $noteDiv.find('input[name="wpsn_textposition"]:checked');
		let $textShadow = $noteDiv.find('input[name="wpsn_textshadow"]:checked');
		let $withMedia = $noteDiv.find('input[name="wpsn_withmedia"]:checked');
		let $textAlign = $noteDiv.find('input[name="wpsn_text_align"]:checked')

		let fontFamily = $fontFamily.val();
		let fontSize = $fontSize.val();
			fontSize = fontSize ? parseInt(fontSize) : null;
		let backgroundColor = $backgroundColor.val();
		let borderColor = $borderColor.val();
		let textColor = $textColor.val();
		let textPosition = $textPosition.val();
		let textShadow = $textShadow.val() == 'true';
		let withMedia = $withMedia.val() == 'true';
		let textAlign = $textAlign.val();
		
		$sampleText.css('font-family', fontFamily || 'inherit');
		$sampleText.css('font-size', fontSize || 'inherit').css('line-height', fontSize ? (fontSize + 9) + 'px' : 'inherit');
		$sampleText.css('background', (withMedia ? '#fff url(\'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/logo/wpsn-logo.svg\') repeat 0 0' : backgroundColor));
		$sampleText.css('border', '1px solid '+borderColor);
		$sampleText.css('color', textColor);
		let positions = ['top-left', 'top-center', 'top-right', 'center-left', 'center-center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'];
		for (let i = 0; i < positions.length; i++) { let tpos = positions[i]; $sampleTextSpan.removeClass('wpsn-text-' + tpos);}
		$sampleTextSpan.addClass('wpsn-text-' + (withMedia ? textPosition: 'top-left'));
		$sampleTextSpan.removeClass('wpsn-text-shadow');
		if (withMedia && textShadow) { 
			$sampleTextSpan.addClass('wpsn-text-shadow'); 
			$sampleText.css('color', '#fff');
		}
		$sampleTextSpan.css('text-align', textAlign);
		$sampleTextSpan.css('position', 'relative');
		$sampleText.css('height', 'auto');
		$sampleText.css('height', $sampleText.height() + 50);
		$sampleTextSpan.css('position', 'absolute');


		//wpsn.autoResize(note);
	};

	wpsn.fontPromptLoad = function (note, preventResize) {
		let noteDiv = wpsn.getNoteDiv(note);

		noteDiv.find('[name="wpsn_font_family"]').unbind('input').bind('input', function () {
			let $that = $(this);
			wpsn.delay(function () {
				wpsn.updateSampleNote(note, preventResize);
				let fontFamily = $that.val();
				if ($.inArray(fontFamily, wpsn.defaultGoogleFonts) && $.inArray(fontFamily, wpsn.loadedFonts) < 0) {
					wpsn.loadFonts([fontFamily]);
				}
				if (!preventResize) wpsn.autoResize(note);
			}, 1000);
		}).focus(function () { 
			$(this).select(); 
		}).focus();

		

		noteDiv.find('[name="wpsn_font_size"]').unbind('change').bind('change', function () {
			wpsn.updateSampleNote(note, preventResize);
		});

		noteDiv.find('input[name="wpsn_background"]').unbind('change').bind('change', function () {
			wpsn.updateSampleNote(note, preventResize);
		});

		noteDiv.find('input[name="wpsn_bordercolor"]').unbind('change').bind('change', function () {
			wpsn.updateSampleNote(note, preventResize);
		});

		noteDiv.find('input[name="wpsn_textcolor"]').unbind('change').bind('change', function () {
			wpsn.updateSampleNote(note, preventResize);
		});

		noteDiv.find('input[name="wpsn_textposition"]').unbind('change').bind('change', function () {
			wpsn.updateSampleNote(note, preventResize);
		});

		noteDiv.find('input[name="wpsn_textshadow"]').unbind('change').bind('change', function () {
			wpsn.updateSampleNote(note, preventResize);
		});

		noteDiv.find('input[name="wpsn_withmedia"]').unbind('change').bind('change', function () {
			wpsn.updateSampleNote(note, preventResize);
		});

		noteDiv.find('input[name="wpsn_text_align"]').unbind('change').bind('change', function () {
			wpsn.updateSampleNote(note, preventResize);
		});

		noteDiv.find('input[name="wpsn_font_size"]').bind('change', function () {
			let size = $(this).val() || 0;
			size = parseInt(size) > 0 ? size + 'px' : 'browser default size';
			$('span.' + $(this).data('display')).text(size);
		}).each(function () {
			let size = $(this).val() || 0;
			size = parseInt(size) > 0 ? size + 'px' : 'browser default size';
			$('span.' + $(this).data('display')).text(size);
		}).change();

	};

	wpsn.fontPromptHTML = function (isMedia, includeMedia, isSettings) {
		let prompt = '';
		prompt += '<label for="wpsn_font_family">Font Family:</label><br/><input id="wpsn_font_family" name="wpsn_font_family" class="form-control" type="text" list="wpsn_font_family_list"/>'
			+ '<datalist id="wpsn_font_family_list">'
			+ '<optgroup label="Web Safe Fonts">';
		for (let i = 0; i < wpsn.defaultFonts.length; i++) {
			let font = wpsn.defaultFonts[i];
			prompt += '<option>' + font + '</option>';
		}
		prompt += '</optgroup><optgroup label="Google Web Fonts">';
		for (let i = 0; i < wpsn.defaultGoogleFonts.length; i++) {
			let font = wpsn.defaultGoogleFonts[i];
			prompt += '<option>' + font + '</option>';
		}
		prompt += '</optgroup></datalist><a href="https://fonts.google.com/" target="_blank">Research or Find more Fonts</a><br/><br/>';
		prompt += '<label for="wpsn_font_size">Font Size:</label><br/>'
			+ '<input type="range" style="width:100%;" name="wpsn_font_size" min="0" max="100" step="1" data-display="wpsn-wpsn_font_size" list="wpsn_font_size_list"><datalist id="wpsn_font_size_list">';
		for (let i = 0; i < wpsn.defaultFontSizes.length; i++) {
			let fontSize = wpsn.defaultFontSizes[i];
			prompt += '<option value="' + fontSize + '">' + fontSize + 'px</option>';
		}
		prompt += '</datalist></input><span class="wpsn-wpsn_font_size" style="padding-left:5px;"></span><br/>';

		prompt +=
			'<label for="wpsn_background">Background</label><br/>' +
			'<input type="text" name="wpsn_background" id="wpsn_background"/>' +
			'<br/>';
		prompt +=
			'<label for="wpsn_bordercolor">Border Color</label><br/>' +
			'<input type="text" name="wpsn_bordercolor" id="wpsn_bordercolor"/>' +
			'<br/>';
		prompt +=
			'<label for="wpsn_textcolor">Text Color</label><br/>' +
			'<input type="text" name="wpsn_textcolor" id="wpsn_textcolor"/>' +
			'<br/>';
		
		if (isMedia || includeMedia) {
			prompt += '<label>Media Text Shadow:</label><br/>';
			prompt += '<input type="radio" name="wpsn_textshadow" value="true" id="wpsn-textshadow-true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/><label for="wpsn-textshadow-true"><b>True</b></label> ';
			prompt += '<input type="radio" name="wpsn_textshadow" value="false" id="wpsn-textshadow-false" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/><label for="wpsn-textshadow-false"><b>False</b></label> ';
			prompt += '<br/><br/>';
		}

		prompt +=
		'<label for="wpsn_background">Text Alignment</label><br/>' +
		'<label><input type="radio" class="wpsn_radio_img" name="wpsn_text_align" id="wpsn_text_align" value="left"/>' +
		'<img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/format_align_left.svg" title="Text Align Left"/></label> ' +
		'<label><input type="radio" class="wpsn_radio_img" name="wpsn_text_align" id="wpsn_text_align" value="center"/>' +
		'<img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/format_align_center.svg" title="Text Align Center"/></label> ' +
		'<label><input type="radio" class="wpsn_radio_img" name="wpsn_text_align" id="wpsn_text_align" value="right"/>' +
		'<img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/format_align_right.svg" title="Text Align Right"/></label> ' +
		'<label><input type="radio" class="wpsn_radio_img" name="wpsn_text_align" id="wpsn_text_align" value="justify"/>' +
		'<img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/format_align_justify.svg" title="Text Align Justify"/></label> ' +
		'<br/><br/>';

		prompt+= '<div style="white-space:nowrap">';
		if (isMedia || includeMedia) {
			let positions = ['top-left', 'top-center', 'top-right', 'center-left', 'center-center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'];
			prompt += '<label>Media Text Position:</label>';
			for (let i = 0; i < positions.length; i++) {
				let pos = positions[i];
				if (i % 3 == 0) {
					prompt += '<br/>';
				}
				prompt += '<input type="radio" name="wpsn_textposition" value="' + pos + '" id="wpsn-textposition-' + pos + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/>' +
					'<label for="wpsn-textposition-' + pos + '" style="width:150px;"><b>' + pos + '</b></label>&nbsp; ';
			}
			prompt += '<br/><br/>';
		}
		prompt+= '</div>';
		prompt += '<div class="wpsn_sample_text_div"><label>Sample Note:</label>';
		if (isSettings) {
			prompt += '<br/><div class="wpsn_sample_text_div"><label>&nbsp;&nbsp;&nbsp;With Media:</label>';
			prompt += '<input type="radio" name="wpsn_withmedia" value="true" id="wpsn-withmedia-true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/><label for="wpsn-withmedia-true"><b>True</b></label> ';
			prompt += '<input type="radio" name="wpsn_withmedia" value="false" id="wpsn-withmedia-false" checked="checked" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/><label for="wpsn-withmedia-false"><b>False</b></label> ';
		}
		prompt += '<br/><div class="wpsn_sample_text" style="min-height:100px;position:relative;padding:14px"><span>The quick brown fox jumps over the lazy dog. <br/><br/> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut.</span></div></div>';
		return prompt;
	};


	wpsn.zoomInEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.zoomInNote, '');
	};

	wpsn.zoomInNote = function (note, options) {
		options = options || {};
		let anchorNote = options.anchorNote || note;
		note.zoom = anchorNote.zoom || 100;
		note.zoom += 10;
		wpsn.getNoteDiv(note).find('.wpsn-frame').css('zoom', (note.zoom || 100) + '%');
		wpsn.save(note);
	};

	wpsn.zoomOutEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.zoomOutNote, '');
	};

	wpsn.zoomOutNote = function (note, options) {
		options = options || {};
		let anchorNote = options.anchorNote || note;
		note.zoom = anchorNote.zoom || 100;
		note.zoom -= 10;
		wpsn.getNoteDiv(note).find('.wpsn-frame').css('zoom', (note.zoom || 100) + '%');
		wpsn.save(note);
	};

	wpsn.zoomOnEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.zoomOnNote, '');
	};

	wpsn.zoomOnNote = function (note) {
		note.zoom = 100;
		wpsn.getNoteDiv(note).find('.wpsn-frame').css('zoom', (note.zoom || 100) + '%');
		wpsn.save(note);
	};

	wpsn.toggleLockEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.toggleLockNote, 'Are you sure you want to toggle lock for {0}?');
	};

	wpsn.toggleLockNote = function (note, options) {
		options = options || {};
		let anchorNote = options.anchorNote || note;
		if (!anchorNote.lockmode) {
			note.lock = true;
			note.lockmode = wpsn.lockModes.all;
		} else if (anchorNote.lockmode == wpsn.lockModes.all) {
			note.lockmode = wpsn.lockModes.editable;
		} else {
			delete note.lock;
			delete note.lockmode;
		}
		wpsn.refreshNote(note);
	};

	wpsn.updateEffectiveNotesMode = async function (noteOrNotes) {
		let effectiveNotes = await wpsn.getEffectiveNotes(noteOrNotes);
		let note = effectiveNotes.notes[0];

		return await wpsn.actOnEffectiveNotesWithPrompt(
			noteOrNotes,
			'',//'Are you sure you want to update note editing/rendering modes for {0}?', 
			function () {
				return wpsn.prompt({}, wpsn.modePromptHTML('Note editing/rendering mode for ' + effectiveNotes.label), { 'wpsn_mode': note.mode || wpsn.getModeId(wpsn.defaultMode) });
			},
			wpsn.updateNoteMode
		);
	};

	wpsn.updateNoteMode = function (note, form) {
		if (form) {
			note.mode = form.wpsn_mode;
			note.htmlMode = wpsn.getModeKey(note) == 'texteditor';
			wpsn.refreshNote(note);
		}
	};


	wpsn.modePromptHTML = function (header) {
		let promptHTML = '<ul/>';
		let modeKeys = wpsn.getModeKeys(wpsn.menu.mode.modes);
		for (let i = 0; i < modeKeys.length; i++) {
			if (!modeKeys[i]) { continue; }
			let modeKey = modeKeys[i];
			let mode = wpsn.menu.mode.modes[modeKey];
			promptHTML += '<li style="list-style-type:none"><input type="radio" name="wpsn_mode" value="' + mode.id + '" id="wpsn-mode-' + mode.id + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/>' +
				'<label for="wpsn-mode-' + mode.id + '"><b>' + mode.name + '</b></label>';
			if (mode.description) {
				promptHTML += '<span>: ' + mode.description + '</span>';
			}
			promptHTML += '</li>';
		}
		promptHTML += '</ul>';
		return '<div class="panel panel-default"><div class="panel-heading">' + (header || 'Note editing/rendering mode') + ':</div><div class="panel-body">' + promptHTML + '</div></div>';
	};

	wpsn.renderChecklist = function (note) {
		let text = note.text;
		
		text = text
			.replace(/(^|\n)(\s*|\t*)-\s/g, '$1$2<span class="wpsn-md-checkbox wpsn-md-unchecked" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"></span> ')
			.replace(/(^|\n)(\s*|\t*)x\s/g, '$1$2<span class="wpsn-md-checkbox wpsn-md-checked" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"></span> ')
			.replace(/  /g,'&nbsp;&nbsp;');

		note.previewText = text;

		wpsn.renderMarkdown(note);

		let noteDiv = wpsn.getNoteDiv(note);
		let noteFrame = $('.wpsn-frame', noteDiv);

		$('.wpsn-md-checkbox', noteFrame).click(function(){
			let $cb = $(this);
			if ($cb.is('.wpsn-md-checked')) {
				$cb.removeClass('wpsn-md-checked').removeClass('wpsn-md-unchecked').addClass('wpsn-md-unchecked');
			} else {
				$cb.removeClass('wpsn-md-checked').removeClass('wpsn-md-unchecked').addClass('wpsn-md-checked')
			}

			let ttext = note.text;
			let tttext = '';
			let token = '|~^~|';
			$('.wpsn-md-checkbox', noteFrame).each(function(index){
				let replaceWith = $(this).is('.wpsn-md-checked')?'x':'-';
				ttext = ttext.replace(/(^|\n)(\s*|\t*)[-|x]/, '$1$2'+replaceWith+token);
				tttext += ttext.split(token)[0];
				ttext = ttext.split(token)[1];

			});
			tttext += ttext;
			note.text = tttext;
			wpsn.save(note);
		});
		$('.wpsn-md-checkbox', noteFrame).parent('li').parent('ul,ol').addClass('wpsn-md-checkbox-list');
	}

	wpsn.renderMarkdown = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let noteFrame = $('.wpsn-frame', noteDiv);
		let text = wpsn.markdownConverter((note.previewText || note.text || '').replace(/{@@extension_id}/g, chrome.i18n.getMessage('@@extension_id')));
			
		noteFrame.html(text);

		if (noteFrame.html() && noteFrame.html().indexOf('<!--TOC-->') > -1) {
			let toc = '';
			$('h1,h2,h3,h4,h5,h6', noteFrame).each(function () {
				let $header = $(this);
				let headerNumber = parseInt($header.prop('tagName').replace('H', ''));
				toc += '<li>';
				for (let i = 1; i < headerNumber; i++) {
					toc += '&nbsp;&nbsp;&nbsp;&nbsp;';
				}
				toc += '<a class="wpsn-toc" href="#' + $header.attr('id') + '">' + $header.html() + '</a>';
				for (let i = 0; i < headerNumber; i++) {
					//toc+= '</ul></li>';
				}
				toc += '</li>';
			});
			if (toc) { toc = '<ul style="margin-left:0;padding-left:0;list-style-type:none">' + toc + '</ul>'; }
			noteFrame.prepend(toc);
			$('.wpsn-toc', noteFrame).click(function () {
				$($(this).attr('href')).get(0).scrollIntoView();
				return false;
				//window.localStorage.setItem('wpsn_TOCCLick',true);
			});
		}
	};

	wpsn.renderAsIs = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let noteFrame = $('.wpsn-frame', noteDiv);
		noteFrame.html(wpsn.htmlEncode(note.previewText || note.text).replace(/\r\n|\r|\n/g, '<br/>').replace(/ {2}/g, ' &nbsp;'));
	};

	wpsn.renderPrettyfied = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let noteFrame = $('.wpsn-frame', noteDiv);
		let text = note.previewText || note.text;
		try { text = JSON.stringify(JSON.parse(note.previewText || note.text), null, 2); } catch (err) {
			try { text = vkbeautify.xml(text); } catch (err) { wpsn.error(err); }
		}
		noteFrame.html('<pre class="prettyprint">' + wpsn.htmlEncode(text) + '</pre>');
		if (window.prettyPrint) window.prettyPrint();
	};

	wpsn.renderHTML = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let noteFrame = $('.wpsn-frame', noteDiv);
		noteFrame.html(note.previewText || note.text);
	};

	wpsn.renderExperimental = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let noteFrame = $('.wpsn-frame', noteDiv);
		noteFrame.html((note.previewText || note.text).replace(/\r\n|\r|\n/g, '<br/>').replace(/ {2}/g, ' &nbsp;'));
	};

	wpsn.commands.updateScope = async function (noteOrNotes) {
		let effectiveNotes = await wpsn.getEffectiveNotes(noteOrNotes);
		let note = effectiveNotes.notes[0];
		return await wpsn.actOnEffectiveNotesWithPrompt(
			noteOrNotes,
			'',//'Are you sure you want to update the scope of {0}?', 
			function () {
				return wpsn.prompt(
					wpsn.scope.promptOptions(),
					'<div class="panel panel-default"><div class="panel-heading"><span style="white-space:nowrap">' + effectiveNotes.label + ' will be visible for pages matching selected criteria:</span></div><div class="panel-body">' + wpsn.scope.input(note) + '<br/><br/>Tip: You can use a wildcard \'*\' in the fields above.<br/></div></div>'+
					`
					<div class="panel panel-default"><div class="panel-heading">Enable Note Positioning Per Page</div><div class="panel-body">
					If note is scoped to many pages, its position can vary between pages.<br/>
					<input type="radio" name="wpsn_multiPosition" value="true" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> Yes <input type="radio" name="wpsn_multiPosition" value="false" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> No</div></div>
					`,
					wpsn.scope.noteToForm(note)
				);
			},
			wpsn.scope.updateScope
		);
	};

	wpsn.scope = {
		updateScope: function (note, form) {
			if (form) {
				note.scope = {};

				let noteDiv = wpsn.getNoteDiv(note);
				wpsn.scope.formToNote(note, form);

				if (wpsn.getSavePath(note) == wpsn.keys.domain) {
					noteDiv.addClass('wpsn-domain').removeClass('wpsn-global');
				} else if (wpsn.getSavePath(note) == wpsn.keys.global) {
					noteDiv.addClass('wpsn-global').removeClass('wpsn-domain');
				} else {
					noteDiv.removeClass('wpsn-domain').removeClass('wpsn-global');
				}
				wpsn.refreshNote(note);
			}
		},
		input: function (note) {
			let table = '<div class="wpsn_table_div">';
			let count = Array.isArray(note.scope) ? note.scope.length : 1;
			for (let i = 0; i < count; i++) {
				table += wpsn.scope.table(note, i);
			}

			table += '</div>' +
				'<input type="button" name="wpsn_add" class="btn btn-success wpsn_add" value="Add Criteria" style="margin-top: 20px"/>' +
				'<input type="hidden" name="wpsn_count" class="wpsn_count" value="' + count + '"/>';
			return table;
		},
		table: function (note, index) {
			let wpsn_ = 'wpsn' + (index > 0 ? index : '') + '_';
			let scope = Array.isArray(note.scope) ? note.scope[index] : (index == 0 ? note.scope : {});
			let table = '' +
				'<div class="wpsn_scope_div">';
			table += '' +
				'<table class="wpsn-scope form-inline ' + wpsn_ + 'table">' +
				'<tr>' +
				'<td>URL</td>' +
				'<td><input type="text" class="' + wpsn_ + 'url form-control" style="width:100%"/></td>' +
				'</tr>' +
				'<tr>' +
					'<td>Protocol</td>' +
					'<td><input type="checkbox" name="' + wpsn_ + 'scope_protocol" class="' + wpsn_ + 'scope_protocol" value="' + location.protocol + '" id="wpsn-' + location.protocol + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'" /> <input type="text" value="' + location.protocol + '" class="form-control"/></td>' +
					(note.scope && note.scope.protocol && scope.protocol != location.protocol ?
						'<td><input type="checkbox" name="' + wpsn_ + 'scope_protocol" class="' + wpsn_ + 'scope_protocol" value="' + scope.protocol + '" id="wpsn-' + scope.protocol + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn-' + scope.protocol + '">' + scope.protocol + '</label></td>'
						: '') +
					'</tr>'+
					'<tr>' +
					'<td>Host name</td>' +
					'<td><input type="checkbox" name="' + wpsn_ + 'scope_hostname" class="' + wpsn_ + 'scope_hostname" value="' + location.hostname + '" id="wpsn-' + location.hostname + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <input type="text" class="form-control" value="' + location.hostname + '"/></td>' +
					(scope && scope.hostname && scope.hostname != location.hostname ?
						'<td><input type="checkbox" name="' + wpsn_ + 'scope_hostname" class="' + wpsn_ + 'scope_hostname" value="' + scope.hostname + '" id="wpsn-' + scope.hostname + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn-' + scope.hostname + '">' + scope.hostname + '</label></td>'
						: '') +
					'</tr>'+
					'<tr>' +
					'<td>Port</td>' +
					'<td><input type="checkbox" name="' + wpsn_ + 'scope_port" class="' + wpsn_ + 'scope_port" value="' + location.port + '" id="wpsn-' + location.port + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'" /> <input type="text" class="form-control" value="' + location.port + '"/></td>' +
					(scope && scope.port && scope.port != location.port ?
						'<td><input type="checkbox" name="' + wpsn_ + 'scope_port" class="' + wpsn_ + 'scope_port" value="' + scope.port + '" id="wpsn-' + scope.port + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn-' + scope.port + '">' + scope.port + '</label></td>'
						: '') +
					'</tr>'+
					'<tr>' +
					'<td>Path name</td>' +
					'<td><input type="checkbox" name="' + wpsn_ + 'scope_pathname" class="' + wpsn_ + 'scope_pathname" value="' + location.pathname + '" id="wpsn-' + location.pathname + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'" /> <input type="text" class="form-control" value="' + location.pathname + '"/></td>' +
					(scope && scope.pathname && scope.pathname != location.pathname ?
						'<td><input type="checkbox" name="' + wpsn_ + 'scope_pathname" class="' + wpsn_ + 'scope_pathname" value="' + scope.pathname + '" id="wpsn-' + scope.pathname + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn-' + scope.pathname + '">' + scope.pathname + '</label></td>'
						: '') +
					'</tr>'+
					'<tr>' +
					'<td>Query string</td>' +
					'<td><input type="checkbox" name="' + wpsn_ + 'scope_search" class="' + wpsn_ + 'scope_search" value="' + location.search + '" id="wpsn-' + location.search + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'" /> <input type="text"  class="form-control" value="' + (location.search ? location.search : location.href.indexOf('?') >= 0 ? '?' : '') + '"/></td>' +
					(scope && scope.search && scope.search != location.search ?
						'<td><input type="checkbox" name="' + wpsn_ + 'scope_search" class="' + wpsn_ + 'scope_search" value="' + scope.search + '" id="wpsn-' + scope.search + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn-' + scope.search + '">' + scope.search + '</label></td>'
						: '') +
					'</tr>'+
					'<tr>' +
					'<td>Hash name</td>' +
					'<td><input type="checkbox" name="' + wpsn_ + 'scope_hash" class="' + wpsn_ + 'scope_hash" value="' + location.hash + '" id="wpsn-' + location.hash + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'" /> <input type="text" class="form-control" value="' + location.hash + '"/></td>' +
					(scope && scope.hash && scope.hash != location.hash ?
						'<td><input type="checkbox" name="' + wpsn_ + 'scope_hash" class="' + wpsn_ + 'scope_hash" value="' + scope.hash + '" id="wpsn-' + scope.hash + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn-' + scope.hash + '">' + scope.hash + '</label></td>'
						: '') +
					'</tr>'+
					'<tr>' +
					'<td>Page title</td>' +
					'<td><input type="checkbox" name="' + wpsn_ + 'scope_title" class="' + wpsn_ + 'scope_title" value="' + document.title + '" id="wpsn-' + document.title + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'" /> <input type="text" class="form-control" value="' + document.title + '"/></td>' +
					(scope && scope.title && scope.title != document.title ?
						'<td><input type="checkbox" name="' + wpsn_ + 'scope_title" class="' + wpsn_ + 'scope_title" value="' + scope.title + '" id="wpsn-' + scope.title + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/><label for="wpsn-' + scope.title + '">' + scope.title + '</label></td>'
						: '') +
					'</tr>';
			table += '' +
					'<tr><td colspan="2">' +
					'<input type="button" name="wpsn_remove" class="btn btn-danger wpsn_remove" value="Remove Criteria" style=""/>' +
					'<input type="hidden" name="' + wpsn_ + 'index" value="' + index + '"/>' +
					'</td></tr>';
			
			table += '' +
				'</table>' +
				'<br/>' +
				'</div>';

			return table;
		},
		noteToForm: function (note) {
			let form = {};
			let count = Array.isArray(note.scope) ? note.scope.length : 1;
			for (let i = 0; i < count; i++) {
				let wpsn_ = 'wpsn' + (i > 0 ? i : '') + '_';
				let scope = Array.isArray(note.scope) ? note.scope[i] : (i == 0 ? note.scope : {});
				let tform = {};
				tform[wpsn_ + 'scope_protocol'] = scope ? scope.protocol : location.protocol;
				tform[wpsn_ + 'scope_hostname'] = scope ? scope.hostname : location.hostname;
				tform[wpsn_ + 'scope_port'] = scope ? scope.port : location.port;
				tform[wpsn_ + 'scope_pathname'] = scope ? scope.pathname : location.pathname;
				tform[wpsn_ + 'scope_search'] = scope ? scope.search : location.search;
				tform[wpsn_ + 'scope_hash'] = scope ? scope.hash : location.hash;
				tform[wpsn_ + 'scope_title'] = scope ? scope.title : document.title;
				form = Object.assign(form, tform);
			}
			form['wpsn_multiPosition'] = ''+((note.multiPosition != undefined) ? (note.multiPosition) : (wpsn.settings.multiPosition));
			for (let property in form) {
				if (form[property] == undefined) delete form[property];
			}
			return form;
		},
		formToNote: function (note, form) {
			let count = parseInt(form['wpsn_count']);
			note.scope = [];
			for (let i = 0; i < count; i++) {
				let wpsn_ = 'wpsn' + (i > 0 ? i : '') + '_';
				if (form[wpsn_ + 'index'] == null) { continue; }
				let scope = {};
				scope.protocol = form[wpsn_ + 'scope_protocol'];
				scope.hostname = form[wpsn_ + 'scope_hostname'];
				scope.port = form[wpsn_ + 'scope_port'];
				scope.pathname = form[wpsn_ + 'scope_pathname'];
				scope.search = form[wpsn_ + 'scope_search'];
				scope.hash = form[wpsn_ + 'scope_hash'];
				scope.title = form[wpsn_ + 'scope_title'];
				note.scope.push(scope);
			}
			if (note.scope.length == 1) {
				note.scope = note.scope[0];
			}
			note.multiPosition = form['wpsn_multiPosition'] == 'true';
			if (wpsn.isMultiPosition(note)) {
				wpsn.setScopedProp(note,'pos_x',note.pos_x);
				wpsn.setScopedProp(note,'pos_y',note.pos_y);
			}
		},
		promptOptions: function () {
			return {
				load: function (note) {
					let $count = $('.wpsn_count');
					let count = parseInt($count.val());
					let wpsn_ = 'wpsn' + (count > 1 ? count - 1 : '') + '_';
					let wpsn_bind_events = function (wpsn_) {
						$('.wpsn_remove').unbind('click').bind('click', function () {
							$(this).closest('.wpsn_scope_div').remove();
							wpsn.centerNote(wpsn.autoResize(note));
							let scrollDiv = wpsn.getNoteDiv(note).find('.wpsn-scrollbar').get(0);
							scrollDiv.scrollTop = scrollDiv.scrollHeight;
						});

						let $protocolCheck = $('.' + wpsn_ + 'scope_protocol');
						let $hostnameCheck = $('.' + wpsn_ + 'scope_hostname');
						let $portCheck = $('.' + wpsn_ + 'scope_port');
						let $pathnameCheck = $('.' + wpsn_ + 'scope_pathname');
						let $searchCheck = $('.' + wpsn_ + 'scope_search');
						let $hashCheck = $('.' + wpsn_ + 'scope_hash');
						$('.form-control').unbind('change keyup keydown blur').bind('change keyup keydown blur', function () { $(this).siblings('input').val($(this).val()); });
						$('.' + wpsn_ + 'url').unbind('change keyup keydown blur').bind('change keyup keydown blur', function () {
							if ($(this).val()) {
								let loc = wpsn.location($(this).val());
								let $protocol = $protocolCheck.siblings('.form-control'); $protocol.val(loc.protocol); $protocol.trigger('change'); if (wpsn.settings.scope && wpsn.settings.scope.protocol == true) {$protocolCheck.prop('checked', true);}
								let $hostname = $hostnameCheck.siblings('.form-control'); $hostname.val(loc.hostname); $hostname.trigger('change'); if (wpsn.settings.scope && wpsn.settings.scope.hostname == true) {$hostnameCheck.prop('checked', true);}
								let $port = $portCheck.siblings('.form-control'); $port.val(loc.port); $port.trigger('change'); if (wpsn.settings.scope && wpsn.settings.scope.port == true) {$portCheck.prop('checked', true);}
								let $pathname = $pathnameCheck.siblings('.form-control'); $pathname.val(loc.pathname); $pathname.trigger('change'); if (wpsn.settings.scope && wpsn.settings.scope.pathname == true) {$pathnameCheck.prop('checked', true);}
								let $search = $searchCheck.siblings('.form-control'); $search.val(loc.search); $search.trigger('change'); if (wpsn.settings.scope && wpsn.settings.scope.search == true) {$searchCheck.prop('checked', true);}
								let $hash = $hashCheck.siblings('.form-control'); $hash.val(loc.hash); $hash.trigger('change'); if (wpsn.settings.scope && wpsn.settings.scope.hash == true) {$hashCheck.prop('checked', true);}
							}
						}).focus();

						$protocolCheck.unbind('click').bind('click', function () { let checked = $(this).prop('checked'); $protocolCheck.prop('checked', false); $(this).prop('checked', checked); });
						$hostnameCheck.unbind('click').bind('click', function () { let checked = $(this).prop('checked'); $hostnameCheck.prop('checked', false); $(this).prop('checked', checked); });
						$portCheck.unbind('click').bind('click', function () { let checked = $(this).prop('checked'); $portCheck.prop('checked', false); $(this).prop('checked', checked); });
						$pathnameCheck.unbind('click').bind('click', function () { let checked = $(this).prop('checked'); $pathnameCheck.prop('checked', false); $(this).prop('checked', checked); });
						$searchCheck.unbind('click').bind('click', function () { let checked = $(this).prop('checked'); $searchCheck.prop('checked', false); $(this).prop('checked', checked); });
						$hashCheck.unbind('click').bind('click', function () { let checked = $(this).prop('checked'); $hashCheck.prop('checked', false); $(this).prop('checked', checked); });

						/*
						if ($protocolCheck.size() == 1 && (wpsn.settings.scope && wpsn.settings.scope.protocol == true)) {$protocolCheck.prop('checked', true);}
						if ($hostnameCheck.size() == 1 && (wpsn.settings.scope && wpsn.settings.scope.hostname == true)) {$hostnameCheck.prop('checked', true);}
						if ($portCheck.size() == 1 && (wpsn.settings.scope && wpsn.settings.scope.port == true)) {$portCheck.prop('checked', true);}
						if ($pathnameCheck.size() == 1 && (wpsn.settings.scope && wpsn.settings.scope.pathname == true)) {$pathnameCheck.prop('checked', true);}
						if ($searchCheck.size() == 1 && (wpsn.settings.scope && wpsn.settings.scope.search == true)) {$searchCheck.prop('checked', true);}
						if ($hashCheck.size() == 1 && (wpsn.settings.scope && wpsn.settings.scope.hash == true)) {$hashCheck.prop('checked', true);}
						*/
					};
					$('.wpsn_add').click(function () {
						let count = parseInt($count.val());
						let wpsn_ = 'wpsn' + (count > 0 ? count : '') + '_';
						$('.wpsn_table_div').append(wpsn.scope.table(note, count));
						$count.val(++count);

						wpsn_bind_events(wpsn_);
						wpsn.centerNote(wpsn.autoResize(note));
						let scrollDiv = wpsn.getNoteDiv(note).find('.wpsn-scrollbar').get(0);
						scrollDiv.scrollTop = scrollDiv.scrollHeight;
					});

					wpsn_bind_events(wpsn_);
				}
			};
		}
	};


	wpsn.bringToTopEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.bringToTopNote, '');
	};

	wpsn.nextOrder = function() {
		let lastOrder = -1;
		for (let i = 0; i < wpsn.notes.length; i++) {
			let _note = wpsn.notes[i];
			let _order = _note.order || -1;
			lastOrder = _order > lastOrder ? _order : lastOrder;
		}
		return lastOrder+1;
	}

	wpsn.bringToTopNote = function (note) {
		for (let i = 0; i < wpsn.notes.length; i++) {
			if (!wpsn.notes[i]) { continue; }
			let tempNote = wpsn.notes[i];
			if (note && tempNote && note.id == tempNote.id) {
				wpsn.notes.splice(i, 1);
				wpsn.notes.push(note);
				break;
			}
		}
		for (let i = 0; i < wpsn.notes.length; i++) {
			if (!wpsn.notes[i]) { continue; }
			let tempNote = wpsn.notes[i];
			tempNote.order = i+1;
		}
		wpsn.refreshAllNotes();
	};

	wpsn.sendToBottomEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.sendToBottomNote, '');
	};

	wpsn.sendToBottomNote = function (note) {
		for (let i = 0; i < wpsn.notes.length; i++) {
			if (!wpsn.notes[i]) { continue; }
			let tempNote = wpsn.notes[i];
			if (note && tempNote && note.id == tempNote.id) {
				wpsn.notes.splice(i, 1);
				wpsn.notes.unshift(note);
				break;
			}
		}
		for (let i = 0; i < wpsn.notes.length; i++) {
			if (!wpsn.notes[i]) { continue; }
			let tempNote = wpsn.notes[i];
			tempNote.order = i+1;
		}
		wpsn.refreshAllNotes();
	};

	wpsn.cloneCanvas = function(oldCanvas) {

		//create a new canvas
		var newCanvas = document.createElement('canvas');
		var context = newCanvas.getContext('2d');
	
		//set dimensions
		newCanvas.width = oldCanvas.width;
		newCanvas.height = oldCanvas.height;
	
		//apply the old canvas to the new one
		context.drawImage(oldCanvas, 0, 0);
	
		//return the new canvas
		return newCanvas;
	}

	wpsn.colorInput = function($inputs, canvas) {
		$inputs.each(function(){
			let $input = $(this);
			let note = wpsn.getNoteFromDiv($input.parents('.wpsn-sticky'))
			let colors = $input.data('predefinedColors')||'';
			colors = colors.split('|');
			let defaultColor = $input.val() || '#fff';
			let $predefined = $(wpsn.predifinedColors(colors));

			$input.css('position','sticky');

			if ($inputs.size() == 1) {
				$input.after($('<span/>').css('font-size', 'x-small').append('<br/>Powered by ').append($('<a>Jquery UI Colorpicker</a>').attr('href', 'https://bitbucket.org/lindekleiv/jquery-ui-colorpicker')));
			}
			$input.after($('<div class="wpsn-canvas-color-div"></div>'));
			$input.after($predefined);
			wpsn.colorPicker($input);
			$input.colorPicker('setColor', defaultColor);
			if ($inputs.size() > 1) {
				//setTimeout(function(){
					$inputs.siblings('.picker,.slider,.circle,canvas').hide();
				//}, 0);
				$input.focus(function(){
					$inputs.siblings().hide();
					$input.siblings().show();
					$('.wpsn-canvas-color').hide();
				}).blur(function(){
					$input.siblings('.picker,.slider,.circle,canvas').hide();
				});
			}
			$input.keyup(function () {
				let $this = $(this);
				let newColor = $this.val();
				$this.css('background', newColor);
				try { $input.colorPicker('setColor', newColor); } catch (err) { wpsn.error(err); }
			});
			$($predefined).find('li').click(function () {
				let color = $(this).data('color');
				
				$input.val(color);
				$input.colorPicker('setColor', color);
			});
			$input.css('background', $input.val());


			if (canvas) {
				canvas = wpsn.cloneCanvas(canvas);
				$predefined.append(
					$('<li class="wpsn-eyedropper" style="display:none;break:left;cursor:hand;list-style-type:none;float:left;width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'px;border:1px solid #ddd;background:#fff url(\'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/eyedrop.svg\') no-repeat -1px -1px;background-size:cover">&nbsp;</li>')
						.click(function(){
							$('.wpsn-canvas-color').hi
							let $canvas = $(this).parent().next('.wpsn-canvas-color-div').find('.wpsn-canvas-color');
							if ($canvas.size() > 0) {
								let visible = $canvas.is(':visible');
								$('.wpsn-canvas-color').hide();
								$canvas.toggle(!visible);
								wpsn.autoResize(note);
								$input.focus();
								$canvas.toggle(!visible);
							}
						})
				);

				let ctx = canvas.getContext('2d');
				let $canvas = $(canvas).click(function(){
					$(this).data('eyedropperActive', !$(this).data('eyedropperActive'));
					$input.change();
				}).mousemove(function(e){
					if (!$(this).data('eyedropperActive')) { return; }
					let boundingRect = this.getBoundingClientRect();
					let mouseX=parseInt(e.clientX-boundingRect.left);
					let mouseY=parseInt(e.clientY-boundingRect.top);
					let pxData = ctx.getImageData(mouseX,mouseY,1,1);
					let color = `rgba(${pxData.data[0]},${pxData.data[1]},${pxData.data[2]},${pxData.data[3]})`;
					$input.val(color);
					$input.css('background', color);
				}).attr('title','Click once to activate color selection. Click again to select color.');
				$canvas.addClass('wpsn-canvas-color');
				$canvas.css('border','1px solid #ccc').css('display','block').css('clear','both').hide();
				$canvas.data('wpsn-loaded',true);
				$input.parent().nextAll('.wpsn-canvas-color-div').first().empty().append($canvas);
				$('.wpsn-eyedropper').show();
			}
		});
	}

	wpsn.getColor = async function (color, defaultColor, header, type) {
		if (color && color.indexOf('#') === 0 || color.indexOf('.') === -1) {
			return color;
		}
		defaultColor = defaultColor || color;
		let imageAndCanvas = await wpsn.takeScreenshot($(document.body),{canvasWidth:1000});
		let canvas = imageAndCanvas.canvas;
		return await wpsn.promptWithTextInput(
			{
				load: function (note) {
					let $input = $('input.wpsn-prompt');
					let colors = [];
					if (type == 'border') {
						colors = ['#000', '#222', '#444', '#666', '#888', '#aaa', '#ccc', '#eee', '#fff', wpsn.transparent];
					} else if (type == "text") {
						colors = ['#000', '#222', '#444', '#666', '#888', '#aaa', '#ccc', '#eee', '#fff'];
					} else {
						colors = ['#ffa', '#fc9', '#fcf', '#faa', '#aaf', '#9cf', '#aff', '#afa', '#eee', '#fff', wpsn.transparent];
					}
					$input.data('predefinedColors', colors.join('|'))
					wpsn.colorInput($input, canvas);
					wpsn.autoResize(note);
					wpsn.centerNote(note);
				}
			},
			header ? '<div class="panel panel-default"><div class="panel-heading">' + header + '</div></div>' : '',//<div class="panel-body">,
			defaultColor
		);
	};

	wpsn.wait = async function(ms) {
		await new Promise(resolve => setTimeout(resolve, ms));
	};

	wpsn.predifinedColors = function (colors) {
		let $colors = '';
		for (let color of colors) {
			$colors += wpsn.predifinedColor(color);
		}
		return '<ul class="wpsn-predefined-colors" style="padding:0;clear:both">' + $colors + '</ul>';
	};
	wpsn.predifinedColor = function (color) {
		let background = (color == wpsn.transparent ? '#fff url(\'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/transparent_grid.png\') no-repeat -2px -2px' : color);
		return '<li title="'+background+'" style="cursor:hand;list-style-type:none;float:left;background:' + background + ';width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'px;border:1px solid #ddd" data-color="' + color + '">&nbsp;</li>';
	};

	wpsn.toggleEffectiveNotesCanvasMode = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.toggleNoteCanvasMode, '');//'Are you sure you want to toggle canvas mode for {0}?');
	};

	wpsn.toggleNoteCanvasMode = function (note, options) {
		options = options || {};
		let anchorNote = options.anchorNote || note;
		if (!anchorNote.canvas) {
			note.canvas = wpsn.transparent + '|#aaa';
		} else if (anchorNote.canvas == wpsn.transparent + '|#aaa') {
			note.canvas = 'frameless';
		} else if (anchorNote.canvas == 'frameless') {
			note.canvas = wpsn.transparent + '|' + wpsn.transparent;
		} else if (anchorNote.canvas == wpsn.transparent + '|' + wpsn.transparent) {
			note.canvas = '#fff|#aaa';
		} else {
			delete note.canvas;
		}
		wpsn.refreshNote(note);
	};

	wpsn.snapshotEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.snapshotNotes, '', true);
	};

	wpsn.snapshotNotes = async function (noteOrNotes, e) {
		let notes = wpsn.toNoteArray(noteOrNotes);
		if (!notes || notes.length == 0) { return; }
		let x1 = -1;
		let y1 = -1;
		let x2 = -1;
		let y2 = -1;
		for (let i = 0; i < notes.length; i++) {
			let tnote = notes[i];
			if (!tnote) { continue; }
			let x = parseFloat(tnote.pos_x) - 1;
			let y = parseFloat(tnote.pos_y) - 1;
			let w = parseFloat(tnote.width) + 2;
			let h = parseFloat(tnote.height) + 2;
			if (x < x1 || x1 == -1) {
				x1 = x;
			}
			if (x + w > x2 || x2 == -1) {
				x2 = x + w;
			}
			if (y < y1 || y1 == -1) {
				y1 = y;
			}
			if (y + h > y2 || y2 == -1) {
				y2 = y + h;
			}
		}
		x1 = x1 > 0 ? x1 : 0;
		x2 = x2 > 0 ? x2 : 0;
		y1 = y1 > 0 ? y1 : 0;
		y2 = y2 > 0 ? y2 : 0;

		let $window = $(window);
		let windowWidth = $window.scrollLeft() + $window.width();
		let windowHeight = $window.scrollTop() + $window.height();

		x1 = x1 < windowWidth ? x1 : windowWidth-1;
		x2 = x2 < windowWidth ? x2 : windowWidth-1;
		y1 = y1 < windowHeight ? y1 : windowHeight-1;
		y2 = y2 < windowHeight ? y2 : windowHeight-1;

		let frame_note = notes[0];

		if (notes.length > 1) {
			frame_note = await wpsn.newNote({
				pos_x: x1,
				pos_y: y1,
				width: x2 - x1,
				height: y2 - y1,
				canvas: wpsn.transparent + '|' + wpsn.transparent,
				menu: [],
				discard: true,
				zIndex: wpsn.defaultZIndex + 10,
				lock: true
			});
			await wpsn.createNote(frame_note);
			await wpsn.refreshNote(frame_note);
		}
		let watermark = true;
		if (notes.length == 1 && wpsn.isMeme(notes[0]) && notes[0].text) {
			watermark = false;
		}
		if (wpsn.keyPressed('ctrl') || wpsn.keyPressed('meta')) {
			watermark = !watermark;
		}
		let $selectedNotes = $('.wpsn-selected');
		wpsn.deselectElement($selectedNotes);

		try {
			let $frame = wpsn.getNoteDiv(frame_note);
			let imageAndCanvas = await wpsn.takeScreenshot($frame, {waitTime:wpsn.screenshotTimeout(e), watermark, includeBorders:notes.length>1});
			let img = imageAndCanvas.image;
			//callback(img, $element, note, callbackOptions)
			await wpsn.processScreenshot(img, frame_note, { download:true });
			if (notes.length > 1) { wpsn.deleteNote(frame_note); }
			wpsn.selectElement($selectedNotes);
		} catch (err) {
			if (notes.length > 1) { wpsn.deleteNote(frame_note); }

		}
	};

	wpsn.downloadAsHTML = async function (note, e) {
		e = e || {};
		const $noteDiv = wpsn.getNoteDiv(note);
		let imageAndCanvas = await wpsn.takeScreenshot($noteDiv, {watermark:!(e.ctrlKey || e.metaKey)});
		let img = imageAndCanvas.image;
		await wpsn.processScreenshot(img, note, { downloadHTML: true, noSnapshot: (e.ctrlKey || e.metaKey)});
	};
	//######################### Menu ###############################




	wpsn.menu = wpsn.menu || {};
	wpsn.submenu = wpsn.submenu || {};

	wpsn.menu.maximize = {
		name: 'maximize',
		description: '',
		load: function (note, menuButton) {
			menuButton.css('background', note.background).css('background-size','cover');
			if (!note.minimized) { menuButton.hide(); }
			if (note.title) { menuButton.attr('title', note.title); }
		},
		leftClick: {
			command: 'maximize-note',
			applyToAll: true
		}
	};


	wpsn.menu.minimize = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/minus.svg',
		name: 'minimize',
		required: true,
		description: '',
		load: function (note, $menuButton) {
			let icon = 'minus.svg';
			if (note.autominimize) {
				icon = 'minus_warning.svg';
			}
			$('.wpsn-menu-minimize', wpsn.getNoteDiv(note)).css('background-image', 'url(chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/' + icon);
			if ($menuButton) {
				$menuButton.css('background-image', 'url(chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/' + icon);
			}
		},
		leftClick: {
			command: 'minimize-note',
			applyToAll: true
		},
		rightClick: {
			'description': 'Toggle auto-minimize mode',
			'action': async function (note) {
				note.autominimize = !note.autominimize;
				if (!note.autominimize) { delete note.autominimize; }
				await wpsn.refreshNote(note);
				wpsn.clickOutSetup();
			}
		}
	};


	wpsn.menu.fullscreen = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/maximized.svg',
		name: 'fullscreen',
		description: '',
		load: function (note, menuButton) {
			if (!note.fullscreen) { note.fullscreen = false; }
			if (note.fullscreen) {
				menuButton.css('background', 'url("chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/maximized.svg")').css('background-size','cover');
			} else {
				menuButton.css('background', 'url("chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/maximize.svg")').css('background-size','cover');
			}
		},
		leftClick: {
			command: 'toggle-fullscreen-note'
		},
		rightClick: {
			command: 'resize-note-paper-ratio',
			applyToAll: true
		}
	};

	wpsn.menu.lookandfeel = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/lookandfeel.svg',
		name: 'look and feel',
		description: '',
		optional: false,
		leftClick: {
			command: 'update-lookandfeel-note',
			applyToAll: true
		}
	};

	wpsn.menu.zoom = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/zoom.svg',
		name: 'zoom',
		optional: false,
		description: 'Zoom in/out.',
		leftClick: {
			command: 'zoom-in-note',
			applyToAll: true
		},
		rightClick: {
			command: 'zoom-out-note',
			applyToAll: true
		},
		doubleClick: {
			command: 'zoom-on-note',
			applyToAll: true
		}
	};

	wpsn.menu.refresh = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/refresh.svg',
		name: 'refresh',
		load: function (note, $menuButton) {
			let icon = 'refresh.svg';
			if ((note.fetchNote && note.fetchNote.url) || (note.fetchData && (note.fetchData.url || (note.fetchData[0] && note.fetchData[0].url)))) {
				icon = 'refresh_warning.svg';
			}
			$('.wpsn-menu-refresh', wpsn.getNoteDiv(note)).css('background-image', 'url(chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/' + icon);
			if ($menuButton) {
				$menuButton.css('background-image', 'url(chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/' + icon);
			}
		},
		optional: false,
		description: '',
		leftClick: {
			command: 'refresh-note',
			applyToAll: true
		},
		doubleClick: {
			description: 'Render note stored at provided URL (experimental). Please be advised that remote note will not override most look and feel properties of current note',
			action: function (note) {
				wpsn.prompt(
					wpsn.menu.refresh.fetchNoteFormOptions(note),
					wpsn.menu.refresh.fetchNoteForm(note),
					wpsn.menu.refresh.fetchNoteNoteToForm(note),
					wpsn.menu.refresh.fetchNoteFormToNote,
					note.id
				);
			}
		},
		rightClick: {
			description: 'Fetch and manipulate data from provided URL (experimental)',
			action: function (note) {
				wpsn.prompt(
					wpsn.menu.refresh.fetchDataFormOptions(note),
					wpsn.menu.refresh.fetchDataForm(note),
					wpsn.menu.refresh.fetchDataNoteToForm(note),
					wpsn.menu.refresh.fetchDataFormToNote,
					note.id
				);
			}
		},
		fetchDataFormOptions: function () {
			return {
				minWidth: 1000,
				background: '#fff',
				load: function (note) {
					let $count = $('.wpsn_count');
					let count = parseInt($count.val());
					let wpsn_ = 'wpsn' + (count > 1 ? count - 1 : '') + '_';
					let wpsn_bind_events = function () {
						$('.wpsn_interval').unbind('change').bind('change', function () {
							if (!$(this).val() || $(this).val() == '0') {
								$(this).closest('table').find('.wpsn_description_interval').hide();
								$(this).closest('table').find('.wpsn_description_interval_none').show();
							} else {
								$(this).closest('table').find('.wpsn_description_interval').show();
								$(this).closest('table').find('.wpsn_description_interval_none').hide();
								$(this).closest('table').find('.wpsn_url_interval').html($(this).find('option:selected').text() || '');
							}
						}).change();
						$('.wpsn_url').unbind('keyup').bind('keyup', function () {
							if (!$(this).val()) {
								$(this).closest('table').find('.wpsn_description').closest('tr').hide();
							} else {
								$(this).closest('table').find('.wpsn_description').closest('tr').show();
								$(this).closest('table').find('.wpsn_url_display').html($(this).val() || 'http://example.com');
							}
						}).keyup();
						$('.wpsn_remove').unbind('click').bind('click', function () {
							$(this).closest('.wpsn_table').remove();
							wpsn.centerNote(wpsn.autoResize(note));
							let scrollDiv = wpsn.getNoteDiv(note).find('.wpsn-scrollbar').get(0);
							scrollDiv.scrollTop = scrollDiv.scrollHeight;
						});
					};
					$('.wpsn_add').click(function () {
						let count = parseInt($count.val());
						let wpsn_ = 'wpsn' + (count > 0 ? count : '') + '_';
						$('.wpsn_div').append(wpsn.menu.refresh.fetchForm(note, wpsn.menu.refresh.fetchDataFormDescription(note), true, count));
						$count.val(++count);

						wpsn_bind_events(wpsn_);
						wpsn.centerNote(wpsn.autoResize(note));
						let scrollDiv = wpsn.getNoteDiv(note).find('.wpsn-scrollbar').get(0);
						scrollDiv.scrollTop = scrollDiv.scrollHeight;
					}
					);

					wpsn_bind_events(wpsn_);
				}
			};
		},
		fetchNoteFormOptions: function () {
			return {
				minWidth: 1000,
				load: function () {

				}
			};
		},
		fetchNoteNoteToForm: function (note) {
			return wpsn.menu.refresh.fetchNoteToForm(note, 'fetchNote');
		},
		fetchDataNoteToForm: function (note) {
			return wpsn.menu.refresh.fetchNoteToForm(note, 'fetchData');
		},
		fetchNoteToForm: function (note, fetchWhat) {
			let form = {};
			let count = Array.isArray(note[fetchWhat]) ? note[fetchWhat].length : 1;
			for (let i = 0; i < count; i++) {
				let wpsn_ = 'wpsn' + (i > 0 ? i : '') + '_';
				let fetch = (Array.isArray(note[fetchWhat]) ? note[fetchWhat][i] : (i == 0 ? note[fetchWhat] : {})) || {};
				let tform = {};
				tform[wpsn_ + 'url'] = fetch.url;
				tform[wpsn_ + 'interval'] = fetch.interval;
				tform[wpsn_ + 'script'] = fetch.script;
				form = Object.assign(form, tform);
			}
			return form;
		},
		fetchNoteFormToNote: function (form, noteId) {
			wpsn.menu.refresh.fetchFormToNote(form, noteId, 'fetchNote');
		},
		fetchDataFormToNote: function (form, noteId) {
			wpsn.menu.refresh.fetchFormToNote(form, noteId, 'fetchData');
		},
		fetchFormToNote: function (form, noteId, fetchWhat) {
			let note = wpsn.getNote(noteId);
			wpsn.saveNoteStateForUndo(note);

			let oldFetch = note[fetchWhat] || {};
			if (!(oldFetch instanceof Array)) { oldFetch = [oldFetch]; }
			for (let i = 0; i < oldFetch.length; i++) {
				let oldUrl = oldFetch[i].url;
				if (oldUrl) { clearInterval(window[oldUrl + '_interval']); }
			}

			let count = parseInt(form['wpsn_count']) || 1;
			note[fetchWhat] = [];
			for (let i = 0; i < count; i++) {
				let wpsn_ = 'wpsn' + (i > 0 ? i : '') + '_';
				let fetch = {};
				fetch.url = form[wpsn_ + 'url'];
				fetch.interval = form[wpsn_ + 'interval'];
				fetch.script = form[wpsn_ + 'script'];
				note[fetchWhat].push(fetch);
			}
			if (note[fetchWhat].length == 1) {
				note[fetchWhat] = note[fetchWhat][0];
			}
			wpsn.refreshNote(note);

		},
		fetchNoteForm: function (note) {
			return '' +
				'<div class="panel panel-default"><div class="panel-heading"><span style="white-space:nowrap">' +
				'Fetch Note:' +
				'</span></div><div class="panel-body">' +
				wpsn.menu.refresh.fetchForm(note, '', false) +
				'</div></div>';
		},
		fetchDataFormDescription: function () {
			return `
		<div class="wpsn_description">
		<div class="wpsn_description_interval">
		Data will be retrieved every <code><span class="wpsn_url_interval">2 hours</span></code> and will be cached for <code><span class="wpsn_url_interval">2 hours</span></code>
		</div>
		<div class="wpsn_description_interval_none">
		Data will be retrieved every time this note loads and will not be cached!
		</div>
		<br/>
		The server providing data will be impacted. You might be blacklisted/penalized for accessing data if done excessively!
		</div>
		`;
		},
		fetchDataForm: function (note) {
			let table = '' +
				'<div class="panel panel-default"><div class="panel-heading"><span style="white-space:nowrap">' +
				'Fetch Data:' +
				'</span></div><div class="panel-body"><div class="wpsn_div">';

			let count = Array.isArray(note.fetchData) ? note.fetchData.length : 1;
			for (let i = 0; i < count; i++) {
				table += wpsn.menu.refresh.fetchForm(note, wpsn.menu.refresh.fetchDataFormDescription(note), true, i);
			}
			table += '</div>' +
				'<input type="button" name="wpsn_add" class="btn btn-success wpsn_add" value="Add URL" style="margin-top: 20px"/>' +
				'<input type="hidden" name="wpsn_count" class="wpsn_count" value="' + count + '"/>' +
				'</div></div>';
			return table;
		},
		fetchForm: function (note, description, showInterval, index) {
			let wpsn_ = 'wpsn' + (index > 0 ? index : '') + '_';
			let table = '' +
				'<table style="width:100%;margin-bottom: 20px;" class="wpsn_table">' +
				'<tr><td>URL: </td><td><input type="text" name="' + wpsn_ + 'url" class="wpsn_url" style="width:100%"/></td></tr>' +
				(!showInterval ? '' :
					'<tr><td>Interval: </td><td><select name="' + wpsn_ + 'interval" class="wpsn_interval" style="width:100%">' +
					'<option value="0"></option>' +
					'<option value="15">15 seconds</option>' +
					'<option value="20">20 seconds</option>' +
					'<option value="30">30 seconds</option>' +
					'<option value="45">45 seconds</option>' +
					'<option value="60">1 minute</option>' +
					'<option value="120">2 minutes</option>' +
					'<option value="300">5 minutes</option>' +
					'<option value="600">10 minutes</option>' +
					'<option value="900">15 minutes</option>' +
					'<option value="1800">30 minutes</option>' +
					'<option value="2700">45 minutes</option>' +
					'<option value="3600">1 hour</option>' +
					'<option value="7200">2 hours</option>' +
					'<option value="10800">3 hours</option>' +
					'<option value="14400">4 hours</option>' +
					'<option value="21600">6 hours</option>' +
					'<option value="28800">8 hours</option>' +
					'<option value="43200">12 hours</option>' +
					'<option value="86400">1 day</option>' +
					'<option value="172800">2 days</option>' +
					'<option value="604800">1 week</option>' +
					'</select>' +
					'</td></tr>' +
					'<tr><td>Callback: </td><td>' +
					'<code>function(data, note, $note, document){</code>' +
					'<textarea name="' + wpsn_ + 'script" class="wpsn_script" style="width:100%;height:200px;"></textarea>' +
					'<code>}</code>' +
					'<input type="hidden" name="' + wpsn_ + 'index" value="' + index + '"/>' +
					'</td></tr>') +
				(description ? '<tr><td colspan="2">' + description + '</td></tr>' : '');
			if (index > 0) {
				table += '' +
					'<tr><td colspan="2">' +
					'<input type="button" name="wpsn_remove" class="btn btn-danger wpsn_remove" value="Remove Criteria" style=""/>' +
					'</td></tr>';
			}
			table += '</table>';
			return table;
		}
	};

	wpsn.menu.lock = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/lock_off.svg',
		name: 'lock',
		optional: false,
		description: function (note) {
			let desc = 'Lock note. Prevents moving, resizing and/or editing of note.\nThis is especially useful if you want to be able to select the content of the note without dragging note.';
			if (note) {
				if (!note.lock) {
					desc += '\n\nNote is currently unlocked.';
				} else if (note.lockmode == wpsn.lockModes.editable) {
					desc += '\n\nNote is currently locked but content is editable.';
				} else {
					desc += '\n\nNote is currently locked.';
				}
			}
			return desc;
		},
		load: function (note, menuButton) {
			if (note.lock) {
				if (note.lockmode == wpsn.lockModes.editable) {
					menuButton.css('background', 'url("chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/lock_warning.svg")').css('background-size','cover');
				} else {
					menuButton.css('background', 'url("chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/lock.svg")').css('background-size','cover');
				}
			} else {
				menuButton.css('background', 'url("chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/lock_off.svg")').css('background-size','cover');
			}
		},
		leftClick: {
			command: 'toggle-lock-note',
			applyToAll: true
		}
	};

	wpsn.menu.mode = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/gear.svg',
		name: 'mode',
		optional: false,
		description: '',
		modes: {
			markdown: { name: 'Github Flavored Markdown', id: 6328746328, render: function (note) { wpsn.renderMarkdown(note); }, description: 'Markdown allows you to write using an easy-to-read, easy-to-write plain text format, which then converts to valid HTML. <a href="https://help.github.com/articles/basic-writing-and-formatting-syntax/">More information</a>. (Powered by <a href="https://github.com/chjj/marked">marked.js</a>)' },
			asis: { name: 'As is', id: 3287458732, render: function (note) { wpsn.renderAsIs(note); }, description: 'What you write is what you read.' },
			texteditor: { name: 'Text Editor', id: 6856399856, render: function (note) { wpsn.renderHTML(note); }, description: 'A text editor is provided to allow for text formatting. (Powered by <a href="http://www.tinymce.com">TinyMCE</a>)' },
			checklist: { name: 'Checklist', id: 9486429094, render: async function (note) { await wpsn.renderChecklist(note); }, description: 'Renders note in checklist mode. Lines beginning with - or x are transformed into checklists. Renders into Markdown otherwise' }
		},
		load: function (note, menuButton) {
			if (!note.htmlMode) { note.htmlMode = false; }

			if (note.htmlMode === null || note.htmlMode) {
				menuButton.css('background', 'url("chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/gear.svg")').css('background-size','cover');
			}
		},
		leftClick: {
			command: 'update-mode-note',
			applyToAll: true
		}
	};


	wpsn.menu.clone = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/copy.svg',
		name: 'clone',
		description: '',
		optional: false,
		leftClick: {
			command: 'b-clone-note',
			applyToAll: true
		},
		rightClick: {
			command: 'b-clone-provided-notes'
		},
		doubleClick: {
			command: 'b-clone-favorite-note'
		}
	};

	wpsn.menu.scope = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/circle.svg',
		name: 'scope',
		optional: false,
		description: 'A note can be visible across several pages depending on the given scope.',
		leftClick: {
			command: 'update-scope-note',
			applyToAll: true
		}
	};

	wpsn.menu.target = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/pushpin_off.svg',
		name: 'pin',
		description: '',
		optional: false,
		load: function (note, menuButton) {
			if (note && note.target) {
				menuButton.attr('title', note.target);
				menuButton.css('background', 'url("chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/pushpin.svg")').css('background-size','cover');
			}
		},
		doubleClick: {
			description: 'Pin note to HTML element by specifying selector',
			action: async function (note) {
				try {
					await wpsn.prompt(
						{},
						`<div class="panel panel-default"><div class="panel-heading">Specify JQuery selector</div><div class="panel-body">(i.e. \'body table#main tbody tr td:first-child\'). </div>
						<div class="panel-body">
						The note will adopt the top right position of the first element matching the selector and will be pinned to it. If no element matches selector, the note will be pinned to the top left of the page. 
						<br/><br/> 
						To unpin note, set selector to blank. 
						<br/><br/>
						Note: This feature is dependent on underlying HTML. This will not always work as expected.
						<br/>
						<textarea name="wpsn_target" id="wpsn-target" style="width:100%"/>					
						<br/><br/>
						Do you also want to update the underlying element with the note text?
						<br/>
						<input type="radio" name="wpsn_target_update" value="true" id="wpsn-target-update" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}px"/> Yes
						<input type="radio" name="wpsn_target_update" value="false" id="wpsn-target-update" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}px"/> No
						<br/><br/>
						Do you also want to update the title of the window? (Leave blank if you don't)
						<br/>
						<input type="text" name="wpsn_document_title" value="true" id="wpsn-document-title"/>
						<br/><br/>
						Do you also want to update the favicon of the window? (Leave blank if you don't)
						<br/>
						<input type="text" name="wpsn_document_favicon" value="true" id="wpsn-document-favicon" placeholder="Image URL or Color"/>
						</div></div>`,
						{
							'wpsn_target': note.target,
							'wpsn_target_update': note.targetUpdate ? "true" : "false",
							"wpsn_document_title": note.documentTitle,
							"wpsn_document_favicon": note.documentFavicon
						},
						function (form) {
							if (form) {
								wpsn.saveNoteStateForUndo(note);
								note.target = form.wpsn_target;
								note.targetUpdate = form.wpsn_target_update == "true"
								note.documentTitle = form.wpsn_document_title
								note.documentFavicon = form.wpsn_document_favicon
								wpsn.refreshNote(note);
							}
						}
					);
				} catch (err) { wpsn.error(err); }
			}
		},
		rightClick: {
			description: 'Unpin note',
			action: function (note) {
				wpsn.saveNoteStateForUndo(note);
				delete note.target;
				wpsn.refreshNote(note);
			}
		},
		leftClick: {
			description: 'Pin note to another note or page element',
			action: async function (note) {
				await wpsn.prompt(
					{},
					`<div class="panel panel-default"><div class="panel-heading">You selected the option of pinning this note to another note or page element.</div>
					<div class="panel-body">After clicking OK, click on the note or page element you want to pin this note to. 
					<br/><br/>Click cancel if you don\'t want to proceed.
					<br/><br/>
					Do you also want to update the underlying element with the note text?
					<br/>
					<input type="radio" name="wpsn_target_update" value="true" id="wpsn-target-update" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}px"/> Yes
					<input type="radio" name="wpsn_target_update" value="false" id="wpsn-target-update" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}px"/> No
					<br/><br/>
					Do you also want to update the title of the window? (Leave blank if you don't)
					<br/>
					<input type="text" name="wpsn_document_title" value="true" id="wpsn-document-title"/>
					<br/><br/>
					Do you also want to update the favicon of the window? (Leave blank if you don't)
					<br/>
					<input type="text" name="wpsn_document_favicon" value="true" id="wpsn-document-favicon" placeholder="Image URL or Color"/>
					</div></div>`,
					{
						'wpsn_target_update': note.targetUpdate ? "true" : "false",
						'wpsn_document_title': note.documentTitle,
						'wpsn_document_favicon': note.documentFavicon
					},
					function (form) {
						if (form) {
							wpsn.saveNoteStateForUndo(note);
							note.targetUpdate = form.wpsn_target_update == "true"
							note.documentTitle = form.wpsn_document_title
							note.documentFavicon = form.wpsn_document_favicon
						}
					}
				);
				let childNoteId = note.id;
				$('*').bind('click.wpsn-pin', function () {								
					if (window.sessionStorage.getItem('wpsn-childnote')) {
						let childNoteId = window.sessionStorage.getItem('wpsn-childnote');
						let childNote = wpsn.getNote(childNoteId);
						wpsn.saveNoteStateForUndo(childNote);
						childNote.target = wpsn.selector($(this));
						//wpsn.refreshNote(childNote);
						wpsn.refreshAllNotes();
						window.sessionStorage.removeItem('wpsn-childnote');
					}
					$('*').unbind('click.wpsn-pin');
					return false;
				});
				$('.wpsn-container *, .wpsn-popup-container *').unbind('click.wpsn-pin');
				window.sessionStorage.setItem('wpsn-childnote', childNoteId); 
				wpsn.selectElement(wpsn.getNoteDiv(wpsn.getNote(childNoteId)));
				wpsn.updateHasSelection();
			}
		}
	};

	wpsn.menu.order = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/updown.svg',
		name: 'order',
		optional: false,
		description: '',
		leftClick: {
			command: 'bring-to-top-note'
		},
		rightClick: {
			command: 'send-to-bottom-note'
		}
	};


	wpsn.menu.synchronize = {
		'icon': 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/cloud.svg',
		'name': 'synchronize',
		optional: false,
		'description': '',
		'leftClick': {
			command: 'a-c-b-sync-notes'
		},
		'rightClick': {
			command: 'a-c-c-sync-logout'
		}
	};

	wpsn.menu.export = {
		'icon': 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/up.svg',
		'name': 'export',
		'required': true,
		'description': '',
		'leftClick': {
			command: 'b-export-note',
			applyToAll: true
		},
		'rightClick': {
			command: 'b-export-provided-notes'
		},
		'doubleClick': {
			command: 'a-g-backup'
		}
	};

	wpsn.menu.add = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/plus.svg',
		name: 'add',
		required: true,
		description: '',
		leftClick: {
			command: 'a-a-add-note'
		},
		rightClick: {
			command: 'b-import-note'
		}
	};

	wpsn.import = function () {
		wpsn.prompt(
			{
				load: function () {
					$('.wpsn-files').change(function (evt) {
						let files = evt.target.files;
						let notes = [];
						$('.wpsn-prompt').val('');
						for (let i = 0;; i++) {
							let f = files[i];
							let reader = new FileReader();
							if (f.type.match('image.*')) {
								reader.onload = (function () {
									return function (e) {
										try {
											let img = new Image();
											img.src = e.target.result;
											notes = notes.concat(JSON.parse(steg.decode(img)));
											$('.wpsn-prompt').val(JSON.stringify(notes));
										} catch (err) {
											wpsn.alert({}, err.message);
										}
									};
								})(f);
								reader.readAsDataURL(f);
							} else {
								reader.onload = (function () {
									return function (e) {
										try {
											let data = e.target.result;
											try {
												data = steg.decode($('<div/>').append($(data)).find('#wpsn-snapshot').attr('src'));
											} catch (err) { wpsn.error(err); }
											notes = notes.concat(JSON.parse(data));
											$('.wpsn-prompt').val(JSON.stringify(notes));
										} catch (err) {
											wpsn.alert({}, err.message);
										}
									};
								})(f);
								reader.readAsText(f);
							}
						}
					});
				}
			},
			'<div class="panel panel-default"><div class="panel-heading">Import Note(s)</div><div class="panel-body">You can import note(s) to this page by pasting the stateless representation of note(s) into the text field below and clicking OK. <br/><br/>The stateless representation of note(s) can be found by clicking on the export button of a note.<br/>' +
			'<textarea name="newNotes" class="wpsn-prompt"></textarea><br/>or<br/>' +
			'<input type="file" name="newFiles" class="wpsn-files" multiple/></div></div>',
			{},
			function (form) {
				if (form) {
					try {
						wpsn.saveNotes(JSON.parse(form.newNotes)).then(async function (importedNotes) {
							wpsn.notes = wpsn.notes.concat(importedNotes);
							for (let i = 0; i < importedNotes.length; i++) {
								let tnote = importedNotes[i];
								await wpsn.refreshNote(tnote);
							}
							let message = '<div class="alert alert-success">The following note(s) have been imported</div>';
							wpsn.manager.renderManagerNotes(null, importedNotes, message);
							wpsn.loadFonts();
						});
					} catch (err) {
						wpsn.alert({}, err.message);
					}
				}
			}
		);
	};

	wpsn.menu.more = {
		'icon': 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/more.svg',
		'name': 'more',
		'required': true,
		'description': '',
		'load': function (note) {
			wpsn.menu.more.submenu = {};
			let mainmenu = wpsn.generateMainMenuArray(note);
			for (let menu in wpsn.menu) {
				if (wpsn.menuEnabled(menu) && $.inArray(menu, mainmenu) < 0 &&
					menu != 'removePopup' && menu != 'maximize') {
					wpsn.menu.more.submenu[menu] = wpsn.menu[menu];
				}
			}
		},
		'leftClick': {
			'description': 'Select more options',
			'action': function (note, menuButton, noteDiv) {
				let submenu = noteDiv.find('>.wpsn-submenu-more');
				if (submenu.is(':visible')) { submenu.hide('slide'); }
				else { submenu.show('slide'); }
			}
		}
	};

	wpsn.menu.removePopup = {
		'icon': 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/multiply.svg',
		'name': 'deletePopup',
		'required': true,
		'description': '',
		'leftClick': {
			'description': 'Delete Popup.',
			'action': function (note) {
				wpsn.deleteNote(note);
			}
		}
	};

	wpsn.removeNotes = async function (notes) {
		if (notes && notes.length > 0) {
			try {
				await wpsn.confirm({}, '<div class="alert alert-danger">Did you mean to delete ' + (notes.length == 1 ? 'this note' : 'these notes') + '? This cannot be undone!</div>');
				for (let i = 0; i < notes.length; i++) {
					wpsn.deleteNote(notes[i]);
				}
			} catch (err) { wpsn.error(err); }
		}
	};

	wpsn.menu.remove = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/multiply.svg',
		name: 'delete',
		required: true,
		description: '',
		leftClick: {
			command: 'delete-note',
			applyToAll: true
		},
		rightClick: {
			'description': 'Cleanup deleted notes.\nNotes that are deleted are purged of content but the ID and timestamp remain (These notes continue to show in the "Manage Note" table with minimal size).\nThis is done to reconcile the synchronization of notes.\nIf the deleted notes are fully deleted locally, on the next synchronization, these notes previously synced on Google Drive would reappear.\nOn synchronization, these deleted notes are cleaned up automatically.\n\nPlease note that on manually cleaning the deleted notes, they might reappear with their old content on the next synchronization!',
			'action': async function (note) {
				await wpsn.confirm({}, 'Notes that are deleted are purged of content but the ID and timestamp remain<br/>(These notes continue to show in the "Manage Note" table with minimal size).<br/><br/>This is done to reconcile the synchronization of notes.<br/><br/>If the deleted notes are fully deleted locally, on the next synchronization, these notes previously synced on Google Drive would reappear.<br/>On synchronization, these deleted notes are cleaned up automatically.<br/><br/>Please note that on manually cleaning the deleted notes, they might reappear with their old content on the next synchronization!<br/><br/>Are you sure you want to cleanup deleted notes?');
				wpsn.cleanupDeletedNotes();
			}
		}
	};

	wpsn.menu.tips = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/sun.svg',
		name: 'tips',
		description: '',
		leftClick: {
			command: 'a-markdown-cheatsheet',
			description: '',
			action: function () { wpsn.menu.tips.markdownCheatsheet(); }
		},
		rightClick: {
			command: 'a-tips-and-tricks',
			description: '',
			action: function () { wpsn.menu.tips.tipsAndTricks(); }
		},
		doubleClick: {
			command: 'a-menu-cheatsheet',
			description: '',
			action: function () { wpsn.menuIllustration(); }
		},
		markdownCheatsheet: function () {
			let csNote = wpsn.cheatsheet();
			wpsn.allNotes[csNote.id] = csNote;
			wpsn.centerNote(wpsn.reRenderNote(csNote));
		},
		tipsAndTricks: function () {
			let tNote = wpsn.tips();
			wpsn.allNotes[tNote.id] = tNote;
			wpsn.centerNote(wpsn.reRenderNote(tNote));
		}
	};

	wpsn.menu.whatsnew = {
		extension: 'wpsn.menu.whatsnew',
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/new.svg',
		name: 'whatsnew',
		required: true,
		description: function () {
			return 'Web Page Sticky Notes was updated.';
		},
		leftClick: {
			description: 'View new functionality/bug fixes added to Web Page Sticky Notes.',
			action: function () { wpsn.menu.whatsnew.whatsNew(); }
		},
		whatsNew: function () {
			let aboutNote = wpsn.about(true);
			wpsn.allNotes[aboutNote.id] = aboutNote;
			wpsn.renderNote(aboutNote);
			wpsn.autoResizeHeight(aboutNote);
			wpsn.centerNote(aboutNote);

			wpsn.versionUpdated = true;
			window.sessionStorage.removeItem('wpsn.menu.whatsnew');
			$('.wpsn-menu-whatsnew').remove();
			wpsn.saveToAll({ 'wpsn-version-updated': wpsn.versionUpdated });
			//chrome.storage.local.set({'wpsn-version-updated':wpsn.versionUpdated});
			//chrome.storage.local.remove('wpsn-version-updated');
		}
	};

	wpsn.menu.about = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/info.svg',
		name: 'about',
		required: true,
		description: function (note) { return 'Note ID: ' + note.id; },
		rightClick: {
			description: 'Information and updates about Web Page Sticky Notes.',
			action: function () { wpsn.menu.about.wpsnInfo(); }
		},
		doubleClick: {
			description: 'Watch Demo Playlist.',
			action: function () { wpsn.menu.about.demo(); }
		},
		leftClick: {
			description: 'Information related to current note.',
			action: function (note) { wpsn.menu.about.noteInfo(note); }
		},


		wpsnInfo: function () {
			let aboutNote = wpsn.about();
			wpsn.allNotes[aboutNote.id] = aboutNote;
			wpsn.renderNote(aboutNote);
			wpsn.autoResizeHeight(aboutNote, true);
			wpsn.centerNote(aboutNote);
		},
		demo: function () {
			wpsn.demo.isPopup = true;
			wpsn.renderNote(wpsn.demo);
			wpsn.centerNote(wpsn.demo);
		},
		noteInfo: function (note) {
			chrome.storage.local.getBytesInUse('wpsn.note.' + note.id, function () {
				chrome.storage.local.getBytesInUse(null, function (bytes) {
					wpsn.alert(
						{},
						function () {
							let noteSize = wpsn.lengthInUtf8Bytes(JSON.stringify(note));
							let total = chrome.storage.local.QUOTA_BYTES;
							let used = bytes;
							let free = total - used;
							return '<table>' +
								'<tr><th colspan="2">This Note</th></tr>' +
								'<tr><td>ID:</td><td>' + note.id + '</td></tr>' +
								'<tr><td>Created:</td><td>' + new Date(note.created_date).toLocaleString() + '</td></tr>' +
								'<tr><td>Modified:</td><td>' + new Date(note.modified_date ? note.modified_date : note.created_date).toLocaleString() + '</td></tr>' +
								'<tr><td>Size:</td><td>' + noteSize + ' bytes</td></tr>' +
								'<tr><td colspan="2" style="border:0px"></td></tr>' +
								'<tr><th colspan="2">All Notes</th></tr>' +
								'<tr><td>Total Size:</td><td>' + used + ' bytes</td></tr>' +
								//'<tr><td>Sync Size:</td><td>'+usedSync+' bytes used of ' + maxSync + ' bytes</td></tr>'+
								'<tr><td>Storage Size:</td><td>' + free + ' bytes free of ' + total + ' bytes <br/>(' + parseInt((free / total) * 10000) / 100 + '% remaining)' + '</td></tr>' +
								//'<tr><td>Sync Storage Size:</td><td>'+freeSync + ' bytes free of ' + totalSync + ' bytes ('+ parseInt((freeSync/totalSync)*10000)/100+'%)'+'</td></tr>'+
								'</table><br/>';
						}()
					);
				});
			});
		}
	};

	wpsn.menu.manager = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/layers.svg',
		name: 'manager',
		required: true,
		description: '',
		modes: {
			notes_manager: { name: 'Note Manager', id: 8748732987, render: function (note) { wpsn.manager.renderManager(note); }, description: 'Note Manager allows you to manage all your notes in one spot.' }
		},
		leftClick: {
			command: 'a-c-manage-notes'
		},
		rightClick: {
			command: 'a-c-a-note-board'
		},
		doubleClick: {
			command: 'position-notes-to-grid'
		}
	};

	wpsn.removeNonNotes = function (notes) {
		if (notes && notes.length) {
			let i = notes.length;
			while (i--) {
				if (!notes[i].id) {
					notes.splice(i, 1);
				}
			}
		}
		return notes;
	};

	wpsn.backup = async function () {
		let results = await wpsn.loadFromAll();
		let notes = await wpsn.getNotesFromStorageResult(results);
		await wpsn.export(notes, { downloadname: 'backup-' + wpsn.formatDate(new Date(), true), downloadonly: true, downloadlabel: 'Backup' });
	};

	wpsn.getFavoriteNote = async function() {
		const favoriteNotes = await wpsn.getFavoriteNotes();
		return favoriteNotes && favoriteNotes.length > 0 ? favoriteNotes[0] : null;
	};

	wpsn.getFavoriteNotes = async function() {
		let results = await wpsn.loadFromAll();
		let allNotes = await wpsn.getNotesFromStorageResult(results);
		let notes = [];
		for (let note of allNotes) {
			if (wpsn.isFavorite(note)) {
				notes.push(note);
			}
		}
		return notes;
	};

	wpsn.isFavorite = function(note) {
		return note && note.tag && note.tag.indexOf('#favorite') > -1;
	};

	wpsn.noteboard = {
		openBoard: async function() {
			await wpsn.getSettings();
			let example = 'https://www.google.com/blank.html#{name}';
			wpsn.settings.noteboard_url = wpsn.settings.noteboard_url || example;
			if (wpsn.settings.noteboard_url.indexOf('{')==-1){
				wpsn.settings.noteboard_url+= '#{name}';
			}
			let notesInScope = wpsn.getNotesInScope(Object.values(wpsn.allNotes), wpsn.settings.noteboard_url, {
				protocol : {include:false},
				hostname : {include:true},
				port : {include:true},
				pathname : {include:true},
				search : {include:true},
				hash : {include:false},
				title : {include:false}
			});
			let noteboardNameList = '';
			let names = new Set();
			for (let note of notesInScope) {
				let hash = note.scope && note.scope.hash;
				if (!hash) continue;
				names.add(hash.replace('#',''));
			}
			names = Array.from(names).sort();

			let form = await wpsn.template.prompt({template:wpsn.settings.noteboard_url}, [wpsn.settings.noteboard_url], 'Go to Noteboard', example, {name:names}, true);
			
			let template = JSON.parse(unescape(form.template||"{}"));

			wpsn.settings.noteboard_url = template.template;
			wpsn.saveSettings();
		
			chrome.extension.sendMessage({ gotourl:  form.evaluated, title: form.board_name });
		}
	};

	wpsn.manager = {
		manageNotes: function () {
			//let managerNote = {background:'#fff',lock:true,isPopup:true,fullscreen:true,mode:wpsn.menu.manager.modes.notes_manager.id};
			//wpsn.createNote(managerNote);
			wpsn.manager.renderManager(null, 'Manage Notes');
		},
		renderManager: async function (note, message, selectNotes) {
			let results = await wpsn.loadFromAll();
			let notes = await wpsn.getNotesFromStorageResult(results);
			return await wpsn.manager.renderManagerNotes(note, notes, message, selectNotes);
		},
		renderManagerNotes: async function (note, notes, message, selectNotes) {
			wpsn.clearPopups();
			let html = `
			<br/><br/>
			${(message ? '<div class="panel panel-default"><div class="panel-heading"><b>' + message + '</b></div>' : '')}
			<table class="wpsn-manager table table-striped table-bordered table-hover table-condensed" style="width:100%">
				<thead><tr>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
				</tr></thead>
				<tbody></tbody></table><input type="hidden" name="wpsn_provided_notes" class="wpsn_provided_notes"/>
		`;

			let form = await wpsn.prompt({ background: '#fff', fullscreen: true, isNotPopup: true, load: function () { wpsn.manager.renderManagerLoad(note, notes, message, selectNotes); } }, html);
			return form.wpsn_provided_notes ? JSON.parse(form.wpsn_provided_notes) : [];
		},
		renderManagerLoad: function (note, notes, message, selectNotes) {
			let manager = $('.wpsn-manager');
			let noteFrame = manager.closest('.wpsn-frame');

			let managerTableSelected = {};
			let managerTableSubscopeChecked = {};

			notes = wpsn.removeNonNotes(notes);
			let tableNotes = notes;

			$.fn.dataTable.ext.search.push(
				function( settings, searchData, index, rowData) {
					let search = $('.wpsn-manager-search').val();
					let strategy = $('.wpsn-manager-search-strategy-or').is(':checked') ? 'OR' : 'AND';
					if (search) {
						let words = search.split(' ');
						var found = false;
						let data = JSON.stringify(rowData);
						if (strategy == 'OR') {
							for (let word of words) {
								if (!word) { continue; }
								if (data.toUpperCase().indexOf(word.toUpperCase()) > -1) {
									found = true; break;
								}
								for (let colData of searchData) {
									if (colData.toUpperCase().indexOf(word.toUpperCase()) > -1) {
										found = true; break;
									}
								}
							}
						} else {
							for (let word of words) {
								if (!word) { continue; }
								found = false;
								if (data.toUpperCase().indexOf(word.toUpperCase()) > -1) {
									found = true;
								}
								for (let colData of searchData) {
									if (colData.toUpperCase().indexOf(word.toUpperCase()) > -1) {
										found = true; break;
									}
								}
								if (!found) { break; }
							}
						}
					} else {
						return true;
					}
					return found;
				}
			);

			let managerTable = manager.DataTable({
				'paging': true,
				'ordering': true,
				'info': true,
				'search': false,
				'pageLength': 100,
				'pagingType': 'full_numbers',
				'bAutoWidth': false,
				'dom': '<"navbar-default navbar-fixed-top top wpsn-margin"<"pull-left"><"pull-right"p><"text-center"i><"clear">>rt',
				'aaData': tableNotes,
				'aoColumns': [
					{ 'sTitle': '#', 'bVisible': true, 'sClass': '', 'mDataProp': function () { return ''; } },
					{
						'sTitle': '', 'bVisible': true, 'sClass': '', 'mDataProp': function (note) {
							return ((note.tag && note.tag.indexOf('#favorite') > -1) ?
								'<img class="wpsn-menu wpsn-menu-favorite" data-id="' + note.id + '" title="Favorite current note" src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/star.svg" width="'+(wpsn.settings.defaultIconSize||14)+'" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'px;background-size:cover"/>'
								:
								'<img class="wpsn-menu wpsn-menu-favorite" data-id="' + note.id + '" title="Favorite current note" src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/star_off.svg" width="'+(wpsn.settings.defaultIconSize||14)+'" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'px;background-size:cover"/> '
							);
						}
					},
					{
						'sTitle': (selectNotes == 'note' ? '' : `
							<span title="Select all notes">
								<input type="checkbox" class="wpsn-scope-all" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> All
							</span><br/>
							<span title="Select all filtered notes">
								<input type="checkbox" class="wpsn-scope-all-filtered" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> Filtered
							</span><br/>
							<span title="Select all notes in the scope of the current page" style="white-space:nowrap">
								<input type="checkbox" class="wpsn-scope wpsn-scope-in-scope" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> In-scope
							</span>
						`), 'bVisible': true, 'sClass': '', 'mDataProp': function (note) {
							return '<input type="' + (selectNotes == 'note' ? 'radio' : 'checkbox') + '" name="wpsn-selected-note" class="' + (note.tag && note.tag.indexOf('#favorite') > -1 ? 'wpsn-favorite' : '') + ' wpsn-selected-note wpsn-scope wpsn-scope-' + note.id + '" data-id="' + note.id + '" ' + (managerTableSelected[note.id] ? 'checked="checked"' : '') + ' style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/>';
						}
					},
					{ 'sTitle': 'Note', 'bVisible': false, 'sClass': '', 'mDataProp': function (note) { return escape(JSON.stringify(note)); } },
					{
						'sTitle': 'Note ID', 'bVisible': true, 'sClass': '', 'mDataProp': function (note) {
							return (wpsn.inScope(note) ? ' <img title="In Scope" src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/circle.svg" width="'+(wpsn.settings.defaultIconSize||14)+'"/>':' ')+
							'<a href="#' + note.id + '" data-id="' + note.id + '" class="wpsn-note-id" title="Hover to preview note unminimized and centered. Click to toggle note.\nHolding Ctrl while hovering/clicking will maintain the original constraints of the note which might not be initially visible without scrolling the page.\nEditing a note toggled without holding Ctrl will unminimize and move the original note!">' + note.id + '<a/>';
						}
					},
					{
						'sTitle': 'Note/Page', 'bVisible': true, 'sClass': '', 'mDataProp': function (note) {
							let url = note.scope && note.scope.hostname ? (note.scope.protocol || 'http:') + '//' + note.scope.hostname + (note.scope.port ? ':' + note.scope.port : '') + (note.scope.pathname || '') + (note.scope.search || '') + (note.scope.hash || '') : '';
							return '<a href="#' + note.id + '">Note</a>' + (url ? '/<a href="' + url + '">Page</a>' : '');
						}
					},
					{ 'sTitle': 'Modified', 'bVisible': true, 'sClass': '', 'mDataProp': function (note) { return '<span style="white-space:nowrap">' + wpsn.formatDate(new Date(note.modified_date ? note.modified_date : note.created_date)) + '</span>'; } },
					{ 'sTitle': 'Size', 'bVisible': true, 'sClass': '', 'mDataProp': function (note) { return JSON.stringify(note).length; } },
					{
						'sTitle': 'Protocol', 'bVisible': true, 'sClass': '', 'mDataProp': function (note) {
							let scpTxt = 'protocol'; let scp = (note.scope && note.scope[scpTxt] ? note.scope[scpTxt] : '');
							return '<span title="Click on this cell to toggle all notes with current ' + scpTxt + ' scope.\n\n' + scp + '" class="wpsn-scope wpsn-scope-subscope" data-key="' + scpTxt + '" data-value="' + scp + '">' + wpsn.shorten(scp, 50, 50) + '</span>';
						}
					},
					{
						'sTitle': 'Host Name', 'bVisible': true, 'sClass': '', 'mDataProp': function (note) {
							let scpTxt = 'hostname'; let scp = (note.scope && note.scope[scpTxt] ? note.scope[scpTxt] : '');
							return '<span title="Click on this cell to toggle all notes with current ' + scpTxt + ' scope.\n\n' + scp + '" class="wpsn-scope wpsn-scope-subscope" data-key="' + scpTxt + '" data-value="' + scp + '" style="">' + wpsn.shorten(scp, 50, 50) + '</span>';
						}
					},
					{
						'sTitle': 'Port', 'bVisible': true, 'sClass': '', 'mDataProp': function (note) {
							let scpTxt = 'port'; let scp = (note.scope && note.scope[scpTxt] ? note.scope[scpTxt] : '');
							return '<span title="Click on this cell to toggle all notes with current ' + scpTxt + ' scope.\n\n' + scp + '" class="wpsn-scope wpsn-scope-subscope" data-key="' + scpTxt + '" data-value="' + scp + '" style="">' + wpsn.shorten(scp, 50, 50) + '</span>';
						}
					},
					{
						'sTitle': 'Path Name', 'bVisible': true, 'sClass': '', 'mDataProp': function (note) {
							let scpTxt = 'pathname'; let scp = (note.scope && note.scope[scpTxt] ? note.scope[scpTxt] : '');
							return '<span title="Click on this cell to toggle all notes with current ' + scpTxt + ' scope.\n\n' + scp + '" class="wpsn-scope wpsn-scope-subscope" data-key="' + scpTxt + '" data-value="' + scp + '" style="word-break:break-all">' + wpsn.shorten(scp, 50, 50) + '</span>';
						}
					},
					{
						'sTitle': 'Search', 'bVisible': true, 'sClass': '', 'mDataProp': function (note) {
							let scpTxt = 'search'; let scp = (note.scope && note.scope[scpTxt] ? note.scope[scpTxt] : '');
							return '<span title="Click on this cell to toggle all notes with current ' + scpTxt + ' scope.\n\n' + scp + '" class="wpsn-scope wpsn-scope-subscope" data-key="' + scpTxt + '" data-value="' + scp + '" style="word-break:break-all">' + wpsn.shorten(scp, 50, 50) + '</span>';
						}
					},
					{
						'sTitle': 'Hash', 'bVisible': true, 'sClass': '', 'mDataProp': function (note) {
							let scpTxt = 'hash'; let scp = (note.scope && note.scope[scpTxt] ? note.scope[scpTxt] : '');
							return '<span title="Click on this cell to toggle all notes with current ' + scpTxt + ' scope.\n\n' + scp + '" class="wpsn-scope wpsn-scope-subscope" data-key="' + scpTxt + '" data-value="' + scp + '" style="word-break:break-all">' + wpsn.shorten(scp, 50, 50) + '</span>';
						}
					},
					{
						'sTitle': 'Page Title', 'bVisible': true, 'sClass': '', 'mDataProp': function (note) {
							let scpTxt = 'title'; let scp = (note.scope && note.scope[scpTxt] ? note.scope[scpTxt] : '');
							return '<span title="Click on this cell to toggle all notes with current ' + scpTxt + ' scope.\n\n' + scp + '" class="wpsn-scope wpsn-scope-subscope" data-key="' + scpTxt + '" data-value="' + scp + '" style="word-break:break-all">' + wpsn.shorten(scp, 50, 50) + '</span>';
						}
					},
					{
						'sTitle': '<span title="Actions to be applied to selected notes"><span class="wpsn-selected-count"></span><br/>Selected<br/>' +
						(selectNotes ? '' :
							'<img class="wpsn-menu wpsn-menu-export" title="Export all selected notes" src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/up.svg" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'px;background-size:cover"/> ' +
							'<img class="wpsn-menu wpsn-menu-delete" title="Delete all selected notes" src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/multiply.svg" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'px;background-size:cover"/></span>'
						),
						'bVisible': selectNotes != 'note', 'sClass': '', 'mDataProp': function (note) {
							return '' +
								(selectNotes ? '' :
									'<img class="wpsn-menu wpsn-menu-export" data-id="' + note.id + '" title="Export current note" src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/up.svg" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'px;background-size:cover"/> ' +
									'<img class="wpsn-menu wpsn-menu-delete" data-id="' + note.id + '" title="Delete current note" src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/multiply.svg" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'px;background-size:cover"/>'
								);
						}
					}
				],
				'fnRowCallback': function (nRow, note) {
					$(nRow).off('click').on('click', function () {
						$('input.wpsn-scope', $(this)).click();
					}).removeClass('wpsn-row-selected').addClass((managerTableSelected[note.id] ? 'wpsn-row-selected' : ''));

					$('input.wpsn-scope', nRow).off('click').on('click', function (e) {
						e.stopPropagation();
						let checked = selectNotes == 'note' || $(this).is(':checked');
						if (selectNotes == 'note') { managerTableSelected = {}; }
						if (checked) {
							managerTableSelected[note.id] = true;
						} else {
							delete managerTableSelected[note.id];
						}
						$('.wpsn-selected-count', noteFrame).html(Object.keys(managerTableSelected).length);
						managerTable.rows().invalidate().draw();
					});

					$('.wpsn-note-id', nRow).off('click').on('click', function (e) {
						e.preventDefault();
						e.stopPropagation();
						let noteId = $(this).data('id');
						let tnote = wpsn.getNote(noteId);
						if ($('#note-' + noteId + '.wpsn-mouseclick').size() > 0) {
							wpsn.eraseNote(tnote);
						} else if ($('#note-' + noteId + '.wpsn-mouseover').size() > 0) {
							$('#note-' + noteId).addClass('wpsn-mouseclick').removeClass('wpsn-mouseover');
						} else {
							let clonedNote = JSON.parse(JSON.stringify(tnote));//clone
							if (!(e.ctrlKey || e.metaKey)) { clonedNote.minimized = false; }
							wpsn.renderNote(clonedNote);
							if (!(e.ctrlKey || e.metaKey)) { wpsn.centerNote(clonedNote); }
							$('#note-' + noteId).addClass('wpsn-mouseclick').css('z-index', '9999');
						}
					}).off('mouseenter').on('mouseenter', function (e) {
						e.preventDefault();
						let noteId = $(this).data('id');
						let tnote = wpsn.getNote(noteId);
						//if (!$('#note-' + noteId).size() > 0) {
						let clonedNote = JSON.parse(JSON.stringify(tnote));//clone
						if (wpsn.inScope(clonedNote)) {
							clonedNote.id = clonedNote.id+'_';
						}
						if (!(e.ctrlKey || e.metaKey)) { clonedNote.minimized = false; }
						wpsn.renderNote(clonedNote);
						if (!(e.ctrlKey || e.metaKey)) { wpsn.centerNote(clonedNote); }
						let $note = $('#note-' + clonedNote.id);
						$note.addClass('wpsn-mouseover').css('z-index', wpsn.defaultZIndexPopup + 20).off('mouseenter').on('mouseenter', function (e) {
							e.preventDefault();
							if ($(this).is('.wpsn-mouseover')) {
								$(this).removeClass('wpsn-mouseover').addClass('wpsn-mouseover2');
							}
						}).off('mouseleave').on('mouseleave', function (e) {
							e.preventDefault();
							let $this = $(this);
							if ($this.is('.wpsn-mouseover2')) {
								$this.remove();
							}
						});
						//}
					}).off('mouseleave').on('mouseleave', function (e) {
						e.preventDefault();
						let that = $(this);
						window.setTimeout(function () {
							let noteId = that.data('id');
							let tnote = wpsn.getNote(noteId);
							let clonedNote = JSON.parse(JSON.stringify(tnote));//clone
							if (wpsn.inScope(clonedNote)) {
								clonedNote.id = clonedNote.id+'_';
							}
							if ($('#note-' + clonedNote.id + '.wpsn-mouseover').size() > 0) {
								wpsn.eraseNote(clonedNote);
							}
						}, 10);
					});

					$('.wpsn-scope-subscope', nRow).off('click').on('click', function (e) {
						if (selectNotes != 'note') {
							e.stopPropagation();
							let subscope = $(this);
							let subscopeKey = subscope.data('key');
							let subscopeValue = subscope.data('value');

							managerTableSubscopeChecked[note] = managerTableSubscopeChecked[note] || {};
							managerTableSubscopeChecked[note][subscopeKey] = managerTableSubscopeChecked[note][subscopeKey] || false;
							let checked = !managerTableSubscopeChecked[note][subscopeKey];
							managerTableSubscopeChecked[note][subscopeKey] = !managerTableSubscopeChecked[note][subscopeKey];



							for (let i = 0; i < notes.length; i++) {
								let note = notes[i];
								if (note.scope && note.scope[subscopeKey] == subscopeValue) {
									if (checked) {
										managerTableSelected[note.id] = true;
									} else {
										delete managerTableSelected[note.id];
									}
								}
							}
							managerTable.rows().invalidate().draw();
						}
					});
				},
				'fnInitComplete': function () {

				},
				'fnDrawCallback': function () {
					$('.wpsn-selected-count', noteFrame).html(Object.keys(managerTableSelected).length);
					if ($('input[type="search"]', noteFrame).size() == 0) {
						$('.navbar-default', noteFrame).prepend(`
							<div class="pull-left">
								<div id="DataTables_Table_0_filter" class="dataTables_filter">
									<label>
										Search:
										<input type="search" class="form-control input-sm wpsn-manager-search" placeholder="" aria-controls="DataTables_Table_0" name="wpsn-manager-search" autocomplete="wpsn-manager-search">
									</label>
									<span style="display:inline-block;line-height:50%;top:-12px;position:relative;">
									<label style="margin:0">
										Match All Words:
										<input type="radio" class="wpsn-manager-search-strategy wpsn-manager-search-strategy-and" name="wpsn-manager-search-strategy" checked="checked" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/>
									</label>
									<br/>
									<label style="margin:0">
										Match Any Words:
										<input type="radio" class="wpsn-manager-search-strategy wpsn-manager-search-strategy-or" name="wpsn-manager-search-strategy" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/>
									</label>
									</span>
								</div>
							</div>
						`);
						$('.wpsn-manager-search', noteFrame).off('keyup').on('keyup',function(){
							managerTable.search('').draw();
						});
						$('.wpsn-manager-search-strategy', noteFrame).off('change').on('change',function(){
							managerTable.search('').draw();
						});
					}
					$('input[type="search"]', noteFrame).attr('name','wpsn-manager-search').removeClass('wpsn-manager-search').addClass('wpsn-manager-search').attr('autocomplete','wpsn-manager-search').focus();

					$('input.wpsn-scope-all', noteFrame).off('click').on('click', function () {
						let checked = $(this).is(':checked');
						for (let i = 0; i < notes.length; i++) {
							let note = notes[i];
							if (checked) {
								managerTableSelected[note.id] = true;
							} else {
								delete managerTableSelected[note.id];
							}
						}
						managerTable.rows().invalidate().draw();
					});
					$('input.wpsn-scope-all-filtered', noteFrame).off('click').on('click', function () {
						let checked = $(this).is(':checked');
						const data = managerTable.rows({ search: 'applied'}).data();
						for (let i = 0; i < data.length; i++) {
							const note = data[i];
							if (checked) {
								managerTableSelected[note.id] = true;
							} else {
								delete managerTableSelected[note.id];
							}
						}
						managerTable.rows().invalidate().draw();
					});
					$('input.wpsn-scope-in-scope', noteFrame).off('click').on('click', function () {
						let checked = $(this).is(':checked');
						for (let i = 0; i < notes.length; i++) {
							let note = notes[i];
							if (wpsn.inScope(note)) {
								if (checked) {
									managerTableSelected[note.id] = true;
								} else {
									delete managerTableSelected[note.id];
								}
							}
						}
						managerTable.rows().invalidate().draw();
					});
					$('.wpsn-menu-export,.wpsn-menu-delete,.wpsn-menu-favorite', noteFrame).off('click').on('click', async function (e) {
						e.stopPropagation();
						let notes = [];
						let isCurrentNote = false;
						let action = $(this);
						if (action.data('id')) {
							notes.push(wpsn.getNote($(this).data('id')));
							isCurrentNote = true;
						} else {
							let mtNotes = managerTable.data();
							for (let i = 0; i < mtNotes.length; i++) {
								let note = mtNotes[i];
								if (managerTableSelected[note.id]) {
									notes.push(note);
								}
							}
						}
						if (action.is('.wpsn-menu-export')) {
							wpsn.exportEffectiveNotes(notes);
						}
						if (action.is('.wpsn-menu-delete')) {
							try {
								await wpsn.confirm({}, 'Delete ' + (isCurrentNote ? 'current note' : 'selected notes') + '? This cannot be undone!');
								await wpsn.saveNoteStateForUndo(notes);
								await wpsn.deleteEffectiveNotes(notes);
								for (let i = tableNotes.length - 1; i >= 0; i--) {
									let tnote1 = tableNotes[i];
									for (let tnote2 of notes) {
										if (tnote1.id === tnote2.id) {
											tableNotes.splice(i, 1);
										}
									}
								}
								managerTableSelected = {};
								managerTable.clear().draw();
								managerTable.rows.add(tableNotes);
								managerTable.columns.adjust().draw();
							} catch (err) { wpsn.error(err); }
						}
						if (action.is('.wpsn-menu-favorite')) {
							for (let note of tableNotes) {
								if (note.id != $(this).data('id')) { continue; }
								if (note && note.tag && note.tag.indexOf('#favorite') > -1) {
									delete note.tag;
								} else {
									note.tag = '#favorite';
								}
								wpsn.save(note);
								managerTable.rows().invalidate().draw(false);
							}
						}
					});
					noteFrame.unbind('dblclick');
					//wpsn.autoResizeWidth(note);
				}
			}).off('order.dt search.dt').on('order.dt search.dt', function () {
				managerTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
					cell.innerHTML = i + 1;
				});
			});
			managerTable.order([[1, 'asc'], [6, 'desc']]).draw();
			$('input.wpsn-favorite[type=radio]').eq(0).click();

			$('form.wpsn_form').data('submit', function () {
				let notes = [];
				let mtNotes = managerTable.data();
				for (let i = 0; i < mtNotes.length; i++) {
					let note = mtNotes[i];
					if (managerTableSelected[note.id]) {
						notes.push(note);
					}
				}
				$('.wpsn_provided_notes').val(JSON.stringify(notes));
			});
		},

		notesToGrid: function () {
			let notesClone = wpsn.getSelectedOrAllNotes(true).slice(0);
			let html = '<div class="panel panel-default">' +
				'<div class="panel-heading">Width & Height:</div>' +
				'<div class="panel-body">' +
				'<span style="display:inline-block;width:150px">Notes per row:</span><input type="range" class="wpsn_slider wpsn_notesPerRow" style="width:100%;" name="wpsn_notesPerRow" min="1" max="' + notesClone.length + '" step="1" data-display="wpsn_notesPerRow" list="wpsn_notesPerRow"><datalist id="wpsn_notesPerRow">';
			for (let i = 0; i < notesClone.length; i++) {
				html += '<option>' + (i + 1) + '</option>';
			}
			html += '</datalist></input><span class="wpsn_notesPerRow" style="padding-left:5px;"></span><br/><br/>' +
				'<span style="display:inline-block;width:50px">Width:</span><input type="range" class="wpsn_slider wpsn_defaultWidth" style="width:100%;" name="wpsn_defaultWidth" min="25" max="1000" step="25" data-display="wpsn_defaultWidth" list="wpsn_defaultWidth"><datalist id="wpsn_defaultWidth"><option>25</option><option>250</option><option>500</option><option>750</option><option>1000</option></datalist></input><span class="wpsn_defaultWidth" style="padding-left:5px;"></span>px<br/><br/>' +
				'<span style="display:inline-block;width:50px">Height:</span><input type="range" class="wpsn_slider wpsn_defaultHeight" style="width:100%;" name="wpsn_defaultHeight" min="25" max="1000" step="25" data-display="wpsn_defaultHeight" list="wpsn_defaultHeight"><datalist id="wpsn_defaultHeight"><option>25</option><option>250</option><option>500</option><option>750</option><option>1000</option></datalist></input><span class="wpsn_defaultHeight" style="padding-left:5px;"></span>px<br/><br/>' +
				'<input type="checkbox" name="wpsn_lock" id="wpsn_lock" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn_lock">Lock Notes</label>' +
				'</div>' +
				'</div>';
			let padding = 10;
			let defaultNotesPerRow = Math.floor(Math.sqrt(parseInt(notesClone.length)));
			wpsn.prompt(
				{
					load: function () {
						$('.wpsn_slider.wpsn_notesPerRow').unbind('change.calculate').bind('change.calculate', function () {
							let notesPerRow = parseInt($(this).val());
							let defaultWidth = Math.floor((($(window).width() - 2 * padding) / notesPerRow) / 25) * 25;
							let defaultHeight = Math.floor((($(window).height() - 2 * padding) / Math.ceil(notesClone.length / notesPerRow)) / 25) * 25;
							$('.wpsn_slider.wpsn_defaultWidth').val(defaultWidth).change();
							$('.wpsn_slider.wpsn_defaultHeight').val(defaultHeight).change();
						});
						let sizeInput = $('.wpsn_slider').unbind('change.change').bind('change.change', function () {
							$('span.' + $(this).data('display')).text($(this).val());
						});
						sizeInput.each(function () {
							$('span.' + $(this).data('display')).text($(this).val());
						});
					}
				},
				html,
				{
					'wpsn_defaultWidth': Math.floor((($(window).width() - 2 * padding) / defaultNotesPerRow) / 25) * 25,
					'wpsn_defaultHeight': Math.floor((($(window).height() - 2 * padding) / Math.ceil(notesClone.length / defaultNotesPerRow)) / 25) * 25,
					'wpsn_notesPerRow': defaultNotesPerRow
				},
				function (form) {
					if (form) {
						let rowNoteCount = 0;
						let lastPosX = padding;
						let lastPosY = padding;
						for (let i = 0; i < notesClone.length; i++) {
							if (!notesClone[i]) { continue; }
							let tempNote = notesClone[i];
							wpsn.saveNoteStateForUndo(tempNote);
							tempNote.pos_x = lastPosX + 1;
							tempNote.pos_y = lastPosY + 1;
							tempNote.width = parseFloat(form.wpsn_defaultWidth);
							tempNote.height = parseFloat(form.wpsn_defaultHeight);
							lastPosX = parseFloat(tempNote.pos_x) + parseFloat(tempNote.width);
							rowNoteCount++;
							if (rowNoteCount == parseInt(form.wpsn_notesPerRow)) {
								lastPosX = padding;
								rowNoteCount = 0;
								lastPosY = parseFloat(tempNote.pos_y) + parseFloat(tempNote.height);
							}
							if (form.wpsn_lock) {
								tempNote.lock = true;
								tempNote.lockmode = wpsn.lockModes.editable;
							} else {
								delete tempNote.lock;
								delete tempNote.lockmode;
							}
							wpsn.refreshNote(tempNote);
						}
					}
				}
			);
		}
	};

	wpsn.manager;
















	wpsn.menu.media = {
		'icon': 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/play.svg',
		'name': 'media',
		'optional': false,
		'description': '',
		'modes': {
			'media': { name: 'Media', id: 4580805653, render: async function (note) { await wpsn.menu.media.render(note); }, description: 'Render an image, music or video from another web page.' },
			'mediaSearch': { name: 'Media from Search', id: 9372103092, render: async function (note) { await wpsn.menu.media.render(note); }, description: 'Render an image, music or video from another web page.' }
		},
		'renderMedia': async function (note, html) {
			let props = note[wpsn.menu.media.modes.media.id];
			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);

			if (note.text) {
				note.textposition = note.textposition || wpsn.settings.textposition || 'bottom-center';
				if (note.textshadow == undefined) {
					note.textshadow = note.textshadow || wpsn.settings.textshadow || 'true';
					await wpsn.refreshNote(note);
					return;
				}
			}

			if (note.jqText) {
				wpsn.renderJQText(note);
			}
			if (html) {
				noteFrame.empty().append(html);
			}
			if (note.text) {
				let _textPositionClass = 'wpsn-text-' + note.textposition;
				let _textShadowClass = note.textshadow && note.textshadow != 'false' ? 'wpsn-text-shadow' : '';
				let meme = wpsn.isMeme(note);
				let fontSize = wpsn.fontSize(note);
				if (meme) {
					let textArr = ['', note.text];
					let ind = note.text.indexOf('\n');
					if (ind > -1) {
						textArr = [note.text.substring(0, ind), note.text.substring(ind + 1)];
					}
					noteFrame.prepend('<div class="' + (fontSize ? '' : 'wpsn-auto-fit-text') + ' wpsn-text-top-center wpsn-text-shadow wpsn-meme" style="text-transform:uppercase;font-family:Impact,Verdana;color:' + (note.textcolor || wpsn.settings.textcolor || '#fff;') + '">' + wpsn.markdownConverter(textArr[0]) + '</div>');
					noteFrame.prepend('<div class="' + (fontSize ? '' : 'wpsn-auto-fit-text') + ' wpsn-text-bottom-center wpsn-text-shadow wpsn-meme" style="text-transform:uppercase;font-family:Impact,Verdana;color:' + (note.textcolor || wpsn.settings.textcolor || '#fff;') + '">' + wpsn.markdownConverter(textArr[1]) + '</div>');
				} else {
					noteFrame.prepend('<div class="' + (fontSize ? '' : 'wpsn-auto-fit-text') + ' ' + _textPositionClass + ' ' + _textShadowClass + '" style="color:' + (note.textcolor || wpsn.settings.textcolor || '#fff;') + '">' + wpsn.markdownConverter(note.text) + '</div>');
				}
			}
			if (props.caption) {
				noteFrame.append('<br/><div class="wpsn-caption">' + props.caption + '</div>');
			}

			if (props.media != '') {
				//noteFrame.unbind('dblclick');
			}
			if (note.initiallyEmpty && !note.lock) {
				wpsn.autoResize(note);
				delete note.initiallyEmpty;
			}
			if (props.crop) {
				wpsn.cropMedia(note);
			}
			let $media = $('.wpsn-media', noteDiv);
			if (note.mediaFilter) {
				let filterValues = [];
				for (let filter in wpsn.filters) {
					if (note.mediaFilter[filter] != null) {
						filterValues.push(filter + '(' + note.mediaFilter[filter] + wpsn.filters[filter].unit + ')');
					}
				}
				if (filterValues.length > 0) {
					$media.css('-webkit-filter', filterValues.join(' '));
				}
			}
			if (note.mediaTransform) {
				let transformValues = [];
				for (let transform in wpsn.transforms) {
					if (note.mediaTransform[transform] != null) {
						transformValues.push(transform + '(' + note.mediaTransform[transform] + wpsn.transforms[transform].unit + ')');
					}
				}
				if (transformValues.length > 0) {
					$media.css('-webkit-transform', transformValues.join(' '));
				}
			}
			wpsn.menu.media.renderTransparentAndVectorizer(note);

			noteDiv.find('.wpsn-auto-fit-text').fitText(wpsn.fittextcompressor, wpsn.fittextoptions);
		},
		'renderTransparentAndVectorizer': function (note, options = {}) {
			options.transparentOptions = Object.assign({}, note.colorToTransparent, options.transparentOptions);
			options.vectorizerOptions = Object.assign({}, note.mediaTracer, options.vectorizerOptions);
			return new Promise(function (resolve) {
				let $noteDiv = wpsn.getNoteDiv(note);
				$('.wpsn-media', $noteDiv);
				if (options.transparentOptions && !$.isEmptyObject(options.transparentOptions)) {
					wpsn.menu.media.renderTransparent(note, Object.assign({ uselatesturl: false }, options.transparentOptions)).then(function () {
						wpsn.menu.media.renderVectorizer(note, Object.assign({ uselatesturl: true }, options.vectorizerOptions)).then(function (url) {
							resolve(url);
						});
					});
				} else if (options.vectorizerOptions.enabled && options.vectorizerOptions) {
					wpsn.menu.media.renderVectorizer(note, Object.assign({ uselatesturl: false }, options.vectorizerOptions)).then(function (url) {
						resolve(url);
					});
				}
			});
		},
		'renderTransparent': function (note, options = {}) {
			options = Object.assign({ color: '#ffffff', threshold: 0 }, note.colorToTransparent, options);
			return new Promise(function (resolve) {
				let $noteDiv = wpsn.getNoteDiv(note);
				let $media = $('.wpsn-media', $noteDiv);
				if (options) {
					wpsn.imageColorToTransparent($media, options).then(function (url) {
						resolve(url);
					});
				}
			});
		},
		'renderVectorizer': function (note, options = {}) {
			options = Object.assign({}, note.mediaTracer, options);
			return new Promise(function (resolve) {
				let $noteDiv = wpsn.getNoteDiv(note);
				let $media = $('.wpsn-media', $noteDiv);
				if (options && options.enabled) {
					let tracerValues = {};
					tracerValues.uselatesturl = options.uselatesturl;
					for (let tracer in wpsn.tracers) {
						if (options[tracer] != null) {
							tracerValues[tracer] = options[tracer] + wpsn.tracers[tracer].unit;
						}
					}
					if (tracerValues != {}) {
						let url = $media.data('wpsn_original_src') || $media.attr('src');
						$media.data('wpsn_original_src', url);
						let updatedTracerValues = Object.assign({}, tracerValues);
						delete updatedTracerValues.enabled;
						wpsn.imageToBase64($media, updatedTracerValues).then(function (url) {
							$media.attr('src', url);
							resolve(url);
						});
					}
				}
			});
		},
		'render': function (note) {
			return new Promise(function (resolve) {
				let props = note[wpsn.menu.media.modes.media.id];
				if (!props || !props.media) { return; }
				let media = wpsn.htmlDecode(props.media);
				let fallbackHTML = props.html;
				let html = '';
				if (media.toLowerCase().match(/\.(mp4|webm|ogg)$/) != null) {
					html = '<video controls loop><source src="' + media + '"></video> ';
					wpsn.menu.media.renderMedia(note, html).then(function () {
						wpsn.getNoteDiv(note).find('.wpsn-frameless').removeClass('wpsn-frameless');
						resolve();
					});
				} else if (media.toLowerCase().match(/\.(mp3|wav)$/) != null) {
					html = '<audio controls loop><source src="' + media + '"></audio> ';
					wpsn.menu.media.renderMedia(note, html).then(function () {
						wpsn.getNoteDiv(note).find('.wpsn-frameless').removeClass('wpsn-frameless');
						resolve();
					});
				} else if (media.toLowerCase().indexOf('youtube.com/') > -1 && media.toLowerCase().indexOf('v=') > -1) {
					html = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + media.substring(media.toLowerCase().indexOf('v=') + 2) + '" frameborder="0" allowfullscreen></iframe> ';
					wpsn.menu.media.renderMedia(note, html).then(function () {
						wpsn.getNoteDiv(note).find('.wpsn-frameless').removeClass('wpsn-frameless');
						resolve();
					});
				} else {
					$('<img class="wpsn-media"/>')
						.on('load', function () {
							if (!$(this).data('wpsn_original_src')) {
								note.jqText = $('<div class="wpsn-media-div"/>').append($(this));
								wpsn.initResizable(note, { aspectRatio: true });
								wpsn.menu.media.renderMedia(note);
								let $noteDiv = wpsn.getNoteDiv(note);
								$noteDiv.find('.wpsn-media-filter').addClass('wpsn-media-filter-show');
								$noteDiv.find('.wpsn-media-crop').addClass('wpsn-media-crop-show');
								$noteDiv.find('.wpsn-media-meme').addClass('wpsn-media-meme-show');
								let $frame = wpsn.getNoteFrame(note);
								$frame.removeClass('wpsn-scrollbar');
								resolve();
							}
						})
						.error(async function () {
							if (fallbackHTML) {
								let $element = $(fallbackHTML);
								if ($element.is('img')) {
									let props = note[wpsn.menu.media.modes.media.id] || {};
									note[wpsn.menu.media.modes.media.id] = props;
									delete props.html;
									props.media = $element.attr('src');
									await wpsn.refreshNote(note);
									resolve();
								} else {
									note.text = fallbackHTML;
									delete note.mode;
									await wpsn.refreshNote(note);
									if (!wpsn.settings.disableAutoresize && !note.fullscreen) {
										wpsn.autoResize(note);
									}
									resolve();
								}
							} else {
								let urlPattern = new RegExp('^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|(www\\.)?){1}([0-9A-Za-z-\\.@:%_??+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?');
								let matchingFragments = media.match(urlPattern);
								if (matchingFragments && matchingFragments[0] && matchingFragments[0] === media) {
									if (media.indexOf('http') < 0) {
										media = 'http://' + media;
									}
									note.text = '<a href="' + media + '">' + media + '</a>';
									wpsn.renderMarkdown(note);
									if (!wpsn.settings.disableAutoresize) {
										wpsn.autoResize(note);
									}
									resolve();
								} else {
									html = media;
									wpsn.menu.media.renderMedia(note, html).then(function () { resolve(); });
								}
							}
						})
						.attr('src', media);
				}
			});
		},
		'saveMedia': function (note, media, html) {
			return new Promise(function (resolve) {
				if (media && media.endsWith('.rss')) {
					wpsn.menu.rss.saveRSS(note, media);
				} else {
					wpsn.saveNoteStateForUndo(note);
					note.mode = wpsn.menu.media.modes.media.id;
					if (note.initiallyEmpty == null) {
						note.initiallyEmpty = true;
					}
					let props = note[wpsn.menu.media.modes.media.id] || {};
					note[wpsn.menu.media.modes.media.id] = props;
					props.media = media;
					props.html = html;
					wpsn.refreshNote(note).then(function () { resolve(note); });
				}
			});
		},
		'leftClick': {
			'description': 'Load media (image, music, video ...)',
			'prompt': {
				mode: 4580805653,
				popup: { minWidth: 600 },
				refresh: true,
				form: function () {
					return '<div class="panel panel-default"><div class="panel-heading">Media:</div><div class="panel-body"><ol><li>Right click an image, music or video from another web page and copy its URL. </li><li>Paste the URL below.</li></ol>The note will <i>attempt</i> to render the media.<br/><br/>URL:<input type="text" style="width:100%" name="media" value="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/transparent.gif"/><br/>Caption:<textarea name="caption" style="width:100%;height:200px"/><br/>Tip: You can also drag and drop an image from another window into a note.</div></div><div class="panel panel-default"><div class="panel-heading">Background mode:</div><div class="panel-body"><input type="radio" name="canvas" id="wpsn-none" value="" checked="checked" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn-none">None</label><br/><input type="radio" name="canvas" id="wpsn-frameless" value="frameless" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn-frameless">Frameless (no background, no border, media fits to note)</label><br/><input type="radio" name="canvas" id="wpsn-sticker" value="' + wpsn.transparent + '|' + wpsn.transparent + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn-sticker">Sticker Mode (transparent background & border)</label><br/><input type="radio" name="canvas" id="wpsn-whiteGray" value="#fff|#aaa" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn-whiteGray">Canvas Mode (white background / gray border)</label></div></div>';
				},
				callback: function (note) {
					let props = note[wpsn.menu.media.modes.media.id];
					if (!props || !props.media) { return; }
					note.canvas = props.canvas;
				}
			}
		},
		'doubleClick': {
			'description': 'Preview page content inside note',
			'action': function (note) {
				wpsn.prompt(
					{},
					'<div class="panel panel-default"><div class="panel-heading">You selected the option of previewing a page element inside this note.</div><div class="panel-body"><ul>' +
					'<li style="list-style-type:none"><input type="radio" name="wpsn_mode" value="raw" id="wpsn-mode-raw" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> ' +
					'<label for="wpsn-mode-raw"><b>Preview Raw Text</b></label><span>: Renders preview of raw text of selected element.</span></li>' +
					'<li style="list-style-type:none"><input type="radio" name="wpsn_mode" value="html" id="wpsn-mode-html" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> ' +
					'<label for="wpsn-mode-html"><b>Preview HTML</b></label><span>: Renders preview of HTML text of selected element.</span></li>' +
					'<li style="list-style-type:none"><input type="radio" name="wpsn_mode" value="none" id="wpsn-mode-none" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> ' +
					'<label for="wpsn-mode-none"><b>Don\'t Preview</b></label></li>' +
					'</ul>After clicking OK, click on the page element you wish to preview in this note.</div></div>',
					{
						'wpsn_mode': note.previewMode
					},
					function (form, previewNoteId) {
						if (form) {
							let previewnote = wpsn.getNote(previewNoteId);
							wpsn.saveNoteStateForUndo(previewnote);
							if (form.wpsn_mode == 'none') {
								if (previewnote.preview) {
									$(previewnote.preview).unbind('keyup.wpsn-preview,change.wpsn-preview');
								}
								delete previewnote.mode;
								delete previewnote.preview;
								delete previewnote.previewText;
								wpsn.refreshNote(previewnote);
							} else {
								$('*').bind('click.wpsn-preview', function () {
									if (window.sessionStorage.getItem('wpsn-previewnote')) {
										previewnote.preview = wpsn.selector($(this));
										previewnote.previewMode = form.wpsn_mode;
										wpsn.refreshNote(previewnote);

										window.sessionStorage.removeItem('wpsn-previewnote');
									}
									$('*').unbind('click.wpsn-preview');
									return false;
								});
								//$('.wpsn-container *, .wpsn-popup-container *').unbind('click.wpsn-preview');
								window.sessionStorage.setItem('wpsn-previewnote', previewNoteId); 
								wpsn.selectElement(wpsn.getNoteDiv(wpsn.getNote(previewNoteId)));
								wpsn.updateHasSelection();
							}
						}
					},
					note.id
				);
			}
		}
	};

	wpsn.screenshotTimeout = function (e) {
		if (e.altKey) {
			return 3000;
		}
		return 500;
	};

	wpsn.menu.snapshot = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/camera.svg',
		name: 'snapshot',
		description: '',
		leftClick: {
			command: 'snapshot-note',
			applyToAll: true
		},
		rightClick: {
			//description : 'Toggle canvas mode:\n      -transparent background with gray border\n      -frameless\n      -transparent background and border\n      -white background with gray border\n      -original note',
			command: 'toggle-canvas-mode-note',
			appendDescription: '      -transparent background with gray border\n      -frameless\n      -transparent background and border\n      -white background with gray border\n      -original note',
			applyToAll: true
		},
		'doubleClick': {
			command: 'b-download-note-as-html'
		}
	};

	wpsn.menu.record = {
		//'extension' : 'wpsn.menu.record',
		'icon': 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/record.svg',
		'name': 'record',
		'optional': false,
		'description': '',
		'modes': { 'formrecorder': { name: 'Form Recorder', id: 9027598325, render: function (note) { wpsn.menu.record.render(note); }, description: 'Form Recorder allows you to record the state of the forms of a current page to allow for a one click form completion at a later time.' } },
		'updateValue': function (fieldElement, value) {
			if (fieldElement.is('[type="checkbox"]') || fieldElement.is('[type="radio"]')) {
				if (fieldElement.val() == value) {
					let checked = (fieldElement.val() == value);
					if (!checked) { fieldElement.removeAttr('checked'); } else { fieldElement.attr('checked', 'checked'); }
					fieldElement.prop('checked', checked).mousedown().mouseup().click().change().mouseout().blur();
					if (fieldElement.prop('checked') != (fieldElement.val() == value)) { fieldElement.click(); }
				}
			} else {
				if (value) {
					fieldElement.val('');
					fieldElement.mousedown().mouseup().click();
					for (let i = 0; i < value.length; i++) {
						let letter = value.charAt(i);
						fieldElement.val(fieldElement.val() + letter).keydown().keyup();
						fieldElement.each(function () {
							this.dispatchEvent(new CustomEvent('input'));
						});
					}
				}
				fieldElement.change().mouseout().blur();
				//fieldElement.val(value).mousedown().mouseup().click().change().mouseout().blur();
			}
		},
		'render': function (note) {
			let props = note[wpsn.menu.record.modes.formrecorder.id];
			if (!props || (!props.forms && !props.csvFieldNames)) { return; }
			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);
			let formLink = $('<a>').css('white-space', 'nowrap').text(props.text).on('click', function () {
				if (props.csvFieldNames) {
					let csvFieldValues = window.prompt('Comma Seperated Field Values (' + props.csvFieldNames + '):');
					let fieldNames = props.csvFieldNames.split(',');
					let fieldValues = csvFieldValues.split(',');
					for (let a = 0; a < 2; a++) {
						for (let formSelector in props.forms) {
							let form = $(formSelector);
							for (let i = 0; i < fieldNames.length; i++) {
								let fieldElements = $('[name="' + fieldNames[i] + '"]', form);
								fieldElements.each(function () {
									let fieldElement = $(this);
									wpsn.menu.record.updateValue(fieldElement, fieldValues[i]);
								});
							}
						}
					}
				} else {
					for (let a = 0; a < 2; a++) {
						for (let formSelector in props.forms) {
							let form = $(formSelector);
							for (let i = 0; i < props.forms[formSelector].length; i++) {
								let field = props.forms[formSelector][i];
								let fieldElements = $('[name="' + field.name + '"]', form);
								fieldElements.each(function () {
									let fieldElement = $(this);
									wpsn.menu.record.updateValue(fieldElement, field.value);
								});
							}
						}
					}
				}
				if (props.submitForm) {
					let formEL = $(props.formSelector);
					let submitEL = $('[type="submit"]', formEL);
					let otherSubmitEL = $('[id*="submit"],[class*="submit"]', formEL);
					if (submitEL.size() > 0) { submitEL.mousedown().mouseup().click(); }
					else if (otherSubmitEL.size() > 0) {
						otherSubmitEL.find('*').addBack().mousedown().mouseup().click();
						if (otherSubmitEL.attr('href')) {
							location.href = otherSubmitEL.attr('href');
						}
					} else { formEL.submit(); }
					//wpsn.saveToAll({'wpsn-form-note':note.id});
					//chrome.storage.local.set({'wpsn-form-note':note.id});
				}
			});
			if (props.previousStep && props.previousStep == window.sessionStorage.getItem('wpsn-form-note')) {
				formLink.click();
			}
			noteFrame.empty().append(formLink);
		},
		'promptHTML': function (note) {
			let promptHTML = '<div class="panel panel-default"><div class="panel-heading">Record Form</div><div class="panel-body">Please provide text of generated link:<br/><input style="width:98%" type="text" name="text" value="Fill Form"/>';
			let formPromptHTML = '';
			let count = 0;
			let formFound = {};
			$('form').each(function () {
				let formSelector = 'form';
				if ($(this).attr('id')) {
					//formSelector += '#'+$(this).attr('id');
				} if ($(this).attr('name')) {
					formSelector += '[name="' + $(this).attr('name') + '"]';
				} else if ($(this).attr('action')) {
					formSelector += '[action="' + $(this).attr('action') + '"]';
				} else {
					formSelector = wpsn.selector($(this));
					//return;
				}
				if (formFound[formSelector]) { return; }
				formFound[formSelector] = true;
				formPromptHTML += '<br/><input type=\'radio\' name=\'formSelector\' id=\'' + formSelector + '\' value=\'' + formSelector + '\' ' + (count == 0 ? 'checked="checked"' : '') + ' style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/><label for=\'' + formSelector + '\'>' + ($(this).attr('name') || formSelector) + '</label>';
				count++;
			});
			if (formPromptHTML) {
				promptHTML += '<br/><br/>Please select which form to record:';
				promptHTML += formPromptHTML;
				//promptHTML += '<br/><input type="radio" name="formSelector" id="none" value=""/><label for="none">None</label>';
				//promptHTML += '<br/><br/>Comma Seperated Value of field names to prompt user for fast input?<br/><input type="text" style="width:100%" name="csvFieldNames" value=""/>';
				promptHTML += '<br/><br/><input type="checkbox" name="submitForm" id="submitForm" value="true"' + (note[wpsn.menu.record.modes.formrecorder.id] ? '' : ' checked="checked"') + ' style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/><label for="submitForm">Submit form when generated link is clicked?</label> By unchecking this, the form will be filled when the generated link is clicked but the form will not be submitted';
				if (note[wpsn.menu.record.modes.formrecorder.id]) {
					promptHTML += '<br/><br/><input type="checkbox" name="keepPrevious" id="keepPrevious" value="true" checked="checked" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/><label for="keepPrevious">Keep previously recorded form values?</label> By unchecking this, the values on the current form will be saved instead';
				}
				promptHTML += '<br/><br/>Warning:<ul>';
				promptHTML += '<li>The form may contain dynamic fields which depend on user interaction not replicable by the recorder.</li>';
				promptHTML += '<li>The form may also contain dynamic fields which may lose the value previously recorded.</li>';
				promptHTML += '<li>The form may be styled using some third party utility. Filling the form might not reflect the values due to the need to refresh the form via third party API.</li>';
				promptHTML += '<li>The form values are not encrypted. Sensitive form data, such as login forms, should be carefully considered before being recorded.</li>';

				promptHTML += '</ul><br/>All cases are uncovered by the recorder and may yield undesired results.</div></div>';
			} else {
				promptHTML = '<div class="alert alert-warning">There are no forms to record</div>';
			}

			return promptHTML;
		},
		'leftClick': {
			'description': 'Record state of forms on current page into a link. Click generated link to autofill/autosubmit form.',
			'prompt': {
				mode: 9027598325,
				popup: {
					minWidth: 250, onloadCallback: function (form) {
						$('[name="formSelector"]', form).bind('change.wpsn-form').bind('change.wpsn-form', function () {
							let $this = $(this);
							let selector = $this.val();
							$this.next('label').html();
							$('.wpsn-highlight').removeClass('wpsn-highlight');
							$(selector).addClass('wpsn-highlight');
						}).change();
					}
				},
				form: function (note) { return wpsn.menu.record.promptHTML(note); },
				store: function (storage) {
					if (!storage.keepPrevious) {
						storage.forms = {};
						$(wpsn.htmlDecode(storage.formSelector)).each(function () {
							let formSelector = 'form';
							if ($(this).attr('id')) {
								formSelector += '#' + $(this).attr('id');
							} else if ($(this).attr('name')) {
								formSelector += '[name="' + $(this).attr('name') + '"]';
							} else {
								formSelector = wpsn.selector($(this));
							}
							storage.forms[formSelector] = $(this).serializeArray();
						});
					}
				}
			}
		}
	};

	wpsn.menu.rss = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/rss.svg',
		name: 'feed',
		optional: false,
		description: 'RSS feeds benefit users who want to receive timely updates from favourite websites or to aggregate data from many sites.',
		modes: {
			rss: { name: 'RSS', id: 2997357854, render: function (note, callback) { wpsn.menu.rss.render(note, callback); }, description: 'RSS feeds benefit users who want to receive timely updates from favourite websites or to aggregate data from many sites.' },
			rssparam: { name: 'rssparam', id: 6382746823, render: function (note, callback) { wpsn.menu.rss.renderRSSParams(note, callback); }, description: '' }
		},
		render: function (note, callback) {
			let props = note[wpsn.menu.rss.modes.rss.id];
			if (!props.rss) { return; }
			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);

			if (props.rss !== null) {
				let renderFeed = function (data, callback) {
					let rssDiv = $('<div class="wpsn-rss"></div>');
					noteFrame.empty().append(rssDiv);
					let rssData = $($.parseXML(data));
					//title,link,description,language,copyright,pubDate,ttl,image
					let title = $('channel>title,feed>title', rssData).text();
					let link = $('channel>link,feed>link', rssData).text();
					rssDiv.append('<a href="' + link + '" class="wpsn-rss-channel-title" target="_blank">' + title + '</a>');
					rssData.find('item,entry').each(function () {
						let item = {
							'title': $('title', this).text(),
							'guid': $('guid,id', this).text(),
							'link': $('link', this).text(),
							'desc': $('description,summary,content', this).text(),
							'pubDate': $('pubDate,published', this).text()
						};
						if (callback) { item = callback(item); }

						let rssItemDiv = $('<div class="wpsn-rss-item"></div>');
						rssDiv.append(rssItemDiv);

						rssItemDiv.append('<a href="' + item.link + '" class="wpsn-rss-title" target="_blank">' + item.title + '</a>');
						rssItemDiv.append('<div class="wpsn-rss-pubDate">' + item.pubDate + '</div>');
						rssItemDiv.append('<div class="wpsn-rss-desc">' + item.desc + '</div>');
					});
				};
				
				wpsn.getUrlData(wpsn.htmlDecode(props.rss), 60*5).then(function (data) {
					renderFeed(data, callback); 
				});
			}
		},
		renderRSSParams: function (note, callback) {
			let props = note[wpsn.menu.rss.modes.rssparam.id];
			if (!props.rss) { return; }
			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);
			if (props.rss !== null && props.keywords !== null && props.location !== null) {
				let rss = props.rss;
				let validFields = rss.match(/{.*?}/g);
				if (validFields) {
					for (let i = 0; i < validFields.length; i++) {
						let validField = validFields[i].substring(1, validFields[i].length - 1);
						rss = rss.replace('{' + validField + '}', props[validField]);
						rss = rss.replace('{' + validField + '}', '');
					}
				}
				let renderFeed = function (data, callback) {
					let rssDiv = $('<div class="wpsn-rss"></div>');
					noteFrame.empty().append(rssDiv);
					let rssData = $($.parseXML(data));
					//title,link,description,language,copyright,pubDate,ttl,image
					let title = $('channel>title,feed>title', rssData).text();
					let link = $('channel>link,feed>link', rssData).text();
					rssDiv.append('<a href="' + link + '" class="wpsn-rss-channel-title" target="_blank">' + title + '</a>');
					rssData.find('item,entry').each(function () {
						let item = {
							'title': $('title', this).text(),
							'guid': $('guid,id', this).text(),
							'link': $('link', this).text(),
							'desc': $('description,summary,content', this).text(),
							'pubDate': $('pubDate,published', this).text()
						};
						if (callback) { item = callback(item); }

						let rssItemDiv = $('<div class="wpsn-rss-item"></div>');
						rssDiv.append(rssItemDiv);

						rssItemDiv.append('<a href="' + item.link + '" class="wpsn-rss-title" target="_blank">' + item.title + '</a>');
						rssItemDiv.append('<div class="wpsn-rss-pubDate">' + item.pubDate + '</div>');
						rssItemDiv.append('<div class="wpsn-rss-desc">' + item.desc + '</div>');
					});
				};

				wpsn.getUrlData(wpsn.htmlDecode(rss), 60*5).then(function (data) {
					renderFeed(data, callback); 
				});
			}
		},
		saveRSS: function (note, rss) {
			let props = note[wpsn.menu.rss.modes.rss.id] || {};
			props.rss = rss;
			note[wpsn.menu.rss.modes.rss.id] = props;
			note.mode = wpsn.menu.rss.modes.rss.id;
			wpsn.refreshNote(note);
		},
		leftClick: {
			description: 'Add RSS feed',
			prompt: {
				mode: 2997357854,
				popup: { minWidth: 700 },
				autoResize: 'height',
				form: function (note) {
					return '<div class="panel panel-default"><div class="panel-heading">Provide RSS URL to retrieve feed:</div><div class="panel-body"><input style="width:100%" type="text" name="rss" value="' + wpsn.getStorageValue(note, wpsn.menu.rss.modes.rss.id, 'rss') + '"/></div></div>';
				}
			}
		},
		rightClick: {
			description: 'Add parameterized RSS feed. Great for job searches & more...',
			action : async function(note, menuButton, noteDiv) {
				let props = Object.assign({},note[wpsn.menu.rss.modes.rssparam.id]);
				props.template = props.rss;
				await wpsn.getSettings();
				wpsn.settings.RSSParams = wpsn.settings.RSSParams || [{'label':'indeed.com','template':'http://rss.indeed.com/rss?q={keywords}&l={location}'}, {'label':'monster.com','template':'http://rss.jobsearch.monster.com/rssquery.ashx?q={keywords}&where={location}'}, {'label':'craigslist.com','template':'http://{city}.craigslist.org/search/jjj?query={keywords}&format=rss'}];

				let form = await wpsn.template.prompt(props, wpsn.settings.RSSParams, 'RSS Feed', 'http://rss.indeed.com/rss?q={keywords}&l={location}');
				
				let template = JSON.parse(unescape(form.template||"{}"));
				form.rss = template.template;
				delete form.template;
				wpsn.settings.RSSParams = form.templates;
				wpsn.saveSettings();
				note[wpsn.menu.rss.modes.rssparam.id] = form;
				note.mode = wpsn.menu.rss.modes.rssparam.id; 
				wpsn.refreshNote(note);
			}
		}
	};

	wpsn.menu.position = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/position.svg',
		name: 'position',
		optional: false,
		description: '',
		load: function (note, menuButton) {
			if (note.position == 'top') {
				menuButton.css('background', 'url("chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/position_top.svg")').css('background-size','cover');
			} else if (note.position == 'right') {
				menuButton.css('background', 'url("chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/position_right.svg")').css('background-size','cover');
			} else if (note.position == 'bottom') {
				menuButton.css('background', 'url("chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/position_bottom.svg")').css('background-size','cover');
			} else if (note.position == 'left') {
				menuButton.css('background', 'url("chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/position_left.svg")').css('background-size','cover');
			}
		},
		leftClick: {
			command: 'position-note'
		},
		rightClick: {
			command: 'remove-position-note'
		},
		doubleClick: {
			command: 'toggle-docking-note'
		}
	};

	wpsn.positionEffectiveNotes = async function (noteOrNotes) {
		try {
			let effectiveNotes = await wpsn.getEffectiveNotes(noteOrNotes);
			let anchorNote = effectiveNotes.notes[0];

			return await wpsn.actOnEffectiveNotesWithPrompt(
				noteOrNotes,
				'Are you sure you want to position {0}?',
				function () {
					let html = '' +
						'<table width="100%">' +
						'<tr><td></td><td><input type="radio" name="wpsn_position" id="wpsn_position_top" value="top" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn_position_top">Top</label></td><td></td></tr>' +
						'<tr><td><input type="radio" name="wpsn_position" id="wpsn_position_left" value="left" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn_position_left">Left</label></td><td><input type="radio" name="wpsn_position" id="wpsn_position_none" value="" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn_position_none">None</label></td><td><input type="radio" name="wpsn_position" id="wpsn_position_right" value="right" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn_position_right">Right</label></td></tr>' +
						'<tr><td></td><td><input type="radio" name="wpsn_position" id="wpsn_position_bottom" value="bottom" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn_position_bottom">Bottom</label></td><td></td></tr>' +
						'</table>' +
						'<br/><input type="checkbox" name="wpsn_dockable" id="wpsn_dockable" value="top" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn_dockable">Dockable</label> ' +
						'<br/><input type="checkbox" name="wpsn_docked" id="wpsn_docked" value="top" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> <label for="wpsn_docked">Docked</label> ';

					return wpsn.prompt(
						{},
						'<div class="panel panel-default"><div class="panel-heading">Specify Note Positioning & Docking Properties</div><div class="panel-body">' + html + '</div></div>',
						{
							'wpsn_position': anchorNote.position,
							'wpsn_dockable': anchorNote.dockable,
							'wpsn_docked': anchorNote.docked
						}
					);
				},
				wpsn.positionNote
			);
		} catch (err) { wpsn.error(err); }
	};

	wpsn.positionNote = function (note, form) {
		if (form) {
			note.position = form.wpsn_position;
			note.dockable = form.wpsn_dockable;
			note.docked = form.wpsn_docked;
			wpsn.refreshNote(note);
		}
	};

	wpsn.removePositionEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.removePositionNote, 'Are you sure you want to remove positioning/docking for {0}?');
	};

	wpsn.removePositionNote = function (note) {
		delete note.position;
		delete note.dockable;
		delete note.docked;

		wpsn.refreshAllNotes();
	};

	wpsn.toggleDockingEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.toggleDockingNote, 'Are you sure you want to remove positioning/docking for {0}?');
	};

	wpsn.toggleDockingNote = function (note) {
		note.position = note.position || 'left';
		note.dockable = !note.dockable;
		note.docked = note.dockable;

		wpsn.refreshAllNotes();
	};

	wpsn.encode64 = function (data) {
		r = "";
		for (i=0; i<data.length; i+=3) {
		 if (i+2==data.length) {
		  r +=wpsn.append3bytes(data.charCodeAt(i), data.charCodeAt(i+1), 0);
		 } else if (i+1==data.length) {
		  r += wpsn.append3bytes(data.charCodeAt(i), 0, 0);
		 } else {
		  r += wpsn.append3bytes(data.charCodeAt(i), data.charCodeAt(i+1), data.charCodeAt(i+2));
		 }
	   }
	   return r;
	};

	wpsn.append3bytes = function(b1, b2, b3) {
		c1 = b1 >> 2;
		c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
		c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
		c4 = b3 & 0x3F;
		r = "";
		r += wpsn.encode6bit(c1 & 0x3F);
		r += wpsn.encode6bit(c2 & 0x3F);
		r += wpsn.encode6bit(c3 & 0x3F);
		r += wpsn.encode6bit(c4 & 0x3F);
		return r;
		}
		
	wpsn.encode6bit = function(b) {
		if (b < 10) {
		 return String.fromCharCode(48 + b);
		}
		b -= 10;
		if (b < 26) {
		 return String.fromCharCode(65 + b);
		}
		b -= 26;
		if (b < 26) {
		 return String.fromCharCode(97 + b);
		}
		b -= 26;
		if (b == 0) {
		 return '-';
		}
		if (b == 1) {
		 return '_';
		}
		return '?';
	};

	wpsn.parseJSON = function(jsonStr) {
		let json = jsonStr;
		try {
			json = JSON.parse(json);
		} catch(err) {
			let jsontemp = json.replace((/([\w]+)(:)/g), "\"$1\"$2");
			let correctjson = jsontemp.replace((/'/g), "\"");
			json = JSON.parse(correctjson);
		}
		return json;
	}
	wpsn.menu.diagram = {
		//'extension' : 'wpsn.menu.diagram',
		'icon': 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/diagram.svg',
		'name': 'diagram',
		'optional': false,
		'description': '',
		'modes': {
			/*'networkdiagram' : {name:'Network Diagram',id:5784637854,render:function(note){wpsn.menu.diagram.renderVisJsNetwork(note);},description:'Network Diagram (powered by VisJs)'},
			*/
			'sequencediagram': { name: 'Sequence Diagram', id: 5453823628, render: function (note) { wpsn.menu.diagram.renderSequenceDiagram(note); }, description: 'Turns text into a UML sequence diagram. (Powered by <a href="https://bramp.github.io/js-sequence-diagrams/" target="_blank">JS-Sequence-Diagrams</a> and <a href="https://github.com/bramp/js-sequence-diagrams/pull/74" target="_blank">Pull Request</a>)' },
			'mermaiddiagram': { name: 'Diagram', id: 6478367842, render: function (note) { wpsn.menu.diagram.renderMermaidDiagram(note); }, description: 'Turns text into a diagram. <a href="http://knsv.github.io/mermaid/#graph" target="_blank">More information</a>. (Powered by <a href="https://github.com/knsv/mermaid" target="_blank">Mermaid.js</a>)' },
			'flowchart': { name: 'Flowchart', id: 6122356463, render: function (note) { wpsn.menu.diagram.renderFlowchart(note); }, description: 'Turns text into a flowchart. <a href="http://adrai.github.io/flowchart.js/" target="_blank">More information</a>. (Powered by <a href="http://adrai.github.io/flowchart.js/" target="_blank">Flowchart.js</a>)', options: '{\n\t"x": 0,\n\t"y": 0,\n\t"line-width": 3,\n\t"line-length": 50,\n\t"text-margin": 10,\n\t"font-size": 14,\n\t"font": "normal",\n\t"font-family": "Helvetica",\n\t"font-weight": "normal",\n\t"font-color": "black",\n\t"line-color": "black",\n\t"element-color": "black",\n\t"fill": "white",\n\t"yes-text": "yes",\n\t"no-text": "no",\n\t"arrow-end": "block",\n\t"scale": 1,\n\t"symbols": {\n\t\t"start": {\n\t\t\t"font-color": "black",\n\t\t\t"element-color": "black",\n\t\t\t"fill": "white"\n\t\t},\n\t\t"end":{\n\t\t\t"class": "end-element"\n\t\t}\n\t},\n\t"flowstate" : {\n\t\t"past" : { "fill" : "#CCCCCC", "font-size" : 12},\n\t\t"anythingyouwant" : { "fill" : "#FFFF99"},\n\t\t"current" : {"fill" : "yellow", "font-color" : "red", "font-weight" : "bold"},\n\t\t"request" : { "fill" : "blue"},\n\t\t"invalid": {"fill" : "#444444", "font-color" : "white"},\n\t\t"approved" : { "fill" : "#58C4A3", "font-size" : 12, "yes-text" : "APPROVED", "no-text" : "n/a" },\n\t\t"rejected" : { "fill" : "#C45879", "font-size" : 12, "yes-text" : "n/a", "no-text" : "REJECTED" }\n\t}\n}' },
			'js2flowchart': { name: 'JS 2 Flowchart', id: 5649385089, render: function (note) { wpsn.menu.diagram.renderJs2Flowchart(note); }, description: 'Turns JS code into a flowchart. <a href="https://github.com/Bogdan-Lyashenko/js-code-to-svg-flowchart" target="_blank">More information</a>. (Powered by <a href="https://github.com/Bogdan-Lyashenko/js-code-to-svg-flowchart" target="_blank">js2flowchart.js</a>)'},
			'chartjs': { name: 'Chart.js', id: 3747823508, render: function (note) { wpsn.menu.diagram.renderChartjs(note); }, description: 'Creates beautiful charts. <a href="http://www.chartjs.org/docs/latest/charts/" target="_blank">More information</a>. (Powered by <a href="http://www.chartjs.org/" target="_blank">Chart.js</a>)'},
			'treediagram': { name: 'Tree Diagram(beta)', id: 7659346992, render: function (note) { wpsn.menu.diagram.renderTreeDiagram(note); }, description: 'Turns text into a UML tree diagram. (Powered by <a href="http://webpagestickynotes.com"><img height="24" src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/logo/wpsn-logo.png"/></a> + <a href="http://d3js.org/" target="_blank">d3.js</a>)' },
			'directory': { name: 'Directory Structure', id: 7632954307, render: function (note) { wpsn.menu.diagram.renderDirectoryStructure(note); }, description: 'Turns text into a directory structure. Lines beginning with - or x are transformed into open or closed folders and into files if no entries are found below the line. Renders into Markdown otherwise' },
			'plantumldiagram': { name: 'PlantUML Diagrams', id: 8897654693, render: function (note) { wpsn.menu.diagram.renderPlantUMLDiagram(note); }, description: 'Turns text into a Plant UML diagram. <a href="http://plantuml.com" target="_blank">More information</a> (Powered by & Generated at <a href="http://plantuml.com" target="_blank">PlantUML</a>)' },
		},
		'renderDirectoryStructure': function (note) {
			let text = note.text;
		
			text = text
				.replace(/(^|\n)(\s*|\t*)-\s/g, '$1$2- <span class="wpsn-md-node wpsn-md-expanded" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"></span> ')
				.replace(/(^|\n)(\s*|\t*)x\s/g, '$1$2- <span class="wpsn-md-node wpsn-md-collapsed" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"></span> ');

			note.previewText = text;

			wpsn.renderMarkdown(note);

			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);

			$('.wpsn-md-node').each(function(index){
				let $this = $(this);
				if ($this.siblings('ul').size() == 0) {
					$this.addClass('wpsn-md-leaf')
				} else {
					$this.removeClass('wpsn-md-leaf')
				}
			});
			$('.wpsn-md-node', noteFrame).click(function(){
				let $cb = $(this);
				if ($cb.is('.wpsn-md-expanded')) {
					$cb.removeClass('wpsn-md-expanded').removeClass('wpsn-md-collapsed').addClass('wpsn-md-collapsed');
				} else {
					$cb.removeClass('wpsn-md-expanded').removeClass('wpsn-md-collapsed').addClass('wpsn-md-expanded')
				}

				let ttext = note.text;
				let tttext = '';
				let token = '|~^~|';
				$('.wpsn-md-node', noteFrame).each(function(index){
					let replaceWith = $(this).is('.wpsn-md-expanded')?'-':'x';
					ttext = ttext.replace(/(^|\n)(\s*|\t*)[-|x]/, '$1$2'+replaceWith+token);
					tttext += ttext.split(token)[0];
					ttext = ttext.split(token)[1];

				});
				tttext += ttext;
				note.text = tttext;
				wpsn.save(note);
			});
			$('.wpsn-md-node', noteFrame).parent('li').parent('ul,ol').addClass('wpsn-md-node-list');
		},
		'renderMermaidDiagram': function (note) {
			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);
			try {
				noteFrame.html(note.previewText || note.text);
				mermaid.init(null, '#wpsn-frame-' + note.id);
				wpsn.resizeSVG(note);
				$('.node,.node .label,.edgeLabel,.edgeLabel .label,.edgePath,.actor,.note,.labelText,.labelBox', noteFrame).css('stroke', note.textcolor).css('color', note.textcolor).css('fill', note.background).css('border', note.bordercolor);
			} catch (err) {
				wpsn.error(err);
			}
		},
		'renderSequenceDiagram': function (note) {
			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);
			try {
				let text = note.previewText || note.text;
				let numberedText = '';
				let count = 1;
				for (let line of text.split('\n')) {
					if (line.indexOf(':') == -1) {
						numberedText += line + '\n';
						continue;
					}
					let countText = '';
					let leftSide = line.split(':')[0];
					if (leftSide.toLowerCase().indexOf('title') == 0 || leftSide.toLowerCase().indexOf('note ') == 0) {
						countText = '';
					} else {
						countText = (count++) + '. ';
					}
					let rightSide = (countText)+line.substring(line.indexOf(':')+1);
					numberedText += leftSide + ':' + rightSide + '\n';
				}
				noteFrame.html(numberedText).sequenceDiagram({ theme: 'simple' });
				$('svg', noteFrame).css('background', note.background);
				$('*', noteFrame).each(function () {
					if (this.tagName == 'text') {
						this.setAttribute('font', null);
						$(this).css('font-family', 'inherit')
							.css('font-size', 'inherit');
					}
					if (this.getAttribute('fill') == 'none' || this.getAttribute('fill') == '#ffffff' || this.getAttribute('fill') == '#fff') {
						this.setAttribute('fill', note.background);
					}
					if (this.getAttribute('fill') == '#000000' || this.getAttribute('fill') == '#000') {
						this.setAttribute('fill', note.textcolor);
					} else if (this.getAttribute('fill')) {
						//this.setAttribute('fill', note.background);
					}
					if (this.getAttribute('stroke') == '#000000') {
						this.setAttribute('stroke', note.textcolor);
					}
				});
			} catch (err) {
				wpsn.error(err);
			}
			wpsn.resizeSVG(note);
		},
		'renderPlantUMLDiagram': async function (note) {
			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);
			try {
				let text = note.previewText || note.text;
				//TODO
				let data = wpsn.encode64(window.deflate(unescape(encodeURIComponent(text), 9)));
				if (data) {
					let svg = await wpsn.getUrlData(`http://www.plantuml.com/plantuml/svg/${data}`, 280);
					noteFrame.html(svg);
				}
				$('svg', noteFrame).css('background', note.background);
				$('*', noteFrame).each(function () {
					let $this = $(this);
					if (this.tagName == 'text') {
						this.setAttribute('font', null);
						$this.css('font-family', 'inherit')
							.css('font-size', 'inherit');
					}
					if (this.getAttribute('fill') == 'none' || this.getAttribute('fill') == '#ffffff' || this.getAttribute('fill') == '#fff' || this.getAttribute('fill') == '#FEFECE') {
						this.setAttribute('fill', note.background);
					}
					if (this.getAttribute('fill') == '#000000' || this.getAttribute('fill') == '#000') {
						this.setAttribute('fill', note.textcolor);
					} else if (this.getAttribute('fill')) {
						//this.setAttribute('fill', note.background);
					}
					if (this.getAttribute('stroke') == '#000000') {
						this.setAttribute('stroke', note.textcolor);
					}
					if (this.style.stroke == 'rgb(168, 0, 54)') {
						this.style.stroke = note.textcolor;
					}
				});
			} catch (err) {
				wpsn.error(err);
			}
			wpsn.resizeSVG(note);
		},
		'renderFlowchart': function (note) {
			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);
			try {
				let diagram = flowchart.parse(note.previewText || note.text);
				let storage = wpsn.getStorage(note) || {};
				let options = {};
				try {
					let optionString = storage.options || wpsn.getMode(note).options;
					options = JSON.parse(optionString);
				} catch (err) {
					wpsn.error(err);
				}
				diagram.drawSVG(noteFrame[0], options);
			} catch (err) {
				wpsn.error(err);
			}
			wpsn.resizeSVG(note);
		},
		'renderJs2Flowchart': function (note) {
			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);
			try {
				let svg = js2flowchart.convertCodeToSvg(note.previewText || note.text);
				$('.wpsn-frame', noteDiv).html(svg);
			} catch (err) {
				wpsn.error(err);
			}
			wpsn.resizeSVG(note);
		},
		'renderChartjs': function (note) {
			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);
			try {
				let options = wpsn.parseJSON(note.previewText || note.text);
				$('.wpsn-frame', noteDiv).html('<canvas width="800" height="450"></canvas>');
				new Chart($('.wpsn-frame canvas', noteDiv),options);
			} catch (err) {
				wpsn.error(err);
			}
			wpsn.resizeSVG(note);
		},
		'renderTreeDiagram': function (note) {
			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);
			let update = function(source, root, tree, svg, duration, diagonal, i) {
				// Compute the new tree layout.
				let nodes = tree.nodes(root).reverse(),
					links = tree.links(nodes);

				// Normalize for fixed-depth.
				nodes.forEach(function (d) { d.y = d.depth * 180; });

				// Update the nodes…
				let node = svg.selectAll('g.node')
					.data(nodes, function (d) { return d.id || (d.id = ++i); });

				// Enter any new nodes at the parent's previous position.
				let nodeEnter = node.enter().append('g')
					.attr('class', 'node')
					.attr('transform', function () { return 'translate(' + source.y0 + ',' + source.x0 + ')'; })
					.on('click', function(d) {
						if (d.children) {
							d._children = d.children;
							d.children = null;
						} else {
							d.children = d._children;
							d._children = null;
						}
						update(d, root, tree, svg, duration, diagonal, i);
						wpsn.resizeSVG(note);
					});

				nodeEnter.append('circle')
					.attr('r', 1e-6)
					.style('fill', function (d) { return d._children ? '#ccc' : '#fff'; })
					.style('stroke', '#666')
					.style('cursor', 'pointer')
					.style('r', '6');

				nodeEnter.append('text')
					.attr('x', function (d) { return d.children || d._children ? -10 : 10; })
					.attr('dy', '.35em')
					.attr('text-anchor', function (d) { return d.children || d._children ? 'end' : 'start'; })
					.text(function (d) { return d.name; })
					.style('fill-opacity', 1e-6)
					.style('fill', note.background)
					.style('color', note.textcolor)
					.style('stroke', note.textcolor);

				// Transition nodes to their new position.
				let nodeUpdate = node.transition()
					.duration(duration)
					.attr('transform', function (d) { return 'translate(' + d.y + ',' + d.x + ')'; });

				nodeUpdate.select('circle')
					.attr('r', 4.5)
					.style('fill', function (d) { return d._children ? '#ccc' : '#fff'; });

				nodeUpdate.select('text')
					.style('fill-opacity', 1);

				// Transition exiting nodes to the parent's new position.
				let nodeExit = node.exit().transition()
					.duration(duration)
					.attr('transform', function () { return 'translate(' + source.y + ',' + source.x + ')'; })
					.remove();

				nodeExit.select('circle')
					.attr('r', 1e-6);

				nodeExit.select('text')
					.style('fill-opacity', 1e-6);

				// Update the links…
				let link = svg.selectAll('path.link')
					.data(links, function (d) { return d.target.id; });

				// Enter any new links at the parent's previous position.
				link.enter().insert('path', 'g')
					.attr('class', 'link')
					.attr('d', function () {
						let o = { x: source.x0, y: source.y0 };
						return diagonal({ source: o, target: o });
					}).attr('stroke-width', '1').attr('stroke', note.textcolor).attr('fill', 'none');

				// Transition links to their new position.
				link.transition()
					.duration(duration)
					.attr('d', diagonal);

				// Transition exiting nodes to the parent's new position.
				link.exit().transition()
					.duration(duration)
					.attr('d', function () {
						let o = { x: source.x, y: source.y };
						return diagonal({ source: o, target: o });
					})
					.remove();

				// Stash the old positions for transition.
				nodes.forEach(function (d) {
					d.x0 = d.x;
					d.y0 = d.y;
				});
				window.setTimeout(function () { wpsn.resizeSVG(note); }, 100);
			};

			try {
				let data = JSON.parse(note.previewText || note.text);
				let margin = { top: 10, right: 10, bottom: 30, left: 30 },
					width = note.width,
					height = note.height;

				let i = 0,
					duration = 0,
					root;

				let tree = d3.layout.tree()
					.size([height, width]);

				let diagonal = d3.svg.diagonal()
					.projection(function (d) { return [d.y, d.x]; });

				let svg = d3.select('#' + noteFrame.attr('id')).append('svg')
					.attr('width', '100%')
					.attr('height', '100%')
					//.attr("viewBox","0 0 "+ 1000 + " " + 1000)
					.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

				//d3.json(data, function(error, flare) {
				//  if (error) throw error;
				root = data;
				root.x0 = height / 2;
				root.y0 = 0;

				let collapse = function(d) {
					if (d.children) {
						d._children = d.children;
						d._children.forEach(collapse);
						d.children = null;
					}
				};

				root.children.forEach(collapse);
				update(root, root, tree, svg, duration, diagonal, i);
				//});

				//d3.select(self.frameElement).style("height", "800px");
			} catch (err) {
				wpsn.error(err);
			}
			wpsn.resizeSVG(note);
		},
		'leftClick': {
			'description': 'Change note diagram modes',
			'action': function (note) {
				if (wpsn.isCurrentlyEditedNote(note)) {
					wpsn.stopEditing(note);
				}
				let promptHTML = '<div class="panel panel-default"><div class="panel-heading">Note diagram mode:</div><div class="panel-body">';
				let modeKeys = wpsn.getModeKeys(wpsn.menu.diagram.modes);
				for (let i = 0; i < modeKeys.length; i++) {
					if (!modeKeys[i]) { continue; }
					let modeKey = modeKeys[i];
					let mode = wpsn.menu.diagram.modes[modeKey];
					promptHTML += (i > 0 ? '<br/>' : '') + '<input type="radio" name="wpsn_mode" value="' + mode.id + '" id="wpsn-mode-' + mode.id + '" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/>' +
						'<label for="wpsn-mode-' + mode.id + '"><b>' + mode.name + '</b></label>';
					if (mode.options) {
						promptHTML += ' <a href="#" class="wpsn_options" data-modekey="' + modeKey + '">Options</a>';
					}
					if (mode.description) {
						promptHTML += '<span>: ' + mode.description + '</span>';
					}
				}
				promptHTML += '</div></div>';
				let currentNote = note;
				wpsn.prompt(
					{
						minWidth: 700, load: function () {
							$('a.wpsn_options').unbind('click').bind('click', async function () {
								let modeKey = $(this).data('modekey');
								let mode = wpsn.menu.diagram.modes[modeKey];
								let storage = wpsn.getStorage(currentNote) || {};
								let options = await wpsn.promptWithTextarea(
									{ minWidth: 1000 },
									'Type JSON representation of options:',
									storage.options || mode.options
								);
								if (options !== null) {
									wpsn.saveNoteStateForUndo(currentNote);
									if (!currentNote[mode.id]) {
										currentNote[mode.id] = {};
									}
									currentNote[mode.id].options = options;
									wpsn.refreshNote(currentNote);
								}
								return false;
							});
						}
					}, promptHTML, { 'wpsn_mode': note.mode },
					function (form, noteId) {
						let note = wpsn.getNote(noteId);
						wpsn.saveNoteStateForUndo(note);
						if (form) {
							note.mode = form.wpsn_mode;
							note.htmlMode = wpsn.getModeKey(note) == 'texteditor';
						}
						if (note.mode == wpsn.menu.diagram.modes.sequencediagram.id) {
							let demo = 
`
Title: This is a demo [color="gray", fontcolor="white", fillcolor="black"]
A->B: Normal line
Note right of A: This is a link [url="http://www.example.com"]
B-->C: Dashed line
C->>B: Open arrow
B-->>A: Dashed open arrow
Note right of B: Double \\nclick note
`;
							note.text = note.text ? note.text : demo;
						}
						/*if (note.mode == wpsn.menu.diagram.modes.dotdiagram.id) {
						let demo = 'graph demo {\nThis -> is; \nis -> a;\nis -> demo;\nDouble -> Click;\nClick -> Note\n}';
						note.text = note.text ? note.text : demo;
					}*/
						if (note.mode == wpsn.menu.diagram.modes.flowchart.id) {
							let demo = 'st=>start: Start|rejected:>http://www.webpagestickynotes.com[blank]\ne=>end: End|anythingyouwant:>http://www.webpagestickynotes.com\nop1=>operation: My Operation|past\nsub1=>subroutine: My Subroutine|current\ncond=>condition: Yes\nor No?|approved:>http://www.webpagestickynotes.com\nio=>inputoutput: catch something...|invalid\n\nst->op1->cond\ncond(yes)->io->e\ncond(no)->sub1(right)->op1';
							note.text = note.text ? note.text : demo;
						}
						if (note.mode == wpsn.menu.diagram.modes.treediagram.id) {
							let demo = '{"name":"You","children":[{"name":"Mother","children":[{"name":"Maternal Grandmother"},{"name":"Maternal Grandfather"}]},{"name":"Father","children":[{"name":"Paternal Grandmother"},{"name":"Paternal Grandfather"}]}]}';
							note.text = note.text ? note.text : demo;
						}
						if (note.mode == wpsn.menu.diagram.modes.mermaiddiagram.id) {
							let demo = '%% Example diagram\ngraph LR\n' +
								'  A[Square Rect] -- Link text --> B((Circle))\n' +
								'  A --> C(Round Rect)\n' +
								'  B --> D{Rhombus}\n' +
								'  C --> D\n' +
								'  click A "http://www.webpagestickynotes.com" "Tooltip"';
							note.text = note.text ? note.text : demo;
						}
						if (note.mode == wpsn.menu.diagram.modes.js2flowchart.id) {
							let demo = 
`
function factorial(number) {
	let result = 1;
	for (let i = 2; i <= number; i += 1) {
	result *= i;
	}
	return result;
}
`;
						  note.text = note.text ? note.text : demo;
						}
						if (note.mode == wpsn.menu.diagram.modes.chartjs.id) {
							let demo = 
`
{
	type: 'bar',
	data: {
		labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
		datasets: [{
			label: '# of Votes',
			data: [12, 19, 3, 5, 2, 3],
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)'
			],
			borderColor: [
				'rgba(255,99,132,1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)'
			],
			borderWidth: 1
		}]
	},
	options: {
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero:true
				}
			}]
		}
	}
}
`;
						  note.text = note.text ? note.text : demo;
						}
						if (note.mode == wpsn.menu.diagram.modes.plantumldiagram.id) {
							let demo = 
`
@startuml
'skinparam linetype ortho
'hide circle
'top to bottom direction
'left to right direction

header Header
footer Footer

title Title

rectangle Rectangle {
package Package {

folder Folder {
  entity Entity {
    you
    ..
   can
    ==
    use
    __
    different
    --
   lines
  }
}

node Node {
  class MyClass {
    -field1: String //private
    #field2: Integer //protected
    ~method1(): Object //package private
    +method2(): Boolean //public 
  }
}

database Database {
  interface Interface

  abstract Abstract
  
  enum Enum

  annotation Annotation

  class Custom<< (Z,grey) >>

  Interface -left-> Abstract
  Interface -up-> Enum
  Interface -down-> Annotation
  Interface -right-> Custom
}

cloud Cloud {
  OneOrMany }|..|| ExactlyOne
  ZeroOrMany }o..o| ZeroOrOne
  ExactlyOne ||--o{ ZeroOrMany
  ZeroOrOne |o--|| ExactlyOne
}

note top of Node
  Note top of Node.
end note

note as Note
  This note is <u>also</u>
  <b><color:royalBlue>on several</color>
  <s>words</s> lines
end note

}
}
@enduml
`;
							note.text = note.text ? note.text : demo;
						}

						wpsn.refreshNote(note);
					},
					note.id
				);
			}
		}
	};

	wpsn.createChecklist = async function() {
		await wpsn.createNote({mode:wpsn.menu.mode.modes.checklist.id});
	};

	wpsn.menu.checklist = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/checkbox.svg',
		name: 'checklist',
		optional: false,
		description: '',
		modes: {
			checklist: { name: 'Checklist', id: 9486429094, render: async function (note) { await wpsn.renderChecklist(note); }, description: 'Renders note in checklist mode.' }
		},
		leftClick: {
			command: 'render-checklist',
			description: 'Render note as checklist. Lines beginning with - or x are transformed into checklists. Renders into Markdown otherwise'
		},
		rightClick: {
			command: 'create-checklist',
			description: 'Create new note in checklist mode. Lines beginning with - or x are transformed into checklists. Renders into Markdown otherwise'
		}
	};

	wpsn.menu.code = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/prettify.svg',
		name: 'code',
		optional: false,
		description: '',
		modes: {
			code: { name: 'Code', id: 4734532438, render: async function (note) { await wpsn.renderCode(note); }, description: 'Pretty prints the text. Especially useful when the text represents code or markup.' },
			minify: { name: 'Minify', id: 7584398324, render: async function (note) { await wpsn.renderMinify(note); }, description: 'Minifies JSON & XML.' },
			jsonSchemaViewer: { name: 'JSON Schema Viewer', id: 4365896345, render: async function (note) { await wpsn.renderJsonSchemaViewer(note); }, description: 'JSON Schema Viewer.' },
		},
		leftClick: {
			command: 'indent-prettify-note',
			applyToAll: true
		},
		rightClick: {
			command: 'minify-prettify-note',
			applyToAll: true
		},
		doubleClick: {
			command: 'indent-minify-prettify-note-undo',
			applyToAll: false
		}
	};

	wpsn.renderCode = async function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let noteFrame = $('.wpsn-frame', noteDiv).addClass('wpsn-scrollbar');
		let preRenderedText = note.previewText || note.text;
		let text = wpsn.indent(preRenderedText);
		noteFrame.html('<pre class="prettyprint">' + text + '</pre>');
		if (window.prettyPrint) { await window.prettyPrint(); }
	};

	wpsn.renderJsonSchemaViewer = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let noteFrame = $('.wpsn-frame', noteDiv).addClass('wpsn-scrollbar');
		let text = wpsn.unindent(note.previewText || note.text);
		noteFrame.html(`<div id="main-body" style="height:100%;width:100%;"></div>`);
		//let json = JSON.parse(text)
		//console.log(json)
		var loc = window.location;
		//if not already set, set the root schema location
		//this allows dev ENV to override the schema location
		var schema = JSV.schema ? JSV.schema : loc.href//loc.origin + loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1) + 'schemas/schema/schema.json';
		JSV.init({
			schema : schema,
			plain : true, //don't use JQM
			viewerHeight : $('#main-body').height(), //set initial dimensions of SVG
			viewerWidth : $('#main-body').width()
		}, function() {
			$('#jsv-tree').css('width', '100%');
			//set diagram width to 100%, this DOES NOT resize the svg container
			//it will not adjust to window resize, needs a listener to support that
			JSV.resetViewer();
			$('#loading').fadeOut('slow');
		});
	};

	wpsn.renderMinify = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let noteFrame = $('.wpsn-frame', noteDiv).addClass('wpsn-scrollbar');
		let text = wpsn.unindent(note.previewText || note.text);
		noteFrame.html('<pre class="prettyprint">' + wpsn.htmlEncode(text) + '</pre>');
		if (window.prettyPrint) window.prettyPrint();
	};

	wpsn.indent = function (jsonXML) {
		let text = jsonXML;
		try { text = JSON.stringify(JSON.parse(jsonXML), null, 2); } catch (err) {
			try {
				if (text.indexOf('<') != -1) {
					text = vkbeautify.xml(text).replace(/</g,'&lt;'); 
				} else {
					text = wpsn.csvToFlatFile(text);
				}
			} catch (err) {
				text = wpsn.csvToFlatFile(text);
			}
		}
		return text;
	};

	wpsn.unindent = function (jsonXML) {
		let text = jsonXML;
		try { text = vkbeautify.jsonmin(text); } catch (err) {
			try { text = vkbeautify.xmlmin(text); } catch (err) { wpsn.error(err); }
		}
		return text;
	},
	wpsn.csvToFlatFile = function (text) {
		let obj = Papa.parse(text);
		let length = [];
		for (let i = 0; i < obj.data.length; i++) {
			let row = obj.data[i];
			for (let j = 0; j < row.length; j++) {
				let cell = row[j];
				if (!length[j] || cell.length > length[j]) {
					length[j] = cell.length;
				}
			}
		}
		text = '';
		for (let i = 0; i < obj.data.length; i++) {
			let row = obj.data[i];
			for (let j = 0; j < row.length; j++) {
				let cell = row[j].replace(/\t/g,' ');
				if (j == row.length - 1) {
					text += cell;
				} else {
					text += wpsn.padRight(cell, ' ', length[j] + (j == row.length - 1 ? 0 : 1));
				}
			}
			text += '\n';
		}
		return text;
	};

	wpsn.renderChecklistEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.renderChecklistNote, 'Are you sure you want to render {0} as checklist?');
	};

	wpsn.renderChecklistNote = async function (note) {
		if (note) {
			wpsn.stopEditing(note);
			note.mode = wpsn.menu.mode.modes.checklist.id;
			await wpsn.refreshNote(note);
			await wpsn.autoResize(note);
			//await wpsn.refreshNote(note);
		}
	};

	wpsn.indentPrettifyEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.indentPrettifyNote, 'Are you sure you want to indent JSON/XML/CSV and prettify code for {0}?');
	};

	wpsn.indentPrettifyNote = async function (note) {
		if (note) {
			wpsn.stopEditing(note);
			note.mode = wpsn.menu.code.modes.code.id;
			await wpsn.refreshNote(note);
			await wpsn.autoResize(note);
			//await wpsn.refreshNote(note);
		}
	};

	wpsn.jsonSchemaViewerEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.jsonSchemaViewerNote, 'Are you sure you want to convert {0} into JSON Schema Viewer?');
	};

	wpsn.jsonSchemaViewerNote = async function (note) {
		wpsn.stopEditing(note);
		note.mode = wpsn.menu.code.modes.jsonSchemaViewer.id;
		await wpsn.refreshNote(note);
		await wpsn.autoResize(note);
		await wpsn.refreshNote(note);
	};

	wpsn.minifyPrettifyEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.minifyPrettifyNote, 'Are you sure you want to minify JSON/XML/CSV and prettify code for {0}?');
	};

	wpsn.minifyPrettifyNote = async function (note) {
		wpsn.stopEditing(note);
		note.mode = wpsn.menu.code.modes.minify.id;
		await wpsn.refreshNote(note);
		await wpsn.autoResize(note);
		await wpsn.refreshNote(note);
	};


	wpsn.undoIndentMinifyPrettifyEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.undoIndentMinifyPrettifyNote, 'Are you sure you want to minify JSON/XML/CSV and prettify code for {0}?');
	};

	wpsn.undoIndentMinifyPrettifyNote = async function (note) {
		wpsn.stopEditing(note);
		delete note.mode;
		await wpsn.refreshNote(note);
		await wpsn.autoResize(note);
		await wpsn.refreshNote(note);
	};

	/*
wpsn.menu.calculator = {
	'icon' : 'chrome-extension://'+chrome.i18n.getMessage("@@extension_id")+'/images/calculator.svg',
	'name' : 'calculator',
	'description' : '',
	'modes' : {'calculator' : {name:'Calculator',id:4587354735,render:function(note){wpsn.menu.calculator.render(note);},description:'(Powered by <a href="http://web2.0calc.com/">Web 2.0 Scientific Calculator</a>)'}},
	'render' : function(note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let noteFrame = $('.wpsn-frame',noteDiv);
		noteFrame.html('<p><iframe style="border: 1px solid #silver; " src="https://web2.0calc.com/widgets/minimal/" width="100%" height="93%" scrolling="no" data-mce-src="chrome-extension://nllbobkiijbedkejjdpnhbjeopnhafnn/tinymce//widgets/minimal/" data-mce-style="border: 1px solid #silver;">  </iframe><br><span style="font-size:x-small" data-mce-style="font-size: x-small;">Powered by <a href="http://web2.0calc.com/" data-mce-href="chrome-extension://nllbobkiijbedkejjdpnhbjeopnhafnn/tinymce//">Web 2.0 scientific calculator</a></span></p>');
	},
	'leftClick' : {
		'description' : 'Calculator',
		'action' : function(note, menuButton, noteDiv) {
			note.mode = wpsn.menu.calculator.modes.calculator.id;
			note.width = 260;
			note.height = 350;
			note.background = '#eee';
			wpsn.refreshNote(note);
		}
	}
};
*/

	wpsn.getSnappedNotes = function(note) {
		let snapped = {
			all: new Set(),
			top:{
				top:[],right:[],bottom:[],left:[]
			},
			right:{
				top:[],right:[],bottom:[],left:[]
			},
			bottom:{
				top:[],right:[],bottom:[],left:[]
			},
			left:{
				top:[],right:[],bottom:[],left:[]
			}
		};
		for (let tnote of wpsn.notes) {
			if (tnote.id === note.id) { continue; }
			if (tnote.pos_y === note.pos_y) {
				if (
					(tnote.pos_x <= note.pos_x                && (tnote.pos_x + tnote.width + 1) >= note.pos_x               ) ||
					(tnote.pos_x <= (note.pos_x + note.width + 1) && (tnote.pos_x + tnote.width) >= note.pos_x               )
				) {
					snapped.all.add(tnote);
					snapped.top.top.push(tnote);
				}
			}
			if ((tnote.pos_y + tnote.height + 1) === note.pos_y) {
				if (
					(tnote.pos_x <= note.pos_x                && (tnote.pos_x + tnote.width + 1) >= note.pos_x               ) ||
					(tnote.pos_x <= (note.pos_x + note.width + 1) && (tnote.pos_x + tnote.width) >= note.pos_x                   )
				) {
					snapped.all.add(tnote);
					snapped.top.bottom.push(tnote);
				}
			}

			if (tnote.pos_x === (note.pos_x + note.width + 1)) {
				if (
					(tnote.pos_y <= note.pos_y                && (tnote.pos_y + tnote.height + 1) >= note.pos_y               ) ||
					(tnote.pos_y <= (note.pos_y + note.height + 1) && (tnote.pos_y + tnote.height) >= note.pos_y              )
				) {
					snapped.all.add(tnote);
					snapped.right.left.push(tnote);
				}
			}
			if ((tnote.pos_x + tnote.width) === (note.pos_x + note.width)) {
				if (
					(tnote.pos_y <= note.pos_y                && (tnote.pos_y + tnote.height + 1) >= note.pos_y               ) ||
					(tnote.pos_y <= (note.pos_y + note.height + 1) && (tnote.pos_y + tnote.height) >= note.pos_y              )
				) {
					snapped.all.add(tnote);
					snapped.right.right.push(tnote);
				}
			}

			if (tnote.pos_y === (note.pos_y + note.height + 1)) {
				if (
					(tnote.pos_x <= note.pos_x                && (tnote.pos_x + tnote.width + 1) >= note.pos_x               ) ||
					(tnote.pos_x <= (note.pos_x + note.width + 1) && (tnote.pos_x + tnote.width) >= note.pos_x               )
				) {
					snapped.all.add(tnote);
					snapped.bottom.top.push(tnote);
				}
			}
			if ((tnote.pos_y + tnote.height) === (note.pos_y + note.height)) {
				if (
					(tnote.pos_x <= note.pos_x                && (tnote.pos_x + tnote.width + 1) >= note.pos_x               ) ||
					(tnote.pos_x <= (note.pos_x + note.width + 1) && (tnote.pos_x + tnote.width) >= note.pos_x               )
				) {
					snapped.all.add(tnote);
					snapped.bottom.bottom.push(tnote);
				}
			}

			if (tnote.pos_x === note.pos_x) {
				if (
					(tnote.pos_y <= note.pos_y                && (tnote.pos_y + tnote.height + 1) >= note.pos_y               ) ||
					(tnote.pos_y <= (note.pos_y + note.height + 1) && (tnote.pos_y + tnote.height) >= note.pos_y              )
				) {
					snapped.all.add(tnote);
					snapped.left.left.push(tnote);
				}
			}
			if ((tnote.pos_x + tnote.width + 1) === note.pos_x) {
				if (
					(tnote.pos_y <= note.pos_y                && (tnote.pos_y + tnote.height + 1) >= note.pos_y               ) ||
					(tnote.pos_y <= (note.pos_y + note.height + 1) && (tnote.pos_y + tnote.height) >= note.pos_y                  )
				) {
					snapped.all.add(tnote);
					snapped.left.right.push(tnote);
				}
			}
		}
		snapped.all = Array.from(snapped.all);
		return snapped;
	}

	wpsn.menu.github = {
		icon: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/github.svg',
		name: 'github',
		optional: false,
		description: '',
		leftClick: {
			command : 'b-commit-to-github',
			applyToAll : true
		},
		rightClick: {
			command: 'b-compare-github-repos'
		}
	};

	wpsn.compareRepos = async function (noteOrNotes) {
		let effectiveNotes = await wpsn.getEffectiveNotes(noteOrNotes);
		let note = effectiveNotes.notes[0];

		var data = await wpsn.fetchReposData(note.text.split('\n'));
		var output = await wpsn.printJsonData(data);
		var $note = wpsn.getNoteFrame(note);
		$note.html(output)
		$note.find('table').dataTable({
			"paging": false, "searching": false, "info": false
		});
	};

	wpsn.fetchReposData = async function(urls) {
		let data = {};
		let promises = [];
		for (let i = 0; i < urls.length; i++) {
			let url = urls[i];
			if (!url) continue;
			promises.push(wpsn.fetchRepoData(url));
		}
		await Promise.all(promises).then(function(values) {
			for (let i = 0; i < values.length; i++) {
				data[urls[i]] = values[i];
			}
		});
		return data;
	};

	wpsn.fetchRepoData = async function(url) {
		let data = {};

		let link = document.createElement('a');
		link.href = url
		link.domain = link.protocol +'//'+ link.hostname;

		let html = await wpsn.getUrlData(wpsn.absoluteUrl(url), 280);
		let $html = $(html);
		
		try {
			let author = $html.find('[itemprop="author"] a');
			data.author = {
				name : author.text(),
				url : link.domain+author.attr('href')
			}
		}catch(err){}
		try {
			let repo = $html.find('[itemprop="name"] a');
			data.repo = {
				name : repo.text(),
				url : link.domain+repo.attr('href')
			}
		}catch(err){}
		try {
			let license = $html.find('.octicon-law').parent('a');
			if (license.size()>0) {
				data.license = {
					name : license.text(),
					url : link.domain+license.attr('href')
				}
			}
		}catch(err){}
		try{data.watchers = parseInt($html.find('a[href*="/watchers"]').html().trim().replace(',',''));}catch(err){ data.watchers = ''; }
		try{data.stars = parseInt($html.find('a[href*="/stargazers"]').html().trim().replace(',',''));}catch(err){ data.stars = ''; }
		try{data.forks = parseInt($html.find('a[href*="/members"]').html().trim().replace(',',''));}catch(err){ data.forks = ''; }
		try{data.issues = parseInt($html.find('a[href*="/issues"] .Counter').html().trim().replace(',',''));}catch(err){ data.issues = ''; }
		try{data.pulls = parseInt($html.find('a[href*="/pulls"] .Counter').html().trim().replace(',',''));}catch(err){ data.pulls = ''; }
		try{data.projects= parseInt($html.find('a[href*="/projects"] .Counter').html().trim().replace(',',''));}catch(err){ data.projects = ''; }
		try{data.commits= parseInt($html.find('a[href*="/commits/master"] .num').html().trim().replace(',',''));}catch(err){ data.commits = ''; }
		try{data.branches= parseInt($html.find('a[href*="/branches"] .num').html().trim().replace(',',''));}catch(err){ data.branches = ''; }
		try{data.releases= parseInt($html.find('a[href*="/releases"] .num').html().trim().replace(',',''));}catch(err){ data.releases = ''; }
		try{data.contributors= parseInt($html.find('a[href*="/contributors"] .num').html().trim().replace(',',''));}catch(err){ data.contributors = ''; }
		try{data.lastModified= new Date($html.find('[itemprop="dateModified"] relative-time').html().trim().replace(',','')).toLocaleDateString();}catch(err){ data.lastModified = ''; }
		try {
			let repo = $html.find('[itemprop="name"] a');
			data.repo = {
				name : repo.text(),
				url : link.domain+repo.attr('href')
			}
		}catch(err){}
		try {
			$html.find('.repository-lang-stats a').each(function() {
				let lang = $(this).find('.lang').html();
				let percent = $(this).find('.percent').html();
				data[lang] = percent;
			});
		} catch(err){}
		return data;
	}

	wpsn.printJsonData = async function(data) {
		let keys = [];
		let properties = [];
		for (var repo in data) {
			if (data.hasOwnProperty(repo)) {
				keys.push(repo);
				//if (properties.length == 0) {
					for (var property in data[repo]) {
						if (data[repo].hasOwnProperty(property)) {
							properties.push(property);
						}
					}
			    //}
			}
		}
		keys = [...new Set(keys)];
		properties = [...new Set(properties)];

		let output = '<div style="width:99%"><table>';
		let headers = false;
		let weight = {};
		try {
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				for (let j = 0; j<properties.length; j++) {
					let prop = properties[j];
					let value = data[key][prop];
					weight[prop] = weight[prop] || {};
					weight[prop].max = weight[prop].max ? weight[prop].max > value ? weight[prop].max : value : value;
					weight[prop].min = weight[prop].min ? weight[prop].min < value ? weight[prop].min : value : value;
				}
			}
		}catch(err){}

		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
		
		    if (!headers) {
				output += '<thead><tr>';
				for (let j = 0; j<properties.length; j++) {
					let prop = properties[j];
					output += '<td>'+prop+'</td>';
				}
				headers = true;
				output += '</tr></thead>';
			}
			if (i==0) {
				output += '<tbody>';
			}
			output += '<tr>';
			for (let j = 0; j<properties.length; j++) {
				let prop = properties[j];
				let value = data[key][prop];
				if (value instanceof Object) {
					if (value.name && value.url) {
						value = '<a href="'+value.url+'">'+value.name+'</a>';
					}
				}
				let color = '#fff';
				if (keys.length > 1) {
					try {
						let weightObj = weight[prop];
						let weightValue = value / weightObj.max;
						color = wpsn.weightedColor({r:200,g:200,b:200}, weightValue);
					} catch(err){}
				}
				output += '<td style="background:'+color+'">'+(value?value:'')+'</td>';
			}
			output += '</tr>';
		}
		output += '<tbody>';
		output += '</table></div>'
		return output;
	};

	wpsn.commitToGitHubEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.commitToGitHubNote, '', true);
	};

	wpsn.commitToGitHubNote = async function (notes, options) {
		await wpsn.getSettings();
		options = options || {};
		let anchorNote = notes[0];
		let effectiveNotes = options.effectiveNotes || await wpsn.getEffectiveNotes(notes);
		let github = anchorNote.github || wpsn.settings.github || {};
		let prompt = '' +
		'<table width="100%">' +
		'<tr><td><label for="wpsn_username">Username</label>:</td><td><input type="text" name="wpsn_username" id="wpsn_username" style="width:100%"/></td></tr>' +
		'<tr><td><label for="wpsn_password"><a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token" target="_blank">Personal Access Token</a></label>:</td><td><input type="password" name="wpsn_password" id="wpsn_password" style="width:100%"/></td></tr>' +
		'<tr><td><label for="wpsn_repository">Repository</label>:</td><td><input type="text" name="wpsn_repository" id="wpsn_repository" style="width:100%"/></td></tr>' +
		'<tr><td><label for="wpsn_path">Commit As</label>:</td><td><input type="text" name="wpsn_path" id="wpsn_path" style="width:100%"/></td></tr>' +
		'<tr><td><label for="wpsn_message">Commit Message</label>:</td><td><textarea name="wpsn_message" id="wpsn_message" style="width:100%;height:100px"/></td></tr>' +
		'</table>';

		let form = await wpsn.prompt(
			{
				minWidth: 700,
				load: function(){$('#wpsn_password').focus();}
			},
			'<div class="panel panel-default"><div class="panel-heading"><a href="http://www.github.com" target="_blank">GitHub</a> Commit Configuration for '+ effectiveNotes.label + '</div><div class="panel-body">' + prompt + '</div></div>',
			{
				'wpsn_username': github.username,
				'wpsn_repository': github.repository,
				//'wpsn_branch' : github.branch,
				'wpsn_path': github.path || anchorNote.id,
				//'wpsn_content' : github.content,
				'wpsn_message': github.message

			}
		);
		wpsn.saveNoteStateForUndo(notes);
		for (let note of notes) {
			if (form) {
				note.github = {
					username: form.wpsn_username,
					repository: form.wpsn_repository,
					path: form.wpsn_path
				};
			}
			await wpsn.refreshNote(note);
		}
		wpsn.settings.github = {
			username: form.wpsn_username,
			repository: form.wpsn_repository
		};
		wpsn.saveSettings();
		form.wpsn_path = form.wpsn_path || anchorNote.id;
		if (!form.wpsn_path.endsWith('.wpsn')) {
			form.wpsn_path += '.wpsn';
		}
		wpsn.commit({
			token: form.wpsn_token,
			username: form.wpsn_username,
			authorization: btoa(form.wpsn_username + ':' + form.wpsn_password),
			repository: form.wpsn_repository,
			branch: form.wpsn_branch || 'main',
			path: form.wpsn_path,
			content: form.wpsn_content || JSON.stringify(notes, null, 4),
			message: form.wpsn_message || 'Committed from WebPageStickyNotes'
		});
	};

	wpsn.menu.settings = {
		'icon': 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/settings.svg',
		'name': 'settings',
		'required': true,
		'description': '',
		'menuArray': function () {
			let allMenuArray = wpsn.generateMainMenuArray({ fullscreen: true });
			let menuArray = [];
			for (let i = 0; i < allMenuArray.length; i++) {
				let menu = allMenuArray[i];
				if (!menu || !wpsn.menu[menu] || wpsn.menu[menu].required || wpsn.menu[menu].extension) { continue; }
				menuArray.push(menu);
			}
			return menuArray;
		},
		'rightClick': {
			'description': 'Revert to default Settings',
			'action': async function () {
				await wpsn.confirm({}, 'Are you sure you want to revert to default settings?');
				wpsn.settings = wpsn.defaultSettings;
				wpsn.saveSettings();
				wpsn.refreshAllNotes();
			}
		},
		'leftClick': {
			'description': async function () { return await wpsn.commandDescription('a-d-settings'); },
			'action': async function (note) {
				await wpsn.getSettings();
				let promptHTML = '<h1>Settings</h1>';
				promptHTML +=`
					<div class="panel panel-default"><div class="panel-heading">Default Menu</div><div class="panel-body">
					Hover over icons for functionality description:<br/>
					<table class="wpsn-scope form-inline" style="width:100%">
						<tr>
							<td><label for="wpsn_menu_all" style="display:block">All:</label></td>
							<td><label for="wpsn_menu_all" style="display:block"><input type="checkbox" name="wpsn_menu_all" id="wpsn_menu_all" class="wpsn_menu_all" value="true" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/></label></td>
						</tr>
				`;
				let menuArray = wpsn.menu.settings.menuArray();
				for (let i = 0; i < menuArray.length; i++) {
					let menuProperty = menuArray[i];
					let menu = wpsn.menu[menuProperty];
					if (!menu || !menu.icon) { continue; }
					let title = await wpsn.menuDescription(note, menu);
					promptHTML += '<tr>' +
						'<td><label for="wpsn_menu_' + menuProperty + '" style="display:block"><img src="' + menu.icon + '" title="' + title + '" width="'+(wpsn.settings.defaultIconSize||14)+'"/></label></td>' +
						'<td><label for="wpsn_menu_' + menuProperty + '" style="display:block"><input type="checkbox" name="wpsn_menu_' + menuProperty + '" id="wpsn_menu_' + menuProperty + '" class="wpsn_menu_item wpsn_menu_' + menuProperty + '" value="true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></label></td>' +
						'</tr>';
				}
				promptHTML += '' +
					'</table>' +
					'</div></div>';
				/*
				promptHTML +=
				'<div class="panel panel-default"><div class="panel-heading">Default Background</div><div class="panel-body">'+
				'<input type="text" name="background"/>'+
				'<ul class="colorpicker" data-wpsn.input="background">';
				let background = ['#ffa','#fc9','#fcf','#faa','#aaf','#9cf','#aff','#afa','#eee','#fff','#000','hsla(0, 0, 0, 0)'];
				for (let i = 0; i < background.length; i++) {
					promptHTML += '<li style="background-color:'+background[i]+'">&nbsp;</li>';
				}
				promptHTML += '</ul></div></div>';
				promptHTML +=
				'<div class="panel panel-default"><div class="panel-heading">Default Text Color</div><div class="panel-body">'+
				'<input type="text" name="textcolor"/>'+
				'<ul class="colorpicker" data-wpsn.input="textcolor">';
				let textcolor = ['#000','#222','#444','#666','#888','#aaa','#ccc','#eee','#fff'];
				for (let i = 0; i < textcolor.length; i++) {
					promptHTML += '<li style="background-color:'+textcolor[i]+'">&nbsp;</li>';
				}
				promptHTML += '</ul></div></div>';
				promptHTML +=
				'<div class="panel panel-default"><div class="panel-heading">Default Border Color</div><div class="panel-body">'+
				'<input type="text" name="bordercolor"/>'+
				'<ul class="colorpicker" data-wpsn.input="bordercolor">';
				let bordercolor = ['#000','#222','#444','#666','#888','#aaa','#ccc','#eee','#fff','hsla(0, 0, 0, 0)'];
				for (let i = 0; i < bordercolor.length; i++) {
					promptHTML += '<li style="background-color:'+bordercolor[i]+'">&nbsp;</li>';
				}
				promptHTML += '</ul></div></div>';
				*/
				promptHTML += 
					'<div class="panel panel-default"><div class="panel-heading">Default Width & Height</div><div class="panel-body">' +
					'<span style="display:inline-block;width:50px">Width:</span><input type="range" style="width:100%;" name="defaultWidth" min="100" max="1000" step="25" data-display="wpsn-defaultWidth"list="wpsn_defaultWidth"><datalist id="wpsn_defaultWidth"><option>25</option><option>250</option><option>500</option><option>750</option><option>1000</option></datalist></input><span class="wpsn-defaultWidth" style="padding-left:5px;"></span><br/>' +
					'<span style="display:inline-block;width:50px">Height:</span><input type="range" style="width:100%;" name="defaultHeight" min="100" max="1000" step="25" data-display="wpsn-defaultHeight"list="wpsn_defaultHeight"><datalist id="wpsn_defaultHeight"><option>25</option><option>250</option><option>500</option><option>750</option><option>1000</option></datalist></input><span class="wpsn-defaultHeight" style="padding-left:5px;"></span></div></div>';
				promptHTML +=
					'<div class="panel panel-default"><div class="panel-heading">Default Icon Size</div><div class="panel-body">' +
					'<span style="display:inline-block;width:50px">Size:</span><input type="range" style="width:100%;" name="defaultIconSize" min="10" max="30" step="1" data-display="wpsn-defaultIconSize"list="wpsn_defaultIconSize"><datalist id="wpsn_defaultIconSize"><option>15</option><option>20</option><option>25</option><option>30</option><option>35</option><option>40</option><option>45</option></datalist></input><span class="wpsn-defaultIconSize" style="padding-left:5px;"></span></div></div>';
				promptHTML +=
					'<div class="panel panel-default"><div class="panel-heading">Default Look And Feel Properties</div><div class="panel-body">' + wpsn.fontPromptHTML(false, true, true) + '</div></div>';

				promptHTML +=
					'<div class="panel panel-default"><div class="panel-heading">Default Scope</div><div class="panel-body">' +
					'All newly created note will inherit the scope of the page where it is being created, but matching the criteria selected below:<br/>' +
					'<table class="wpsn-scope form-inline" style="width:100%">' +
					'<tr><td>Protocol</td>		<td><input type="checkbox" name="wpsn_scope_protocol" class="wpsn_scope_protocol" value="true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td></tr>' +
					'<tr><td>Host name</td>		<td><input type="checkbox" name="wpsn_scope_hostname" class="wpsn_scope_hostname" value="true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td></tr>' +
					'<tr><td>Port</td>		<td><input type="checkbox" name="wpsn_scope_port" class="wpsn_scope_port" value="true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td></tr>' +
					'<tr><td>Path name</td>		<td><input type="checkbox" name="wpsn_scope_pathname" class="wpsn_scope_pathname" value="true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td></tr>' +
					'<tr><td>Query string</td>	<td><input type="checkbox" name="wpsn_scope_search" class="wpsn_scope_search" value="true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td></tr>' +
					'<tr><td>Hash name</td>		<td><input type="checkbox" name="wpsn_scope_hash" class="wpsn_scope_hash" value="true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td></tr>' +
					'<tr><td>Page title</td>	<td><input type="checkbox" name="wpsn_scope_title" class="wpsn_scope_title" value="true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/></td></tr>' +
					'</table>' +
					'</div></div>';
				promptHTML += `
					<div class="panel panel-default"><div class="panel-heading">Enable Synchronization with Google Drive</div><div class="panel-body">
					Once enabled, on creating/modifying/deleting a note, an attempt to synchronize all notes will occur seamlessly. 
					If a certain amount of time elapses between synchronization, the notes will synchronize with Google Drive. Otherwise, the notes will remain out of sync.
					This is to prevent an abuse of the Google Drive API quota.<br/><br/>
					The notes will be stored under <code>WebPageStickyNotes/sync.wpsn</code> on your Google Drive.<br/><br/>
					Only select 'Yes' if you have a Google account.<br/>
					<input type="radio" name="enableSynchronization" value="true" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> Yes <input type="radio" name="enableSynchronization" value="false" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> No</div></div>
					`;
				promptHTML +=
					`
					<div class="panel panel-default"><div class="panel-heading">Disable Auto Resize</div><div class="panel-body">
					When initially empty and text is added to note, note will automatically resize around text.<br/>
					<input type="radio" name="disableAutoresize" value="true" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> Yes <input type="radio" name="disableAutoresize" value="false" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> No</div></div>
					`;
				promptHTML +=
					`
					<div class="panel panel-default"><div class="panel-heading">Enable Auto Resize Height</div><div class="panel-body">
					Always auto resize height.<br/>
					<input type="radio" name="enableAutoresizeHeight" value="true" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> Yes <input type="radio" name="enableAutoresizeHeight" value="false" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> No</div></div>
					`
				promptHTML +=
					`
					<div class="panel panel-default"><div class="panel-heading">Enable Note Positioning Per Page</div><div class="panel-body">
					For notes that are scoped to many pages, the position of the notes can vary between pages.<br/>
					<input type="radio" name="multiPosition" value="true" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> Yes <input type="radio" name="multiPosition" value="false" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> No</div></div>
					`;
				promptHTML +=
					`
					<div class="panel panel-default"><div class="panel-heading">Disable Meme Mode By Default</div><div class="panel-body">
					Meme mode makes text on media be of a specific font with dynamic size and positioned at the bottom and at the top of media. <br/>
					<input type="radio" name="disableMemeModeByDefault" value="true" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> Yes <input type="radio" name="disableMemeModeByDefault" value="false" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/> No</div></div>
					`;
				promptHTML += wpsn.modePromptHTML('Default Rendering/Editing Mode');
				promptHTML +=
					'<div class="panel panel-default"><div class="panel-heading">Enable Source Formatting when Pasting from Clipboard in Markdown mode</div><div class="panel-body">' +
					'<input type="radio" name="enableSmartPaste" value="true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> Yes <input type="radio" name="enableSmartPaste" value="false" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> No<br/>' +
					'With Source Formatting enabled, Ctrl+V will paste the formatting markup in the note in Markdown mode only. To paste as plain text, Ctrl+Shift+V.</div></div>';
				promptHTML +=
					'<div class="panel panel-default"><div class="panel-heading">Enable Web Page Sticky Notes Bookmarks</div><div class="panel-body">' +
					'<input type="radio" name="enableBookmarks" value="true" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> Yes <input type="radio" name="enableBookmarks" value="false" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> No</div></div>';
				if (!window.sessionStorage['wpsn.adFree']) {
					let noteCount = wpsn.propertiesSize(wpsn.allNotes);
					if (wpsn.adEnabled && noteCount > 20) {
						promptHTML +=
							'<div class="panel panel-default"><div class="panel-heading">Development Support Option</div><div class="panel-body">' +
							'<input type="radio" name="monetizationOption" value="ad" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> Ad <input type="radio" name="monetizationOption" value="affiliate" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> Affiliate <br/> <a href="https://chrome.google.com/webstore/detail/web-page-sticky-notes-%3E-a/okmbdoenngkhmcijiamaeamgminpkdho?hl=en-US&gl=US&authuser=1">Purchase Ad-Free Add-On</a></div></div>';
					}
				}

				let imageAndCanvas = await wpsn.takeScreenshot($(document.body),{canvasWidth:1000});
				let canvas = imageAndCanvas.canvas;
				
				await wpsn.prompt(
					{
						maxWidth: 1000, minWidth: 330, 
						load: function (note) {
							//input.eq(0).focus();

							$('input[name="wpsn_background"]').data('predefinedColors', '#ffa|#fc9|#fcf|#faa|#aaf|#9cf|#aff|#afa|#eee|#fff|'+wpsn.transparent);
							$('input[name="wpsn_textcolor"]').data('predefinedColors', '#000|#222|#444|#666|#888|#aaa|#ccc|#eee|#fff');
							$('input[name="wpsn_bordercolor"]').data('predefinedColors', '#000|#222|#444|#666|#888|#aaa|#ccc|#eee|#fff|'+wpsn.transparent);

							let $input = $('input[name="wpsn_background"],input[name="wpsn_textcolor"],input[name="wpsn_bordercolor"]');
							
							wpsn.colorInput($input, canvas);
							
							let sizeInput = $('input[name="defaultWidth"],input[name="defaultHeight"],input[name="defaultIconSize"]').bind('change', function () {
								$('span.' + $(this).data('display')).text($(this).val() + 'px');
							});
							sizeInput.each(function () {
								$('span.' + $(this).data('display')).text($(this).val() + 'px');
							});
							let $menuItemCheckbox = $('.wpsn_menu_item');
							$('.wpsn_menu_all').click(function(){
								let checked = $(this).is(':checked');
								$menuItemCheckbox.prop('checked', checked);
							});

							wpsn.autoResize(note);
							wpsn.centerNote(note);
							wpsn.fontPromptLoad(note, true);
						}
					},
					promptHTML
					,
					function () {
						let defaults = {
							'wpsn_background': wpsn.settings.background || '#ffa',
							'wpsn_textcolor': wpsn.settings.textcolor || '#444',
							'wpsn_bordercolor': wpsn.settings.bordercolor || '#aaa',
							'wpsn_textposition': wpsn.settings.textposition || 'bottom-center',
							'wpsn_textshadow': wpsn.settings.textshadow || 'true',
							'wpsn_mode': wpsn.settings.defaultMode || wpsn.getModeId(wpsn.defaultMode),
							'defaultWidth': wpsn.settings.defaultWidth || 500,
							'defaultHeight': wpsn.settings.defaultHeight || 500,
							'defaultIconSize': wpsn.settings.defaultIconSize || 14,
							'wpsn_scope_protocol': wpsn.settings.scope ? wpsn.settings.scope.protocol == false ? 'false' : 'true' : 'false',
							'wpsn_scope_hostname': wpsn.settings.scope ? wpsn.settings.scope.hostname == false ? 'false' : 'true' : 'true',
							'wpsn_scope_port': wpsn.settings.scope ? wpsn.settings.scope.port == false ? 'false' : 'true' : 'true',
							'wpsn_scope_pathname': wpsn.settings.scope ? wpsn.settings.scope.pathname == false ? 'false' : 'true' : 'true',
							'wpsn_scope_search': wpsn.settings.scope ? wpsn.settings.scope.search == false ? 'false' : 'true' : 'true',
							'wpsn_scope_hash': wpsn.settings.scope ? wpsn.settings.scope.hash == false ? 'false' : 'true' : 'true',
							'wpsn_scope_title': wpsn.settings.scope ? wpsn.settings.scope.title == true ? 'true' : 'false' : 'false',
							'wpsn_font_family': wpsn.settings.font ? wpsn.settings.font.family : '',
							'wpsn_font_size': wpsn.settings.font ? wpsn.settings.font.size || '0' : '0',
							'multiPosition': wpsn.settings.multiPosition ? 'true' : 'false' || 'false',
							'disableAutoresize': wpsn.settings.disableAutoresize ? 'true' : 'false' || 'false',
							'enableAutoresizeHeight': wpsn.settings.enableAutoresizeHeight ? 'true' : 'false' || 'false',
							'disableMemeModeByDefault': wpsn.settings.disableMemeModeByDefault ? 'true' : 'false' || 'false',
							'enableSynchronization': wpsn.settings.enableSynchronization ? 'true' : 'false' || 'false',
							'enableSmartPaste': wpsn.settings.enableSmartPaste ? 'true' : 'false' || 'false',
							'enableBookmarks': wpsn.settings.enableBookmarks ? 'true' : 'false' || 'false',
							'monetizationOption': wpsn.settings.monetizationOption || wpsn.defaultMonetizationOption
						};
						let menuArray = wpsn.menu.settings.menuArray();
						for (let i = 0; i < menuArray.length; i++) {
							let menuProperty = menuArray[i];
							let menu = wpsn.menu[menuProperty];
							if (!menu || !menu.icon) { continue; }
							defaults['wpsn_menu_' + menuProperty] =
								wpsn.settings.menu && wpsn.settings.menu[menuProperty] ?
									'' + (wpsn.settings.menu[menuProperty].enabled == true) :
									(menu.required || !menu.optional ? 'true' : 'false');
						}
						return defaults;
					}(),
					function (form) {
						if (form) {
							wpsn.settings.background = form.wpsn_background;
							wpsn.settings.textcolor = form.wpsn_textcolor;
							wpsn.settings.bordercolor = form.wpsn_bordercolor;
							wpsn.settings.textposition = form.wpsn_textposition;
							wpsn.settings.textshadow = form.wpsn_textshadow;
							wpsn.settings.defaultMode = form.wpsn_mode;
							wpsn.settings.defaultWidth = form.defaultWidth;
							wpsn.settings.defaultHeight = form.defaultHeight;
							wpsn.settings.defaultIconSize = form.defaultIconSize;
							wpsn.settings.scope = wpsn.settings.scope || {};
							wpsn.settings.scope.protocol = form.wpsn_scope_protocol === 'true';
							wpsn.settings.scope.hostname = form.wpsn_scope_hostname === 'true';
							wpsn.settings.scope.port = form.wpsn_scope_port === 'true';
							wpsn.settings.scope.pathname = form.wpsn_scope_pathname === 'true';
							wpsn.settings.scope.search = form.wpsn_scope_search === 'true';
							wpsn.settings.scope.hash = form.wpsn_scope_hash === 'true';
							wpsn.settings.scope.title = form.wpsn_scope_title === 'true';
							wpsn.settings.font = wpsn.settings.font || {};
							wpsn.settings.font.family = form.wpsn_font_family;
							wpsn.loadFonts([form.wpsn_font_family]);
							wpsn.settings.font.size = parseInt(form.wpsn_font_size) || null;
							wpsn.settings.disableAutoresize = form.disableAutoresize === 'true';
							wpsn.settings.enableAutoresizeHeight = form.enableAutoresizeHeight === 'true';
							wpsn.settings.multiPosition = form.multiPosition === 'true';
							wpsn.settings.disableMemeModeByDefault = form.disableMemeModeByDefault === 'true';
							wpsn.settings.enableSynchronization = form.enableSynchronization === 'true';
							wpsn.settings.enableSmartPaste = form.enableSmartPaste === 'true';
							wpsn.settings.enableBookmarks = form.enableBookmarks === 'true';
							wpsn.settings.monetizationOption = form.monetizationOption;

							wpsn.settings.menu = wpsn.settings.menu || {};
							let menuArray = wpsn.menu.settings.menuArray();
							for (let i = 0; i < menuArray.length; i++) {
								let menuProperty = menuArray[i];
								let menu = wpsn.menu[menuProperty];
								if (!menu || !menu.icon) { continue; }
								wpsn.settings.menu[menuProperty] = wpsn.settings.menu[menuProperty] || {};
								wpsn.settings.menu[menuProperty].enabled = form['wpsn_menu_' + menuProperty] === 'true';
							}
							wpsn.saveSettings();
							wpsn.refreshAllNotes();
						}
					}
				);
			}
		}
	};

	wpsn.menu.aboutAd = {
		'icon': 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/question.svg',
		'name': 'aboutAd',
		'exclude': true,
		'description': 'Why are you seeing this ad?',
		'leftClick': {
			'description': '',
			'action': function () {
				wpsn.prompt(
					{},
					'<img height="75" src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/logo/wpsn.png"/> has been developed for free for more than 2 years now. The growth ahead is not sustainable at this rate.<br/>There are several ways you can contribute today to show your support and help grow this invaluable extension:<br/>' +
					'<ol><li><input type="radio" name="monetizationOption" value="ad" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> An ad will occasionally popup only when you create a new note</li><li><input type="radio" name="monetizationOption" value="affiliate" style="width:'+(wpsn.settings.defaultIconSize||14)+'px;height:'+(wpsn.settings.defaultIconSize||14)+'"/> An affiliate id will be appended to the URL when you visit certain sites</li>' +
					'<li>None of the above will occur if you purchase this <a href="https://chrome.google.com/webstore/detail/web-page-sticky-notes-%3E-a/okmbdoenngkhmcijiamaeamgminpkdho?hl=en-US&gl=US&authuser=1">Ad-Free Add-On</a></li></ol><input type="hidden" name="monetizationAffiliateWarning" value="true"/>',
					{
						'monetizationOption': wpsn.settings.monetizationOption || wpsn.defaultMonetizationOption
					},
					async function (form) {
						if (form) {
							await wpsn.getSettings();
							wpsn.settings.monetizationOption = form.monetizationOption;
							wpsn.settings.monetizationAffiliateWarning = form.monetizationAffiliateWarning;
							wpsn.saveSettings();
						}
					}
				);
			}
		}
	};

	wpsn.features = {
		'3.0.41': [
			'FEATURE: Text Alignment in <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/feather.svg"/>',
			'FEATURE: Ability to Always Auto Resize Height in <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/settings.svg"/> (Disabled by default)',
			'FEATURE: Ability to update underlying page in <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/pushpin.svg"/>',
		],
		'3.0.31': [
			'FEATURE: Plant UML diagram in <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/diagram.svg"/>'
		],
		'3.0.29': [
			'FEATURE: Ability to Label/Add/Remove/UpdateAll/InsertNew templates in "Go To URL" feature.'
		],
		'3.0.24': [
			'FEATURE: Increase icon size by popular demand, with the ability to change icon size in  <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/settings.svg"/>'
		],
		'3.0.15': [
			'FEATURE: Create directory structure in <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/diagram.svg"/>'
		],
		'3.0.12': [
			'FIX: Screenshot was blurry depending on the display in <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/camera.svg"/>',
			'FIX: Criteria setup was buggy in <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/circle.svg"/>',
			'FIX: Dragging an image into a note resulted in an error',
			'FIX: Diagram resizing was buggy in <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/diagram.svg"/>'
		],
		'3.0.8': [
			'FEATURE: Numbered each arrow of sequence diagram',
			'FEATURE: Add color and url functionality to sequence diagram'
		],
		'3.0.3': [
			'FEATURE: Menu icons were updated with a more consistent look',
			'FEATURE: All menu items enabled by default to match the slogan',
			'FEATURE: You can now visualize javascript code in a flowchart diagram by clicking <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/diagram.svg"/>',
			'FEATURE: You can now create beautiful charts by clicking <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/diagram.svg"/>'
		],
		'3.0.0': [
			'FEATURE: You can now synchronize with Google Drive!',
			'FEATURE: Exports, Backups and Syncs are now encrypted!'
		]
	};

	wpsn.versionCompare = function (v1, v2, options) {
		let lexicographical = options && options.lexicographical,
			zeroExtend = options && options.zeroExtend,
			v1parts = v1.split('.'),
			v2parts = v2.split('.');
		function isValidPart(x) {
			return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
		}
		if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
			return NaN;
		}
		if (zeroExtend) {
			while (v1parts.length < v2parts.length) v1parts.push('0');
			while (v2parts.length < v1parts.length) v2parts.push('0');
		}
		if (!lexicographical) {
			v1parts = v1parts.map(Number);
			v2parts = v2parts.map(Number);
		}
		for (let i = 0; i < v1parts.length; ++i) {
			if (v2parts.length == i) {
				return 1;
			}
			if (v1parts[i] == v2parts[i]) {
				continue;
			}
			else if (v1parts[i] > v2parts[i]) {
				return 1;
			}
			else {
				return -1;
			}
		}
		if (v1parts.length != v2parts.length) {
			return -1;
		}
		return 0;
	};

	wpsn.featureList = function (fromVersion, toVersion) {
		let versionOrder = [];
		for (let version in wpsn.features) {
			if (versionOrder.length == 0) {
				versionOrder.push(version);
			} else {
				let added = false;
				for (let i = 0; i < versionOrder.length; i++) {
					let tempVersion = versionOrder[i];
					if (wpsn.versionCompare(tempVersion, version) < 0) {
						versionOrder.splice(i, 0, version);
						added = true;
					}
				}
				if (!added) {
					versionOrder.push(version);
				}
			}
		}
		let featureList = [];
		for (let j = 0; j < versionOrder.length; j++) {
			let version = versionOrder[j];
			if ((!fromVersion || version >= fromVersion) && (!toVersion || version <= toVersion)) {
				let features = wpsn.features[version];
				for (let k = 0; k < features.length; k++) {
					featureList.push(features[k]);
				}
			}
		}
		return featureList;
	};

	wpsn.about = function (whatsnew) {
		let title = '<div class="panel panel-warning"><div class="panel-heading"><h4><img height="50" src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/logo/wpsn.png"/> ' + (!wpsn.versionUpdated ? 'was '+(wpsn.installDetails && wpsn.installDetails.reason == 'install' ? 'installed' : 'updated') : '') + '</h4></div><div class="panel-body">';
		let support = '<div class="panel panel-success"><div class="panel-heading"><h4>Connect with WebPageStickyNotes.com</h4></div><div class="panel-body"><ul><li><a href="https://chrome.google.com/webstore/detail/web-page-sticky-notes-bet/alpjieidnmmkljnceakgpeajlngabnee/reviews?utm_source=chrome-ntp-icon&authuser=1">Rate & Review</a></li><li><a href="https://chrome.google.com/webstore/detail/web-page-sticky-notes-bet/alpjieidnmmkljnceakgpeajlngabnee/support">Questions, Suggestions & Problems</a></li><li><a href="http://faq.webpagestickynotes.com">Frequently Asked Questions</a></li><li>Follow <a href="https://twitter.com/thatyellowbox">@ThatYellowBox</a> on Twitter for more updates</li></ul>'+
		'<table><tr><td style="border:0"><a href="http://webpagestickynotes.item.merch.m2kcollection.com" target="_blank"><img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/shirt.png" width="75px"/></a></td><td style="border:0;vertical-align:middle"><a href="http://webpagestickynotes.collection.merch.m2kcollection.com" target="_blank">Check out some merch!</a></td></tr></table>'+
		'</div></div>';
		let body = '<div class="panel panel-default"><div class="panel-heading"><h4>About</h4></div><div class="panel-body">Offload your memory by appending notes <ol><li>to a specific web site</li><li>to a specific page of that web site</li><li>to a specific element of that page</li><li>to any web page matching a defined scope</li></ol><ul><li>FRICTIONLESS - Click & Type</li><li>CONTEXTUAL - Page specific instead of cluttered note board</li><li>SIMPLE - Most tasks are 2 clicks away</li><li>INTUITIVE - Shallow functionality, Symbolic icons, Tool tips to fill the gaps</li><li>CLEAN - Crisp icons, clean borders, unassuming</li><li>VERSATILE - Text editor, Picture frame, Video embed, RSS feed and much, much more...</li></ul></div></div>';
		let tip = '<div class="panel panel-info"><div class="panel-heading"><h4>Tips</h4></div><div class="panel-body"><ul>'+
		'<li>More functionality can be unlocked in <a href data-wpsn-command="a-d-settings">Settings <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/settings.svg" width="'+(wpsn.settings.defaultIconSize||14)+'"/></a></li>'+
		'<li><a href data-wpsn-command="a-tips-and-tricks">Tips & Tricks <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/sun.svg" width="'+(wpsn.settings.defaultIconSize||14)+'"/></a></li>'+
		'<li><a href data-wpsn-command="a-markdown-cheatsheet">Markdown Cheatsheet <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/sun.svg" width="'+(wpsn.settings.defaultIconSize||14)+'"/></a></li>'+
		'<li><a href data-wpsn-command="a-menu-cheatsheet">Menu Cheatsheet <img src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/sun.svg" width="'+(wpsn.settings.defaultIconSize||14)+'"/></a></li>'+
		'</ul></div></div>';

		if (whatsnew && !wpsn.versionUpdated && !(wpsn.installDetails && wpsn.installDetails.reason == 'install')) { body = ''; }
		let features = '<div class="panel panel-danger"><div class="panel-heading"><h4>' + (!wpsn.versionUpdated ? 'What\'s new' : 'Updates') + '</h4></div><div class="panel-body">';
		let featureList = wpsn.featureList((!wpsn.versionUpdated ? wpsn.versionPrevious : null), (!wpsn.versionUpdated ? wpsn.version : null));
		for (let i = 0; i < featureList.length; i++) {
			features += (i > 0 ? '\n' : '') + '- ' + featureList[i];
		}
		features += '</div></div>';
		features = ( !(wpsn.installDetails && wpsn.installDetails.reason == 'install') ? features : '')
		return { 'menu': ['removePopup', 'snapshot'], 'background': '#fff', 'textcolor': '#444', 'isPopup': true, 'font': { 'family': 'Verdana' }, 'fullscreen': false, 'height': 688, 'width': 1024, 'htmlMode': false, 'id': 842932279, 'mode': '6328746328', 'modified_date': 1439745294878, 'pos_x': 788, 'pos_y': 33, 'text': title + body + support + features + tip };
	};

	wpsn.fileContent = function (relativePath) {
		return $.ajax({
			type: 'GET',
			url: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/' + relativePath,
			async: false
		}).responseText;
	};

	wpsn.gotoUrl = async function() {
		await wpsn.getSettings();
		let example = 'https://www.google.com/search?q={query}';
		wpsn.settings.GotoURLTemplates = wpsn.settings.GotoURLTemplates || [example];
		wpsn.settings.GotoURLTemplate = wpsn.settings.GotoURLTemplate || example;

		let form = await wpsn.template.prompt({template:wpsn.settings.GotoURLTemplate}, wpsn.settings.GotoURLTemplates, 'URL', example);
		
		wpsn.settings.GotoURLTemplates = form.templates;
		wpsn.settings.GotoURLTemplate = form.template;
		wpsn.saveSettings();
		if (form.evaluated) {
			window.open(form.evaluated, '_blank');
		}
	};

	wpsn.template = {
		promptHTML : function(oneTemplate, templates=[], header, example, formFieldName) {
			let formText = `
			<div>
				<div class="panel panel-default"><div class="panel-heading">Template:</div>
				<div class="panel-body">
					<table style="width:100%" class="wpsn_template_table">
						<tbody style="display:table-row-group;overflow:auto;max-height:500px;width:100%"></tbody>
					</table>
				</div>
			</div>`;
			formText += `
			<div>
				<div class="panel panel-default"><div class="panel-heading">Parameter(s):</div><div class="panel-body">
				<div class="fields"></div>
				</div>
			</div>
			<div>
				<div class="panel panel-default"><div class="panel-heading">${header}:</div><div class="panel-body">
				<div class="wpsn_link"></div>
				</div>
			</div>
		${oneTemplate ? '' : `
			<div>
				<div class="panel panel-default"><div class="panel-heading">Update all templates:</div><div class="panel-body">
				<div class="export">
					<textarea style="width:100%" name="wpsn_templates_export" value="${templates}" placeholder="Update all templates"/>
				</div>
				</div>
			</div>
			<div>
				<div class="panel panel-default"><div class="panel-heading">Add new templates:</div><div class="panel-body">
				<div class="import">
					<textarea style="width:100%" name="wpsn_templates_import" value="" placeholder="Add new templates"/>
				</div>
				</div>
			</div>
		`}
			`;
			return formText;
		},
		evaluate : function(template, params) {
			let evaledTemplate = template;
			let validFields = template.match(/{.*?}/g);
			if (validFields) {
				for (let i = 0; i < validFields.length; i++) {
					let validField = validFields[i].substring(1, validFields[i].length - 1);
					evaledTemplate = evaledTemplate.replace(new RegExp('{' + validField + '}','g'), (params[validField]||''));
					evaledTemplate = evaledTemplate.replace('{' + validField + '}', '');
				}
			}
			return evaledTemplate;
		},
		repaintTemplates : async function(props={},templates=[], header, example, fieldNames={}, oneTemplate) {
			let formText = '';
			//templates = wpsn.removeDuplicates(templates);
			for (let template of templates) {
				formText += `
				<tr>
					<td style="border:0;margin:0;display:${oneTemplate?'none':'block'}">
						<input type="radio" name="template" style="width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}" value="${escape(JSON.stringify(template))}"/>
					</td>
				${oneTemplate?'':`
					<td style="padding:5px;margin:0;border:0;width:30%;">
						<input style="width:100%;box-sizing: border-box;white-space:nowrap;" type="text" name="template_labels" value="${(template.label||"").replace(/"/g, '&quot;')}" placeholder="label"/>
					</td>
				`}
					<td style="padding:5px;margin:0;border:0;width:100%;">
						<input style="width:100%;box-sizing: border-box;white-space:nowrap;" type="text" name="templates" value="${(template.template||"").replace(/"/g, '&quot;')}" placeholder="template (i.e. ${example})"/>
					</td>
				${oneTemplate?'':`
					<td style="padding:5px;margin:0;border:0;">
						&nbsp;<img class="wpsn_template_remove" src="chrome-extension://${chrome.i18n.getMessage('@@extension_id')}/images/multiply.svg" style="cursor:pointer;width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/>
					</td>
				`}
				</tr>
				`;
			}
			formText += oneTemplate ? "" : `
			<tr><td colspan="4" style="padding:5px 0;margin:0;border:0;">
				<img class="wpsn_template_add" src="chrome-extension://${chrome.i18n.getMessage('@@extension_id')}/images/plus.svg" style="cursor:pointer;width:${(wpsn.settings.defaultIconSize||14)}px;height:${(wpsn.settings.defaultIconSize||14)}"/>
			</td></tr>`;
			$('table.wpsn_template_table tbody').html(formText);
			wpsn.template.updateAllTemplates(templates);
		},
		updateAllTemplates : async function(templates) {
			templates = templates || await wpsn.template.getAllTemplates();
			$('[name="wpsn_templates_export"]').val(JSON.stringify(templates));
		},
		getAllTemplates : async function() {
			let templates = [];
			//$('input[name="template_labels"],input[name="templates"]').change();
			$('input[name="template"]').each(function(){
				let tmplt = $(this).val()
				if (typeof tmplt === "string") {
					tmplt = wpsn.htmlEncode(tmplt);
					tmplt = unescape(tmplt||"");
					try {
						tmplt = JSON.parse(tmplt || "{}");
					} catch(err){
						tmplt = {template:tmplt};
					}
				}
				templates.push(tmplt);
			});
			return templates;
		},
		reloadTemplates : async function(props={},templates=[], header, example, fieldNames={}, oneTemplate) {
			$('table.wpsn_template_table tbody').sortable({
				stop: function(){
					wpsn.template.updateAllTemplates();
				}
			});
				let checked = false;
				let $templateRB = $('input[name="template"]').hide();
				$templateRB.change(function () {
					$(this).closest('table').find('tr').removeClass('wpsn-selected');
					$(this).closest('tr').addClass('wpsn-selected');
					let tmplt = $(this).val()
					if (typeof tmplt === "string") {
						tmplt = wpsn.htmlEncode(tmplt);
						tmplt = unescape(tmplt||"");
						try {
							tmplt = JSON.parse(tmplt || "{}");
						} catch(err){
							tmplt = {template:tmplt};
						}
					}

					let template = tmplt;
					var params = {};
					$.each($(this).closest('form').serializeArray(), function(i, param) {
						params[param.name] = param.value;
					});
					let evaledTemplate = wpsn.template.evaluate(template.template||"", params);
					$('.fielddiv').hide();
					if (template) {
						let validFields = (template.template||"").match(/{.*?}/g);
						if (validFields) {
							let $fieldsDiv = $('.fields');
							for (let i = 0; i < validFields.length; i++) {
								let validField = validFields[i].substring(1, validFields[i].length - 1);
								let $validField = $('.fielddiv.' + validField);
								let formFieldName = validField.toLowerCase().replace(' ', '_');
								let $formField = $('[name="' + formFieldName + '"]');
								if ($validField.size() > 0) {
									$('.' + validField).show();
								} else {
									let formFieldExists = true;
									if ($formField.size() == 0) {
										formFieldExists = false;
										let options = '';
										let names = fieldNames[formFieldName] || [];
										for (let name of names) {
											options += `<option>${name}</option>`;
										}
										$formField = $(`
											<div>
												<input type="text" class="field" name="${formFieldName}" id="${formFieldName}" placeholder="{${formFieldName}}" value="${(props[formFieldName]||'')}" style="width:100% "list="${formFieldName}List" autocomplete="on"/>
												<datalist id="${formFieldName}List">
													<optgroup label="Template Names"></optgroup>
													${options}
												</datalist>
											</div>
										`);
									}
									if (!formFieldExists) {
										$fieldsDiv.append($formField);
									}
								} 
								$formField.off('keyup').on('keyup',function(){
									$templateRB.filter(':checked').change();
								});
							}
						}
					}
					$('.field').each(function () {
						let $this = $(this);
						if ($this.closest('.fielddiv').size() == 0) {
							let $formFieldDiv = $('<div class="' + $this.attr('name') + ' fielddiv">' + $this.attr('name') + ':<br/><span class="fieldspot"></span><br/></div>');
							$this.before($formFieldDiv);
							$('.fieldspot', $formFieldDiv).append($this);
						}
					})
					if($(this).data('focus') == true && !$(document.activeElement).is('.field')) {
						$('.field:visible').eq(0).focus();
						$(this).data('focus', 'false');
					}
					$('.wpsn_link').empty().append($('<a href="'+evaledTemplate+'" target="_blank" style="margin-top:'+wpsn.defaultPadding+'px;">'+evaledTemplate+'</a>'));
					
					//wpsn.template.updateAllTemplates();
				}).each(function () {
					let $this = $(this);
					$this.attr('value', $this.closest('td').next('td').find('input[name="templates"]').val());
					if (typeof props.template === "string") {
						props.template = wpsn.htmlEncode(props.template);
						props.template = unescape(props.template||"");
						try {
							props.template = JSON.parse(props.template || "{}");
						} catch(err){}
					}

					if (typeof props.template === "string") {
						props.template = {template:props.template};
					}

					let tmplt = $this.val()
					if (typeof tmplt === "string") {
						tmplt = wpsn.htmlEncode(tmplt);
						tmplt = unescape(tmplt||"");
						try {
							tmplt = JSON.parse(tmplt || "{}");
						} catch(err){
							tmplt = {template:tmplt};
						}
					}

					if (props.template && props.template.template ===  tmplt.template) {
						$this.attr('checked', 'checked').data('focus', true).change();
						checked = true;
					}
				});
				if (!checked) {
					$templateRB.eq(0).attr('checked', 'checked').change();
				}
				$('input[name="template_labels"]').each(function () {
					let $this = $(this);
					$this.keyup(function () {
						let $radio = $this.closest('tr').find('input[name="template"]');
						let tmplt = JSON.parse(unescape($radio.val() || "{}"));
						tmplt.label = $this.val();
						$radio.val(escape(JSON.stringify(tmplt))).change();
						wpsn.template.updateAllTemplates();
					});
					$this.focus(function () {
						let $radio = $this.closest('tr').find('input[name="template"]');
						$radio.prop('checked', 'checked').change();
					});
					let $radio = $this.closest('tr').find('input[name="template"]');
					if ($radio.prop('checked')=='checked') {
						$this.keyup();
					}
				});
				$('input[name="templates"]').each(function () {
					let $this = $(this);
					$this.keyup(function () {
						let $radio = $this.closest('tr').find('input[name="template"]');
						let tmplt = $radio.val();
						if (typeof tmplt === "string") {
							tmplt = wpsn.htmlEncode(tmplt);
							tmplt = unescape(tmplt||"");
							try {
								tmplt = JSON.parse(tmplt || "{}");
							} catch(err){
								tmplt = {template:tmplt};
							}
						}
						tmplt.template = $this.val();
						$radio.val(escape(JSON.stringify(tmplt))).change();
						wpsn.template.updateAllTemplates();
					});
					$this.focus(function () {
						let $radio = $this.closest('tr').find('input[name="template"]');
						$radio.prop('checked', 'checked').change();
					});
					let $radio = $this.closest('tr').find('input[name="template"]');
					if ($radio.prop('checked')=='checked') {
						$this.keyup();
					}
				});
				$('.wpsn_template_add').click(async function() {
					let templates = await wpsn.template.getAllTemplates();
					templates.push({label:"",template:""});
					//templates = wpsn.removeDuplicates(templates);
					wpsn.template.updateAllTemplates(templates);
					wpsn.template.repaintTemplates(props, templates, header, example, fieldNames, oneTemplate);
					wpsn.template.reloadTemplates(props, templates, header, example, fieldNames, oneTemplate);
				});
				$('.wpsn_template_remove').each(function () {
					let $this = $(this);
					$this.click(function () {
						let $row = $this.closest('tr');
						$row.remove();
						wpsn.template.updateAllTemplates();
					});
				});
				$('[name="wpsn_templates_export"], [name="wpsn_templates_import"]').change(function(){
					let templates = [];
					templates = templates.concat(JSON.parse(unescape($('[name="wpsn_templates_export"]').val()||"[]")));
					templates = templates.concat(JSON.parse(unescape($('[name="wpsn_templates_import"]').val()||"[]")));
					templates = wpsn.removeDuplicates(templates);
					wpsn.template.repaintTemplates(props, templates, header, example, fieldNames, oneTemplate);
					wpsn.template.reloadTemplates(props, templates, header, example, fieldNames, oneTemplate);
				});
		},
		prompt : async function(props={},templates=[], header, example, fieldNames={}, oneTemplate) {
			if (!oneTemplate) {
				templates = [''].concat(templates);
			}
			let templateObjs = [];
			for (let template of templates) {
				if (template) {
					if (typeof template === "string") {
						templateObjs.push({template:template, label:""});
					} else {
						templateObjs.push(template);
					}
				}
			}
			templates = templateObjs.length>0 ? templateObjs : [{}];
			templates = wpsn.removeDuplicates(templates);

			let form = await wpsn.prompt({
				minWidth: 1000, minHeight: 500, load: function () {
					wpsn.template.repaintTemplates(props, templates, header, example, fieldNames, oneTemplate);
					wpsn.template.reloadTemplates(props, templates, header, example, fieldNames, oneTemplate);
				}
			}, wpsn.template.promptHTML(oneTemplate, templates, header, example));

			let tmplt = form.template;
			if (typeof tmplt === "string") {
				tmplt = wpsn.htmlEncode(tmplt);
				tmplt = unescape(tmplt||"");
				try {
					tmplt = JSON.parse(tmplt || "{}");
				} catch(err){
					tmplt = {template:tmplt};
				}
			}
			form.evaluated = wpsn.template.evaluate(tmplt.template||"", form);
			form.template = escape(JSON.stringify(tmplt));
			form.templates = oneTemplate ? [].concat(tmplt) : JSON.parse(form.wpsn_templates_export||"[]").concat(JSON.parse(form.wpsn_templates_import||"[]"));
			return form;
		}
	};

	wpsn.menuIllustration = async function (menu, action, note, menuDiv) {
		let menus = [];
		if (!menu) {
			for (let prop in wpsn.menu) {
				if (((typeof wpsn.menu[prop].exclude == 'function' && !wpsn.menu[prop].exclude()) || !wpsn.menu[prop].exclude) &&
					wpsn.menu[prop].icon) {
					menus.push(wpsn.menu[prop]);
				}
			}
		} else {
			menus = [menu];
		}
		let text = '';
		let columns = 6;
		let count = 0;
		let iconSize = 32;
		for (let a = 0; a < menus.length; a++) {
			if (a % columns == 0) {
				text += '<tr>';
			}
			text += '<td style="max-width:350px;vertical-align:top" valign="top">';
			let menu = menus[a];
			let actions = [];
			if (!action) {
				actions = ['leftClick', 'rightClick', 'doubleClick'];
			} else {
				actions = [action];
			}

			for (let i = 0; i < actions.length; i++) {
				let action = actions[i];
				if (!menu[action]) { continue; }
				let actionIcon = 'mouse.svg';
				if (action == 'leftClick') {
					actionIcon = 'mouse_left_click.svg';
				} else if (action == 'rightClick') {
					actionIcon = 'mouse_right_click.svg';
				} else if (action == 'doubleClick') {
					actionIcon = 'mouse_left_click.svg';
				}

				if (note && !menuDiv) {
					menuDiv = wpsn.getNoteDiv(note);
				}

				let menuIcon = menuDiv ? menuDiv.css('background-image').replace('url(', '').replace(')', '').replace('"', '').replace('"', '') : menu.icon;

				let description = await wpsn.clickDescription(menu[action], note || {});
				if (action == 'doubleClick') {
					text += '<img src="chrome-extension://{@@extension_id}/images/' + actionIcon + '" width="' + iconSize + '" style="float:left"/>';
				}
				text += '<img src="chrome-extension://{@@extension_id}/images/' + actionIcon + '" width="' + iconSize + '" style="float:left"/><img src="' + menuIcon + '" width="' + iconSize + '" style="float:left"/><div style="clear:both">' + description + '</div>';
				count++;
			}
			text += '</td>';
			if (a % columns == columns - 1) {
				text += '</tr>';
			}
		}
		if (text) {
			text = '<table width="' + (count < columns ? count * 315 : columns * 315) + '">' + text + '</table>';
			let tNote = { 'menu': ['removePopup', 'snapshot'], 'background': '#fff', 'textcolor': '#444', 'font': { 'family': 'Verdana' }, 'position': 'right', 'dockable': 'top', 'htmlMode': false, 'mode': '6328746328', 'modified_date': 1439745294878, 'pos_x': 788, 'pos_y': 33, 'isPopup': true, 'isNotPopup': true, 'text': text };
			await wpsn.createNote(tNote);
			wpsn.autoResize(tNote);
			wpsn.centerNote(tNote);
		}
	};

	wpsn.tips = function () {
		let text = wpsn.fileContent('tips.txt');

		return { 'menu': ['removePopup', 'snapshot', 'position'], 'background': '#fff', 'textcolor': '#444', 'font': { 'family': 'Verdana' }, 'position': 'right', 'dockable': 'top', 'height': 688, 'width': 1024, 'htmlMode': false, 'id': 8369542886, 'mode': '6328746328', 'modified_date': 1439745294878, 'pos_x': 788, 'pos_y': 33, 'isPopup': true, 'isNotPopup': true, 'text': text };
	};

	wpsn.cheatsheet = function () {
		let text = wpsn.fileContent('cheatsheet.txt');

		return { 'menu': ['removePopup', 'snapshot', 'position'], 'background': '#fff', 'textcolor': '#444', 'font': { 'family': 'Verdana' }, 'position': 'right', 'dockable': 'top', 'height': 688, 'width': 1024, 'htmlMode': false, 'id': 8369542886, 'mode': '6328746328', 'modified_date': 1439745294878, 'pos_x': 788, 'pos_y': 33, 'isPopup': true, 'isNotPopup': true, 'text': text };
	};

	wpsn.demo = { 'id': 842932278, 'text': '<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PLZsbN2-oeE3QiXP-EBxTb4bE9_0ymrqaZ" frameborder="0" allowfullscreen></iframe>', 'width': 588, 'height': 343, 'pos_x': 463, 'pos_y': 373, 'background': '#ffa', 'textcolor': '#444', 'created_date': 1419435274452, 'htmlMode': false, 'fullscreen': false, 'modified_date': 1436721876991, 'mode': '6328746328', 'font': { 'family': 'Verdana' }, 'title': '<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PLZsbN2-oeE3QiXP-EBxTb4bE9_0ymrqaZ" frameborder="0" allowfullscreen></iframe>' };

	wpsn.init = function () {
		let $body = $('body');

		let wpsnOptions = {
			resizable: true,
			draggable: true,
			controls: false
		};

		$body.wpsn(wpsnOptions);
	};

	wpsn.initSelectable = function () {
		$('body').selectable({
			filter: '.wpsn-sticky',
			cancel: 'a,input,textarea,button,select,option,.wpsn-no-draggable',
			delay: 150,
			selected: function (event, ui) {
				wpsn.selectElement($(ui.selected));
				wpsn.updateHasSelection();
			},
			unselected: function (event, ui) {
				wpsn.deselectElement($(ui.unselected));
				wpsn.updateHasSelection();
			}
		});

		$('.wpsn-sticky').unbind('click.wpsn-selectable').bind('click.wpsn-selectable', function (e) {
			let $this = $(this);
			let isNotSelected = !$this.is('.wpsn-selected');
			if (!(e.ctrlKey || e.metaKey)) {
				wpsn.deselectElement($('.wpsn-selected'));
				wpsn.updateHasSelection();
			} else {
				wpsn.deselectElement($this);
				wpsn.updateHasSelection();
			}
			if (isNotSelected && (e.ctrlKey || e.metaKey)) {
				wpsn.selectElement($this);
				wpsn.updateHasSelection();
			}
		}).each(function () {
			let sticky = $(this);
			let isDraggable = sticky.is('.wpsn-draggable') && !sticky.is('.ui-draggable-disabled');
			if (isDraggable) {
				sticky.data('wpsn-draggable', true).removeClass('wpsn-draggable').draggable('disable');
			}
		});
	};

	wpsn.selectNote = function (note) {
		wpsn.getNoteDiv(note).removeClass('wpsn-selected').addClass('wpsn-selected');
	};

	wpsn.selectAllNotes = function () {
		$('.wpsn-sticky').removeClass('wpsn-selected').addClass('wpsn-selected');
		wpsn.updateHasSelection();
	};

	wpsn.destroySelectable = function () {
		try {
			$('body').mouseup().selectable('destroy');
		} catch (err) { wpsn.error(err,true); }
		//$('.wpsn-sticky').unbind('click.wpsn-selectable');
		$('.wpsn-sticky').each(function () {
			let sticky = $(this);
			if (sticky.data('wpsn-draggable')) {
				sticky.addClass('wpsn-draggable').draggable('enable').removeData('wpsn-draggable');
			}
		});
	};

	wpsn.toNoteArray = function (noteOrNotes) {
		if (Object.prototype.toString.call(noteOrNotes) === '[object Array]') {
			return noteOrNotes;
		} else {
			return [noteOrNotes];
		}
	};

	wpsn.getEffectiveNotes = async function (noteOrNotes, selectNotes) {
		let notes = [];
		let label = 'no';
		let type = 'none';
		if (noteOrNotes) {
			if (Object.prototype.toString.call(noteOrNotes) === '[object Array]') {
				notes = noteOrNotes;
				label = notes.length + ' ' + (notes.length > 1 ? 'notes' : 'note');
				type = 'notes';
			} else {
				notes = [noteOrNotes];
				label = 'current note';
				type = 'current';
			}
		} else {
			if (selectNotes) {
				notes = await wpsn.manager.renderManager(null, 'Select ' + selectNotes, selectNotes);
				label = (selectNotes == 'notes' ? notes.length + ' ' : '') + 'provided ' + selectNotes;
				type = 'provided';
			} else {
				let activeNotes = wpsn.getActiveNotes();
				let editedNotes = await wpsn.currentlyEditedNotes();
				if (activeNotes.selected && activeNotes.selected.length > 0) {
					notes = activeNotes.selected;
					label = notes.length + ' selected ' + (notes.length > 1 ? 'notes' : 'note');
					type = 'selected';
				} else if (editedNotes && editedNotes.length > 0) {
					notes = editedNotes;
					label = (notes.length > 1 ? notes.length : '') + ' edited ' + (notes.length > 1 ? 'notes' : 'note');
					type = 'edited';
				} else if (activeNotes.hovered) {
					notes = [activeNotes.hovered];
					label = 'note below cursor';
					type = 'hovered';
				} else if (activeNotes.all && activeNotes.all.length > 0) {
					notes = [];
					for (let note of activeNotes.all) {
						if (!note.isPopup && !note.deleted) {
							notes.push(note);
						}
					}
					label = 'all ' + notes.length + ' ' + (notes.length > 1 ? 'notes' : 'note');
					type = 'all';
				}
			}
		}
		return {
			notes: notes,
			label: label,
			type: type
		};
	};

	wpsn.getActiveNotes = function (note) {
		return {
			note: note,
			selected: wpsn.getSelectedNotes(),
			hovered: wpsn.getMouseoverNote(),
			all: wpsn.getAllNotes()
		};
	};

	wpsn.getSelectedOrAllNotes = function (sorted) {
		let notes = wpsn.getSelectedNotes();
		if (!notes || notes.length == 0) {
			notes = wpsn.notes;
		}
		if (sorted) {
			notes.sort(
				function (a, b) {
					let ax = parseFloat(a.pos_x);
					let bx = parseFloat(b.pos_x);
					let ay = parseFloat(a.pos_y);
					let by = parseFloat(b.pos_y);
					if (ay == by) return ax - bx;
					return ay - by;
				}
			);
		}
		return notes;
	};

	wpsn.getCommand = function (commandName) {
		let commands = wpsn.commands.commands || {};
		return commands[commandName];
	};

	wpsn.shortcut = function (commandName, parenthesis) {
		let command = wpsn.getCommand(commandName) || {};
		let shortcut = command.shortcut || '';
		return shortcut && parenthesis ? '(' + shortcut + ')' : shortcut;
	};

	wpsn.commandDescription = async function (commandName, ctrlForAll, appendDescription) {
		let command = wpsn.getCommand(commandName) || {};
		let effectiveNotes = await wpsn.getEffectiveNotes() || {};
		let label = effectiveNotes.label;
		let notes = effectiveNotes.notes;
		return $.trim(command.description) + ' ' + (ctrlForAll && notes && notes.length > 1 ? '(Alt+Click to apply to ' + label + ') ' : '') + wpsn.shortcut(commandName, true) + (appendDescription ? '\n' + appendDescription : '');
	};

	wpsn.getAllNotes = function () {
		return wpsn.notes.slice().sort(
			function (a, b) {
				let ax = parseFloat(a.pos_x);
				let bx = parseFloat(b.pos_x);
				let ay = parseFloat(a.pos_y);
				let by = parseFloat(b.pos_y);
				if (ay == by) return ax - bx;
				return ay - by;
			}
		);
	};

	wpsn.getMouseoverNote = function () {
		let $mouseover = $('.wpsn-mouseover:not(.wpsn-mouseover-menu)');
		return wpsn.getNoteFromDiv($mouseover);
	};

	wpsn.getSelectedNotes = function () {
		let selectedNotes = [];
		$('.wpsn-selected').each(function () {
			let selectedNote = wpsn.getNoteFromDiv($(this));
			if (selectedNote) {
				selectedNotes.push(selectedNote);
			}
		});
		return selectedNotes;
	};

	wpsn.autoFitEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.autoResize);
	};

	wpsn.autoFitAllNotes = function () {
		let notesClone = wpsn.notes.slice(0);
		for (let i = 0; i < notesClone.length; i++) {
			if (!notesClone[i]) { continue; }
			let tempNote = notesClone[i];
			if (wpsn.inScope(tempNote)) {
				wpsn.autoResize(tempNote);
			}
		}
	};



	wpsn.commit = function (github) {
		/*
		let github = {
			token : '',
			username : '',
			repository : '',
			branch : '',
			path : '',
			content : '',
			message : ''
		};
		*/
		chrome.extension.sendMessage({ github: github });
	};

	wpsn.toggleNotes = function () {
		$('#wpsn-container').toggle();
		wpsn.updateCount();
	};
	wpsn.copyEffectiveNotes = async function (note) {
		let effectiveNotes = await wpsn.getEffectiveNotes(note);
		let notes = effectiveNotes.notes;
		chrome.extension.sendMessage({ copySelectedNotes: JSON.stringify(notes) });
	};
	wpsn.cutEffectiveNotes = async function (note) {
		let effectiveNotes = await wpsn.getEffectiveNotes(note);
		let notes = effectiveNotes.notes;
		chrome.extension.sendMessage({ copySelectedNotes: JSON.stringify(notes) });
		wpsn.deleteEffectiveNotes(notes);
	};
	wpsn.pasteCopiedNotes = function (pasteText, keepOriginalCoordinates) {
		if (pasteText != null) {
			try {
				let selectedNotes = JSON.parse(pasteText);
				for (let note of selectedNotes) { note.scope = []; }
				wpsn.cloneNotes(selectedNotes, true, keepOriginalCoordinates);
			} catch (err) { wpsn.error(err); }
		} else {
			chrome.extension.sendMessage({ pasteCopiedNotes: true, keepOriginalCoordinates });
		}
	};
	wpsn.removeSelectedNotes = function () {
		let selectedNotes = wpsn.getSelectedOrAllNotes();
		wpsn.removeNotes(selectedNotes);
	};

	wpsn.moveSelectedNotes = function (x, y) {
		let selectedNotes = wpsn.getSelectedOrAllNotes();
		for (let i = 0; i < selectedNotes.length; i++) {
			let selectedNote = selectedNotes[i];
			selectedNote.pos_x += x;
			selectedNote.pos_y += y;
			let noteDiv = wpsn.getNoteDiv(selectedNote);
			let pos = noteDiv.position();
			noteDiv.css({ left: (pos.left + x), top: (pos.top + y) });
			wpsn.save(selectedNote);
		}
	};
	wpsn.stopEditingEffectiveNotes = function (noteOrNotes) {
		return wpsn.actOnEffectiveNotes(noteOrNotes, wpsn.stopEditing);
	};
	wpsn.activeNote = function () {
		return wpsn.getNoteFromDiv($(document.activeElement).closest('.wpsn-sticky'));
	};

	wpsn.noActiveInput = function () {
		let $active = $(document.activeElement);
		return !$active.is('input') && !$active.is('textarea');
	};

	wpsn.keyPressed = function (shiftCtrlMetaAlt) {
		return $(document).data('wpsn.'+shiftCtrlMetaAlt+'Key');
	};

	$(document).ready(function () {
		wpsn.init();
		let $body = $('body');
		if (wpsn.enableSelection) {
			$(document).unbind('keydown.wpsn').bind('keydown.wpsn', function (e) {
				$(this).data('wpsn.shiftKey', e.shiftKey);
				$(this).data('wpsn.ctrlKey', e.ctrlKey);
				$(this).data('wpsn.metaKey', e.metaKey);
				$(this).data('wpsn.altKey', e.altKey);
			}).unbind('keyup.wpsn').bind('keyup.wpsn', function () {
				$(this).removeData('wpsn.shiftKey');
				$(this).removeData('wpsn.ctrlKey');
				$(this).removeData('wpsn.metaKey');
				$(this).removeData('wpsn.altKey');
			});

			$body.unbind('keydown.wpsn').bind('keydown.wpsn', function (e) {
				//[Do not use](taken){remaining} CTRL+SHIFT+[QWERTIOPDGJCBNMZ](ASFHLKX){UVY}, CTRL+[WERTUOPASDFGHJKLN](CXVYZ){BIMQ}
				if (e.keyCode == 13) {//Enter
					let $active = $(document.activeElement);
					if (!$active.is('textarea')) {
						let $download = $('.wpsn-download');
						if ($download.size() > 0) {
							$download.click();
						} else {
							$('.wpsn-ok').click();
						}
					}
				}
				if (e.keyCode == 27) { //ESC keycode
					$('.wpsn-cancel').click();
				}
				if (e.ctrlKey || e.metaKey) {//Ctrl || Mac left+right Cmd
					wpsn.initSelectable();
					if (e.keyCode == 70) {//F
						wpsn.destroySelectable();
					}
				}
				if (e.shiftKey && !e.ctrlKey) {
					let $note = $('.wpsn-sticky');
					if (!$note.resizable('option', 'disabled')) {
						$note.data('wpsn-resizable', true);
						$note.resizable('disable');
					}
					if (!$note.data('wpsn-snap')) {
						$note.draggable('option', 'snap', false);
						$note.data('wpsn-snap', true);
					}
					$('.wpsn-menu', $note).addClass('wpsn-menu-hide');
				}
				if (wpsn.hasSelection) {
					if (e.keyCode == 37) {//Left Arrow
						wpsn.moveSelectedNotes(-1, 0);
					}
					if (e.keyCode == 38) {//Up Arrow
						wpsn.moveSelectedNotes(0, -1);
					}
					if (e.keyCode == 39) {//Right Arrow
						wpsn.moveSelectedNotes(1, 0);
					}
					if (e.keyCode == 40) {//Down Arrow
						wpsn.moveSelectedNotes(0, 1);
					}
				}
				if (e.keyCode == 9) {//Tab
					let $active = $(document.activeElement);
					if ($active.is('.wpsn-frame textarea, .wpsn-textarea')) {
						e.preventDefault();
						let text = '\t';
						let txtarea = $active[0];
						let scrollPos = txtarea.scrollTop;
						let caretPos = txtarea.selectionStart;

						let front = (txtarea.value).substring(0, caretPos);
						let back = (txtarea.value).substring(txtarea.selectionEnd, txtarea.value.length);
						txtarea.value = front + text + back;
						caretPos = caretPos + text.length;
						txtarea.selectionStart = caretPos;
						txtarea.selectionEnd = caretPos;
						txtarea.focus();
						txtarea.scrollTop = scrollPos;
					}
				}
			}).unbind('keyup.wpsn').bind('keyup.wpsn', function (e) {
				wpsn.destroySelectable();
				if (e.shiftKey || e.key=="Shift") {//Shift
					let $note = $('.wpsn-sticky');
					if ($note.data('wpsn-resizable')) {
						$note.removeData('wpsn-resizable');
						$note.resizable('enable');
					}
					if ($note.data('wpsn-snap')) {
						$note.draggable('option', 'snap', true);
						$note.removeData('wpsn-snap');
					}
					$('.wpsn-menu', $note).removeClass('wpsn-menu-hide');
				}
			});
		}


		let $window = $(window);
		$body.unbind('DOMNodeRemoved.wpsn').bind('DOMNodeRemoved.wpsn', function (evt) {
			if (evt && evt.target && evt.target.id == 'wpsn-container') {
				setTimeout(wpsn.init, 1000);
			}
		});
		$window.unbind('hashchange.wpsn').bind('hashchange.wpsn', function () {
			wpsn.locationChange();
		});
		$window.unbind('pushstate.wpsn').bind('pushstate.wpsn', function () {
			wpsn.locationChange();
		});
		$window.unbind('spfdone.wpsn').bind('spfdone.wpsn', function () {
			wpsn.locationChange();
		});
	});

	wpsn.locationChange = function () {
		wpsn.load().then(function () {
			if (window.localStorage.getItem('wpsn_TOCCLick')) {
				location.href = location.hash;
				window.localStorage.removeItem('wpsn_TOCCLick');
			}
		});
	};


	wpsn.defaultMonetizationOption = 'affiliate';
	wpsn.affiliateIds = {
		'amazon.com': { parameter: 'tag', id: 'chrwebpagstin-20' },
		'amazon.fr': { parameter: 'tag', id: 'chrwebpagstin-20' }
	};
	wpsn.updateAffiliateId = async function () {
		await wpsn.getSettings();
		delete wpsn.settings.monetizationAffiliateWarning;
		wpsn.saveSettings();
		try {
			if (!window.sessionStorage['wpsn.adFree']) {
				let noteCount = wpsn.propertiesSize(wpsn.allNotes);
				if (wpsn.adEnabled && noteCount > 20 && ((!wpsn.settings.monetizationOption && wpsn.defaultMonetizationOption == 'affiliate') || wpsn.settings.monetizationOption == 'affiliate')) {
					for (let domain in wpsn.affiliateIds) {
						if (location.href.indexOf(domain) > -1 && !window.sessionStorage['wpsn.affiliate.' + domain]) {
							if (location.href.indexOf(wpsn.affiliateIds[domain].parameter + '=') == -1) {
								location.href = wpsn.updateQueryString(wpsn.affiliateIds[domain].parameter, wpsn.affiliateIds[domain].id, location.href);
							} else if (!wpsn.settings.monetizationAffiliateWarning) {
								//the following 2 lines are complex only because I haven't found a way to get the font to load prior to resize which causes the auto resize to resize incorrectly
								wpsn.deleteNote(await wpsn.createNote({ text: 'a' }));
								window.setTimeout(function () { wpsn.menu.aboutAd.leftClick.action(); }, 500);
							}
							window.sessionStorage['wpsn.affiliate.' + domain] = true;
							break;
						}
					}
				}
			}
		} catch (err) { wpsn.log(err); }
	};

	wpsn.generateAd = async function (note) {
		try {
			if (wpsn.adEnabled && !window.sessionStorage['wpsn.adFree'] && ((!wpsn.settings.monetizationOption && wpsn.defaultMonetizationOption == 'ad') || wpsn.settings.monetizationOption == 'ad')) {
				let noteCount = wpsn.propertiesSize(wpsn.allNotes);
				if (wpsn.adEnabled && !note.isPopup && !note.deleted && noteCount > 20 && noteCount % 5 == 0) {
					window.setTimeout(async function () {
						let ad = $('.wpsn-ad');
						if (ad.size() == 0) {
							let note = { position: 'right', dockable: true, background: '#fff', width: 400, height: 100, discard: true, class: 'wpsn-ad wpsn-amazon', };
							note.mode = wpsn.menu.rss.modes.rss.id;
							note.menu = ['aboutAd', 'remove'];
							note[wpsn.menu.rss.modes.rss.id] = { rss: 'https://rssfeeds.s3.amazonaws.com/goldbox' };
							await wpsn.createNote(note, function (feedItem) {
								if (feedItem && feedItem.link) {
									feedItem.link = wpsn.updateQueryString(wpsn.affiliateIds['amazon.com'].parameter, wpsn.affiliateIds['amazon.com'].id, feedItem.link);
								}
								return feedItem;
							});
							delete note.dockable;
							note.docked = true;
						} else {
							ad.mouseenter();
						}
					}, 0);
				}
			}
		} catch (err) { wpsn.error(err); }
	};

	wpsn.updateQueryString = function (key, value, url) {
		if (!url) url = window.location.href;
		let re = new RegExp('([?&])' + key + '=.*?(&|#|$)(.*)', 'gi'),
			hash;

		if (re.test(url)) {
			if (typeof value !== 'undefined' && value !== null)
				return url.replace(re, '$1' + key + '=' + value + '$2$3');
			else {
				hash = url.split('#');
				url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
				if (typeof hash[1] !== 'undefined' && hash[1] !== null)
					url += '#' + hash[1];
				return url;
			}
		}
		else {
			if (typeof value !== 'undefined' && value !== null) {
				let separator = url.indexOf('?') !== -1 ? '&' : '?';
				hash = url.split('#');
				url = hash[0] + separator + key + '=' + value;
				if (typeof hash[1] !== 'undefined' && hash[1] !== null)
					url += '#' + hash[1];
				return url;
			}
			else
				return url;
		}
	};

	wpsn.downloadSVG = function ($svg) {
		let html = $('<p>').append($svg.clone().attr('version', 1.1).attr('xmlns', 'http://www.w3.org/2000/svg')).html();
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');
		let image = new Image();
		image.src = 'data:image/svg+xml;base64,' + window.btoa(html);
		image.onload = function () {
			canvas.width = image.width;
			canvas.height = image.height;
			context.drawImage(image, 0, 0);
			let a = document.createElement('a');
			a.download = 'feed.png';
			a.href = canvas.toDataURL();
			a.click();
		};
	};

	/* Takes a screenshot and uses it in a callback as a canvas */
	wpsn.takeScreenshot = async function ($element, {waitTime=0,watermark=false,includeBorders=false,colorToTransparent}={}) {
		return new Promise(function (resolve) {
			if ($element && watermark) {
				$element.append($('<span/>').append('WebPageStickyNotes.com').addClass('wpsn-watermark'));
			}
			window.setTimeout(function () {
				chrome.extension.sendMessage({ screenshot: true }, function (response) {
					//$element = $($element.selector);//Weird bug where offset is lost
					let data = response.screenshotUrl;
					let img = new Image();
					img.src = data;
					img.onload = async function () {
						let imageAndCanvas = {
							image : img
						};
						if ($element) {
							$element.find('.wpsn-watermark').remove();
							imageAndCanvas = await wpsn.cropToElement(img, $element,{includeBorders,colorToTransparent});
						} else {
							imageAndCanvas.canvas = await wpsn.imageToCanvas(img, {colorToTransparent});
						}
						if (colorToTransparent) {
							imageAndCanvas.canvas = await wpsn.canvasColorToTransparent(imageAndCanvas.canvas, colorToTransparent);
						}
						resolve(imageAndCanvas);
					};
				});
			}, waitTime || 0);
		});
	};

	wpsn.parseColor = function (input) {
		let cvs, ctx;
		cvs = document.createElement('canvas');
		cvs.height = 1;
		cvs.width = 1;
		ctx = cvs.getContext('2d');
		ctx.fillStyle = input;
		ctx.fillRect(0, 0, 1, 1);
		let data = ctx.getImageData(0, 0, 1, 1).data;

		if (data) return { red: data[0], green: data[1], blue: data[2], alpha: data[3] };
		else throw new Error('Colour ' + input + ' could not be parsed.');
	};
	
	wpsn.weightedColor = function({r,g,b}={r:null,g:null,b:null}, weight, flip, {r:r2,g:g2,b:b2}={r:null,g:null,b:null}) {
		var w = (!weight || weight == -1) ? 0 : weight;
		w = flip ? (1-w) : w;
		w = (!weight || weight == -1) ? 0 : w;
		return !flip ?  
			`rgba(${r}, ${g}, ${b}, ${w})` :
			r2 ? 
				`rgba(${r2}, ${g2}, ${b2}, ${w})` :
				`rgba(${255-r}, ${255-g}, ${255-b}, ${w})` ;
	};

	wpsn.colorToBase64 = function (color, width, height, pngfy) {
		let rgb = wpsn.parseColor(color);
		let p = new PNGlib(1, 1, 256);
		p.buffer[0, 0] = p.color(rgb.red, rgb.green, rgb.blue);
		if (width && height) {
			p = new PNGlib(width, height, 256);
			for (let w = 0; w < width; w++) {
				for (let h = 0; h < height; h++) {
					p.buffer[w, h] = p.color(rgb.red, rgb.green, rgb.blue);
				}
			}
		}
		let base64 = p.getBase64();
		if (pngfy) {
			return 'data:image/png;base64,' + base64;
		}
		return base64;
	};

	wpsn.updateTabWithTextAndFaviconColorOrImage = function (text, colorOrHref) {
		if (colorOrHref) {
			let link = document.querySelector('link[rel*=\'icon\']') || document.createElement('link');
			link.type = 'image/x-icon';
			link.rel = 'shortcut icon';
			let colorBase64 = colorOrHref.indexOf("://")==-1?wpsn.colorToBase64(colorOrHref, 1, 1, true):null;
			link.href = colorBase64?colorBase64:colorOrHref;
			document.getElementsByTagName('head')[0].appendChild(link);
			let faviconHref = colorBase64?colorBase64:colorOrHref;
			//chrome.extension.sendMessage({ favicon: faviconHref });
		}
		if (text) {
			document.title = text;
		}
	};


	wpsn.getVisibleNotesWithinNote = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let tnotes = [];
		let before = true;
		for (let i = 0; i < wpsn.notes.length; i++) {
			if (!wpsn.notes[i]) { continue; }
			let tnote = wpsn.notes[i];
			let tnoteDiv = wpsn.getNoteDiv(tnote);
			if (tnote.id == note.id) { before = false; }
			if (wpsn.isObjOnObj(noteDiv.get(0), tnoteDiv.get(0), before)) {
				tnotes.push(tnote);
			}
		}
		return tnotes;
	};

	wpsn.padRight = function padding_right(s, c, n) {
		if (!s || !c || s.length >= n) {
			return s;
		}
		let max = (n - s.length) / c.length;
		for (let i = 0; i < max; i++) {
			s += c;
		}
		return s;
	};

	wpsn.isObjOnObj = function (a, b, bBeforeA) {
		if (!a || !b) { return false; }

		let al = a.offsetLeft;
		let ar = a.offsetLeft + a.offsetWidth;
		let bl = b.offsetLeft;
		let br = b.offsetLeft + b.offsetWidth;

		let at = a.offsetTop;
		let ab = a.offsetTop + a.offsetHeight;
		let bt = b.offsetTop;
		let bb = b.offsetTop + b.offsetHeight;

		let az = parseInt(a.style.zIndex);
		let bz = parseInt(b.style.zIndex);

		let ao = 1;
		try {
			let bg = a.querySelector('.wpsn-note').style.background;
			ao = parseFloat(bg.replace(/^.*,(.+)\)/, '$1'));
			if (isNaN(ao)) {
				if (bg == wpsn.transparent) {
					ao = 0;
				} else {
					ao = 1;
				}
			}
		} catch (err) { wpsn.error(err); }

		if (bl > ar || br < al) { return false; }//overlap not possible
		if (bt > ab || bb < at) { return false; }//overlap not possible
		if ((bz < az || (bz == az && bBeforeA)) && (isNaN(ao) || ao >= 1)) { return false; }//b is below a
		if (bl >= al && bl < ar) { return true; }
		if (br > al && br <= ar) { return true; }

		if (bt >= at && bt < ab) { return true; }
		if (bb > at && bb <= ab) { return true; }

		return false;
	};

	wpsn.getScrollBarWidth = function () {
		let inner = document.createElement('p');
		inner.style.width = '100%';
		inner.style.height = '200px';

		let outer = document.createElement('div');
		outer.style.position = 'absolute';
		outer.style.top = '0px';
		outer.style.left = '0px';
		outer.style.visibility = 'hidden';
		outer.style.width = '200px';
		outer.style.height = '150px';
		outer.style.overflow = 'hidden';
		outer.appendChild(inner);

		document.body.appendChild(outer);
		let w1 = inner.offsetWidth;
		outer.style.overflow = 'scroll';
		let w2 = inner.offsetWidth;
		if (w1 == w2) w2 = outer.clientWidth;

		document.body.removeChild(outer);

		return (w1 - w2);
	};

	wpsn.getCanvasData = function (canvas, width, height) {
		return canvas.getContext('2d').getImageData(0,0, width,height);
	};

	wpsn.getImageData = function (url, width, height) {
		return new Promise(function (resolve) {
			chrome.extension.sendMessage({
				'getImageData': true,
				'url': url,
				'width': width,
				'height': height
			}, function (imgData) {
				let canvas = document.createElement('canvas');
				let imageData = canvas.getContext('2d').createImageData(width, height);
				for (let key in imgData.data) {
					if (!imgData.data.hasOwnProperty(key)) continue;
					imageData.data[key] = imgData.data[key];
				}
				resolve(imageData);
			});
		});
	};

	wpsn.getUrlData = function (url, interval) {
		return new Promise(function (resolve) {
			chrome.extension.sendMessage({
				'getUrlData': true,
				'url': url,
				'interval': interval
			}, function (data) {
				resolve(data);
			});
		});
	};

	wpsn.imageToCanvas = async function(image, width) {
		let canvas = document.createElement('canvas');
		canvas.width = width || image.width;
		canvas.height = width ? width*image.height/image.width : image.height;
		let url = image.src;
		let ctx = canvas.getContext('2d');
		let imgData = await wpsn.getImageData(url, canvas.width, canvas.height);
		ctx.putImageData(imgData, 0, 0);
		return canvas;
	};
	
	wpsn.imageToBase64 = function ($img, imageTracerOptions) {
		return new Promise(function (resolve) {
			let canvas = document.createElement('canvas');
			canvas.width = $img.width();
			canvas.height = $img.height();

			let ctx = canvas.getContext('2d');

			//let url = $img.data('wpsn_original_src') || $img.attr('src');
			let url = $img.data('wpsn_original_src') || $img.attr('src');
			if (imageTracerOptions && imageTracerOptions.uselatesturl) {
				url = $img.attr('src');
			}
			//$img.data('wpsn_original_src', url);
			wpsn.getImageData(url, canvas.width, canvas.height).then(function (imgData) {
				ctx.putImageData(imgData, 0, 0);
				ctx.filter = $img.css('filter');
				//ctx.drawImage($img.get(0),0,0);

				let newUrl = canvas.toDataURL('image/png', 1.0);
				if (imageTracerOptions) {
					let imgd = ImageTracer.getImgdata(canvas);
					let svg = ImageTracer.imagedataToSVG(imgd, imageTracerOptions);
					newUrl = 'data:image/svg+xml;base64,' + window.btoa(svg);
				}
				resolve(newUrl);
			});
		});
	};

	wpsn.canvasColorToTransparent = async function (canvas, options = { color: '#ffffff', threshold: 0 }) {
		let ctx = canvas.getContext('2d');
		let imgData = await wpsn.getCanvasData(canvas, canvas.width, canvas.height);
		imgData = wpsn.colorToTransparent(imgData, options);
		ctx.putImageData(imgData, 0, 0);
		return canvas;
	};

	wpsn.imageColorToTransparent = async function ($img, options = { color: '#ffffff', threshold: 0 }) {
		let canvas = document.createElement('canvas');
		canvas.width = $img.width();
		canvas.height = $img.height();

		let ctx = canvas.getContext('2d');

		let url = $img.data('wpsn_original_src') || $img.attr('src');
		$img.data('wpsn_original_src', url);
		let imgData = await wpsn.getImageData(url, canvas.width, canvas.height);
		imgData = wpsn.colorToTransparent(imgData, options);
		ctx.putImageData(imgData, 0, 0);

		$img.off('load');
		$img.data('wpsn_original_src', $img.data('wpsn_original_src') || $img.attr('src'));
		$img.attr('src', canvas.toDataURL('image/png', 1.0));
		return $img.attr('src');
	};

	wpsn.colorToTransparent = function (imageData, options) {
		let rgb = wpsn.parseColor(options.color);
		let red = rgb.red;
		let green = rgb.green;
		let blue = rgb.blue;
		let p = imageData.data;
		let colors = {};
		let mostColor;
		if (red != null && green != null && blue != null) {
			mostColor = {
				r: red,
				g: green,
				b: blue
			};
		} else {
			for (let i = 0; i < p.length; i += 4) {
				let r = p[i];
				let g = p[i + 1];
				let b = p[i + 2];
				//let a = p[i + 3];
				if (
					(red != null && red != r)
					|| (green != null && green != g)
					|| (blue != null && blue != b)
				) { break; }
				let key = r + '.' + g + '.' + b;
				colors[key] = colors[key] || {};
				colors[key].r = r;
				colors[key].g = g;
				colors[key].b = b;
				colors[key].count = colors[key].count || 0;
				colors[key].count++;
			}
			for (let key in colors) {
				if (!colors.hasOwnProperty(key)) continue;
				let color = colors[key];
				if (!mostColor || mostColor.count < color.count) {
					mostColor = color;
				}
			}
		}
		if (!mostColor) {
			return imageData;
		}
		for (let i = 0; i < p.length; i += 4) {
			for (let v = 0; v < (options.threshold || 0); v++) {
				if (
					p[i] >= mostColor.r - v
					&& p[i] <= mostColor.r + v
					&& p[i + 1] >= mostColor.g - v
					&& p[i + 1] <= mostColor.g + v
					&& p[i + 2] >= mostColor.b - v
					&& p[i + 2] <= mostColor.b + v
				) {
					p[i + 3] = v;
					break;
				}
			}
		}
		return imageData;
	};

	wpsn.cropToElement = function (image, $element, {includeBorders=false}={}) {
		return new Promise(function(resolve){
			let width = $element.width();
			let height = $element.height();
			let prevTop = $element.offset().top - window.scrollY;
			let prevLeft = $element.offset().left - window.scrollX;
			let borderWidth = includeBorders ? 1 : 0;
			let extraTrim = includeBorders ? 0 : 1;

			let canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			
			let ctx = canvas.getContext('2d');
		
			let srcX = (prevLeft - (1 * borderWidth) + (1 * extraTrim));
			let srcY = (prevTop - (1 * borderWidth) + (1 * extraTrim));
			let srcW = (width + (2 * borderWidth) - (1 * extraTrim));
			let srcH = (height + (2 * borderWidth) - (1 * extraTrim));

			let dstX = 0;
			let dstY = 0;
			let dstW = canvas.width;
			let dstH = canvas.height;

			let dpr = window.devicePixelRatio || 1;
			ctx.imageSmoothingEnabled = false;

			if (dpr != 1) {
				srcX *= dpr; srcY *= dpr; srcW *= dpr; srcH *= dpr;

				var oc = document.createElement('canvas'),
				octx = oc.getContext('2d');
		
				oc.width = canvas.width * dpr;
				oc.height = canvas.height * dpr;

				octx.drawImage(image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
			
				ctx.drawImage(oc, 0, 0, oc.width, oc.height);

				if (true){
					ctx.imageSmoothingEnabled = true;
					dstX *= dpr; dstY *= dpr; dstW *= dpr; dstH *= dpr;
					ctx.scale(1/dpr,1/dpr);
					ctx.drawImage(image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
				}
			} else {
				ctx.drawImage(image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
			}

			let img = new Image();
			img.onload = function () {
				resolve({
					image : img,
					canvas : canvas
				});
			};
			img.src = canvas.toDataURL('image/png', 1.0);
		});
	};

	wpsn.shorten = function (string, leftLength, rightLength) {
		leftLength = leftLength || string.length;
		rightLength = rightLength || 0;
		if (string && string.length > (leftLength + rightLength)) {
			return string.substring(0, leftLength) + ' ... ' + string.substring(string.length - rightLength, string.length);
		}
		return string;
	};
	wpsn.uploaded = function (response) {
		let $uploaded = $('.wpsn-uploaded');
		let html = '';
		if (response) {
			if (response.service == 'imgur') {
				let id = response.data.id;
				let imgurLink = 'http://imgur.com/' + id;
				window.open(imgurLink, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=50,width=' + 1200 + ',height=' + $(window).height());
				//html = '<a href="'+link+'">'+link+'</a><br/><a href="'+imgurLink+'">'+imgurLink+'</a>';
			}
		}
		$uploaded.html(html);
		let $btn = $('.wpsn-upload').removeClass('disabled');
		$btn.find('.wpsn-loading').hide();
	};

	wpsn.processScreenshot = function (img, note, {colorToTransparent, download, downloadHTML, noSnapshot}={}) {
		return new Promise(function (resolve, reject) {
			window.setTimeout(function () {
				if (note && !colorToTransparent) {
					try {
						img.src = steg.encode(JSON.stringify(wpsn.getVisibleNotesWithinNote(note)), img);
					} catch (err) { wpsn.error(err); }
				}
				if (download) {
					let form = {
						filename: '',
						html: img.src
					};
					wpsn.simplePrompt(form, {
						popup: {
							isNotPopup: true,
							load: function (note) {
								wpsn.getNoteDiv(note).find('.wpsn-media-filter').addClass('wpsn-media-filter-show');
								$('.wpsn-upload').bind('click', function () {
									let $this = $(this);
									$this.addClass('disabled');
									$this.find('.wpsn-loading').show();
									chrome.extension.sendMessage({ upload: $this.data() });
									return false;
								});
							}
						},
						form: function () {
							return '<div class="panel panel-default"><div class="panel-heading">Preview Snapshot:</div><div class="panel-body" style="text-align:center;backgroundz:blue"><img src="' + img.src + '" class="wpsn-no-draggable wpsn-base64 wpsn-media wpsn-media-preview" style="height:auto;width:auto;max-width-BAK:1000px;"/></div></div>' +
								'<button style="width:100%" class="btn btn-primary wpsn-upload" data-image="' + img.src + '" data-service="imgur">Upload Snapshot To Imgur <img width="10" src="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/loader.svg" class="wpsn-loading" style="display:none"/></button><div class="wpsn-uploaded"></div><br/>' +
								'<div class="panel panel-default"><div class="panel-heading">Download Snapshot As:</div><div class="panel-body"><input name="filename" class="form-control" placeholder="webpagestickynotes.png"/><input type="hidden" name="html" value=""/></div></div>';
						},
						callback: function (form) {
							form.filename = form.filename || 'webpagestickynotes';
							if (form.filename.indexOf('.png') < 0) {
								form.filename += '.png';
							}
							
							let $media = $('.wpsn-media-preview');
							wpsn.imageToBase64($media).then(function (url) {
								chrome.extension.sendMessage({
									download: {
										url: url,
										filename: form.filename
									}
								});
							});
							resolve(note);
						}
					}).then(function () { resolve(note); }).catch(function (err) { reject(err); });
				}
				if (downloadHTML) {
					wpsn.downloadHTML(note, (!noSnapshot ? img.src : null)).then(function (note) { resolve(note); });
				}
			}, 0);
		});
	};
	wpsn.getNoteHTML = function (note) {
		let noteDiv = wpsn.getNoteDiv(note);
		let noteFrame = $('.wpsn-frame', noteDiv);
		return noteFrame.get(0).innerHTML;
	};

	wpsn.downloadHTML = function (note, base64PNG) {
		return new Promise(function (resolve) {
			let noteDiv = wpsn.getNoteDiv(note);
			let noteFrame = $('.wpsn-frame', noteDiv);

			let html = 'data:text/html,' + escape('<style>.wpsn-watermark {position: fixed;bottom:0px;right: 1px;font-family: Verdana;font-size: 12px;padding-right: 0px;color: rgb(255, 255, 255);text-shadow: rgb(102, 102, 102) -1px -1px 0px, rgb(102, 102, 102) 1px -1px 0px, rgb(102, 102, 102) -1px 1px 0px, rgb(102, 102, 102) 1px 1px 0px;z-index: 9999;}</style><a href="http://www.webpagestickynotes.com"><div class="wpsn-watermark">WebPageStickyNotes.com</div></a>' + noteFrame.get(0).innerHTML + (base64PNG ? '<img id="wpsn-snapshot" style="width:0;height:0" src="' + base64PNG + '"/>' : ''));
			let form = {
				filename: '',
				html: html
			};
			wpsn.simplePrompt(form, {
				popup: {}, form: function () { return '<div class="panel panel-default"><div class="panel-heading">Save As:</div><div class="panel-body"><input name="filename" class="form-control" placeholder="webpagestickynotes.html"/><input type="hidden" name="html" value=""/><br/>Warning: this will not maintain 100% integrity of the look and feel of the note since stylesheets and external files are not downloaded along with the note.</div></div>'; },
				callback: function (form) {
					form.filename = form.filename || 'webpagestickynotes';
					if (form.filename.indexOf('.html') < 0) {
						form.filename += '.html';
					}
					chrome.extension.sendMessage({
						download: {
							url: form.html,
							filename: form.filename
						}
					});
					resolve(note);
				}
			});
		});
	};

	wpsn.copyToClipboard = function (content, mimeType) {
		return new Promise(function (resolve) {
			let $document = $(document);
			$document.on('copy.wpsn', function (event) {
				event.originalEvent.clipboardData.setData(mimeType || 'Text', content);
				event.preventDefault();
				$document.off('copy.wpsn');
				resolve(content);
			});
			document.execCommand('Copy', false, null);
		});
	};

	wpsn.saveScreenshot = async function (image, $element, note) {
		let img = await wpsn.cropToElement(image, $element);
		let props = note[wpsn.menu.media.modes.media.id] || {};
		props.media = wpsn.htmlEncode(img);
		note[wpsn.menu.media.modes.media.id] = props;
		note.mode = wpsn.menu.media.modes.media.id;
		await wpsn.refreshNote(note);
		return note;
	};

	wpsn.saveNoteStateForUndo = function (noteOrNotes) {
		let notes = wpsn.toNoteArray(noteOrNotes);
		wpsn.undoObj = wpsn.undoObj || { index: -1, states: [] };
		let notesJSON = JSON.stringify(notes);
		if (notesJSON != wpsn.undoObj.states[wpsn.undoObj.index]) {
			wpsn.undoObj.states.splice(wpsn.undoObj.index + 1, 0, notesJSON);
			wpsn.undoObj.index++;
			wpsn.undoObj.states.length = wpsn.undoObj.index + 1;//clear all after index
			if (wpsn.undoObj.states.length > 100) {//runaway count
				wpsn.undoObj.states.shift();
				wpsn.undoObj.index--;
			}
		}
	};

	wpsn.undo = async function () {
		wpsn.undoObj = wpsn.undoObj || { index: -1, states: [] };
		if (wpsn.undoObj.index > -1 && wpsn.undoObj.states.length > wpsn.undoObj.index) {
			try {
				let tnotes = JSON.parse(wpsn.undoObj.states[wpsn.undoObj.index]);
				let tnotes2 = [];
				for (let tnote of tnotes) {
					let note = wpsn.getNote(tnote.id) || { id: tnote.id, deleted: true };
					tnotes2.push(note);
					await wpsn.refreshNote(tnote);
				}
				if (wpsn.undoObj.states.length == wpsn.undoObj.index + 1) {
					wpsn.saveNoteStateForUndo(tnotes2);
					wpsn.undoObj.index--;
				}
				wpsn.undoObj.index--;
			} catch (err) { wpsn.error(err); }
		}
	};

	wpsn.redo = async function () {
		wpsn.undoObj = wpsn.undoObj || { index: -1, states: [] };
		if ((wpsn.undoObj.index + 2) > -1 && wpsn.undoObj.states.length > (wpsn.undoObj.index + 2)) {
			try {
				wpsn.undoObj.index++;
				let tnotes = JSON.parse(wpsn.undoObj.states[(wpsn.undoObj.index + 1)]);
				for (let tnote of tnotes) {
					let note = wpsn.getNote(tnote.id);
					if (tnote.deleted) {
						wpsn.deleteNote(note);
					} else {
						await wpsn.refreshNote(tnote);
					}
				}
			} catch (err) { wpsn.error(err); }
		}
	};

	wpsn.delay = (function () {
		let timer = 0;
		return function (callback, ms) {
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		};
	})();

	wpsn.capitalize = function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	wpsn.format = function (format) {
		let args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] != 'undefined'
				? args[number]
				: match;
		});
	};

	wpsn.log = function (msg,suppress) {
		if(!suppress && msg){ 
			//eslint-disable-next-line no-console
			console.log(msg); 
		}
	};

	wpsn.error = function (msg,suppress) {
		if(!suppress && msg){ /*eslint no-console: ["error", { allow: ["error"] }] */ console.error(msg); }
	};

	wpsn.clearProperties = function (note) {
		for (let prop in note) { if (note.hasOwnProperty(prop)) { delete note[prop]; } }
	};

	$.fn.followTo = function () {
		let $this = this, $window = $(window);
		let followToFunc = function () {
			$this.removeClass('wpsn-popup-buttons-fixed');
			if ($window.scrollTop() + $window.height() > $this.offset().top) {
				$this.removeClass('wpsn-popup-buttons-fixed');
			} else {
				$this.removeClass('wpsn-popup-buttons-fixed').css('width', 'auto').css('width', $this.width()).addClass('wpsn-popup-buttons-fixed');
			}
		};
		let $sticky = $this.closest('.wpsn-sticky');
		$sticky.data('dragFunction', followToFunc);
		$sticky.find('.wpsn-scrollbar').scroll(followToFunc).scroll();
	};
})(jQuery, chrome);

(function (history, $) {
	let pushState = history.pushState;
	history.pushState = function (state) {
		let evt = $.Event('pushstate');
		evt.state = state;
		$(window).trigger(evt);
		// ... whatever else you want to do
		// maybe call onhashchange e.handler
		return pushState.apply(history, arguments);
	};
})(window.history, jQuery);


/*
	JQuery UI > Draggable > Snap > Outer > Position > Bug fix (added +-1 at the end of the following lines)
	if (ts) {
		ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top-1;
	}
	if (bs) {
		ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top+1;
	}
	if (ls) {
		ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left-1;
	}
	if (rs) {
		ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left+1;
	}
*/

