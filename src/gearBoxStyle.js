import React from "react";
import "./css/App.css";

// The window background and corners
import bordertexcorner from "./tex/bordertexcorner.png";
import PopupBackground from "./tex/PopupBackground.png";

// Each of the style bars
import barstyleattack from "./tex/barstyleattack.png";
import barstylecontrolled from "./tex/barstylecontrolled.png";
import barstyledefence from "./tex/barstyledefence.png";
import barstylemagic from "./tex/barstylemagic.png";
import barstyleranged from "./tex/barstyleranged.png";
import barstylestrength from "./tex/barstylestrength.png";

// Each of the attack style icons
import staticonstab from "./tex/type-stab.png";
import staticonslash from "./tex/type-slash.png";
import staticoncrush from "./tex/type-crush.png";
import staticonmagic from "./tex/type-magic.png";
import staticonranged from "./tex/type-ranged.png";


class GearBoxStyle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currtype: "none", // This is the weapon group we have selected. Each group will generate a state variable as needed, initializing to the first style listed in the json file.
			currstyle: "none", // This is the style we're attacking in, either Accurate, Aggressive, Controlled, Defensive, etc
			currdamage: "none", // This is the actual damage output we should calculate our DPS with. Stab, Slash, Crush, Ranged, Magic
			currtext: "None", // This is the current display on the box.
			currXP: "attack", // When hitting things, this is the kind of exp that will be yielded. Not useful yet.
			curravailstyles: [], // This will store the current styles of the weapon we have equipped.
			popupActive: false // False = not showing the style list; true = is showing the style list
		};

		// All of the .bind(this) functions
		this.loadStyle = this.loadStyle.bind(this);
		this.buttonClick = this.buttonClick.bind(this);
		this.changeStyle = this.changeStyle.bind(this);
	}

	// Called when a new weapon is loaded. Newstyle is the type of weapon passed to this object. 
	loadStyle(newstyle) {
		var styles = require(`./gear/weaponstyles.json`); // Load the weapon styles from our file.
		var self = this;
		// Put all of this in a try block since this seems to crash for no reason. 
		try {
			// We've selected this weapon class before, so we'll try to use the same style we had before. 
			if (self.state[newstyle] != null) {
				var split = self.state[newstyle].split("-");
				self.setState({
					currtype: newstyle,
					currstyle: split[0], // "accurate", "aggressive", "defensive" etc
					currdamage: split[1], // "stab", "slash", "crush" etc
					curravailstyles: styles[newstyle]
				});
				// We've never seen this weapon before, so we'll use the first type of attack, just like the game. 
				// For most weapons, this will be "Accurate"
			} else {
				var stylearray = styles[newstyle];
				var split = stylearray[0].split("-");
				self.setState({
					currtype: newstyle,
					currstyle: split[0], // "accurate", "aggressive", "defensive" etc
					currdamage: split[1], // "stab", "slash", "crush" etc
					curravailstyles: stylearray,
					[newstyle]: stylearray[0]
				});
			}
			// If for some reason something went wrong or we called this with nothing in newstyle, we'll load the unarmed style list. 
		} catch (err) {
			var stylearray = styles["unarmed"];
			console.log(stylearray);
			var split = stylearray[0].split("-");
			self.setState({
				currtype: newstyle,
				currstyle: split[0], // "accurate", "aggressive", "defensive" etc
				currdamage: split[1], // "stab", "slash", "crush" etc
				curravailstyles: stylearray,
				unarmed: stylearray[0]
			});
		}
		// After we've chosen a new weapon and loaded the styles for it, update what style we have for the rest of the app. 
		setTimeout(function (el) {
			self.props.styleUpdate();
		}, 100);
	}

	// Closes the popup when called. This is usually called from GearSec's ClickMenuClear() function
	closePopup() {
		this.setState({
			popupActive: false
		});
	}

	// Opens the popup when the style button is clicked
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
	}

	// I am unsure what this button does. It's called when a style is clicked. 
	buttonClick2() {
		console.log("A clicked button!");
	}

	// Called when a style is clicked. It will read the style and update the state to use that new style. 
	changeStyle(inputstyle) {
		var thestyleinput = inputstyle.target.attributes.name.value; // This is the style we clicked
		var self = this;
		var split = thestyleinput.split("-");
		var weaponclass = this.state.currtype;
		self.setState({
			currstyle: split[0],
			currdamage: split[1],
			[weaponclass]: thestyleinput,
			popupActive: false // This will set popupactive to false, since we no longer need it. 
		});
		// Update the style bonuses after we've set ourselves again. 
		setTimeout(function (el) {
			self.props.styleUpdate();
		}, 100);
		console.log(thestyleinput);
	}

	// Holdover code from CalcSec, but height/width adjusted a bit. This is used to draw the attack style icon. 
	// This function should be renamed. 
	renderItemStyleBonusIconMonster(inputurl) {
		var thisStyle = {
			marginBottom: "1.05vmin",
			marginLeft: "0",
			backgroundImage: `url(${inputurl})`,
			top: "0%",
			left: "0%",
			height: "2.1vmin",
			width: "2.1vmin",
			float: "left"
		};

		return <div id='CalcBonusTotalsLevelsIcon' style={thisStyle}></div>;
	}

	// Displays the actual style text on the style button. 
	getCurrentText() {
		var returntext;
		var self = this;
		// This part should never happen, but the case is there anyway. 
		if (self.state.currtype == "none") {
			returntext = "None";
		} else {
			// Trident class weapon
			if (self.state.currtype == "staff-selfpowering") {
				if ((self.state.currstyle = "accurate")) {
					returntext = "Accurate Trident";
				} else {
					returntext = "Long-range Trident";
				}
				// Normal staff of some sort, selecting spell casting
			} else if (self.state.currstyle == "spell") {
				returntext = "Auto Casting";
			} else if (self.state.currstyle == "spelldefensive") {
				returntext = "Auto Casting (Def)";
				// We have a salamander. 
			} else if (
				self.state.currdamage == "magic" ||
				self.state.currstyle == "weapon"
			) {
				returntext = "Salamander Magic";
				// Using long-ranged bow attacks 
			} else {
				if (self.state.currstyle == "longrange") {
					returntext =
						"L.Range " +
						self.state.currdamage.charAt(0).toUpperCase() +
						self.state.currdamage.slice(1);
					// Everything else. This should output "Accurate Crush", "Aggressive Slash" etc
				} else {
					returntext =
						self.state.currstyle.charAt(0).toUpperCase() +
						self.state.currstyle.slice(1) +
						" " +
						self.state.currdamage.charAt(0).toUpperCase() +
						self.state.currdamage.slice(1);
				}
			}
		}
		return returntext;
	}

	// Draws for each style bar. style is the weapon's style supplied here. 
	renderStyleBar(style) {
		// Initialize the variables. currbartexture will be "controlled" for the cases where nothing else applies. 
		var currbartexture = barstylecontrolled;
		var type; // Type of Damage. This will be "Stab", "Slash", "Crush", "Ranged", or "Magic"
		var attackstyle; // Style of the attack. "Accurate", "Aggressive" etc
		var typenote; // Stat bonus of the attack. Typically this is +3 in the appropriate stat. 
		var typeicon; // Damage Type icon. This will be the stab, slash, crush, ranged or magic icon. 
		// Set the type, typeicon and attackstyle appropriately. 
		// This will give a blue style bar if the damage is magical. 
		if (style.search("magic") != -1) {
			currbartexture = barstylemagic;
			type = "Magic";
			typeicon = staticonmagic;
			typenote = "";
			if (style.search("spell") != -1) {
				typenote = "Autocast";
				attackstyle = "Spell";
			}
			if (style.search("spelldefensive") != -1) {
				typenote = "Autocast +3 Def";
				attackstyle = "D. Spell";
			}
			// This will give a green style bar if the damage is ranged
		} else if (style.search("ranged") != -1) {
			// This will give a lightblue style bar for defense. 
			if (style.search("longrange") != -1) {
				currbartexture = barstyledefence;
				typenote = "+3 Defence";
				attackstyle = "Long-Range";
			} else {
				typenote = "+3 Ranged";
				attackstyle = "Accurate";
				currbartexture = barstyleranged;
			}
			if (style.search("rapid") != -1) {
				typenote = "+1 AtkSpd";
				attackstyle = "Rapid";
			}
			type = "Ranged";
			typeicon = staticonranged;
			// This will give a red, orange or gray style bar for melee
		} else {
			if (style.search("accurate") != -1) {
				currbartexture = barstyleattack;
				typenote = "+3 Attack";
				attackstyle = "Accurate";
			} else if (style.search("aggressive") != -1) {
				currbartexture = barstylestrength;
				typenote = "+3 Strength";
				attackstyle = "Aggressive";
			} else if (style.search("defensive") != -1) {
				// This will give a lightblue style bar for defense. 
				currbartexture = barstyledefence;
				typenote = "+3 Defence";
				attackstyle = "Defensive";
			} else {
				attackstyle = "Controlled";
				typenote = "+1 Stats";
			}
			if (style.search("stab") != -1) {
				type = "Stab";
				typeicon = staticonstab;
			} else if (style.search("slash") != -1) {
				type = "Slash";
				typeicon = staticonslash;
			} else {
				type = "Crush";
				typeicon = staticoncrush;
			}
		}
		// Finally set the bar background texture and draw the elements on top of it. 
		var barstyle = {
			backgroundImage: `url(${currbartexture})`
		};
		return (
			<div
				className='GearBoxPopupStyleBar'
				style={barstyle}
				name={style}
				onClick={this.changeStyle}
			>
				<div className='GearBoxPopupStyleBarText'>
					{this.renderItemStyleBonusIconMonster(typeicon)}
					{attackstyle + " " + type}
					<div className='GearBoxPopupStyleBarTextSmall'>{typenote}</div>
				</div>
			</div>
		);
	}

	// Draws the actual styles window. 
	renderGearStyles(currpopupstyle) {
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

		return (
			<div className='GearBoxBack' style={clickable}>
				<div
					className='GearBoxPopupStyle'
					style={currpopupstyle}
					onClick={this.buttonClick2}
				>
					<div className='GearBoxPopupBackCorner' style={styleupperleft}></div>
					<div className='GearBoxPopupBackCorner' style={styleupperright}></div>
					<div className='GearBoxPopupBackCorner' style={stylelowerright}></div>
					<div className='GearBoxPopupBackCorner' style={stylelowerleft}></div>
					<div className='GearBoxPopupInner'>
						Attack Styles
						{this.state.curravailstyles.map(styleslot =>
							this.renderStyleBar(styleslot)
						)}
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		// When the component spawns, load unarmed.
		this.loadStyle("unarmed");
		var self = this;
		setTimeout(function (el) {
			self.props.styleUpdate();
		}, 200);
	}

	shouldComponentUpdate(nextProps, nextState) {
		// Limit our updates if we don't have a relevant update. We don't need to change on every single prop change. 
		return (
			this.state.currtype != nextState.currtype ||
			this.props != nextProps ||
			this.state.currtext != nextState.currtext ||
			this.state.popupActive != nextState.popupActive ||
			this.state.currstyle != nextState.currstyle
		);
	}

	componentDidUpdate() {
		// If we received a new type *and* currtype isn't empty, we'll go ahead and load it. 
		// This is used to load the new styles when we equip a new weapon
		if (
			this.props.currtype != this.state.currtype &&
			this.props.currtype != null
		) {
			this.loadStyle(this.props.currtype);
		} else {
			var newtext = this.getCurrentText(); // This will recalculate the current text only after each style change
			this.setState({
				currtext: newtext
			});
		}
	}

	render() {
		// If the style button is clicked, we'll use the bigger popup style that shows. Else it is hidden. 
		var currpopupstyle;
		if (this.state.popupActive == true) {
			currpopupstyle = {
				bottom: "110%",
				left: "-100%",
				width: "300%",
				height: 60 + 40 * this.state.curravailstyles.length + "%",
				opacity: "1.0",
				pointerEvents: "all",
				backgroundImage: `url(${PopupBackground})`
			};
		} else {
			currpopupstyle = {
				bottom: "70%",
				left: "-50%",
				width: "160%",
				height: 60 + (40 * this.state.curravailstyles.length) / 2 + "%",
				opacity: "0.0",
				pointerEvents: "none",
				backgroundImage: `url(${PopupBackground})`
			};
		}

		return (
			<div className='GearBoxBack'>
				<div
					className='GearBoxBack'
					id='GearBox_Slotstyle'
					onClick={this.buttonClick}
				>
					<div id='GearBox_styleText' onClick={this.buttonClick}>
						{this.state.currtext}
					</div>
				</div>
				{this.renderGearStyles(currpopupstyle)}
			</div>
		);
	}
}

export default GearBoxStyle;
