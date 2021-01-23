import React from "react";
import "./css/App.css";
import GearSection from "./gearSec";
import CalcSection from "./calcSec";

import gearBackground from "./tex/gearbackground.jpg";
import gearBackVignette from "./tex/backgroundvignette.png"
import gearSectionground from "./tex/sectback.png";

import gearbackheadi from "./tex/gearbackhead.png";
import gearbackamuleti from "./tex/gearbackamulet.png";
import gearbackammoi from "./tex/gearbackammo.png";
import gearbackbodyi from "./tex/gearbackbody.png";
import gearbackcapei from "./tex/gearbackcape.png";
import gearbackfeeti from "./tex/gearbackfeet.png";
import gearbackglovesi from "./tex/gearbackgloves.png";
import gearbackweaponi from "./tex/gearbackweapon.png";
import gearbacklegsi from "./tex/gearbacklegs.png";
import gearbackshieldi from "./tex/gearbackshield.png";
import gearbackringi from "./tex/gearbackring.png";
import gearbackemptyi from "./tex/gearbackempty.png";

const jsonvars = require(`./jsonvars.json`);
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

var testimer = 0;

var image = "Adamant Platebody";
var slot = "body";
var mainBackStyle = {
	height: "100%",
	width: "100%",
	backgroundImage: `url(${gearBackground})`
};
var mainbackvignette = {
	height: "100%",
	width: "100%",
	backgroundImage: `url(${gearBackVignette})`,
	backgroundSize: "100% 100%"
};
var gearBackStyle = {
	height: "100%",
	width: "42.4%"
};
var gearBoxStyle = {
	//backgroundImage: `url(${gearBackground})`
};
var sectionBackstyle = {
	//backgroundImage: `url(${gearSectionground})`
};

