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
			ZZ_backgroundEmpty: null
		};
		this.gearUpdate = this.gearUpdate.bind(this);
		this.getImageURL = this.getImageURL.bind(this);
		this.giveCurrentState = this.giveCurrentState.bind(this);
		this.clickMethod = this.clickMethod.bind(this);
		this.mouseOverMethodEnter = this.mouseOverMethodEnter.bind(this);
	}

	clickMethod() {
		if (this.state.type == "weapon") {
			this.gearUpdate("abyssal_whip");
		} else if (this.state.type == "body") {
			this.gearUpdate("black_dhide_body");
		} else if (this.state.type == "shield") {
			this.gearUpdate("malediction_ward");
		}
	}

	mouseOverMethodEnter() {
		this.props.mouseOverMethodEnter(this.state.type);
	}

	giveCurrentState() {
		return `${this.state.type} working with level ${this.state.level}, Xpos: ${this.state.ZZ_positionX}`;
	}

	getImageURL() {
		if (this.state.filename != "default") {
			return {
				backgroundImage: `url(${this.state.url})`
			};
		} else {
			return {
				backgroundImage: `url(${geartransp})`
			};
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
			seteffect: defaultjson.seteffect
		});

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
		return this.state.name !== nextState.name;
	}

	componentDidUpdate() {
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

		return (
			<div
				id='GearBoxInner'
				style={imageurl}
				onClick={this.clickMethod}
				onMouseEnter={this.mouseOverMethodEnter}
				onMouseLeave={this.props.mouseOverMethodExit}
			></div>
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
