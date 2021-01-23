import React from "react";
import "./css/App.css";

// The prayer "on" circle and the prayer icon
import prayeron from "./tex/prayersloton.png";
import prayericon from "./tex/combattypeprayer.png";

// The window backgrounds and corner texture
import PopupBackground from "./tex/PopupBackground.png";
import bordertexcorner from "./tex/bordertexcorner.png";
import tooltipiconback from "./tex/tooltipiconback.png";

// Each of the stat icons
import levelsattack from "./tex/levels_attack_icon.png";
import levelsstrength from "./tex/type-strmelee.png";
import levelsdefense from "./tex/combattypedefence.png";
import levelsranged from "./tex/combattyperanged.png";
import levelsmagic from "./tex/combattypemagic.png";

// This is the style for the actual Prayer button's icon. 
const prayerstyle = {
	backgroundImage: `url(${prayericon})`
};

class GearBoxPrayer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentprayers: [], // Currently active prayers.
			currentdrainrate: 0.0, // Current total rate that we're draining prayer per minute
			currentdrainresist: 0, // Current total Drain Resist value of our prayers.
			currenttotalmod: {
				// This will collect all of our % that other parts can use.
				attack: "1.0",
				strength: "1.0",
				defense: "1.0",
				ranged: "1.0",
				rangeddamage: "1.0",
				magic: "1.0"
			},
			backstyle: {
				opacity: "0.0",
				backgroundImage: `url(${prayeron})`
			}, // This is the current style object for our main icon.
			testattrib: true, // Unused, haven't tested removing it yet. 
			popupActive: false, // False = not showing the prayer list; true = is showing the prayer list
			mouseOverTooltip: false, // False = not showing the prayer tooltip; true = is showing the prayer tooltip
			mouseOverPrayer: "thick-skin" // This is the prayer being mouseovered. This will always be the last/current prayer looked at and cannot be null or the code crashes.
		};

		// All of the .bind(this) functions
		this.buttonClick = this.buttonClick.bind(this);
		this.renderGearPrayers = this.renderGearPrayers.bind(this);
		this.renderPrayerIcon = this.renderPrayerIcon.bind(this);
		this.prayerClick = this.prayerClick.bind(this);
		this.tooltipMouseoverEnter = this.tooltipMouseoverEnter.bind(this);
		this.tooltipMouseoverExit = this.tooltipMouseoverExit.bind(this);
		this.renderTooltip = this.renderTooltip.bind(this);
	}

	// Closes the popup when called. This is usually called from GearSec's ClickMenuClear() function
	closePopup() {
		this.setState({
			popupActive: false
		});
	}

	// Opens the popup when the prayer button is clicked
	buttonClick() {
		var self = this;
		if (self.state.popupActive == true) {
			self.setState({
				popupActive: false
			});
		} else {
			self.setState({
				popupActive: true
			});
		}
		this.props.prayerUpdate();
	}

	// The user moved their mouse onto a prayer. 
	tooltipMouseoverEnter(e) {
		this.setState({
			mouseOverTooltip: true,
			mouseOverPrayer: e.target.attributes.name.value
		});
	}

	// The user moved their mouse off of the prayer.
	tooltipMouseoverExit() {
		this.setState({
			mouseOverTooltip: false
		});
	}

	// Calculates all of the prayer bonuses. This is passed with the current set of prayers given after prayerClick and changes the percentages accordingly. 
	// Returns an array of each modified stat as a multiplier float
	calculateTotals(currentprayers) {
		var prayerlist = require(`./gear/prayers.json`); // Load the prayers from our file.

		// Init stat variables
		var currentattack = 1.0;
		var currentstrength = 1.0;
		var currentdefense = 1.0;
		var currentranged = 1.0;
		var currentrangeddamage = 1.0;
		var currentmagic = 1.0;

		// Not implemented, but the prayers do each have this stat. 
		var drainrate = 0;
		var drainresist = 0;

		// Iterates over each prayer and reads the prayer. Each json's .mod value is a whole number representing the percentage. mod: 15 would give us 1.15.
		if (currentprayers.length > 0) {
			currentprayers.forEach(function (prayer) {
				var ourprayer = prayerlist[prayer];
				if (ourprayer.stat == "attack") {
					currentattack = 1 + ourprayer.mod / 100;
				} else if (ourprayer.stat == "strength") {
					currentstrength = 1 + ourprayer.mod / 100;
				} else if (ourprayer.stat == "defense") {
					currentdefense = 1 + ourprayer.mod / 100;
				} else if (ourprayer.stat == "ranged") {
					currentranged = 1 + ourprayer.mod / 100;
					currentrangeddamage = 1 + ourprayer.mod / 100;
				} else if (ourprayer.stat == "magic") {
					currentmagic = 1 + ourprayer.mod / 100;

					// The multi prayers are special, so we'll set those independently from the rest. 
				} else if (prayer == "chivalry" || prayer == "piety") {
					currentattack = 1 + ourprayer.mod / 100;
					currentstrength = 1 + ourprayer.mod2 / 100;
					currentdefense = 1 + ourprayer.mod3 / 100;
				} else if (prayer == "rigour") {
					currentranged = 1 + ourprayer.mod / 100;
					currentrangeddamage = 1 + ourprayer.mod2 / 100;
					currentdefense = 1 + ourprayer.mod3 / 100;
				} else if (prayer == "augury") {
					currentmagic = 1 + ourprayer.mod / 100;
					currentdefense = 1 + ourprayer.mod3 / 100;
				}
				drainrate = drainrate + parseInt(ourprayer.drainrate);
				drainresist = drainresist + parseInt(ourprayer.drainresist);
			});
		}
		var returnvar = [];
		returnvar.push(
			currentattack,
			currentstrength,
			currentdefense,
			currentranged,
			currentrangeddamage,
			currentmagic,
			drainrate,
			drainresist
		);
		return returnvar;
	}

	// Called when a prayer is clicked. This will determine if there are any prayer conflicts and turn off the opposing prayer. 
	prayerClick(e) {
		var theinput = e.target.attributes.name.value; // Gets the name of the prayer we clicked
		var currentprayers = this.state.currentprayers; // Get our current prayers 
		if (currentprayers.includes(theinput)) { // Check if the prayer we clicked was already on and remove it
			currentprayers.splice(currentprayers.indexOf(theinput), 1);
		} else {
			// Iterate over all conflicts. No stat can have two prayers on, nor can ranged,magic,attack/strength have each other on. 
			var prayerconflicts = [];
			if (
				theinput == "thick-skin" ||
				theinput == "rock-skin" ||
				theinput == "steel-skin" ||
				theinput == "piety" ||
				theinput == "chivalry"
			) {
				prayerconflicts.push(
					"thick-skin",
					"rock-skin",
					"steel-skin",
					"piety",
					"chivalry",
					"rigour",
					"augury"
				);
			}
			if (
				theinput == "burst-of-strength" ||
				theinput == "superhuman-strength" ||
				theinput == "ultimate-strength"
			) {
				prayerconflicts.push(
					"burst-of-strength",
					"superhuman-strength",
					"ultimate-strength",
					"piety",
					"chivalry",
					"rigour",
					"augury",
					"sharp-eye",
					"hawk-eye",
					"eagle-eye",
					"mystic-will",
					"mystic-lore",
					"mystic-might"
				);
			}
			if (
				theinput == "clarity-of-thought" ||
				theinput == "improved-reflexes" ||
				theinput == "incredible-reflexes"
			) {
				prayerconflicts.push(
					"clarity-of-thought",
					"improved-reflexes",
					"incredible-reflexes",
					"piety",
					"chivalry",
					"rigour",
					"augury",
					"sharp-eye",
					"hawk-eye",
					"eagle-eye",
					"mystic-will",
					"mystic-lore",
					"mystic-might"
				);
			}
			if (
				theinput == "sharp-eye" ||
				theinput == "hawk-eye" ||
				theinput == "eagle-eye" ||
				theinput == "mystic-will" ||
				theinput == "mystic-lore" ||
				theinput == "mystic-might" ||
				theinput == "rigour" ||
				theinput == "augury" ||
				theinput == "piety" ||
				theinput == "chivalry"
			) {
				prayerconflicts.push(
					"burst-of-strength",
					"superhuman-strength",
					"ultimate-strength",
					"clarity-of-thought",
					"improved-reflexes",
					"incredible-reflexes",
					"piety",
					"chivalry",
					"rigour",
					"augury",
					"sharp-eye",
					"hawk-eye",
					"eagle-eye",
					"mystic-will",
					"mystic-lore",
					"mystic-might"
				);
			}
			if (
				theinput == "protect-from-melee" ||
				theinput == "protect-from-missles" ||
				theinput == "protect-from-magic" ||
				theinput == "retribution" ||
				theinput == "redemption" ||
				theinput == "smite"
			) {
				prayerconflicts.push(
					"protect-from-melee",
					"protect-from-missles",
					"protect-from-magic",
					"retribution",
					"redemption",
					"smite"
				);
			}
			// If we found any conflicts, we should remove them from our current prayers
			if (prayerconflicts.length > 0) {
				prayerconflicts.forEach(function (conflict) {
					if (currentprayers.includes(conflict)) {
						currentprayers.splice(currentprayers.indexOf(conflict), 1);
					}
				});
			}
			// Finally, we can push our new prayer into the list. 
			currentprayers.push(theinput);
		}
		// Get the new percentages to pass into our setState function for currenttotalmod
		var totals = this.calculateTotals(currentprayers);
		this.setState({
			currentprayers: currentprayers,
			currenttotalmod: {
				attack: totals[0],
				strength: totals[1],
				defense: totals[2],
				ranged: totals[3],
				rangeddamage: totals[4],
				magic: totals[5]
			},
			drainrate: totals[6],
			drainresist: totals[7]
		});
		// Run the prayerUpdate function in GearSec *after* we've run our update with the new prayers. 100ms is arbitrary. 
		var self = this;
		setTimeout(function (element) {
			self.props.prayerUpdate();
		}, 100);
	}

	// Checks that there is a prayer active. If there is, it will turn on the prayer circle for the prayer button. 
	// This needs to be renamed. However I believe this isn't really used. 
	urlUpdate() {
		var ourback;
		if (this.state.currentprayers.length > 0) {
			// We have an active item
			ourback = {
				opacity: "1.0",
				backgroundImage: `url(${prayeron})`
			};
		} else {
			ourback = {
				opacity: "0.0",
				backgroundImage: `url(${prayeron})`
			};
		}
		this.setState({
			backstyle: ourback
		});
	}

	// This is some truly spaghetti code. I will hopefully (eventually) fix it.
	// Displays the mouseover tooltip text for the mouseover prayer. 
	renderTooltipText(working) {
		// "ourtext" refers to the '+__% Attack' output. 
		var ourtext;
		var ourtext2;
		var ourtext3;
		// text1 is the boosted level after potions (if applicable). __
		// text2 is the output level after the prayer bonus is added. ⮕ __
		var text1;
		var text2;
		var text1_2;
		var text2_2;
		var text1_3;
		var text2_3;
		var ourimage; // Currently unused
		var self = this;
		var currentchange; // This is the boosted level of our stat.
		var boostedfont = {
			// This will be white if there is no boost, or skyblue if there is a potion boost
			color: "white",
			paddingRight: "4%"
		};
		var boostedfont2 = {
			// This will be white if there is no boost, or skyblue if there is a potion boost
			color: "white",
			paddingRight: "4%"
		};
		var boostedfont3 = {
			// This will be white if there is no boost, or skyblue if there is a potion boost
			color: "white",
			paddingRight: "4%"
		};
		// Create a variable and call it 0. If we find that our prayer we're looking at isn't a single stat prayer, we do other things. 
		var standard = 0;
		// Iterate over each stat. This will read the appropriate props level. This code can probably be simplified to use a variable called potioncurrenttotalmod[working.stat].level and the like
		// Sets "standard" to 1
		if (working.stat == "attack") {
			var teststat = self.props.currentlevels.attack;
			currentchange = Math.floor(
				teststat * self.props.potioncurrenttotalmod.attack.percentage +
				parseInt(self.props.potioncurrenttotalmod.attack.level)
			);
			ourtext = "+" + working.mod + "% Attack";
			ourimage = {
				backgroundImage: `url(${levelsattack})`
			};
			if (currentchange > self.props.currentlevels.attack) {
				boostedfont = {
					color: "skyblue",
					paddingRight: "4%"
				};
			}
			text1 = currentchange;
			text2 =
				" ⮕ " +
				Math.floor(currentchange * ((100 + parseInt(working.mod)) / 100));
			standard = 1;
		}
		if (working.stat == "strength") {
			var teststat = self.props.currentlevels.strength;
			currentchange = Math.floor(
				teststat * self.props.potioncurrenttotalmod.strength.percentage +
				parseInt(self.props.potioncurrenttotalmod.strength.level)
			);
			ourtext = "+" + working.mod + "% Strength";
			ourimage = {
				backgroundImage: `url(${levelsstrength})`
			};
			if (currentchange > self.props.currentlevels.strength) {
				boostedfont = {
					color: "skyblue",
					paddingRight: "4%"
				};
			}
			text1 = currentchange;
			text2 =
				"  ⮕ " +
				Math.floor(currentchange * ((100 + parseInt(working.mod)) / 100));
			standard = 1;
		}
		if (working.stat == "defense") {
			var teststat = self.props.currentlevels.defence;
			currentchange = Math.floor(
				teststat * self.props.potioncurrenttotalmod.defense.percentage +
				parseInt(self.props.potioncurrenttotalmod.defense.level)
			);
			ourtext = "+" + working.mod + "% Defence";
			ourimage = {
				backgroundImage: `url(${levelsdefense})`
			};
			if (currentchange > self.props.currentlevels.defence) {
				boostedfont = {
					color: "skyblue",
					paddingRight: "4%"
				};
			}
			text1 = currentchange;
			text2 =
				"  ⮕ " +
				Math.floor(currentchange * ((100 + parseInt(working.mod)) / 100));
			standard = 1;
		}
		if (working.stat == "ranged") {
			var teststat = self.props.currentlevels.ranged;
			currentchange = Math.floor(
				teststat * self.props.potioncurrenttotalmod.ranged.percentage +
				parseInt(self.props.potioncurrenttotalmod.ranged.level)
			);
			ourtext = "+" + working.mod + "% Ranged";
			ourimage = {
				backgroundImage: `url(${levelsranged})`
			};
			if (currentchange > self.props.currentlevels.ranged) {
				boostedfont = {
					color: "skyblue",
					paddingRight: "4%"
				};
			}
			text1 = currentchange;
			text2 =
				"  ⮕ " +
				Math.floor(currentchange * ((100 + parseInt(working.mod)) / 100));
			standard = 1;
		}
		if (working.stat == "magic") {
			var teststat = self.props.currentlevels.magic;
			currentchange = Math.floor(
				teststat * self.props.potioncurrenttotalmod.magic.percentage +
				parseInt(self.props.potioncurrenttotalmod.magic.level)
			);
			ourtext = "+" + working.mod + "% Magic";
			ourimage = {
				backgroundImage: `url(${levelsmagic})`
			};
			if (currentchange > self.props.currentlevels.magic) {
				boostedfont = {
					color: "skyblue",
					paddingRight: "4%"
				};
			}
			text1 = currentchange;
			text2 =
				"  ⮕ " +
				Math.floor(currentchange * ((100 + parseInt(working.mod)) / 100));
			standard = 1;
		}
		// This is used for chivalry/piety, rigour and augury. This is where _1 and _2 variables come into play. 
		// Sets "standard" to 2
		if (working.stat == "multi") {
			if (working.level == "60" || working.level == "70") {
				// This is Chivalry or Piety
				var teststat = self.props.currentlevels.attack;
				currentchange = Math.floor(
					teststat * self.props.potioncurrenttotalmod.attack.percentage +
					parseInt(self.props.potioncurrenttotalmod.attack.level)
				);
				ourtext = "+" + working.mod + "% Attack";
				if (currentchange > self.props.currentlevels.attack) {
					boostedfont = {
						color: "skyblue",
						paddingRight: "4%"
					};
				}
				text1 = currentchange;
				text2 =
					" ⮕ " +
					Math.floor(currentchange * ((100 + parseInt(working.mod)) / 100));
				teststat = self.props.currentlevels.strength;
				currentchange = Math.floor(
					teststat * self.props.potioncurrenttotalmod.strength.percentage +
					parseInt(self.props.potioncurrenttotalmod.strength.level)
				);
				ourtext2 = "+" + working.mod2 + "% Strength";
				if (currentchange > self.props.currentlevels.strength) {
					boostedfont2 = {
						color: "skyblue",
						paddingRight: "4%"
					};
				}
				text1_2 = currentchange;
				text2_2 =
					"  ⮕ " +
					Math.floor(currentchange * ((100 + parseInt(working.mod2)) / 100));
				teststat = self.props.currentlevels.defence;
				currentchange = Math.floor(
					teststat * self.props.potioncurrenttotalmod.defense.percentage +
					parseInt(self.props.potioncurrenttotalmod.defense.level)
				);
				ourtext3 = "+" + working.mod3 + "% Defence";
				if (currentchange > self.props.currentlevels.defence) {
					boostedfont3 = {
						color: "skyblue",
						paddingRight: "4%"
					};
				}
				text1_3 = currentchange;
				text2_3 =
					"  ⮕ " +
					Math.floor(currentchange * ((100 + parseInt(working.mod3)) / 100));
				standard = 2;
			}
			if (working.level == "74") {
				// This is Rigour
				var teststat = self.props.currentlevels.ranged;
				currentchange = Math.floor(
					teststat * self.props.potioncurrenttotalmod.ranged.percentage +
					parseInt(self.props.potioncurrenttotalmod.ranged.level)
				);
				ourtext = "+" + working.mod + "% Ranged";
				if (currentchange > self.props.currentlevels.ranged) {
					boostedfont = {
						color: "skyblue",
						paddingRight: "4%"
					};
				}
				text1 = currentchange;
				text2 =
					"  ⮕ " +
					Math.floor(currentchange * ((100 + parseInt(working.mod)) / 100));
				teststat = self.props.currentlevels.ranged;
				currentchange = Math.floor(
					teststat * self.props.potioncurrenttotalmod.ranged.percentage +
					parseInt(self.props.potioncurrenttotalmod.ranged.level)
				);
				ourtext2 = "+" + working.mod2 + "% Range Str";
				if (currentchange > self.props.currentlevels.ranged) {
					boostedfont2 = {
						color: "skyblue",
						paddingRight: "4%"
					};
				}
				text1_2 = currentchange;
				text2_2 =
					"  ⮕ " +
					Math.floor(currentchange * ((100 + parseInt(working.mod2)) / 100));
				teststat = self.props.currentlevels.defence;
				currentchange = Math.floor(
					teststat * self.props.potioncurrenttotalmod.defense.percentage +
					parseInt(self.props.potioncurrenttotalmod.defense.level)
				);
				ourtext3 = "+" + working.mod3 + "% Defence";
				if (currentchange > self.props.currentlevels.defence) {
					boostedfont3 = {
						color: "skyblue",
						paddingRight: "4%"
					};
				}
				text1_3 = currentchange;
				text2_3 =
					"  ⮕ " +
					Math.floor(currentchange * ((100 + parseInt(working.mod3)) / 100));
				standard = 2;
			}
			if (working.level == "77") {
				// This is Augury
				var teststat = self.props.currentlevels.magic;
				currentchange = Math.floor(
					teststat * self.props.potioncurrenttotalmod.magic.percentage +
					parseInt(self.props.potioncurrenttotalmod.magic.level)
				);
				ourtext = "+" + working.mod + "% Magic";
				if (currentchange > self.props.currentlevels.magic) {
					boostedfont = {
						color: "skyblue",
						paddingRight: "4%"
					};
				}
				text1 = currentchange;
				text2 =
					"  ⮕ " +
					Math.floor(currentchange * ((100 + parseInt(working.mod)) / 100));
				teststat = self.props.currentlevels.defence;
				currentchange = Math.floor(
					teststat * self.props.potioncurrenttotalmod.defense.percentage +
					parseInt(self.props.potioncurrenttotalmod.defense.level)
				);
				ourtext2 = "+" + working.mod3 + "% Defence";
				if (currentchange > self.props.currentlevels.defence) {
					boostedfont2 = {
						color: "skyblue",
						paddingRight: "4%"
					};
				}
				text1_2 = currentchange;
				text2_2 =
					"  ⮕ " +
					Math.floor(currentchange * ((100 + parseInt(working.mod3)) / 100));
				standard = 2;
			}
		}
		// If we worked with a multi prayer, we'll output this. 
		if (standard == 2) {
			return (
				<div className='GearboxBack'>
					<div className='GearBoxPopupStyleTooltipSectStandardText'>
						<div className='GearBoxPopupStyleTooltipSectTopText'>{ourtext}</div>
						<div className='GearBoxPopupStyleTooltipSectBottomTextJustify'>
							<div
								className='GearBoxPopupStyleTooltipSectBottomText'
								style={boostedfont}
							>
								{text1}
							</div>
							<div className='GearBoxPopupStyleTooltipSectBottomText'>
								{text2}
							</div>
						</div>
					</div>
					<div className='GearBoxPopupStyleTooltipSectStandardText'>
						<div className='GearBoxPopupStyleTooltipSectTopText'>
							{ourtext2}
						</div>
						<div className='GearBoxPopupStyleTooltipSectBottomTextJustify'>
							<div
								className='GearBoxPopupStyleTooltipSectBottomText'
								style={boostedfont2}
							>
								{text1_2}
							</div>
							<div className='GearBoxPopupStyleTooltipSectBottomText'>
								{text2_2}
							</div>
						</div>
					</div>
					<div className='GearBoxPopupStyleTooltipSectStandardText'>
						<div className='GearBoxPopupStyleTooltipSectTopText'>
							{ourtext3}
						</div>
						<div className='GearBoxPopupStyleTooltipSectBottomTextJustify'>
							<div
								className='GearBoxPopupStyleTooltipSectBottomText'
								style={boostedfont3}
							>
								{text1_3}
							</div>
							<div className='GearBoxPopupStyleTooltipSectBottomText'>
								{text2_3}
							</div>
						</div>
					</div>
				</div>
			);
			// If we worked with a non-stat prayer, we'll find out which one and throw up some appropriate text. 
			// These prayers don't actually do anything for us, but they do have drain rates which may be useful later. 
		} else if (standard == 0) {
			var returned;
			if (working.stat == "stats") {
				returned = "2x Restore Rate for all stats (except HP and Prayer)";
			} else if (working.stat == "hp") {
				returned = "2x Restore Rate for HP";
			} else if (working.stat == "item") {
				returned = "Protect 1 extra item on death";
			} else if (working.stat == "protect-magic") {
				returned = "Protect 100% Magic Damage (PvP 40%)";
			} else if (working.stat == "protect-ranged") {
				returned = "Protect 100% Ranged Damage (PvP 40%)";
			} else if (working.stat == "protect-melee") {
				returned = "Protect 100% Melee Damage (PvP 40%)";
				// For Retribution, the damage scales based on the user's prayer level, to 25% of their prayer level. 
			} else if (working.stat == "protect-death") {
				returned =
					"Deals " +
					Math.floor(parseInt(self.props.currentlevels.prayer) * 0.25) +
					" damage to nearby enemies on death";
				// For Redemption, the healing scales based on the user's prayer level, 25% of their prayer level. 
			} else if (working.stat == "protect-hp") {
				returned =
					"Heals for " +
					Math.floor(parseInt(self.props.currentlevels.prayer) * 0.25) +
					" hitpoints when hit below 10% HP";
			} else if (working.stat == "protect-leech") {
				returned =
					"Drains enemy Prayer for 25% of Attack Damage when attacking";
			} else if (working.stat == "preserve") {
				returned = "Extends Boosted Stats by 50% (90 Seconds Total)";
			}
			return (
				<div className='GearBoxBack'>
					<div className='GearBoxPopupStyleTooltipSectNonStandardText'>
						{returned}
					</div>
				</div>
			);
			// Finally, if we actually have a single stat, we'll get this. 
		} else {
			return (
				<div className='GearboxBack'>
					<div className='GearBoxPopupStyleTooltipSectStandardText'>
						<div className='GearBoxPopupStyleTooltipSectTopText'>{ourtext}</div>
						<div className='GearBoxPopupStyleTooltipSectBottomTextJustify'>
							<div
								className='GearBoxPopupStyleTooltipSectBottomText'
								style={boostedfont}
							>
								{text1}
							</div>
							<div className='GearBoxPopupStyleTooltipSectBottomText'>
								{text2}
							</div>
						</div>
					</div>
				</div>
			);
		}
	}

	// This is the starting function when one of the prayers is mouseovered. This will set a style override and show the prayer icon 
	renderTooltip() {
		var prayerlist = require(`./gear/prayers.json`); // Load the prayers from our file.
		var prayer = prayerlist[this.state.mouseOverPrayer]; // Give us a variable with just the prayer that's being mouseovered. 
		var iconstyle = {
			backgroundImage: `url(${prayer.url})`,
			width: 6 * prayer.width + "vmin",
			height: 6 * prayer.height + "vmin"
		};
		// This is the prayer icon's gray background
		var backgroundstyle = {
			backgroundImage: `url(${tooltipiconback})`
		};

		// This will convert the mouseover prayer out of the hyphen separated form in the json file. 
		var wordarray = this.state.mouseOverPrayer.split("-");
		var title = wordarray.map(function (element) {
			return element.slice(0, 1).toUpperCase() + element.slice(1) + " ";
		});
		// This still needs to be played with, but the title will get smaller with longer lengths. 
		var fontsize = {
			fontSize: 0.65 - (title.length - 5) * 0.3 + "vmin"
		};
		if (this.state.mouseOverPrayer == "superhuman-strength") { // Superhuman Strength was too smol, so we manually set this one. 
			fontsize = {
				fontSize: "1.25vmin"
			};
		}
		return (
			<div className='GearBoxBack'>
				<div className='GearBoxPopupStyleTooltipBack' style={backgroundstyle}>
					<div className='GearBoxPopupPrayerIcon' style={iconstyle}></div>
				</div>
				<div className='GearBoxPopupStyleTooltipSect'>
					<div className='GearBoxPopupStyleTooltipSectTitle' style={fontsize}>
						{title}
					</div>
					<div className='GearBoxPopupStyleTooltipSectText' style={fontsize}>
						{this.renderTooltipText(prayerlist[this.state.mouseOverPrayer])}
					</div>
					<div className='GearBoxPopupPrayerTooltipDrain'>
						Drain: {prayerlist[this.state.mouseOverPrayer].drainrate}/min
					</div>
				</div>
			</div>
		);
	}

	// Called for each prayer in the list. The actual prayer object itself, as well as an X and Y grid value are passed here.
	renderPrayerIcon(prayer, posX, posY) {
		var thisstyle = {
			top: 4 + posY * 5 + "vmin",
			left: 1 + posX * 5 + "vmin"
		};
		var backiconstyle;
		var thisprayerstyle;
		// If the prayer is active, this will set the opacity of the active prayer back to 1.0. As this is instantaneous with a transition, it will fade in and out. 
		if (this.state.currentprayers.includes(prayer.name)) {
			backiconstyle = {
				backgroundImage: `url(${prayeron})`,
				opacity: "1.0"
			};
		} else {
			backiconstyle = {
				backgroundImage: `url(${prayeron})`,
				opacity: "0.0"
			};
		}
		// Sets the actual prayer icon. Each prayer icon has a different height and width, written as a float where 1.0 is the largest dimension and the other is a percentage of that dimension.
		thisprayerstyle = {
			backgroundImage: `url(${prayer.url})`,
			width: 3.5 * prayer.width + "vmin",
			height: 3.5 * prayer.height + "vmin"
		};

		// Both the back and the prayer icon itself get the mouseEnter and mouseLeave functions, to ensure smooth transition. 
		return (
			<div className='GearBoxPopupPrayerBack' style={thisstyle}>
				<div
					className='GearBoxPopupPrayerActive'
					style={backiconstyle}
					name={prayer.name}
					onClick={this.prayerClick}
					onMouseEnter={this.tooltipMouseoverEnter}
					onMouseLeave={this.tooltipMouseoverExit}
				></div>
				<div
					className='GearBoxPopupPrayerIcon'
					style={thisprayerstyle}
					name={prayer.name}
					onClick={this.prayerClick}
					onMouseEnter={this.tooltipMouseoverEnter}
					onMouseLeave={this.tooltipMouseoverExit}
				></div>
			</div>
		);
	}

	// This will usually be a 0.0 opacity, but when the prayer button is clicked, currpopupstyle will receive a new prop to show this. 
	// Displays the prayer list and corner elements. 
	renderGearPrayers(currpopupstyle) {
		var self = this;
		// Initializes the mouseover tooltip to our "hidden" style
		var currmouseover = {
			left: "-220%",
			opacity: "0.0",
			pointerEvents: "none",
			backgroundImage: `url(${PopupBackground})`
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
		// If there's a mouseover prayer, we'll set the tooltip style to show. There's a transition element on this in the css.
		if (this.state.mouseOverTooltip == true) {
			currmouseover = {
				opacity: "1.0",
				pointerEvents: "none",
				backgroundImage: `url(${PopupBackground})`
			};
		}

		// The prayer json was done poorly. Each key has a value of the appropriate attributes. 
		// This function fixes them such that we have an array of prayers with a .name element 
		var prayerlist = require(`./gear/prayers.json`); // Load the prayers from our file.
		var prayernames = Object.getOwnPropertyNames(prayerlist);
		var newprayerlist = [];
		prayernames.forEach(function (key) {
			newprayerlist.push({
				stat: prayerlist[key].stat,
				mod: prayerlist[key].mod,
				drainrate: prayerlist[key].drainrate,
				drainresist: prayerlist[key].drainresist,
				level: prayerlist[key].level,
				url: prayerlist[key].url,
				width: prayerlist[key].width,
				height: prayerlist[key].height,
				name: key
			});
		});

		// Initializes the grid variables. 
		var arraywide = -1; // up to 4 (6 elements), then reset
		var arrayheight = 0; // up to 3 (5 rows)

		return (
			<div className='GearBoxBack' style={clickable}>
				<div className='GearBoxPopupStyle' style={currpopupstyle}>
					<div className='GearBoxPopupBackCorner' style={styleupperleft}></div>
					<div className='GearBoxPopupBackCorner' style={styleupperright}></div>
					<div className='GearBoxPopupBackCorner' style={stylelowerright}></div>
					<div className='GearBoxPopupBackCorner' style={stylelowerleft}></div>
					<div className='GearBoxPopupInner'>Prayers</div>
					{newprayerlist.map(function (prayer) {
						// This will choose the "X" and "Y" positions of each prayer, returning the renderPrayerIcon function for each of them. 
						if (arraywide == 5) {
							arraywide = -1;
							arrayheight++;
						}
						if (arrayheight == 5) {
							arrayheight = 0;
						}
						arraywide++;
						return self.renderPrayerIcon(prayer, arraywide, arrayheight);
					})}
				</div>
				<div className='GearBoxPopupStyleTooltipPrayer' style={currmouseover}>
					<div className='GearBoxPopupBackCorner' style={styleupperleft}></div>
					<div className='GearBoxPopupBackCorner' style={styleupperright}></div>
					<div className='GearBoxPopupBackCorner' style={stylelowerright}></div>
					<div className='GearBoxPopupBackCorner' style={stylelowerleft}></div>
					<div className='GearBoxPopupInner'>{this.renderTooltip()}</div>
				</div>
			</div>
		);
	}


	componentDidMount() { // Called as soon as this component exists in the DOM
		this.urlUpdate(); // Runs the prayer icon back once to ensure it starts as "hidden", however I believe this isn't really used. 
	}

	render() {
		// If the prayer button is clicked, we'll use the bigger popup style that shows. Else it is hidden. 
		var currpopupstyle;
		if (this.state.popupActive == true) {
			currpopupstyle = {
				bottom: "110%",
				left: "-112.5%",
				width: "325%",
				height: "300%",
				opacity: "1.0",
				pointerEvents: "all",
				backgroundImage: `url(${PopupBackground})`
			};
		} else {
			currpopupstyle = {
				bottom: "70%",
				left: "0%",
				width: "100%",
				height: "150%",
				opacity: "0.0",
				pointerEvents: "none",
				backgroundImage: `url(${PopupBackground})`
			};
		}
		// Checks that there is a prayer active. If there is, it will turn on the prayer circle for the prayer button. 
		var backstyle;
		if (this.state.currentprayers.length > 0) {
			backstyle = {
				opacity: "1.0",
				backgroundImage: `url(${prayeron})`
			};
		} else {
			backstyle = {
				opacity: "0.0",
				backgroundImage: `url(${prayeron})`
			};
		}

		return (
			<div className='GearBoxBack'>
				<div
					className='GearBox_prayIconBack'
					style={backstyle}
					onClick={this.buttonClick}
				></div>
				<div
					id='GearBox_Slotprayer'
					className='GearBox_prayIcon'
					style={prayerstyle}
					onClick={this.buttonClick}
				></div>
				{this.renderGearPrayers(currpopupstyle) // renderGearPrayers is always active, it just shows when the user clicks the prayer button. 
				}
			</div>
		);
	}
}

export default GearBoxPrayer;
