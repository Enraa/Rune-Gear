import React from "react";
import "./css/App.css";

import gearbackempty from "./tex/gearbackempty.png";
import geartransp from "./tex/gearempty.png";

var fs = require("fs");
const jsonvars = require(`./jsonvars.json`);

class GearBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currwidth: 74, // These are our default values - At least one of these dimensions will always be 74.
			currheight: 74,
			filename: "default",
			name: "somename",
			type: "none",
			level: 300,
			req_defence: 0,
			req_attack: 0,
			req_strength: 0,
			req_ranged: 0,
			req_magic: 0,
			req_prayer: 0,
			req_hitpoints: 0,
			weight: "none",
			url: "https://oldschool.runescape.wiki/images/f/f4/Red_partyhat.png",
			wiki: "https://oldschool.runescape.wiki",
			atk_stab: 0,
			atk_slash: 0,
			atk_crush: 0,
			atk_magic: 0,
			atk_ranged: 0,
			def_stab: 0,
			def_slash: 0,
			def_crush: 0,
			def_magic: 0,
			def_ranged: 0,
			str_melee: 0,
			str_ranged: 0,
			str_magic: 0,
			str_prayer: 0,
			seteffect: null,
			ZZ_positionX: 0,
			ZZ_positionY: 0,
			ZZ_backgroundEmpty: null,
			popupActive: false,
			override: false
		};
		this.gearUpdate = this.gearUpdate.bind(this);
		this.getImageURL = this.getImageURL.bind(this);
		this.giveCurrentState = this.giveCurrentState.bind(this);
		this.clickMethod = this.clickMethod.bind(this);
		this.mouseOverMethodEnter = this.mouseOverMethodEnter.bind(this);
		this.getImageDimensions = this.getImageDimensions.bind(this);

		this.clickMethodOld = this.clickMethodOld.bind(this);
		this.clickMethod = this.clickMethod.bind(this);
	}

	closePopup() {
		this.setState({
			popupActive: false
		});
	}

	clickMethod() {
		console.log("Setting Active");
		this.setState({
			popupActive: true
		});
	}

	clickMethodOld() {
		if (this.state.type == "weapon") {
			this.gearUpdate("abyssal_whip");
		} else if (this.state.type == "body") {
			this.gearUpdate("black_dhide_body");
		} else if (this.state.type == "shield") {
			this.gearUpdate("malediction_ward");
		} else if (this.state.type == "legs") {
			this.gearUpdate("dragon_plateskirt");
		} else if (this.state.type == "ammo") {
			this.gearUpdate("dragonstone_bolts");
		} else if (this.state.type == "amulet") {
			this.gearUpdate("occult_necklace");
		} else if (this.state.type == "cape") {
			this.gearUpdate("fire_cape");
		} else if (this.state.type == "feet") {
			this.gearUpdate("devout_boots");
		} else if (this.state.type == "gloves") {
			this.gearUpdate("barrows_gloves");
		} else if (this.state.type == "head") {
			this.gearUpdate("dharoks_helm");
		} else if (this.state.type == "ring") {
			this.gearUpdate("ring_of_suffering");
		}
	}

	mouseOverMethodEnter() {
		this.props.mouseOverMethodEnter(this.state.type);
	}

	giveCurrentState() {
		return `${this.state.type} working with level ${this.state.level}, Xpos: ${this.state.ZZ_positionX}`;
	}

	getImageURL() {
		console.log(`${this.state.currwidth}% ${this.state.currheight}%`);
		if (this.state.filename != "default") {
			return {
				backgroundImage: `url(${this.state.url})`,
				width: `${this.state.currwidth}%`,
				height: `${this.state.currheight}%`
			};
		} else {
			return {
				backgroundImage: `url(${geartransp})`,
				width: `${this.state.currwidth}%`,
				height: `${this.state.currheight}%`
			};
		}
	}

	getImageDimensions(theurl) {
		var img = new Image();
		var self = this;
		img.onload = function () {
			var height = img.height;
			var width = img.width;
			var dimensionscale = 1.0;

			console.log(height, width, dimensionscale);

			if (height > width) {
				// We have a toll boi
				dimensionscale = width / height;
				height = 74;
				width = Math.floor(74 * dimensionscale);
			} else if (width > height) {
				// We have a long boi
				dimensionscale = height / width;
				width = 74;
				height = Math.floor(74 * dimensionscale);
			} else {
				// Don't change our dimensions
				height = 74;
				width = 74;
			}

			console.log(height, width, dimensionscale);

			self.setState({
				currheight: height,
				currwidth: width
			});
		};

		img.src = theurl;
	}

	setOverride(bool) { // If we get this, set the override state!
		if (bool == false) { // We toggled off override, let's revert ourselves back to the item's stats. 
			this.setState({
				override: false
			})
			this.gearUpdate(this.props.nextItem);
		}
		else {
			this.setState({
				override: true
			})
		}
	}

	// Queries a new item to open. Call this with "default" or an invalid filename and it will return an empty square. Background square will update after this method is called.
	gearUpdate(filename) {
		var defaultjson;
		try {
			defaultjson = require(`./gear/${this.props.itemtype}/${filename}.json`);
			console.log(
				"Trying to require from " +
				`./gear/${this.props.itemtype}/${filename}.json`
			);
		} catch (err) {
			// We could not locate that file name. Something may have gone wrong.
			console.log(
				"Something went wrong. Tried to require from " +
				`./gear/${this.props.itemtype}/${filename}.json`
			);
			defaultjson = require(`./gear/${this.props.itemtype}/default.json`); // Grabs the default json for this type of item
		}
		this.setState({
			filename: defaultjson.filename,
			name: defaultjson.name,
			type: defaultjson.type,
			level: defaultjson.level,
			req_defence: defaultjson.req_defence,
			req_attack: defaultjson.req_attack,
			req_strength: defaultjson.req_strength,
			req_ranged: defaultjson.req_ranged,
			req_magic: defaultjson.req_magic,
			req_prayer: defaultjson.req_prayer,
			req_hitpoints: defaultjson.req_hitpoints,
			weight: defaultjson.weight,
			url: defaultjson.url,
			atk_stab: defaultjson.atk_stab,
			atk_slash: defaultjson.atk_slash,
			atk_crush: defaultjson.atk_crush,
			atk_magic: defaultjson.atk_magic,
			atk_ranged: defaultjson.atk_ranged,
			def_stab: defaultjson.def_stab,
			def_slash: defaultjson.def_slash,
			def_crush: defaultjson.def_crush,
			def_magic: defaultjson.def_magic,
			def_ranged: defaultjson.def_ranged,
			str_melee: defaultjson.str_melee,
			str_ranged: defaultjson.str_ranged,
			str_magic: defaultjson.str_magic,
			str_prayer: defaultjson.str_prayer,
			seteffect: defaultjson.seteffect,
			wiki: defaultjson.wiki,
			width: defaultjson.width,
			height: defaultjson.height
		});
		if (defaultjson.type == "weapon") {
			this.setState({
				combatstyle: defaultjson.combatstyle,
				speed: defaultjson.speed,
				twohanded: defaultjson.twohanded
			});
			this.props.unequipShield(defaultjson.twohanded);
		}
		this.getImageDimensions(defaultjson.url);

		this.props.changeSlotState(defaultjson.type, defaultjson.filename);
	}

	gearInit() {
		var defaultjson = require(`./gear/${this.props.itemtype}/default.json`); // Grabs the default json for this type of item
		this.setState({
			filename: defaultjson.filename,
			name: defaultjson.name,
			type: defaultjson.type,
			level: defaultjson.level,
			req_defence: defaultjson.req_defence,
			req_attack: defaultjson.req_attack,
			req_strength: defaultjson.req_strength,
			req_ranged: defaultjson.req_ranged,
			req_magic: defaultjson.req_magic,
			req_prayer: defaultjson.req_prayer,
			req_hitpoints: defaultjson.req_hitpoints,
			weight: defaultjson.weight,
			url: defaultjson.url,
			atk_stab: defaultjson.atk_stab,
			atk_slash: defaultjson.atk_slash,
			atk_crush: defaultjson.atk_crush,
			atk_magic: defaultjson.atk_magic,
			atk_ranged: defaultjson.atk_ranged,
			def_stab: defaultjson.def_stab,
			def_slash: defaultjson.def_slash,
			def_crush: defaultjson.def_crush,
			def_magic: defaultjson.def_magic,
			def_ranged: defaultjson.def_ranged,
			str_melee: defaultjson.str_melee,
			str_ranged: defaultjson.str_ranged,
			str_magic: defaultjson.str_magic,
			str_prayer: defaultjson.str_prayer,
			seteffect: defaultjson.seteffect,
			ZZ_positionX: defaultjson.ZZ_positionX,
			ZZ_positionY: defaultjson.ZZ_positionY
		});
		if (defaultjson.type == "weapon") {
			this.setState({
				combatstyle: defaultjson.combatstyle,
				speed: defaultjson.speed
			});
		}

		var backgroundEmpty = require(`./tex/gearback${defaultjson.type}.png`);

		this.setState({
			ZZ_backgroundEmpty: backgroundEmpty
		});

		this.props.changeSlotState(defaultjson.type, defaultjson.filename);
	}

	componentDidMount() {
		this.gearInit();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.state.name !== nextState.name ||
			this.state.currheight !== nextState.currheight ||
			this.state.currwidth !== nextState.currwidth ||
			this.state.popupActive !== nextState.popupActive ||
			this.props.nextItem !== nextProps.nextItem ||
			this.props.twohanded !== nextProps.twohanded ||
			this.state.override !== nextState.override
		);
	}

	componentDidUpdate() {
		if (this.props.twohanded == true && this.state.type == "shield") {
			this.gearUpdate("default")
			this.props.gearUpdate(); // This will tell GearSec to recalculate the totals
			return; // Get out of here
		}
		if (
			this.props.nextItem != null &&
			this.state.filename != this.props.nextItem
		) {
			this.gearUpdate(this.props.nextItem);
		}
		this.props.gearUpdate(); // This will tell GearSec to recalculate the totals
	}

	componentWillReceiveProps(nextProps) {
		// This will allow us to compare if the item name we receive is new. If it isn't, we can discard the update.
		if (nextProps.filename !== this.props.filename) {
			// This is different!
			console.log("RUN GEAR UPDATE!");
		}
	}

	render() {
		var imageurl = this.getImageURL();
		var idname = "GearBox_Slot" + this.state.type;

		return (
			<div id='GearBox'>
				<div
					className='GearBoxInner'
					id={idname}
					style={imageurl}
					onClick={this.props.gearitempopup}
				></div>
			</div>
		);
	}
}

var readJson = (path, cb) => {
	fs.readFile(require.resolve(path), (err, data) => {
		if (err) cb(err);
		else cb(null, JSON.parse(data));
	});
};

export default GearBox;
