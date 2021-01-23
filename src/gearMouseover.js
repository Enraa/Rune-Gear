import React from "react";
import "./css/App.css";
import "./css/gearMouseover.css";

// Import the gear background textures
import gearPopupBack from "./tex/gearPopupBack.png";
import gearMouseoverTypeTitle from "./tex/gearMouseoverTypeTitle.png";
import gearStatBackground from "./tex/gearstatmouseoverbackground.png";

// Import the combat weight icons used in the upper right corner
import combat_type_melee from "./tex/combattypemelee.png";
import combat_type_ranged from "./tex/combattyperanged.png";
import combat_type_magic from "./tex/combattypemagic.png";
import combat_type_defence from "./tex/combattypedefence.png";
import combat_type_prayer from "./tex/combattypeprayer.png";
import combat_type_hybrid from "./tex/combattypehybrid.png";

// Import the bonus icons as used on Oldschool Wiki
import staticonstab from "./tex/type-stab.png";
import staticonslash from "./tex/type-slash.png";
import staticoncrush from "./tex/type-crush.png";
import staticonmagic from "./tex/type-magic.png";
import staticonranged from "./tex/type-ranged.png";
import staticonmeleestr from "./tex/type-strmelee.png";
import staticonrangedstr from "./tex/type-strranged.png";
import staticonmagicstr from "./tex/type-strmagic.png";
import staticonprayerstr from "./tex/type-strprayer.png";

import { stat } from "fs";

const jsonvars = require(`./jsonvars.json`);

class GearMouseover extends React.Component {
	constructor(props) {
		super(props);
		//this.state = {}
		this.myRef = React.createRef();
	}

	boxPopupPositionStyle(posX, posY, height, delta, opacity) {
		// Returns a styles sheet given a position x and y
		return {
			top: posY - delta + "px",
			left: posX + 16 + "px",
			width: "250px",
			height: height + "px",
			backgroundImage: `url(${gearPopupBack})`
		};
	}

	componentDidMount = () => {
		this.props.mouseOverTransitionComplete();
	};

	renderItemWeightText(weight) {
		if (weight != "none") {
			var prettypicture;
			var colorstyle;
			var weightName =
				this.props.gearDetails.weight.charAt(0).toUpperCase() +
				this.props.gearDetails.weight.slice(1);
			switch (weight) {
				case "melee":
					prettypicture = combat_type_melee;
					colorstyle = { color: "red" };
					break;
				case "ranged":
					prettypicture = combat_type_ranged;
					colorstyle = { color: "lawngreen" };
					break;
				case "magic":
					prettypicture = combat_type_magic;
					colorstyle = { color: "blue" };
					break;
				case "prayer":
					prettypicture = combat_type_prayer;
					colorstyle = { color: "skyblue" };
					break;
				default:
					prettypicture = combat_type_hybrid;
					colorstyle = { color: "white" };
			}
			return (
				<div>
					<div id='GearMouseoverTitleWeight' style={colorstyle}>
						{weightName}
					</div>
					<div id='GearMouseoverTitleWeightIcon'>
						<img src={prettypicture} height='18' width='18'></img>
					</div>
				</div>
			);
		}
	}

	renderNothingText(text) {
		if (text !== "") {
			return <div id='GearMouseoverNothing'>{text}</div>;
		}
	}

	renderItemNameText(text) {
		if (text !== "") {
			return <div id='GearMouseoverItemName'>{text}</div>;
		}
	}

	renderItemStatSect(atkarr, defarr, strarr, nothingtest) {
		if (nothingtest !== "") {
			var thestyle = {
				backgroundImage: `url(${gearStatBackground})`
			};

			return (
				<div id='GearMouseoverStyleBackplate' style={thestyle}>
					{this.renderItemStyleBonuses(atkarr, "attack", nothingtest)}
					{this.renderItemStyleBonuses(defarr, "defense", nothingtest)}
					{this.renderItemStyleBonusesIcons()}
					{this.renderItemStyleStrBonuses(strarr)}
				</div>
			);
		}
	}

	renderItemStyleBonuses(array, type, nothingtest) {
		// Called twice for each of attack and defense.
		if (nothingtest !== "") {
			var marginStyle;
			// Determine where we'll pad our result
			if (type == "attack") {
				marginStyle = {
					left: "26px"
				};
			} else if (type == "defense") {
				marginStyle = {
					right: "26px",
					textAlign: "right"
				};
			}
			console.log(marginStyle);

			return (
				<div id='GearMouseoverStyleBack' style={marginStyle}>
					{array.map(element => this.renderItemStyleBonusText(element))}
				</div>
			);
		}
	}

	renderItemStyleBonusText(element) {
		var elementint = parseInt(element);
		var result = element;
		var styleBonus;
		if (0 > elementint) {
			// This is LESS than 0, indicating a negative value
			styleBonus = {
				color: "red"
			};
		} else if (elementint == 0) {
			// This is exactly 0, let's gray the returned number
			styleBonus = {
				color: "gray"
			};
		} else {
			// This is a positive number, so let's just give this a normal white color
			styleBonus = {
				color: "white"
			};
			result = "+" + result;
		}
		return (
			<div id='GearMouseoverStatsText' style={styleBonus}>
				{result}
			</div>
		);
	}

