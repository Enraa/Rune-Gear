import React from "react";
import styled from "styled-components"
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import "./css/App.css";
import "./css/gearSec.css";

// Module Imports for each of the boxes
import GearBox from "./gearBox";
import GearMouseover from "./gearMouseover";
import GearBoxStyle from "./gearBoxStyle";
import GearBoxPrayer from "./gearBoxPrayer";
import GearBoxPotions from "./gearBoxPotions";
import GearBoxSpell from "./gearBoxSpell";

// One of the Gear Back icons. I'm not sure why this is used yet. 
import gearbackringi from "./tex/gearbackring.png";

// Each of the attack style icons
import staticonstab from "./tex/type-stab.png";
import staticonslash from "./tex/type-slash.png";
import staticoncrush from "./tex/type-crush.png";
import staticonmagic from "./tex/type-magic.png";
import staticonranged from "./tex/type-ranged.png";
import staticonstrmelee from "./tex/type-strmelee.png";
import staticonstrmagic from "./tex/type-strmagic.png";
import staticonstrranged from "./tex/type-strranged.png";
import staticonstrprayer from "./tex/type-strprayer.png";

// Attack Speed Icon
import attackspeedicon from "./tex/AttackSpeed.png";

// Imports for the gear icon backgrounds
import gearbackemptyi from "./tex/gearbackempty.png";
import geartransp from "./tex/gearempty.png";

// Unequip and Wiki link icons
import inventoryicon from "./tex/Inventory.png";
import wikiicon from "./tex/Wiki.png";

// Select popup background
import gearselectbackground from "./tex/Gearselectbackground.png";
import bordertexcorner from "./tex/bordertexcorner.png";
import gearsearchbackground from "./tex/gearsearchbackground.png";

const jsonvars = require(`./jsonvars.json`);
const fs = require("fs");

const overStyle = {
	position: "relative",
	height: "100%",
	width: "100%"
};
const hiddenStyle = {
	position: "relative",
	top: "0px",
	left: "0px",
	height: "1px",
	width: "1px"
};
const popinStyle = {
	transition: "all 1000ms ease-in"
};

// List gear types to be used
const gearslots = [
	"head",
	"amulet",
	"ammo",
	"cape",
	"body",
	"legs",
	"feet",
	"ring",
	"gloves",
	"weapon",
	"shield"
];

