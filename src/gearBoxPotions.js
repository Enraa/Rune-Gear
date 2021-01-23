import React from "react";
import "./css/App.css";

import prayeron from "./tex/prayersloton.png";
import potionicon from "./tex/potionicon.png";

import PopupBackground from "./tex/PopupBackground.png";
import bordertexcorner from "./tex/bordertexcorner.png";
import tooltipiconback from "./tex/tooltipiconback.png";

import levelsattack from "./tex/levels_attack_icon.png";
import levelsstrength from "./tex/type-strmelee.png";
import levelsdefense from "./tex/combattypedefence.png";
import levelsranged from "./tex/combattyperanged.png";
import levelsmagic from "./tex/combattypemagic.png";

const jsonvars = require(`./jsonvars.json`);

const potionstyle = {
	backgroundImage: `url(${potionicon})`
};

class GearBoxPotions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			prayerlist: null, // This variable will store every prayer that exists from json. Shorthand to reduce multiple imports.
			currentpotions: [], // Currently active prayers.
			//currentback: geartransp, // This will be our transparent png or a khaki circle png, depending if currentprayers.length is 0 or not
			backstyle: {
				opacity: "0.0",
				backgroundImage: `url(${prayeron})`
			}, // This is the current style object for our main icon.
			testattrib: true,
			mouseOverTooltip: false,
			mouseOverPrayer: "attack-potion",
			currentpotionmod: {
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
			popupActive: false
		};

		this.buttonClick = this.buttonClick.bind(this);
		this.potionClick = this.potionClick.bind(this);
		this.calculatePotions = this.calculatePotions.bind(this);
		this.tooltipMouseoverEnter = this.tooltipMouseoverEnter.bind(this);
		this.tooltipMouseoverExit = this.tooltipMouseoverExit.bind(this);
	}

	closePopup() {
		this.setState({
			popupActive: false
		});
	}

	tooltipMouseoverEnter(e) {
		this.setState({
			mouseOverTooltip: true,
			mouseOverPrayer: e.target.attributes.name.value
		});
		console.log(e.target.attributes.name.value);
	}

	tooltipMouseoverExit() {
		this.setState({
			mouseOverTooltip: false
		});
	}

	buttonClick() {
		var self = this;
		console.log("Clicked!");
		console.log(self.state.popupActive);
		if (self.state.popupActive == true) {
			self.setState({
				popupActive: false
			});
		} else {
			self.setState({
				popupActive: true
			});
		}
		this.props.potionUpdate();
	}

	buttonClick2() {
		if (this.state.testattrib == true) {
			this.setState({
				backstyle: {
					opacity: "1.0",
					backgroundImage: `url(${prayeron})`
				},
				testattrib: false,
				currentpotionmod: {
					attack: {
						percentage: "1.15",
						level: "5"
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
				}
			});
		} else {
			this.setState({
				backstyle: {
					opacity: "0.0",
					backgroundImage: `url(${prayeron})`
				},
				testattrib: true,
				currentpotionmod: {
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
				}
			});
		}
		this.props.potionUpdate();
	}

	potionClick(e) {
		console.log(e.target.attributes.name.value);
		var theinput = e.target.attributes.name.value;
		var currentpotions = this.state.currentpotions;
		if (currentpotions.includes(theinput)) {
			currentpotions.splice(currentpotions.indexOf(theinput), 1);
		} else {
			currentpotions.push(theinput);
		}
		this.calculatePotions(currentpotions);
	}

	calculatePotions(currentpotions) {
		var self = this;
		var currentmod = {
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
		};
		var potionlist = require(`./gear/potions.json`); // Load the prayers from our file.
		if (currentpotions.length > 0) {
			currentpotions.forEach(function(thetest) {
				var element = potionlist[thetest];
				for (var prop in element) {
					if (prop == "attack") {
						var teststat = self.props.currentlevels.attack;
						var currentchange = Math.floor(
							teststat * currentmod.attack.percentage +
								parseInt(currentmod.attack.level)
						);
						var newchange = Math.floor(
							(teststat * (parseInt(element.attack.mod) + 100)) / 100 +
								parseInt(element.attack.addlevel)
						);
						if (newchange > currentchange) {
							currentmod.attack = {
								percentage: (parseInt(element.attack.mod) + 100) / 100,
								level: parseInt(element.attack.addlevel)
							};
						}
						console.log(teststat, currentchange, newchange);
					}
					if (prop == "strength") {
						var teststat = self.props.currentlevels.strength;
						var currentchange = Math.floor(
							teststat * currentmod.strength.percentage +
								parseInt(currentmod.strength.level)
						);
						var newchange = Math.floor(
							(teststat * (parseInt(element.strength.mod) + 100)) / 100 +
								parseInt(element.strength.addlevel)
						);
						if (newchange > currentchange) {
							currentmod.strength = {
								percentage: (parseInt(element.strength.mod) + 100) / 100,
								level: parseInt(element.strength.addlevel)
							};
						}
					}
					if (prop == "defense") {
						console.log("Hi!");
						var teststat = self.props.currentlevels.defence;
						var currentchange = Math.floor(
							teststat * currentmod.defense.percentage +
								parseInt(currentmod.defense.level)
						);
						var newchange = Math.floor(
							(teststat * (parseInt(element.defense.mod) + 100)) / 100 +
								parseInt(element.defense.addlevel)
						);
						if (newchange > currentchange) {
							currentmod.defense = {
								percentage: (parseInt(element.defense.mod) + 100) / 100,
								level: parseInt(element.defense.addlevel)
							};
						}
					}
					if (prop == "ranged") {
						var teststat = self.props.currentlevels.ranged;
						var currentchange = Math.floor(
							teststat * currentmod.ranged.percentage +
								parseInt(currentmod.ranged.level)
						);
						var newchange = Math.floor(
							(teststat * (parseInt(element.ranged.mod) + 100)) / 100 +
								parseInt(element.ranged.addlevel)
						);
						if (newchange > currentchange) {
							currentmod.ranged = {
								percentage: (parseInt(element.ranged.mod) + 100) / 100,
								level: parseInt(element.ranged.addlevel)
							};
						}
					}
					if (prop == "magic") {
						var teststat = self.props.currentlevels.magic;
						var currentchange = Math.floor(
							teststat * currentmod.magic.percentage +
								parseInt(currentmod.magic.level)
						);
						var newchange = Math.floor(
							(teststat * (parseInt(element.magic.mod) + 100)) / 100 +
								parseInt(element.magic.addlevel)
						);
						if (newchange > currentchange) {
							currentmod.magic = {
								percentage: (parseInt(element.magic.mod) + 100) / 100,
								level: parseInt(element.magic.addlevel)
							};
						}
					}
				}
			});
		}
		console.log(currentmod);
		this.setState({
			currentpotions: currentpotions,
			currentpotionmod: currentmod
		});
		setTimeout(function(element) {
			self.props.potionUpdate();
		}, 100);
	}

	urlUpdate() {
		var ourback;
		if (this.state.currentpotions.length > 0) {
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
		var ourtext;
		var ourtext2;
		var ourtext3;
		var text1;
		var text2;
		var text1_2;
		var text2_2;
		var text1_3;
		var text2_3;
		var ourimage;
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
		var potiontoolarray = [];
		var standard = 0;
		if (working.attack != undefined) {
			var teststat = self.props.currentlevels.attack;
			currentchange = Math.floor(
				(teststat * Math.floor(parseFloat(working.attack.mod))) / 100 +
					teststat +
					parseInt(working.attack.addlevel)
			);
			console.log(Math.floor(parseFloat(working.attack.mod)) / 100);
			ourtext = `+${working.attack.mod}% + ${working.attack.addlevel} (${currentchange})`;
			ourimage = {
				backgroundImage: `url(${levelsattack})`
			};
			console.log(currentchange, teststat);
			potiontoolarray.push({
				currentchange: currentchange,
				text: ourtext,
				image: ourimage
			});
			standard = 1;
		}
		if (working.strength != undefined) {
			var teststat = self.props.currentlevels.strength;
			currentchange = Math.floor(
				(teststat * Math.floor(parseInt(working.strength.mod))) / 100 +
					teststat +
					parseInt(working.strength.addlevel)
			);
			ourtext = `+${working.strength.mod}% + ${working.strength.addlevel} (${currentchange})`;
			ourimage = {
				backgroundImage: `url(${levelsstrength})`
			};
			console.log(currentchange, teststat);
			potiontoolarray.push({
				currentchange: currentchange,
				text: ourtext,
				image: ourimage
			});
			standard = 1;
		}
		if (working.defense != undefined) {
			var teststat = self.props.currentlevels.defence;
			currentchange = Math.floor(
				(teststat * Math.floor(parseInt(working.defense.mod))) / 100 +
					teststat +
					parseInt(working.defense.addlevel)
			);
			ourtext = `+${working.defense.mod}% + ${working.defense.addlevel} (${currentchange})`;
			ourimage = {
				backgroundImage: `url(${levelsdefense})`
			};
			console.log(currentchange, teststat);
			potiontoolarray.push({
				currentchange: currentchange,
				text: ourtext,
				image: ourimage
			});
			standard = 1;
		}
		if (working.ranged != undefined) {
			var teststat = self.props.currentlevels.ranged;
			currentchange = Math.floor(
				(teststat * Math.floor(parseInt(working.ranged.mod))) / 100 +
					teststat +
					parseInt(working.ranged.addlevel)
			);
			ourtext = `+${working.ranged.mod}% + ${working.ranged.addlevel} (${currentchange})`;
			ourimage = {
				backgroundImage: `url(${levelsranged})`
			};
			console.log(currentchange, teststat);
			potiontoolarray.push({
				currentchange: currentchange,
				text: ourtext,
				image: ourimage
			});
			standard = 1;
		}
		if (working.magic != undefined) {
			var teststat = self.props.currentlevels.magic;
			currentchange = Math.floor(
				(teststat * Math.floor(parseInt(working.magic.mod))) / 100 +
					teststat +
					parseInt(working.magic.addlevel)
			);
			ourtext = `+${working.magic.mod}% + ${working.magic.addlevel} (${currentchange})`;
			ourimage = {
				backgroundImage: `url(${levelsmagic})`
			};
			console.log(currentchange, teststat);
			potiontoolarray.push({
				currentchange: currentchange,
				text: ourtext,
				image: ourimage
			});
			standard = 1;
		}
		var moreroom = {
			marginBottom: "4%"
		};
		return (
			<div className='GearboxBack'>
				<div className='GearBoxPopupStyleTooltipSectStandardTextPotion'>
					<div
						className='GearBoxPopupStyleTooltipSectBottomTextJustify'
						style={moreroom}
					>
						{potiontoolarray.map(function(element) {
							return (
								<div className='GearBoxPopupStyleTooltipSectBottomTextPotion'>
									<div
										className='GearBoxPopupStyleTooltipSectBottomTextPotionIcon'
										style={element.image}
									></div>
									<div className='GearBoxPopupStyleTooltipSectBottomTextPotionText'>
										{element.text}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}

	renderTooltip() {
		var prayerlist = require(`./gear/potions.json`); // Load the prayers from our file.
		var prayer = prayerlist[this.state.mouseOverPrayer];
		var iconstyle = {
			backgroundImage: `url(${prayer.url})`,
			width: 6 * prayer.width + "vmin",
			height: 6 * prayer.height + "vmin"
		};
		var backgroundstyle = {
			backgroundImage: `url(${tooltipiconback})`
		};

		var wordarray = this.state.mouseOverPrayer.split("-");
		var title = wordarray.map(function(element) {
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
				<div className='GearBoxPopupStyleTooltipSectPotion'>
					<div className='GearBoxPopupStyleTooltipSectTitle' style={fontsize}>
						{title}
					</div>
					<div className='GearBoxPopupStyleTooltipSectText' style={fontsize}>
						{this.renderTooltipText(prayerlist[this.state.mouseOverPrayer])}
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
		if (this.state.currentpotions.includes(prayer.name)) {
			// Set this once we know it's aligned properly.
			//if (true == true) {
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
					onClick={this.potionClick}
				></div>
				<div
					className='GearBoxPopupPrayerIcon'
					style={thisprayerstyle}
					name={prayer.name}
					onClick={this.potionClick}
					onMouseEnter={this.tooltipMouseoverEnter}
					onMouseLeave={this.tooltipMouseoverExit}
				></div>
			</div>
		);
	}

	renderGearPrayers(currpopupstyle) {
		var self = this;
		var currmouseover = {
			left: "-220%",
			opacity: "0.0",
			pointerEvents: "none",
			backgroundImage: `url(${PopupBackground})`
		};
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
		if (this.state.mouseOverTooltip == true) {
			currmouseover = {
				opacity: "1.0",
				pointerEvents: "none",
				backgroundImage: `url(${PopupBackground})`
			};
		}

		var prayerlist = require(`./gear/potions.json`); // Load the prayers from our file.
		console.log(Object.getOwnPropertyNames(prayerlist));
		var prayernames = Object.getOwnPropertyNames(prayerlist);
		var newprayerlist = [];
		prayernames.forEach(function(key) {
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
		var arraywide = 0; // up to 5 (6 elements), then reset
		var arrayheight = -1; // up to 2 (3 rows)

		return (
			<div className='GearBoxBack' style={clickable}>
				<div className='GearBoxPopupStyle' style={currpopupstyle}>
					<div className='GearBoxPopupBackCorner' style={styleupperleft}></div>
					<div className='GearBoxPopupBackCorner' style={styleupperright}></div>
					<div className='GearBoxPopupBackCorner' style={stylelowerright}></div>
					<div className='GearBoxPopupBackCorner' style={stylelowerleft}></div>
					<div className='GearBoxPopupInner'>Potions</div>
					{newprayerlist.map(function(prayer) {
						if (arrayheight == 2) {
							arrayheight = -1;
							arraywide++;
						}
						arrayheight++;
						return self.renderPrayerIcon(prayer, arraywide, arrayheight);
					})}
				</div>
				<div className='GearBoxPopupStyleTooltipPotion' style={currmouseover}>
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

	render() {
		var currpopupstyle;
		if (this.state.popupActive == true) {
			currpopupstyle = {
				bottom: "110%",
				left: "-112.5%",
				width: "325%",
				height: "200%",
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
		var backstyle;
		if (this.state.currentpotions.length > 0) {
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
					id='GearBox_Slotpotion'
					className='GearBox_potionIcon'
					style={potionstyle}
					onClick={this.buttonClick}
				></div>
				{this.renderGearPrayers(currpopupstyle)}
			</div>
		);
	}
}

export default GearBoxPotions;