	renderItemStyleBonusesIcons() {
		const offsetvars = ["4", "10", "16", "22", "30"];

		return (
			<div id='GearMouseoverStatsTypeIconBack'>
				{this.renderItemStyleBonusIcon(staticonstab, offsetvars[0])}
				{this.renderItemStyleBonusIcon(staticonslash, offsetvars[1])}
				{this.renderItemStyleBonusIcon(staticoncrush, offsetvars[2])}
				{this.renderItemStyleBonusIcon(staticonmagic, offsetvars[3])}
				{this.renderItemStyleBonusIcon(staticonranged, offsetvars[4])}
			</div>
		);
	}

	renderItemStyleBonusIcon(inputurl, offset) {
		var thisStyle = {
			top: offset + "px",
			backgroundImage: `url(${inputurl})`
		};

		return <div id='GearMouseoverStatsTypeIcon' style={thisStyle}></div>;
	}

	renderItemStyleStrBonuses(array) {
		// This is a horizontal array that will show the strength bonuses of a given mouseover item.
		var marginStyle;
		// Determine where we'll pad our result
		return (
			<div id='GearMouseoverStyleStrBack'>
				{array.map(element => this.renderItemStyleStrBonusText(element))}
			</div>
		);
	}

	renderItemStyleStrBonusText(element) {
		var elementint = parseInt(element);
		var result = element;
		var styleBonus;
		if (0 > elementint) {
			// This is LESS than 0, indicating a negative value
			styleBonus = {
				color: "red"
			};
		} else if (elementint == 0) {
			// This is exactly 0, let's gray the returned number
			styleBonus = {
				color: "gray"
			};
		} else {
			// This is a positive number, so let's just give this a normal white color
			styleBonus = {
				color: "white"
			};
			result = "+" + result;
		}
		return (
			<div id='GearMouseoverStatsStrText' style={styleBonus}>
				{result}
			</div>
		);
	}

	renderStatBlock(stats, type) {
		// Two of these will be called for each of the horizontal sides. This will create 3 divs, 2 vertical, 1 horizontal
		var vert = true;
		var itemicons = [];
		if (type == "attack") {
			itemicons = [];
		}
		stats.forEach(element => {});
	}

	render() {
		var totalheight = 400;
		var delta = 0;

		// Title Variables
		var titlebackground = { backgroundImage: `url(${gearMouseoverTypeTitle})` };
		console.log(this.props);
		var slotName =
			this.props.gearDetails.type.charAt(0).toUpperCase() +
			this.props.gearDetails.type.slice(1);

		// Stats Variables
		var pseudotext = "";
		var itemnametext = "";
		var itematkstats = [];
		var itemdefstats = [];
		var itemstrstats = [];
		if (this.props.gearDetails.filename == "default") {
			pseudotext = "There is nothing equipped here.";
			totalheight = 100;
		} else {
			itemnametext = this.props.gearDetails.name;
			itematkstats = [
				this.props.gearDetails.atk_stab,
				this.props.gearDetails.atk_slash,
				this.props.gearDetails.atk_crush,
				this.props.gearDetails.atk_magic,
				this.props.gearDetails.atk_ranged
			];
			itemdefstats = [
				this.props.gearDetails.def_stab,
				this.props.gearDetails.def_slash,
				this.props.gearDetails.def_crush,
				this.props.gearDetails.def_magic,
				this.props.gearDetails.def_ranged
			];
			itemstrstats = [
				this.props.gearDetails.str_melee,
				this.props.gearDetails.str_ranged,
				this.props.gearDetails.str_magic,
				this.props.gearDetails.str_prayer
			];
		}

		console.log(
			"Current state coords:" +
				this.props.styleX +
				", " +
				this.props.styleY +
				", read type is " +
				this.props.gearDetails.type
		);
		console.log(itematkstats);
		if (this.props.styleY + totalheight + 20 > window.innerHeight) {
			delta = this.props.styleY + totalheight + 20 - window.innerHeight;
		}

		return (
			<div
				id='GearMouseoverMain'
				key='gearPopup'
				ref={this.myRef}
				style={this.boxPopupPositionStyle(
					this.props.styleX,
					this.props.styleY,
					totalheight,
					delta,
					this.props.opacity
				)}
			>
				<div id='GearMouseoverTitle' style={titlebackground}>
					<div id='GearMouseoverTitleFont'>{slotName}</div>
					{this.renderItemWeightText(this.props.gearDetails.weight)}
				</div>
				{this.renderNothingText(pseudotext)}
				{this.renderItemNameText(itemnametext)}
				{this.renderItemStatSect(
					itematkstats,
					itemdefstats,
					itemstrstats,
					itemnametext
				)}
			</div>
		);
	}
}

export default GearMouseover;