class GearSection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false, // Set to true after the component is mounted. The code seems to crash without it. 
			value: "", // Unused, untested for removal
			imageurl: // Unused, untested for removal
				"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
			timer: 0.0, // Unused, untested for removal
			scale: 150, // Unused, untested for removal
			combatstyle: "unarmed", // The current weapon type equipped
			mouseOverActive: false, // Currently unused, but this defines when to run our inefficient mouseover functions
			mouseOverTransition: false, // Currently unused, but this defines when to run our inefficient mouseover functions
			mouseOverSlot: "head", // Currently unused
			mouseOverSlotFadedIn: 0, // Currently unused
			mouseOverSlotScaledIn: 0.7, // Currently unused
			gearPopoutX: 0, // This is the X coordinate in % of the selection popup. 
			gearPopoutY: 0, // This is the Y coordinate in % of the selection popup. 
			nextItem: { // An array of items. When an item is chosen from the selection popup, this is set for that item. 
				head: null,
				ammo: null,
				amulet: null,
				cape: null,
				weapon: null,
				body: null,
				shield: null,
				legs: null,
				gloves: null,
				feet: null,
				ring: null
			},
			// These are all of the item backgrounds. These are set to gearbackemptyi when there is an item in that slot. 
			slot_head_item: gearbackringi,
			slot_ammo_item: gearbackringi,
			slot_amulet_item: gearbackringi,
			slot_cape_item: gearbackringi,
			slot_weapon_item: gearbackringi,
			slot_body_item: gearbackringi,
			slot_shield_item: gearbackringi,
			slot_legs_item: gearbackringi,
			slot_gloves_item: gearbackringi,
			slot_feet_item: gearbackringi,
			slot_ring_item: gearbackringi,
			// Current prayer modifications. These are pulled from GearBoxPrayer
			prayercurrenttotalmod: {
				attack: "1.0",
				strength: "1.0",
				defense: "1.0",
				ranged: "1.0",
				rangeddamage: "1.0",
				magic: "1.0"
			},
			// Current potion modifications. These are pulled from GearBoxPotions
			potioncurrenttotalmod: {
				attack: {
					percentage: "1.0",
					level: "0"
				},
				strength: {
					percentage: "1.0",
					level: "0"
				},
				defense: {
					percentage: "1.0",
					level: "0"
				},
				magic: {
					percentage: "1.0",
					level: "0"
				},
				ranged: {
					percentage: "1.0",
					level: "0"
				}
			},
			popupActive: null, // Set when an item slot is clicked. Anything that *isn't* null will show the popup. It is set to the type of item 
			searchitems: [], // Array of items that match the search string.
			twohanded: false, // If this is true, forces the shield slot to "null"
			currinspectingitem: null, // Unused, untested for removal
			checked: true // Unused, untested for removal
		};

		// Creates the refs and maps them to a global this variable. These are attached to each of the gearboxes to read their states. 
		// This isn't necessarily React-y, however keeping 200 state variables here or in App.js seems silly to me. 
		var reflist = new Object();
		gearslots.forEach(function (type) {
			reflist[type] = React.createRef();
		});
		reflist["prayer"] = React.createRef();
		reflist["style"] = React.createRef();
		reflist["potion"] = React.createRef();
		reflist["spell"] = React.createRef();
		reflist["search"] = React.createRef();
		this.myRefs = reflist;

		// All of the .bind(this) functions
		this.renderGearSquare = this.renderGearSquare.bind(this);
		this.boxPositionStyle = this.boxPositionStyle.bind(this);
		this.gearUpdate = this.gearUpdate.bind(this);
		this.renderGearPopout = this.renderGearPopout.bind(this);
		this.changeSlotState = this.changeSlotState.bind(this);
		this.getItemBackground = this.getItemBackground.bind(this);
		this.renderGearPopout = this.renderGearPopout.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
		this.unequipShield = this.unequipShield.bind(this);
		this.prayerUpdate = this.prayerUpdate.bind(this);
		this.potionUpdate = this.potionUpdate.bind(this);
		this.styleUpdate = this.styleUpdate.bind(this);
		this.ClickMenuClear = this.ClickMenuClear.bind(this);
		this.popupActiveMethod = this.popupActiveMethod.bind(this);
		this.renderGearSelection = this.renderGearSelection.bind(this);
		this.renderSearchBar = this.renderSearchBar.bind(this);
		this.renderSearchResults = this.renderSearchResults.bind(this);
	}

	// Called from popupActiveMethod. This will set the initial X and Y positions of the popup and to make it active. 
	// Each frame of the popup will adjust it to ensure it does not flow off the screen. 
	handleClick(type) {
		var thegearbox = this.myRefs[type].current.state;
		var xpos = thegearbox.ZZ_positionX;
		var ypos = thegearbox.ZZ_positionY;
		var self = this;
		if (this.state.popupActive != null) {
			setTimeout(function (el) {
				self.setState({
					gearPopoutX: xpos,
					gearPopoutY: ypos,
					searchitems: [],
					popupActive: type
				})
			}, 100)
		}
		else {
			self.setState({
				gearPopoutX: xpos,
				gearPopoutY: ypos,
				searchitems: [],
				popupActive: type
			})
		}
	}

	// Called when a gear slot is clicked. This is arguably a very unnecessary function as all it does is calls handleClick above. 
	popupActiveMethod(type) {
		console.log("THIS IS THE THING");
		console.log(type.target.id.slice(12));
		this.handleClick(type.target.id.slice(12))
	}

	// Unused, but this would be implemented to set an override on a specific piece of gear. 
	handleCheckboxChange(e) {
		var currentchecked = this.state.checked;
		console.log(!currentchecked);
		this.myRefs[this.state.popupActive].current.setOverride(!currentchecked);
		this.setState({
			checked: e.target.checked
		})
	}

	// Sets the shield state if a weapon is equipped. 
	unequipShield(bool) {
		this.setState({
			twohanded: bool
		})
	}

	// Updates the gear stat totals which will be passed up to App.js. 
	gearUpdate() {
		// Inititalizes every stat. Each level to 1, each bonus to 0. 
		var req_attack = 1;
		var req_strength = 1;
		var req_defence = 1;
		var req_ranged = 1;
		var req_magic = 1;
		var req_prayer = 1;
		var req_hitpoints = 1;
		var atk_stab = 0;
		var atk_slash = 0;
		var atk_crush = 0;
		var atk_magic = 0;
		var atk_ranged = 0;
		var def_stab = 0;
		var def_slash = 0;
		var def_crush = 0;
		var def_magic = 0;
		var def_ranged = 0;
		var str_melee = 0;
		var str_ranged = 0;
		var str_magic = 0;
		var str_prayer = 0;
		var seteffect = [];
		var self = this;
		// Iterates over each equipped item. 
		gearslots.forEach(function (type) {
			// If the item's stat exceeds our current required stat, it will use the higher one. 
			// This will set the lower bound for the level selection on CalcSec. 
			// For example, an Abyssal Whip will make it such that we cannot have below 70 attack.
			if (self.myRefs[type].current.state.req_attack > req_attack) {
				req_attack = self.myRefs[type].current.state.req_attack;
			}
			if (self.myRefs[type].current.state.req_strength > req_strength) {
				req_strength = self.myRefs[type].current.state.req_strength;
			}
			if (self.myRefs[type].current.state.req_defence > req_defence) {
				req_defence = self.myRefs[type].current.state.req_defence;
			}
			if (self.myRefs[type].current.state.req_ranged > req_ranged) {
				req_ranged = self.myRefs[type].current.state.req_ranged;
			}
			if (self.myRefs[type].current.state.req_magic > req_magic) {
				req_magic = self.myRefs[type].current.state.req_magic;
			}
			if (self.myRefs[type].current.state.req_prayer > req_prayer) {
				req_prayer = self.myRefs[type].current.state.req_prayer;
			}
			if (self.myRefs[type].current.state.req_hitpoints > req_hitpoints) {
				req_hitpoints = self.myRefs[type].current.state.req_hitpoints;
			}
			// Adds each equipped item's stat modification sequentially to get the totals
			atk_stab = atk_stab + self.myRefs[type].current.state.atk_stab;
			atk_slash = atk_slash + self.myRefs[type].current.state.atk_slash;
			atk_crush = atk_crush + self.myRefs[type].current.state.atk_crush;
			atk_magic = atk_magic + self.myRefs[type].current.state.atk_magic;
			atk_ranged = atk_ranged + self.myRefs[type].current.state.atk_ranged;
			def_stab = def_stab + self.myRefs[type].current.state.def_stab;
			def_slash = def_slash + self.myRefs[type].current.state.def_slash;
			def_crush = def_crush + self.myRefs[type].current.state.def_crush;
			def_magic = def_magic + self.myRefs[type].current.state.def_magic;
			def_ranged = def_ranged + self.myRefs[type].current.state.def_ranged;
			str_melee = str_melee + self.myRefs[type].current.state.str_melee;
			str_ranged = str_ranged + self.myRefs[type].current.state.str_ranged;
			str_magic = str_magic + self.myRefs[type].current.state.str_magic;
			str_prayer = str_prayer + self.myRefs[type].current.state.str_prayer;
			// Adds the item's special effect to the "seteffect" array. 
			try {
				seteffect.push(self.myRefs[type].current.state.seteffect);
			} catch (err) {
				console.log(err);
			}
		});
		// Reads the equipped weapon to determine the attack speed and type of weapon we have equipped.
		var combatstyle = this.myRefs["weapon"].current.state.combatstyle;
		var speed = this.myRefs["weapon"].current.state.speed;
		// Declares a new array of all of our totals
		var collectthis = {
			req_attack: req_attack,
			req_strength: req_strength,
			req_defence: req_defence,
			req_ranged: req_ranged,
			req_magic: req_magic,
			req_prayer: req_prayer,
			req_hitpoints: req_hitpoints,
			atk_stab: atk_stab,
			atk_slash: atk_slash,
			atk_crush: atk_crush,
			atk_magic: atk_magic,
			atk_ranged: atk_ranged,
			def_stab: def_stab,
			def_slash: def_slash,
			def_crush: def_crush,
			def_magic: def_magic,
			def_ranged: def_ranged,
			str_melee: str_melee,
			str_ranged: str_ranged,
			str_magic: str_magic,
			str_prayer: str_prayer,
			seteffect: seteffect,
			combatstyle: combatstyle,
			speed: speed
		};
		// Sets our weapon style. 
		this.setState({
			combatstyle: this.myRefs["weapon"].current.state.combatstyle
		});
		// Pushes this up to App.js. 
		this.props.gearUpdate(collectthis);
	}

	// Called from GearBoxPrayer. This will get the current prayer modifications and then push up to App.js. 
	prayerUpdate() {
		var self = this;
		var iconsprayer = self.myRefs["prayer"].current.state.currenttotalmod;
		this.setState({
			prayercurrenttotalmod: iconsprayer
		});
		// Pushes this up to App.js. 
		this.props.prayerUpdate(iconsprayer);
	}

	// Called from GearBoxPotion. This will get the current Potion modifications and then push up to App.js. 
	potionUpdate() {
		var self = this;
		console.log(this.myRefs["potion"].current.state.currentpotionmod);
		var iconspotion = self.myRefs["potion"].current.state.currentpotionmod;
		this.setState({
			potioncurrenttotalmod: iconspotion
		});
		// Pushes this up to App.js. 
		this.props.potionUpdate(iconspotion);
	}

	// Called from GearBoxStyle. This will get the current Style and then push up to App.js. 
	styleUpdate() {
		var self = this;
		console.log(this.myRefs["style"].current.state.currstyle);
		var currstyle = self.myRefs["style"].current.state.currstyle;
		var currdamage = self.myRefs["style"].current.state.currdamage;
		this.setState({
			stylecurrentstyle: currstyle,
			stylecurrentdamage: currdamage
		});
		// Pushes this up to App.js. 
		this.props.styleUpdate(currstyle, currdamage);
	}

	// Used for each stat, with it's icon and bonus. 
	// element = the stat number
	// style = the type of damage
	renderItemStyleStrBonusText(element, style) {
		var elementint = parseInt(element); // Ensures we have an integer. This seems to mess up down the function otherwise
		var result = element;
		var styleBonus;
		var styleText;
		var styleicon;
		var percenttag = ""; // Used only for Magic Damage
		if (style == "stab") {
			styleicon = {
				backgroundImage: `url(${staticonstab})`
			};
			styleText = "Stab";
		}
		if (style == "slash") {
			styleicon = {
				backgroundImage: `url(${staticonslash})`
			};
			styleText = "Slash";
		}
		if (style == "crush") {
			styleicon = {
				backgroundImage: `url(${staticoncrush})`
			};
			styleText = "Crush";
		}
		if (style == "magic") {
			styleicon = {
				backgroundImage: `url(${staticonmagic})`
			};
			styleText = "Magic";
		}
		if (style == "ranged") {
			styleicon = {
				backgroundImage: `url(${staticonranged})`
			};
			styleText = "Ranged";
		}
		if (style == "str_melee") {
			styleicon = {
				backgroundImage: `url(${staticonstrmelee})`
			};
			styleText = "Melee Strength";
		}
		if (style == "str_ranged") {
			styleicon = {
				backgroundImage: `url(${staticonstrranged})`
			};
			styleText = "Ranged Strength";
		}
		if (style == "str_magic") {
			styleicon = {
				backgroundImage: `url(${staticonstrmagic})`
			};
			percenttag = "%";
			styleText = "Magic Damage";
		}
		if (style == "str_prayer") {
			styleicon = {
				backgroundImage: `url(${staticonstrprayer})`
			};
			styleText = "Prayer Bonus";
		}
		if (style == "speed") {
			styleicon = {
				backgroundImage: `url(${attackspeedicon})`
			};
			styleText = "Attack Speed";
		}
		// This is LESS than 0, indicating a negative value
		if (0 > elementint) {
			styleBonus = {
				color: "red",
				gridColumn: "2",
				textAlign: "center"
			};
			// This is exactly 0, let's gray the returned number
		} else if (elementint == 0) {
			styleBonus = {
				color: "gray",
				gridColumn: "2",
				textAlign: "center"
			};
			// This is a positive number, so let's just give this a normal white color
		} else {
			styleBonus = {
				color: "white",
				gridColumn: "2",
				textAlign: "center"
			};
			result = result;
		}
		return (
			<div className='CalcBonusTotalsBonusSectText'>
				<div className='CalcBonusTotalsBonusIcon' style={styleicon}>
					<span class='BonusResultTooltipText'>{styleText}</span>
				</div>
				<div style={styleBonus}>{result + percenttag}</div>
			</div>
		);
	}

	// Returns a styles sheet given a gearbox slot. This will have a background from gearback along with some shading for the transparent sections to look good with the box shadow. 
	// geartype is the slot we're rendering this for.
	boxPositionStyle(geartype, gearback) {
		var jsonquery = require(`./gear/${geartype}/default.json`); // Grabs the default json for this type of item
		return {
			top: jsonquery.ZZ_positionY + "%",
			left: jsonquery.ZZ_positionX + "%",
			backgroundImage: `url(${gearback}), linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.8))`
		};
	}

	// Returns a styles sheet given a position x and y. This will have a background from gearback along with some shading for the transparent sections to look good with the box shadow. 
	boxPositionStyleStyles(posX, posY, gearback) {
		return {
			top: posY + "%",
			left: posX + "%",
			backgroundImage: `url(${gearback}), linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.8))`
		};
	}

	// Checks if the slot has an item in it. 
	changeSlotState(slot, nametest) {
		// This will return the empty item box if there's an item here or the item decoration if there isn't. If there isn't, default will be loaded.
		var backgroundslot;
		if (nametest == "default") {
			// Empty item, draw the slot background
			backgroundslot = require(`./tex/gearback${slot}.png`);
		} else {
			// Occupied, so let's use the transparent one
			backgroundslot = gearbackemptyi;
		}
		// Finds and sets the appropriate item background slot
		if (slot === "head") {
			this.setState({ slot_head_item: backgroundslot });
		} else if (slot === "amulet") {
			this.setState({ slot_amulet_item: backgroundslot });
		} else if (slot === "ammo") {
			this.setState({ slot_ammo_item: backgroundslot });
		} else if (slot === "cape") {
			this.setState({ slot_cape_item: backgroundslot });
		} else if (slot === "body") {
			this.setState({ slot_body_item: backgroundslot });
		} else if (slot === "legs") {
			this.setState({ slot_legs_item: backgroundslot });
		} else if (slot === "feet") {
			this.setState({ slot_feet_item: backgroundslot });
		} else if (slot === "ring") {
			this.setState({ slot_ring_item: backgroundslot });
		} else if (slot === "gloves") {
			this.setState({ slot_gloves_item: backgroundslot });
		} else if (slot === "weapon") {
			this.setState({ slot_weapon_item: backgroundslot });
		} else if (slot === "shield") {
			this.setState({ slot_shield_item: backgroundslot });
		}
	}

	// Returns the current state object corresponding to the slot supplied.
	// This is used to show the current item on the gear selection popup
	getItemBackground(slot) {
		var returned;
		if (slot === "head") {
			returned = this.state.slot_head_item;
		} else if (slot === "amulet") {
			returned = this.state.slot_amulet_item;
		} else if (slot === "ammo") {
			returned = this.state.slot_ammo_item;
		} else if (slot === "cape") {
			returned = this.state.slot_cape_item;
		} else if (slot === "body") {
			returned = this.state.slot_body_item;
		} else if (slot === "legs") {
			returned = this.state.slot_legs_item;
		} else if (slot === "feet") {
			returned = this.state.slot_feet_item;
		} else if (slot === "ring") {
			returned = this.state.slot_ring_item;
		} else if (slot === "gloves") {
			returned = this.state.slot_gloves_item;
		} else if (slot === "weapon") {
			returned = this.state.slot_weapon_item;
		} else if (slot === "shield") {
			returned = this.state.slot_shield_item;
		}
		return returned;
	}

	// Called when an item is clicked from the search results. This will set the nextItem prop for that slot so it can load the new item
	gearSelectClick(e, filename, type) {
		var currentfilerefs = this.state.nextItem; // Read all of the current nextItem props
		currentfilerefs[type] = filename; // Set this slot to the new filename. 
		this.setState({
			nextItem: currentfilerefs
		});
	}

	// Called when the wiki button is clicked. It will load whatever is in the wiki attribute of the item's json. 
	gearSelectWiki(e, type) {
		var wikipage = this.myRefs[type].current.state.wiki
		window.open(wikipage);
	}

	// Renders each of the attack style bonuses on the gear popup. 
	renderItemStyleStrBonusText(element, style) {
		var elementint = parseInt(element);
		var result = element;
		var styleBonus;
		var styleText;
		var styleicon;
		var percenttag = "";
		if (style == "stab") {
			styleicon = {
				backgroundImage: `url(${staticonstab})`
			};
			styleText = "Stab";
		}
		if (style == "slash") {
			styleicon = {
				backgroundImage: `url(${staticonslash})`
			};
			styleText = "Slash";
		}
		if (style == "crush") {
			styleicon = {
				backgroundImage: `url(${staticoncrush})`
			};
			styleText = "Crush";
		}
		if (style == "magic") {
			styleicon = {
				backgroundImage: `url(${staticonmagic})`
			};
			styleText = "Magic";
		}
		if (style == "ranged") {
			styleicon = {
				backgroundImage: `url(${staticonranged})`
			};
			styleText = "Ranged";
		}
		if (style == "str_melee") {
			styleicon = {
				backgroundImage: `url(${staticonstrmelee})`
			};
			styleText = "Melee Strength";
		}
		if (style == "str_ranged") {
			styleicon = {
				backgroundImage: `url(${staticonstrranged})`
			};
			styleText = "Ranged Strength";
		}
		if (style == "str_magic") {
			styleicon = {
				backgroundImage: `url(${staticonstrmagic})`
			};
			percenttag = "%";
			styleText = "Magic Damage";
		}
		if (style == "str_prayer") {
			styleicon = {
				backgroundImage: `url(${staticonstrprayer})`
			};
			styleText = "Prayer Bonus";
		}
		if (0 > elementint) {
			// This is LESS than 0, indicating a negative value
			styleBonus = {
				color: "red",
				gridColumn: "2",
				textAlign: "center"
			};
		} else if (elementint == 0) {
			// This is exactly 0, let's gray the returned number
			styleBonus = {
				color: "gray",
				gridColumn: "2",
				textAlign: "center"
			};
		} else {
			// This is a positive number, so let's just give this a normal white color
			styleBonus = {
				color: "white",
				gridColumn: "2",
				textAlign: "center"
			};
			result = "+" + result;
		}
		return (
			<div className='GearPopupSelectBonusStatsAtkDef'>
				<div className='CalcBonusTotalsBonusIcon' style={styleicon}>
					<span class='BonusResultTooltipText'>{styleText}</span>
				</div>
				<div style={styleBonus}>{result + percenttag}</div>
			</div>
		);
	}

	// This will render each item on a long track with a horizontal scroll bar
	renderSearchResults() {
		var self = this;
		var thearray = this.state.searchitems;
		var currtype = this.state.popupActive;
		var gearsearchback = {
			backgroundImage: `url(${gearsearchbackground})`
		};

		return (
			<div className='GearBoxSearchResultsSkeleton'>
				<div className='GearBoxSearchResultsBackG' style={gearsearchback}></div>
				<div className='GearBoxSearchResultsBack'>
					{thearray.map(function (element) {
						console.log(element);
						var iconstyle = {
							width: "5vmin",
							height: "5vmin",
							backgroundImage: `url(${element.url})`
						};
						if (element.hasOwnProperty("posX")) {
							iconstyle = {
								width: element.posX * 5 + "vmin",
								height: element.posY * 5 + "vmin",
								backgroundImage: `url(${element.url})`
							};
						}

						return (
							<div
								className='GearBoxSearchResultsItem'
								style={iconstyle}
								name={element.filename}
								type={currtype}
								onClick={e =>
									self.gearSelectClick(e, element.filename, currtype)
								}
							>
								<span class='SearchResultTooltipText'>{element.name}</span>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	// This will render the actual search bar. Most of this code is similar to the one used in the monster search
	renderSearchBar() {
		var self = this;
		function handleChange(e) {
			var itemlist = require(`./gear/${self.state.popupActive}/directory.json`); // Load the directory JSON - This has just the filenames, actual names and urls of each item
			var arrayofitems = itemlist.filter(function (element) { // Removes any item that the search string is NOT in. This isn't case sensitive. 
				return element.name
					.toLowerCase()
					.includes(e.target.value.toLowerCase());
			});
			// Set our search items to whatever we found.
			self.setState({
				searchitems: arrayofitems
			});
		}

		// Required is used in the search form to determine some css properties 
		return (
			<div class='CalcMonsterSearchForm'>
				<input
					type='text'
					ref={this.myRefs["search"]}
					name='name'
					autoComplete='off'
					required
					onChange={handleChange}
				/>
				<label for='name' class='CalcMonsterSearchLabel'>
					<span class='CalcMonsterSearchLabelContent'>Search</span>
				</label>
			</div>
		);
	}

	// Renders each of the gear stats under the select popup. 
	renderGearSelectStats(thetype) {
		try {
			// If we don't have an item equipped, we can't really render anything. 
			if (this.myRefs[this.state.popupActive].current.state.name == "Invalid") {
				return (
					<div className="GearPopupSelectBonusStatsNoItem"></div>
				)
			}
			else {
				// We have an item equipped, so let's read from it. 
				var self = this;
				var theitem = this.myRefs[this.state.popupActive].current.state
				// Use a style override to manually set the position of the strength bonuses.
				var stylestrTL = {
					position: "absolute",
					left: "0",
					top: "25%",
					width: "50%",
					height: "50%"
				}
				var stylestrTR = {
					position: "absolute",
					left: "52%",
					top: "25%",
					width: "50%",
					height: "50%"
				}
				var stylestrLR = {
					position: "absolute",
					left: "52%",
					top: "70%",
					width: "50%",
					height: "50%"
				}
				var stylestrLL = {
					position: "absolute",
					left: "0",
					top: "70%",
					width: "50%",
					height: "50%"
				}
				// Draw Attack, Defense or Strength sections, calling the renderItemStyleStrBonusText function for each stat for it's icon and type.
				if (thetype == "attack") {
					return (
						<div>
							{self.renderItemStyleStrBonusText(theitem.atk_stab, "stab")}
							{self.renderItemStyleStrBonusText(theitem.atk_slash, "slash")}
							{self.renderItemStyleStrBonusText(theitem.atk_crush, "crush")}
							{self.renderItemStyleStrBonusText(theitem.atk_magic, "magic")}
							{self.renderItemStyleStrBonusText(theitem.atk_ranged, "ranged")}
						</div>
					)
				}
				else if (thetype == "defense") {
					return (
						<div>
							{self.renderItemStyleStrBonusText(theitem.def_stab, "stab")}
							{self.renderItemStyleStrBonusText(theitem.def_slash, "slash")}
							{self.renderItemStyleStrBonusText(theitem.def_crush, "crush")}
							{self.renderItemStyleStrBonusText(theitem.def_magic, "magic")}
							{self.renderItemStyleStrBonusText(theitem.def_ranged, "ranged")}
						</div>
					)
				}
				else if (thetype == "strength") {
					return (
						<div>
							<div style={stylestrTL}>{self.renderItemStyleStrBonusText(theitem.str_melee, "str_melee")}</div>
							<div style={stylestrTR}>{self.renderItemStyleStrBonusText(theitem.str_magic, "str_magic")}</div>
							<div style={stylestrLL}>{self.renderItemStyleStrBonusText(theitem.str_ranged, "str_ranged")}</div>
							<div style={stylestrLR}>{self.renderItemStyleStrBonusText(theitem.str_prayer, "str_prayer")}</div>
						</div>
					)
				}
			}
		}
		catch (err) {
			// This hopefully won't happen, but we'll just draw a blank return if it does. 
			return (
				<div className="GearPopupSelectBonusStatsNoItem"></div>
			)
		}
	}

	// Draws the Gear Selection window. This is always active and moves when a new slot is selected. 
	renderGearSelection() {
		var self = this;
		var obj;
		var fontsize = {};
		var objname = "None";
		// Icon preview background for the currently equipped item
		var selectedicon;
		var selectedicon2 = {
			width: "10vmin",
			height: "10vmin"
		};
		var clickable = {
			pointerEvents: "none"
		};
		// There are 4 styles, one for each of the corner elements, rotated to fit the corner. 
		var styleupperleft = {
			top: "0px",
			left: "0px",
			backgroundImage: `url(${bordertexcorner})`,
			transform: `rotate(0deg)`
		};
		var styleupperright = {
			top: "0px",
			right: "0px",
			backgroundImage: `url(${bordertexcorner})`,
			transform: `rotate(90deg)`
		};
		var stylelowerright = {
			bottom: "0px",
			right: "0px",
			backgroundImage: `url(${bordertexcorner})`,
			transform: `rotate(180deg)`
		};
		var stylelowerleft = {
			bottom: "0px",
			left: "0px",
			backgroundImage: `url(${bordertexcorner})`,
			transform: `rotate(270deg)`
		};
		// There is no gear slot clicked
		var popupstyle = {
			top: 0,
			left: 0,
			width: "10vmin",
			height: "10vmin",
			opacity: "0.0",
			pointerEvents: "none"
		};
		// We clicked on a gear slot
		if (this.state.popupActive != null) {
			popupstyle = {
				top: 0,
				left: 0,
				width: "32vmin",
				height: "20vmin",
				pointerEvents: "all"
			};
		}
		if (this.state.popupActive != null) {
			// Read and set the current item preview
			obj = this.myRefs[this.state.popupActive].current.state;
			objname = obj.name;
			if (obj.name == "Invalid") {
				objname = "None";
			}
			if (obj.filename != "default") {
				selectedicon = {
					backgroundImage: `url(${obj.url})`,
					width: `${obj.currwidth}%`,
					height: `${obj.currheight}%`
				};
			} else {
				selectedicon = {
					backgroundImage: `url(${geartransp})`,
					width: `${obj.currwidth / 10}vmin`,
					height: `${obj.currheight / 10}vmin`
				};
			}
		}
		// Set the item title size. Longer = smaller font
		var fontsizenumtest = 2.6 - (objname.length - 14) * 0.12;
		if (fontsizenumtest > 3.0) {
			fontsizenumtest = 3.0;
		}
		fontsize = {
			fontSize: fontsizenumtest + "vmin"
		};
		// Draws the backpack and wiki icon styles
		var InventoryIcon = {
			backgroundImage: `url(${inventoryicon})`
		};
		var WikiIcon = {
			backgroundImage: `url(${wikiicon})`
		};

		return (
			<div className='GearBoxBack' style={clickable}>
				<div className='GearBoxPopupBackCorner' style={styleupperleft}></div>
				<div className='GearBoxPopupBackCorner' style={styleupperright}></div>
				<div className='GearBoxPopupBackCorner' style={stylelowerright}></div>
				<div className='GearBoxPopupBackCorner' style={stylelowerleft}></div>
				<div className='GearBoxPopupStyle' style={popupstyle}>
					<div className='GearBoxInnerSelect' style={selectedicon2}>
						<div className='GearBoxInner' style={selectedicon}></div>
					</div>
					<div className='GearBoxSelectNameBack'>
						<div className='GearBoxSelectNameCurrSelected'>
							Currently Selected:
						</div>
						<div className='GearBoxSelectNameTitle' style={fontsize}>
							{objname}
						</div>
						<div
							className='GearBoxSelectUnequip'
							style={InventoryIcon}
							onClick={e =>
								self.gearSelectClick(e, "default", this.state.popupActive)
							}
						></div>
						<div
							className='GearBoxSelectWiki'
							style={WikiIcon}
							onClick={e =>
								self.gearSelectWiki(e, this.state.popupActive)
							}
						></div>
					</div>
					<div className='GearBoxSelectSearchBack'>
						{this.renderSearchBar()}
					</div>
					{this.renderSearchResults()}
				</div>
				<div className='GearBoxPopupSelectStats'>
					<div className='GearBoxPopupSelectStatsAtk'>
						<div className='GearBoxPopupSelectStatsAtkTitle'>Attack</div>
						{this.renderGearSelectStats("attack")}
					</div>
					<div className='GearBoxPopupSelectStatsDef'>
						<div className='GearBoxPopupSelectStatsDefTitle'>Defence</div>
						{this.renderGearSelectStats("defense")}
					</div>
					<div className='GearBoxPopupSelectStatsStr'>
						<div className='GearBoxPopupSelectStatsDefTitle'>Strength Bonuses</div>
						{this.renderGearSelectStats("strength")}
					</div>
				</div>
			</div>
		);
	}

	// Draws a gearbox for the type given, passing props to it. 
	renderGearSquare(type) {
		return (
			<GearBox
				ref={this.myRefs[type]}
				onClick={() => this.handleClick(this.props.type)}
				itemtype={type}
				changeSlotState={this.changeSlotState}
				nextItem={this.state.nextItem[type]}
				gearUpdate={this.gearUpdate}
				mouseOveredParent={this.mouseOveredParent}
				gearitempopup={this.popupActiveMethod}
				unequipShield={this.unequipShield}
				twohanded={this.state.twohanded}
			/>
		);
	}

	// This is currently unused and poorly named, but it would render the mouseover function when the slot hasn't been clicked. 
	renderGearPopout() {
		if (this.state.mouseOverActive) {
			// We currently have the mouse over a gear slot.
			var styleX = this.state.mouseOverX;
			var styleY = this.state.mouseOverY;
			var geardetails = this.myRefs[this.state.mouseOverSlot].current;
			console.log("faded: " + this.state.mouseOverSlotFadedIn);
			return (
				<div id='GearMouseoverMainBox'>
					<CSSTransitionGroup
						in={this.state.mouseOverTransition}
						timeout={1000}
						classNames='fade'
					>
						<GearMouseover
							styleX={this.state.mouseOverX}
							styleY={this.state.mouseOverY}
							gearDetails={geardetails.state}
							mouseOverTransitionComplete={this.mouseOverTransitionComplete}
						/>
					</CSSTransitionGroup>
				</div>
			);
		}
	}

	// Sets the mouseover coordinates. Currently unused. 
	//_onMouseMove = e => {
	//	if (this.state.mouseOverActive) {
	//		console.log(e.pageX, e.pageY);
	//		this.setState({ mouseOverX: e.pageX, mouseOverY: e.pageY });
	//	} // Returns the coordinates only if mouseover is active.
	//};

	// Clears any popup which is not the slot 
	ClickMenuClear(e) {
		var thetarget = e.target.id; // This is the name by ID that our mouse actually clicked on.
		var shorttarget = thetarget.slice(12); // This is the identifier we'll remove from popuplist
		var testshort = thetarget.slice(0, 12); // This is the other part!
		var popuplist = [
			"head",
			"amulet",
			"body",
			"legs",
			"feet",
			"gloves",
			"weapon",
			"shield",
			"ammo",
			"ring",
			"cape",
			"style",
			"prayer",
			"potion",
			"spell"
		];
		var self = this;
		// We clicked the background, close everything. 
		if (thetarget == "GearBackground") {
			popuplist.forEach(function (element) {
				try {
					self.myRefs[element].current.closePopup();
					self.myRefs["search"].current.value = "";
					self.setState({
						searchitems: [],
						popupActive: null
					});
				} catch (err) {
					console.log(err);
				}
			});
			// We clicked on a gearbox slot. We should close everything.
		} else if (testshort == "GearBox_Slot" && this.state.popupActive != null) {
			self.myRefs["search"].current.value = "";
			this.setState({
				searchitems: [],
				popupActive: null
			});
		}
		// We clicked on some other slot element. This needs some work to prevent closing prayers after clicking on a prayer. 
		try {
			popuplist.splice(popuplist.indexOf(shorttarget), 1)
			popuplist.forEach(function (element) {
				self.myRefs[element].current.closePopup();
			})
		}
		catch (err) {

		}
	}

	render() {
		var itemBackground = new Object();
		gearslots.map(
			gearslot => (itemBackground[gearslot] = this.getItemBackground(gearslot))
		);

		var currpopupstyle;
		// Update the gear selection window measurements to make sure it does not flow off. 
		if (this.state.popupActive != null) {
			var vminmeasurement = window.innerHeight // Assume the height is smaller than the width
			if (window.innerHeight > window.innerWidth) { // Height is bigger than the width, so we'll use width instead
				vminmeasurement = window.innerWidth
			}
			// This is the pixel amount of our gear section - gearsec is only 96% of the total height. 
			var elementheight = ((window.innerHeight / 100) * 96)
			var toppos = (elementheight / 100) * (parseInt(this.state.gearPopoutY))
			var topposeval = toppos + 54 * (vminmeasurement / 100) // Add 3 vmin units for clearance
			console.log(vminmeasurement, elementheight, toppos, topposeval)
			if (topposeval > elementheight) { // If the bottom left corner is bigger than our height
				toppos = window.innerHeight - (54 * (vminmeasurement / 100)) // Adjust our top left corner to height - 54vmin
			}
			// Set the popup to active
			currpopupstyle = {
				top: toppos + "px",
				left: parseInt(this.state.gearPopoutX) - 1 + "%",
				width: "32vmin",
				height: "51vmin",
				opacity: "1.0",
				pointerEvents: "all",
				backgroundImage: `url(${gearselectbackground})`
			};
			// Popup is not active right now, nothing has been clicked
		} else {
			currpopupstyle = {
				top: "-1vmin",
				left: "-1vmin",
				width: "10vmin",
				height: "10vmin",
				opacity: "0.0",
				pointerEvents: "none",
				transition: "none",
				backgroundImage: `url(${gearselectbackground})`
			};
		}

		return (
			<div
				style={overStyle}
				id='GearBackground'
				onClick={this.ClickMenuClear}
			>
				<div>
					<div id='GearSkeleton'>
						{gearslots.map(gearslot => (
							<div
								id='GearBox'
								key={"slot_" + gearslot}
								style={this.boxPositionStyle(
									gearslot,
									itemBackground[gearslot]
								)}
							>
								{this.renderGearSquare(gearslot)}
							</div>
						))}
						<div
							id='GearBox_style'
							key={"slot_style"}
							style={this.boxPositionStyleStyles(13, 82, gearbackemptyi)}
						>
							<GearBoxStyle
								ref={this.myRefs["style"]}
								currtype={this.state.combatstyle}
								styleUpdate={this.styleUpdate}
							/>
						</div>
						<div
							id='GearBox_style'
							key={"slot_spell"}
							style={this.boxPositionStyleStyles(33, 82, gearbackemptyi)}
						>
							<GearBoxSpell
								ref={this.myRefs["spell"]}
								prayerUpdate={this.prayerUpdate}
								prayercurrenttotalmod={this.state.prayercurrenttotalmod}
								potioncurrenttotalmod={this.state.potioncurrenttotalmod}
								currentlevels={this.props.currentlevels}
								geartotals={this.props.geartotals}
							/>
						</div>
						<div
							id='GearBox_style'
							key={"slot_prayer"}
							style={this.boxPositionStyleStyles(53, 82, gearbackemptyi)}
						>
							<GearBoxPrayer
								ref={this.myRefs["prayer"]}
								prayerUpdate={this.prayerUpdate}
								prayercurrenttotalmod={this.state.prayercurrenttotalmod}
								potioncurrenttotalmod={this.state.potioncurrenttotalmod}
								currentlevels={this.props.currentlevels}
							/>
						</div>
						<div
							id='GearBox_style'
							key={"slot_potion"}
							style={this.boxPositionStyleStyles(73, 82, gearbackemptyi)}
						>
							<GearBoxPotions
								ref={this.myRefs["potion"]}
								currentlevels={this.props.currentlevels}
								potionUpdate={this.potionUpdate}
							/>
						</div>
					</div>
					{this.renderGearPopout()}
				</div>
				<div
					className='GearBoxPopout'
					style={currpopupstyle}
					id='GearBox_ItemSlotPopout'
				>
					{this.renderGearSelection()}
				</div>
			</div>
		);
	}
}

export default GearSection;