function gearSquare(props) {
	return (
		<div>
			<button id='gearbox' onClick={props.onClick}>
				{props.type}
			</button>
		</div>
	);
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			value: "",
			imageurl:
				"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x9s2dp.png",
			timer: 0.0,
			popupopen: false,
			popupbox: {
				currentitem: null,
				currentitemjson: null,
				suggesteditems: {},
				allitemsinslot: {},
				posx: 0,
				posy: 0
			},
			scale: 150,
			gear: [],
			geartotals: {
				atk_stab: "0",
				atk_slash: "0",
				atk_crush: "0",
				atk_magic: "0",
				atk_ranged: "0",
				def_stab: "0",
				def_slash: "0",
				def_crush: "0",
				def_magic: "0",
				def_ranged: "0",
				str_melee: "0",
				str_ranged: "0",
				str_magic: "0",
				str_prayer: "0",
				seteffect: [
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null
				],
				combatstyle: "unarmed"
			},
			prayercurrenttotalmod: {
				attack: "1.0",
				strength: "1.0",
				defense: "1.0",
				magic: "1.0",
				ranged: "1.0",
				rangeddamage: "1.0"
			},
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
			stylecurrentstyle: "none",
			stylecurrentdamage: "none",
			magicspell: "wind-strike",
			magicdamage: 1,
			currentlevel: {
				attack: 1,
				strength: 1,
				defence: 1,
				ranged: 1,
				prayer: 1,
				magic: 1
			}
		};

		var reflist = new Object();
		var backreflist = new Object();
		reflist["gear"] = React.createRef();
		reflist["calc"] = React.createRef();
		this.myRefs = reflist;

		this.gearUpdate = this.gearUpdate.bind(this);
		this.prayerUpdate = this.prayerUpdate.bind(this);
		this.potionUpdate = this.potionUpdate.bind(this);
		this.styleUpdate = this.styleUpdate.bind(this);
		this.spellUpdate = this.spellUpdate.bind(this);
		this.testEmptyReq = this.testEmptyReq.bind(this);
		this.testGearPopup = this.testGearPopup.bind(this);
		this.getSlot = this.getSlot.bind(this);
		this.updateStats = this.updateStats.bind(this);
		this.updateStatsCalc = this.updateStatsCalc.bind(this);
	}

	handleClicks() {
		if (this.state.popupopen === true) {
			// If it is open, destroy the popup if anywhere else is clicked. This will unregister the popup and set it's top and left % to nothing.
			this.setState({
				popupopen: false,
				popupbox: {
					currentitem: null,
					currentitemjson: null,
					suggesteditems: {},
					allitemsinslot: {}
				}
			});
			console.log("Closed Popup Window.");
		} else {
			console.log("Clicked but there's no popup window.");
		}
	}

	updateStats() {
		var self = this;
		this.setState({
			currentlevel: {
				attack: self.myRefs["calc"].current.state.level_atk,
				strength: self.myRefs["calc"].current.state.level_str,
				defence: self.myRefs["calc"].current.state.level_def,
				ranged: self.myRefs["calc"].current.state.level_ranged,
				prayer: self.myRefs["calc"].current.state.level_prayer,
				magic: self.myRefs["calc"].current.state.level_magic
			}
		});
	}

	updateStatsCalc() {
		this.myRefs["gear"].current.gearUpdate()
	}

	getSlot(slot) {
		var slottest;
		try {
			if (slot === "head") {
				slottest = this.state.head;
			} else if (slot === "amulet") {
				slottest = this.state.amulet;
			} else if (slot === "ammo") {
				slottest = this.state.ammo;
			} else if (slot === "cape") {
				slottest = this.state.cape;
			} else if (slot === "body") {
				slottest = this.state.body;
			} else if (slot === "leg") {
				slottest = this.state.leg;
			} else if (slot === "feet") {
				slottest = this.state.feet;
			} else if (slot === "ring") {
				slottest = this.state.ring;
			} else if (slot === "gloves") {
				slottest = this.state.gloves;
			} else if (slot === "weapon") {
				slottest = this.state.weapon;
			} else if (slot === "shield") {
				slottest = this.state.shield;
			}
		} catch (err) {
			slottest = [];
			slottest.push({
				name: "Invalid",
				type: slot,
				level: -1,
				req: {},
				weight: {},
				url: "https://oldschool.runescape.wiki/images/f/f4/Red_partyhat.png",
				atk: {
					stab: 0,
					slash: 0,
					crush: 0,
					magic: 0,
					ranged: 0
				},
				def: {
					stab: 0,
					slash: 0,
					crush: 0,
					magic: 0,
					ranged: 0
				},
				str: {
					melee: 0,
					ranged: 0,
					magic: 0,
					prayer: 0
				}
			});
		}

		return slottest;
	}

	gearUpdate(totals) {
		this.setState({
			geartotals: totals
		});
	}

	prayerUpdate(newprayertotal) {
		this.setState({
			prayercurrenttotalmod: newprayertotal
		});
	}

	potionUpdate(newpotiontotal) {
		this.setState({
			potioncurrenttotalmod: newpotiontotal
		});
	}

	styleUpdate(newcurrentstyle, newcurrentdamage) {
		this.setState({
			stylecurrentstyle: newcurrentstyle,
			stylecurrentdamage: newcurrentdamage
		});
	}

	spellUpdate(newmagicspell, newmagicdamage) {
		this.setState({
			magicspell: newmagicspell,
			magicdamage: newmagicdamage
		});
	}

	testEmptyReq(slot) {
		// This will test the prop's slot for the "Invalid" or "Empty" names which will be declared when empty.
		var emptytest = true; //this.state.gear[slot].name;

		// This is a stupid way to test this, but I don't know of a better one presently.

		if (emptytest === "Invalid" || emptytest === "Empty") {
			return true;
		} else {
			return false;
		}
	}

	testGearPopup() {
		var emptytest = this.state.popupopen;
		return emptytest;
	}

	componentDidMount() {
		var newslot = new Object();
		var i;
		for (i = 0; i < gearslots.length; i++) {
			//gearslots.forEach(slot => {
			if (gearslots[i] === "head") {
				newslot[gearslots[i]] = getNewGear(gearslots[i], gearbackheadi, 43, 2);
			} else if (gearslots[i] === "amulet") {
				newslot[gearslots[i]] = getNewGear(gearslots[i], gearbackheadi, 43, 17);
			} else if (gearslots[i] === "ammo") {
				newslot[gearslots[i]] = getNewGear(gearslots[i], gearbackheadi, 61, 17);
			} else if (gearslots[i] === "cape") {
				newslot[gearslots[i]] = getNewGear(gearslots[i], gearbackheadi, 25, 17);
			} else if (gearslots[i] === "body") {
				newslot[gearslots[i]] = getNewGear(gearslots[i], gearbackheadi, 43, 32);
			} else if (gearslots[i] === "leg") {
				newslot[gearslots[i]] = getNewGear(gearslots[i], gearbackheadi, 43, 48);
			} else if (gearslots[i] === "feet") {
				newslot[gearslots[i]] = getNewGear(gearslots[i], gearbackheadi, 43, 63);
			} else if (gearslots[i] === "ring") {
				newslot[gearslots[i]] = getNewGear(gearslots[i], gearbackheadi, 67, 63);
			} else if (gearslots[i] === "gloves") {
				newslot[gearslots[i]] = getNewGear(gearslots[i], gearbackheadi, 19, 63);
			} else if (gearslots[i] === "weapon") {
				newslot[gearslots[i]] = getNewGear(gearslots[i], gearbackheadi, 19, 32);
			} else if (gearslots[i] === "shield") {
				newslot[gearslots[i]] = getNewGear(gearslots[i], gearbackheadi, 67, 32);
			}

			try {
				console.log(newslot[gearslots[i]].type + " consolelogged");
			} catch (err) { }
			try {
				console.log(newslot["leg"].type + " blocked");
			} catch (err) { }

			if (gearslots[i] == "amulet") {
				//console.log(newslot["body"].type);
				console.log(newslot);
				//debugger;
			}

			console.log("Finished Loading for " + gearslots[i]);
		} //)
		console.log("Finished with everything.");
		console.log(newslot);

		// We finished initializing the gear section, we should be able to safely call t he <GearSection /> component now.
		this.setState({
			loaded: true
		});
	}

	render() {
		// This is where we can write our code to react to
		const status = "This is some sample text. " + this.state.timer.toFixed(1);

		var returned;
		if (this.state.loaded) {
			// <GearSection /> is receiving the geartypes array, which will determine each of the GearBoxes in that function. In this way, we control the gearboxes with a centralized function and maintain all of the individual boxs' properties in this app function.
			returned = (
				<div id='background' style={mainBackStyle}>
					<div id='background' style={mainbackvignette}>
						<div id='SectionBoxGear' style={sectionBackstyle}>
							<GearSection
								ref={this.myRefs["gear"]}
								gearUpdate={this.gearUpdate}
								testEmptyReq={this.testEmptyReq}
								testGearPopup={this.testGearPopup}
								getSlot={this.getSlot}
								combatstyle={this.state.combatstyle}
								prayerUpdate={this.prayerUpdate}
								potionUpdate={this.potionUpdate}
								styleUpdate={this.styleUpdate}
								spellUpdate={this.spellUpdate}
								currentlevels={this.state.currentlevel}
								geartotals={this.state.geartotals}
								onClick={() => this.handleClicks}
							/>
						</div>
						<div id='SectionBoxComp' style={sectionBackstyle}>
							<CalcSection
								ref={this.myRefs["calc"]}
								updateStatsCalc={this.updateStatsCalc}
								geartotals={this.state.geartotals}
								prayercurrenttotalmod={this.state.prayercurrenttotalmod}
								potioncurrenttotalmod={this.state.potioncurrenttotalmod}
								stylecurrentdamage={this.state.stylecurrentdamage}
								stylecurrentstyle={this.state.stylecurrentstyle}
								magicdamage={this.state.magicdamage}
								magicspell={this.state.magicspell}
								updateStats={this.updateStats}
							/>
						</div>
					</div>
				</div>
			);
		} else {
			returned = <div>Loading...</div>;
		}

		return (
			// This is where we can display the stuff
			returned
		);
	}
}

