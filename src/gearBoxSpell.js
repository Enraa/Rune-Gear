import React from "react";
import "./css/App.css";

import prayeron from "./tex/prayersloton.png";
import prayericon from "./tex/combattypeprayer.png";

import PopupBackground from "./tex/PopupBackground.png";
import bordertexcorner from "./tex/bordertexcorner.png";
import tooltipiconback from "./tex/tooltipiconback.png";

import levelsattack from "./tex/levels_attack_icon.png";
import levelsstrength from "./tex/type-strmelee.png";
import levelsdefense from "./tex/combattypedefence.png";
import levelsranged from "./tex/combattyperanged.png";
import levelsmagic from "./tex/combattypemagic.png";

import spellbookstandard from "./tex/Spellbook.png";
import spellbookancient from "./tex/Ancient_spellbook.png";

const jsonvars = require(`./jsonvars.json`);

class GearBoxSpell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentspell: "wind-strike",
			currentspellurl:
				"https://oldschool.runescape.wiki/images/a/a9/Wind_Strike_icon_%28mobile%29.png",
			currwidth: "1",
			currheight: "0.6923076923076923",
			currentbook: "standard",
			backstyle: {
				opacity: "0.0",
				backgroundImage: `url(${prayeron})`
			}, // This is the current style object for our main icon.
			testattrib: true,
			popupActive: false,
			mouseOverTooltip: false,
			mouseOverSpell: "wind-strike",
			outputDamage: 2 // This will be calculated on each spell as needed
		};

		this.buttonClick = this.buttonClick.bind(this);
		this.setBookStandard = this.setBookStandard.bind(this);
		this.setBookAncient = this.setBookAncient.bind(this);
		this.renderGearPrayers = this.renderGearPrayers.bind(this);
		this.renderPrayerIcon = this.renderPrayerIcon.bind(this);
		this.prayerClick = this.prayerClick.bind(this);
		this.tooltipMouseoverEnter = this.tooltipMouseoverEnter.bind(this);
		this.tooltipMouseoverExit = this.tooltipMouseoverExit.bind(this);
		this.renderTooltip = this.renderTooltip.bind(this);
	}

	closePopup() {
		this.setState({
			popupActive: false
		});
	}

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
		this.props.spellUpdate();
	}

	setBookStandard() {
		this.setState({
			currentbook: "standard"
		});
	}

	setBookAncient() {
		this.setState({
			currentbook: "ancient"
		});
	}

	tooltipMouseoverEnter(e) {
		this.setState({
			mouseOverTooltip: true,
			mouseOverSpell: e.target.attributes.name.value
		});
	}

	tooltipMouseoverExit() {
		this.setState({
			mouseOverTooltip: false
		});
	}

	calculateTotals(currentprayers) {
		var prayerlist = require(`./gear/prayers.json`); // Load the prayers from our file.
		var currentattack = 1.0;
		var currentstrength = 1.0;
		var currentdefense = 1.0;
		var currentranged = 1.0;
		var currentrangeddamage = 1.0;
		var currentmagic = 1.0;
		var drainrate = 0;
		var drainresist = 0;
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
				} else if (prayer == "chivalry" || prayer == "piety") {
					currentattack = 1 + ourprayer.mod / 100;
					currentstrength = 1 + ourprayer.mod2 / 100;
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

	prayerClick(e) {
		var theinput = e.target.attributes.name.value;
		var currentspell = this.state.currentspell;
		var spelllist = [];
		if (this.state.currentbook == "standard") {
			spelllist = require(`./gear/spellsstandard.json`); // Load the spells from our file.
		} else {
			spelllist = require(`./gear/spellsancient.json`); // Load the spells from our file.
		}
		var calculateddamage = parseInt(spelllist[theinput].damage);
		if (
			spelllist[theinput].type == "bolt" &&
			this.props.geartotals.seteffect.includes("chaos_gauntlets")
		) {
			// User has a chaos gauntlets and is casting a bolt spell
			calculateddamage = calculateddamage + 3;
		}
		if (
			spelllist[theinput].element == "fire" &&
			this.props.geartotals.seteffect.includes("tome_of_fire")
		) {
			// User has a tome of fire equipped and this is a fire spell
			calculateddamage = calculateddamage * 2;
		}
		if (
			spelllist[theinput].element == "slayerdart" &&
			!this.props.geartotals.seteffect.includes("slayer_staff")
		) {
			// User does not have slayer staff, but is casting slayer dart
			calculateddamage = 0;
		}
		if (
			spelllist[theinput].element == "slayerdart" &&
			!this.props.geartotals.seteffect.includes("slayer_staffe")
		) {
			// User does not have slayer staff, but is casting slayer dart
			calculateddamage = 0;
		}
		if (
			spelllist[theinput].element == "ibanblast" &&
			!this.props.geartotals.seteffect.includes("iban_staff")
		) {
			// User does not have iban staff, but is casting iban blast
			calculateddamage = 0;
		}
		if (
			spelllist[theinput].type == "zamorak" &&
			!this.props.geartotals.seteffect.includes("zamorak_staff")
		) {
			// User does not have zamorak staff, but is casting Flames of Zamorak
			calculateddamage = 0;
		}
		if (
			spelllist[theinput].type == "guthix" &&
			!this.props.geartotals.seteffect.includes("guthix_staff")
		) {
			// User does not have guthix staff, but is casting Claws of Guthix
			calculateddamage = 0;
		}
		if (
			spelllist[theinput].type == "saradomin" &&
			!this.props.geartotals.seteffect.includes("saradomin_staff")
		) {
			// User does not have saradomin staff, but is casting Saradomin Strike
			calculateddamage = 0;
		}
		if (
			spelllist[theinput].element == "godspell" &&
			this.props.geartotals.seteffect.includes("god_cloak") &&
			this.state.charged == true
		) {
			// User is casting a godspell and has Charge active
			calculateddamage = calculateddamage * 1.5;
		}
		this.setState({
			currentspell: theinput,
			currentspellurl: spelllist[theinput].url,
			outputDamage: calculateddamage,
			currheight: spelllist[theinput].height,
			currwidth: spelllist[theinput].width
		});
		var self = this;
		setTimeout(function(element) {
			self.props.spellUpdate();
		}, 100);
	}

	urlUpdate() {
		var ourback;
		if (true == false) {
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
	renderTooltipText(working) {
		var ourtext = "Damage: " + working.damage;
		var self = this;
		var moreroom = {
			marginBottom: "8%"
		};
		if (working.element == "slayerdart") {
			// We are calculating slayer dart, we should use the new damage formula for this.
			if (
				this.props.geartotals.seteffect.includes("slayer_staff") ||
				this.props.geartotals.seteffect.includes("staff_of_dead") ||
				this.props.geartotals.seteffect.includes("staff_of_dead_toxic") ||
				this.props.geartotals.seteffect.includes("staff_of_balance") ||
				this.props.geartotals.seteffect.includes("staff_of_light")
			) {
				ourtext = "Damage: " + Math.floor(this.props.currentlevels.magic / 10);
			} else if (this.props.geartotals.seteffect.includes("slayer_staffe")) {
				ourtext =
					"Damage: " +
					Math.floor(this.props.currentlevels.magic / 10 + 10) +
					", " +
					Math.floor(this.props.currentlevels.magic / 6 + 13) +
					" while on slayer task";
			} else {
				ourtext = "";
			}
		} else if (working.element == "fire") {
			// We are calculating fire spells
			if (this.props.geartotals.seteffect.includes("tome_of_fire")) {
				ourtext = "Damage: " + parseInt(working.damage) * 1.5;
			}
		} else if (working.element == "ibanblast") {
			// We are calculating iban blast
			if (this.props.geartotals.seteffect.includes("iban_staff")) {
				ourtext = "Damage: " + parseInt(working.damage);
			} else {
				ourtext = "";
			}
		} else if (working.element == "godspell") {
			// We are calculating God spells
			if (
				working.type == "saradomin" &&
				(this.props.geartotals.seteffect.includes("saradomin_staff") ||
					this.props.geartotals.seteffect.includes("staff_of_light"))
			) {
				if (
					this.props.charged == true &&
					this.props.geartotals.seteffect.includes("godcape")
				) {
					ourtext = "Damage: " + parseInt(working.damage) * 1.5;
				}
			} else if (
				working.type == "guthix" &&
				(this.props.geartotals.seteffect.includes("guthix_staff") ||
					this.props.geartotals.seteffect.includes("staff_of_balance"))
			) {
				if (
					this.props.charged == true &&
					this.props.geartotals.seteffect.includes("godcape")
				) {
					ourtext = "Damage: " + parseInt(working.damage) * 1.5;
				}
			} else if (
				working.type == "zamorak" &&
				(this.props.geartotals.seteffect.includes("zamorak_staff") ||
					this.props.geartotals.seteffect.includes("staff_of_dead") ||
					this.props.geartotals.seteffect.includes("staff_of_dead_toxic"))
			) {
				if (
					this.props.charged == true &&
					this.props.geartotals.seteffect.includes("godcape")
				) {
					ourtext = "Damage: " + parseInt(working.damage) * 1.5;
				}
			} else {
				ourtext = "";
			}
		} else if (working.element == "crumbleundead") {
			if (
				this.props.geartotals.seteffect.includes("slayer_staff") ||
				this.props.geartotals.seteffect.includes("staff_of_dead") ||
				this.props.geartotals.seteffect.includes("staff_of_dead_toxic") ||
				this.props.geartotals.seteffect.includes("staff_of_balance") ||
				this.props.geartotals.seteffect.includes("staff_of_light")
			) {
				ourtext = "Damage: " + parseInt(working.damage);
			} else {
				ourtext = "";
			}
		} else if (working.element == "charge") {
			ourtext = "";
		}
		return (
			<div className='GearboxBack'>
				<div className='GearBoxPopupStyleTooltipSectStandardTextPotion'>
					<div
						className='GearBoxPopupStyleTooltipSectBottomTextJustify'
						style={moreroom}
					>
						<div>{ourtext}</div>
						<div className='GearBoxPopupStyleTooltipSectBottomTextSpellInfo'>
							{working.info}
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderTooltip() {
		var prayerlist;
		if (this.state.currentbook == "standard") {
			prayerlist = require(`./gear/spellsstandard.json`); // Load the spells from our file.
		} else {
			prayerlist = require(`./gear/spellsancient.json`); // Load the spells from our file.
		}
		var prayer = prayerlist[this.state.mouseOverSpell];
		var rendertooltipspell;
		if (prayer != undefined) {
			var iconstyle = {
				backgroundImage: `url(${prayer.url})`,
				width: 6 * prayer.width + "vmin",
				height: 6 * prayer.height + "vmin"
			};
			rendertooltipspell = prayerlist[this.state.mouseOverSpell];
		} else {
			var iconstyle = {
				backgroundImage: `url(https://oldschool.runescape.wiki/images/a/a9/Wind_Strike_icon_%28mobile%29.png)`,
				width: "6vmin",
				height: "6vmin"
			};
			rendertooltipspell = {
				damage: "2",
				element: "air",
				type: "strike",
				level: "1",
				height: "0.6923076923076923",
				width: "1",
				url:
					"https://oldschool.runescape.wiki/images/a/a9/Wind_Strike_icon_%28mobile%29.png"
			};
		}
		var backgroundstyle = {
			backgroundImage: `url(${tooltipiconback})`
		};
		var wordarray = this.state.mouseOverSpell.split("-");
		var title = wordarray.map(function (element) {
			return element.slice(0, 1).toUpperCase() + element.slice(1) + " ";
		});
		var fontsize = {
			fontSize: 0.65 - (title.length - 5) * 0.3 + "vmin"
		};
		return (
			<div className='GearBoxBack'>
				<div className='GearBoxPopupStyleTooltipBack' style={backgroundstyle}>
					<div className='GearBoxPopupPrayerIcon' style={iconstyle}></div>
				</div>
				<div className='GearBoxPopupStyleTooltipSectSpell'>
					<div className='GearBoxPopupStyleTooltipSectTitle' style={fontsize}>
						{title}
					</div>
					<div className='GearBoxPopupStyleTooltipSectText' style={fontsize}>
						{this.renderTooltipText(rendertooltipspell)}
					</div>
				</div>
			</div>
		);
	}

	renderPrayerIcon(prayer, posX, posY) {
		var thisstyle = {
			top: 4 + posY * 5 + "vmin",
			left: 1 + posX * 5 + "vmin"
		};
		var backiconstyle;
		var thisprayerstyle;
		if (this.state.currentspell == prayer.name) {
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
		thisprayerstyle = {
			backgroundImage: `url(${prayer.url})`,
			width: 3.5 * prayer.width + "vmin",
			height: 3.5 * prayer.height + "vmin"
		};

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

	renderGearPrayers(currpopupstyle) {
		var self = this;
		var currmouseover;
		var clickable = {
			pointerEvents: "none"
		};
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
		var standardbook = {
			position: "absolute",
			top: "1vmin",
			left: "1vmin",
			backgroundSize: "100% 100%",
			backgroundImage: `url(${spellbookstandard})`,
			width: "2.5vmin",
			height: "2.5vmin"
		};
		var ancientbook = {
			position: "absolute",
			top: "1vmin",
			right: "1vmin",
			backgroundSize: "100% 100%",
			backgroundImage: `url(${spellbookancient})`,
			width: "2.5vmin",
			height: "2.5vmin"
		};
		if (this.state.mouseOverTooltip == true) {
			if (this.state.currentbook == "standard") {
				currmouseover = {
					right: "-290%",
					opacity: "1.0",
					pointerEvents: "none",
					backgroundImage: `url(${PopupBackground})`
				};
			} else {
				currmouseover = {
					right: "-212%",
					opacity: "1.0",
					pointerEvents: "none",
					backgroundImage: `url(${PopupBackground})`
				};
			}
		} else {
			if (this.state.currentbook == "standard") {
				currmouseover = {
					right: "-220%",
					opacity: "0.0",
					pointerEvents: "none",
					backgroundImage: `url(${PopupBackground})`
				};
			} else {
				currmouseover = {
					right: "-132%",
					opacity: "0.0",
					pointerEvents: "none",
					backgroundImage: `url(${PopupBackground})`
				};
			}
		}
		var spelllist = [];
		if (this.state.currentbook == "standard") {
			spelllist = require(`./gear/spellsstandard.json`); // Load the spells from our file.
		} else {
			spelllist = require(`./gear/spellsancient.json`); // Load the spells from our file.
		}
		var spellnames = Object.getOwnPropertyNames(spelllist);
		var newprayerlist = [];
		spellnames.forEach(function (key) {
			var newspell = new Object();
			newspell.damage = spelllist[key].damage;
			newspell.element = spelllist[key].element;
			newspell.type = spelllist[key].type;
			newspell.level = spelllist[key].level;
			newspell.url = spelllist[key].url;
			newspell.width = spelllist[key].width;
			newspell.height = spelllist[key].height;
			newspell.name = key;

			if (spelllist[key].hasOwnProperty("info")) {
				newspell.info = spelllist[key].info;
			}
			newprayerlist.push(newspell);
		});
		var arraywide = -1; // up to 4 (6 elements), then reset
		var arrayheight = 0; // up to 3 (5 rows)
		var spelltext;
		if (this.state.currentbook == "standard") {
			spelltext = "Standard Spells";
		} else {
			spelltext = "Ancient Spells";
		}

		return (
			<div className='GearBoxBack' style={clickable}>
				<div className='GearBoxPopupStyle' style={currpopupstyle}>
					<div className='GearBoxPopupBackCorner' style={styleupperleft}></div>
					<div className='GearBoxPopupBackCorner' style={styleupperright}></div>
					<div className='GearBoxPopupBackCorner' style={stylelowerright}></div>
					<div className='GearBoxPopupBackCorner' style={stylelowerleft}></div>
					<div className='GearBoxPopupInner'>{spelltext}</div>
					<div style={standardbook} onClick={this.setBookStandard} />
					<div style={ancientbook} onClick={this.setBookAncient} />
					{newprayerlist.map(function (prayer) {
						if (self.state.currentbook == "standard") {
							if (arraywide == 6) {
								arraywide = -1;
								arrayheight++;
							}
							if (arrayheight == 5) {
								arrayheight = 0;
							}
							arraywide++;
							return self.renderPrayerIcon(prayer, arraywide, arrayheight);
						} else {
							if (arraywide == 3) {
								arraywide = -1;
								arrayheight++;
							}
							if (arrayheight == 5) {
								arrayheight = 0;
							}
							arraywide++;
							return self.renderPrayerIcon(prayer, arraywide, arrayheight);
						}
					})}
				</div>
				<div className='GearBoxPopupStyleTooltipSpell' style={currmouseover}>
					<div className='GearBoxPopupBackCorner' style={styleupperleft}></div>
					<div className='GearBoxPopupBackCorner' style={styleupperright}></div>
					<div className='GearBoxPopupBackCorner' style={stylelowerright}></div>
					<div className='GearBoxPopupBackCorner' style={stylelowerleft}></div>
					<div className='GearBoxPopupInner'>{this.renderTooltip()}</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.urlUpdate();
	}

	componentDidUpdate() { }

	render() {
		var currpopupstyle;
		if (this.state.popupActive == true) {
			if (this.state.currentbook == "standard") {
				currpopupstyle = {
					bottom: "110%",
					left: "-137.5%",
					width: "375%",
					height: "250%",
					opacity: "1.0",
					pointerEvents: "all",
					backgroundImage: `url(${PopupBackground})`
				};
			} else {
				currpopupstyle = {
					bottom: "110%",
					left: "-62.5%",
					width: "225%",
					height: "250%",
					opacity: "1.0",
					pointerEvents: "all",
					backgroundImage: `url(${PopupBackground})`
				};
			}
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
		var backstyle;
		//if (this.state.currentprayers.length > 0) {
		//	backstyle = {
		//		opacity: "1.0",
		//		backgroundImage: `url(${prayeron})`
		//	};
		//} else {
		backstyle = {
			opacity: "0.0",
			backgroundImage: `url(${prayeron})`
		};
		//}
		var prayerstyle = {
			width: 6.0 * this.state.currwidth + "vmin",
			height: 6.0 * this.state.currheight + "vmin",
			backgroundImage: `url(${this.state.currentspellurl})`
		};

		return (
			<div className='GearBoxBack'>
				<div
					className='GearBox_prayIconBack'
					style={backstyle}
					onClick={this.buttonClick}
				></div>
				<div
					id='GearBox_Slotspell'
					className='GearBox_prayIcon'
					style={prayerstyle}
					onClick={this.buttonClick}
				></div>
				{this.renderGearPrayers(currpopupstyle)}
			</div>
		);
	}
}

export default GearBoxSpell;