//function gearSquare(props) {
//    return (
//        <button className="gearselect-icon" onClick={props.onClick}>
//            {props.value}
//        </button>
//    );
//}

function getStats(slot, itemname) {
	var itemobjectstring;
	try {
		itemobjectstring = require(`./gear/${slot}/${itemname}.json`);
		return itemobjectstring;
	} catch (err) {
		itemobjectstring = require(`./gear/default.json`);
		return itemobjectstring;
	}
}

// Pass New Gear calls to this function to generate them. Returns an object which can be pushed to the array safely.
function getNewGear(slot, background, posX, posY) {
	let newgearadd = require(`./gear/default.json`);
	var tempslot; // Slot to determine the gearbackground
	var tempX; // Slot for X position
	var tempY; // Slot for Y position

	newgearadd.emptybackground = background;
	newgearadd.positionX = posX;
	newgearadd.positionY = posY;
	newgearadd.type = slot;

	return newgearadd;
}

class gearBoard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false
		};
	}

	//handleClick(i) {
	//var recommendedgear = getRecommendedGear(i); // Returns recommended gear for this slot based on current stat weights
	//var allgear = getallgear(i); // Returns every piece of gear that will fit that slot. Similarly levelled items will be prioritized.
	//}

	//renderGearSquare(i) {

	//}
}

export default App;
