import React from "react";

import styled from "styled-components"
import NumericInput from "react-numeric-input";

import GearBonusesTotalsBack from "./tex/GearBonusesTotalsBack.png";
import MonsterTotalsBack from "./tex/MonsterTotalsBack.png";

import MonsterSearchResults from "./MonsterSearchResults"
import NumberCrunch from "./numberCruncher";

import "./css/App.css";
import "./css/gearSec.css";

import gearbackemptyi from "./tex/gearbackempty.png";
import levelsattack from "./tex/levels_attack_icon.png";
import levelsstrength from "./tex/type-strmelee.png";
import levelsdefense from "./tex/combattypedefence.png";
import levelsranged from "./tex/combattyperanged.png";
import levelsmagic from "./tex/combattypemagic.png";
import levelsprayer from "./tex/combattypeprayer.png";

import staticonstab from "./tex/type-stab.png";
import staticonslash from "./tex/type-slash.png";
import staticoncrush from "./tex/type-crush.png";
import staticonmagic from "./tex/type-magic.png";
import staticonranged from "./tex/type-ranged.png";
import staticonstrmelee from "./tex/type-strmelee.png";
import staticonstrmagic from "./tex/type-strmagic.png";
import staticonstrranged from "./tex/type-strranged.png";
import staticonstrprayer from "./tex/type-strprayer.png";

import attackspeedicon from "./tex/AttackSpeed.png";

import combaticon from "./tex/combattypehybrid.png";
import combaticonmaxhit from "./tex/combattypemelee.png";
import splatpoison from "./tex/Poison_hitsplat.png";
import splatvenom from "./tex/Venom_hitsplat.png";

import wikiicon from "./tex/Wiki.png";

const jsonvars = require(`./jsonvars.json`);

const numberinputstyle = {
	arrowUp: {
		width: "0px",
		height: "0px"
	},
	arrowDown: {
		width: "0px",
		height: "0px"
	}
};

const attackspeedurl = {
	backgroundImage: `url(${attackspeedicon})`,
	position: "relative",
	width: "2.2vmin",
	height: "2.2vmin",
	float: "left"
};

const OverrideCheckbox = ({ className, checked, ...props }) => (
	<CheckboxContainer className={className}>
		<HiddenOverrideCheckbox checked={checked} {...props} />
		<StyledOverrideCheckbox checked={checked}>
			<Icon viewBox="0 0 24 24">
				<polyline points="20 6 9 17 4 12" />
			</Icon>
		</StyledOverrideCheckbox>
	</CheckboxContainer>
)

const HiddenOverrideCheckbox = styled.input.attrs({ type: 'checkbox' })`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`
const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`

const StyledOverrideCheckbox = styled.div`
  display: inline-block;
  width: 1.7vmin;
  height: 1.7vmin;
  background: ${props => props.checked ? '#1f1f1f' : '#363636'};
  border-radius: 3px;
  transition: all 150ms;
  ${Icon} {
    visibility: ${props => props.checked ? 'visible' : 'hidden'}
  }
`

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`

var thetimeout = 0;

class CalcSection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			level_atk: 1,
			level_str: 1,
			level_def: 1,
			level_ranged: 1,
			level_magic: 1,
			level_prayer: 1,
			atk_stab: 1,
			atk_slash: 1,
			atk_crush: 1,
			atk_magic: 1,
			atk_ranged: 1,
			def_stab: 1,
			def_slash: 1,
			def_crush: 1,
			def_magic: 1,
			def_ranged: 1,
			str_melee: 1,
			str_magic: 1,
			str_ranged: 1,
			str_prayer: 1,
			speed: 1,
			override: false,
			overridemonster: false,
			variantshowMenu: false,
			monster: {
				filename: "none",
				name: "default",
				url:
					"https://oldschool.runescape.wiki/images/thumb/e/e4/Man_%28blue%29.png/120px-Man_%28blue%29.png",
				wiki: "https://oldschool.runescape.wiki",
				cblevel: "1",
				hitpoints: "1",
				attribute: "none",
				maxhit: "15",
				maxhitmelee: "0",
				maxhitranged: "0",
				maxhitmagic: "0",
				attackspeed: "4",
				statsatk: "1",
				statsstr: "1",
				statsdef: "1",
				statsmagic: "1",
				statsranged: "1",
				aggressivestab: "0",
				aggressiveslash: "0",
				aggressivecrush: "0",
				aggressivemagic: "0",
				aggressiveranged: "0",
				defensestab: "0",
				defenseslash: "0",
				defensecrush: "0",
				defensemagic: "0",
				defenseranged: "0",
				poison: false,
				venom: false,
				xpbonus: "0"
			},
			monsterlist: [],
			monstervariant: 0,
			iconcurrwidth: "100%",
			iconcurrheight: "100%",
			currsearchlist: [],
			currsearchactive: false
		};

		var reflist = new Object();
		reflist["level_atk"] = React.createRef();
		reflist["level_str"] = React.createRef();
		reflist["level_def"] = React.createRef();
		reflist["level_ranged"] = React.createRef();
		reflist["level_magic"] = React.createRef();
		reflist["level_prayer"] = React.createRef();
		reflist["atk_stab"] = React.createRef();
		reflist["atk_slash"] = React.createRef();
		reflist["atk_crush"] = React.createRef();
		reflist["atk_magic"] = React.createRef();
		reflist["atk_ranged"] = React.createRef();
		reflist["def_stab"] = React.createRef();
		reflist["def_slash"] = React.createRef();
		reflist["def_crush"] = React.createRef();
		reflist["def_magic"] = React.createRef();
		reflist["def_ranged"] = React.createRef();
		reflist["str_melee"] = React.createRef();
		reflist["str_magic"] = React.createRef();
		reflist["str_ranged"] = React.createRef();
		reflist["str_prayer"] = React.createRef();
		reflist["speed"] = React.createRef();
		reflist["monsterstatsatk"] = React.createRef();
		reflist["monsterstatsstr"] = React.createRef();
		reflist["monsterstatsdef"] = React.createRef();
		reflist["monsterstatsranged"] = React.createRef();
		reflist["monsterstatsmagic"] = React.createRef();
		reflist["monsteraggressivestab"] = React.createRef();
		reflist["monsteraggressiveslash"] = React.createRef();
		reflist["monsteraggressivecrush"] = React.createRef();
		reflist["monsteraggressivemagic"] = React.createRef();
		reflist["monsteraggressiveranged"] = React.createRef();
		reflist["monsterdefensestab"] = React.createRef();
		reflist["monsterdefenseslash"] = React.createRef();
		reflist["monsterdefensecrush"] = React.createRef();
		reflist["monsterdefensemagic"] = React.createRef();
		reflist["monsterdefenseranged"] = React.createRef();
		this.myRefs = reflist;

		this.clickButton = this.clickButton.bind(this);
		this.changeStat_atk = this.changeStat_atk.bind(this);
		this.changeStat_str = this.changeStat_str.bind(this);
		this.changeStat_def = this.changeStat_def.bind(this);
		this.changeStat_ranged = this.changeStat_ranged.bind(this);
		this.changeStat_prayer = this.changeStat_prayer.bind(this);
		this.changeStat_magic = this.changeStat_magic.bind(this);
		this.changeoverridestat = this.changeoverridestat.bind(this);
		this.renderSearchBar = this.renderSearchBar.bind(this);
		this.monsterInputChange = this.monsterInputChange.bind(this);
		this.monsterInputChangeClick = this.monsterInputChangeClick.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
		this.handleCheckboxChangeMonster = this.handleCheckboxChangeMonster.bind(this)
		this.renderMonsterVariants = this.renderMonsterVariants.bind(this);
		this.variantshowMenu = this.variantshowMenu.bind(this);
		this.variantcloseMenu = this.variantcloseMenu.bind(this);
		this.variantshowSearch = this.variantshowSearch.bind(this);
		this.variantcloseSearch = this.variantcloseSearch.bind(this);
	}

	clickButton() {
		this.changeStat_str(50);
	}

	handleCheckboxChange(e) {
		var currentchecked = this.state.override;
		console.log(!currentchecked);
		this.setState({
			override: e.target.checked
		})
		if (e.target.checked == true) {
			this.setState({
				atk_stab: this.props.geartotals.atk_stab,
				atk_slash: this.props.geartotals.atk_slash,
				atk_crush: this.props.geartotals.atk_crush,
				atk_magic: this.props.geartotals.atk_magic,
				atk_ranged: this.props.geartotals.atk_ranged,
				def_stab: this.props.geartotals.def_stab,
				def_slash: this.props.geartotals.def_slash,
				def_crush: this.props.geartotals.def_crush,
				def_ranged: this.props.geartotals.def_ranged,
				def_magic: this.props.geartotals.def_magic,
				str_magic: this.props.geartotals.str_magic,
				str_melee: this.props.geartotals.str_melee,
				str_ranged: this.props.geartotals.str_ranged,
				str_prayer: this.props.geartotals.str_prayer,
				speed: this.props.geartotals.speed
			})
		}
		var self = this;
		self.props.updateStatsCalc();
	}

	handleCheckboxChangeMonster(e) {
		var currentchecked = this.state.overridemonster;
		console.log(!currentchecked);
		this.setState({
			overridemonster: e.target.checked
		})
		var self = this;
		console.log(e.target.checked)
		if (e.target.checked == false) {
			console.log(self.state.monster.filename)
			setTimeout(function (element) {
				self.monsterInputChange(self.state.monster.filename);
			}, 200);
		}
	}

	variantshowMenu(event) {
		event.preventDefault();

		this.setState({ variantshowMenu: true }, () => {
			document.addEventListener('click', this.variantcloseMenu);
		});
	}

	variantcloseMenu() {
		this.setState({ variantshowMenu: false }, () => {
			document.removeEventListener('click', this.variantcloseMenu);
		});
	}

	variantshowSearch(event) {
		event.preventDefault();

		this.setState({ currsearchactive: true }, () => {
			document.addEventListener('click', this.variantcloseSearch);
		});
	}

	variantcloseSearch() {
		this.setState({ currsearchactive: false }, () => {
			document.removeEventListener('click', this.variantcloseSearch);
		});
	}

	monsterSelectWiki(e) {
		var wikipage = this.state.monster.wiki
		window.open(wikipage);
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
				height = "100%";
				width = Math.floor(100 * dimensionscale) + "%";
			} else if (width > height) {
				// We have a long boi
				dimensionscale = height / width;
				width = "100%";
				height = Math.floor(74 * dimensionscale) + "%";
			} else {
				// Don't change our dimensions
				height = "100%";
				width = "100%";
			}

			console.log(height, width, dimensionscale);

			self.setState({
				iconcurrheight: height,
				iconcurrwidth: width
			});
		};

		img.src = theurl;
	}

	changeoverridestat(stat, newvalue) {
		var thestat = this.myRefs[stat].current.state.value;
		console.log(thestat);
		if (newvalue == undefined) {
			this.setState({
				[stat]: thestat
			});
		} else {
			this.setState({
				[stat]: newvalue
			});
		}
		var self = this;
		setTimeout(function (element) {
			self.props.updateStats();
		}, 100);
	}
	changeoverridestatmonster(stat, newvalue) {
		var filterstat = `monster${stat}`
		var thestat = this.myRefs[filterstat].current.state.value;
		console.log(thestat);
		var mymonster = this.state.monster;
		if (newvalue == undefined) {
			mymonster[stat] = thestat;
			this.setState({
				monster: mymonster
			});
		} else {
			mymonster[stat] = newvalue;
			this.setState({
				monster: mymonster
			});
		}
		var self = this;
	}
	changeStat_atk(newvalue) {
		var thestat = this.myRefs["level_atk"].current.state.value;
		console.log(thestat);
		if (newvalue == undefined) {
			this.setState({
				level_atk: thestat
			});
		} else {
			this.setState({
				level_atk: newvalue
			});
		}
		var self = this;
		setTimeout(function (element) {
			self.props.updateStats();
		}, 100);
	}
	changeStat_str(newvalue) {
		var thestat = this.myRefs["level_str"].current.state.value;
		console.log(thestat);
		if (newvalue == undefined) {
			this.setState({
				level_str: thestat
			});
		} else {
			this.setState({
				level_str: newvalue
			});
		}
		var self = this;
		setTimeout(function (element) {
			self.props.updateStats();
		}, 100);
	}
	changeStat_def(newvalue) {
		var thestat = this.myRefs["level_def"].current.state.value;
		console.log(thestat);
		if (newvalue == undefined) {
			this.setState({
				level_def: thestat
			});
		} else {
			this.setState({
				level_def: newvalue
			});
		}
		var self = this;
		setTimeout(function (element) {
			self.props.updateStats();
		}, 100);
	}
	changeStat_ranged(newvalue) {
		var thestat = this.myRefs["level_ranged"].current.state.value;
		console.log(thestat);
		if (newvalue == undefined) {
			this.setState({
				level_ranged: thestat
			});
		} else {
			this.setState({
				level_ranged: newvalue
			});
		}
		var self = this;
		setTimeout(function (element) {
			self.props.updateStats();
		}, 100);
	}
	changeStat_prayer(newvalue) {
		var thestat = this.myRefs["level_prayer"].current.state.value;
		console.log(thestat);
		if (newvalue == undefined) {
			this.setState({
				level_prayer: thestat
			});
		} else {
			this.setState({
				level_prayer: newvalue
			});
		}
		var self = this;
		setTimeout(function (element) {
			self.props.updateStats();
		}, 100);
	}
	changeStat_magic(newvalue) {
		var thestat = this.myRefs["level_magic"].current.state.value;
		console.log(thestat);
		if (newvalue == undefined) {
			this.setState({
				level_magic: thestat
			});
		} else {
			this.setState({
				level_magic: newvalue
			});
		}
		var self = this;
		setTimeout(function (element) {
			self.props.updateStats();
		}, 100);
	}

	monsterInputChange(newvalue) {
		var monsterlistjson = require(`./monster/directory.json`);
		var returnedlist = monsterlistjson.filter(function (el) {
			return (el.name.toLowerCase().includes(newvalue.toLowerCase()) == true);
		})
		if (returnedlist.length > 6) { // We only want 6 elements
			returnedlist = returnedlist.slice(0, 5);
		}
		this.setState({
			currsearchlist: returnedlist
		})
	}

	monsterInputChangeClick(newvalue) {
		var self = this;
		var defaultjson;
		try {
			defaultjson = require(`./monster/${newvalue}.json`);
			console.log("Trying to require from " + `./monster/${newvalue}.json`);
		} catch (err) {
			// We could not locate that file name. Something may have gone wrong.
			console.log(
				"Something went wrong. Tried to require from " +
				`./monster/${newvalue}.json`
			);
			defaultjson = require(`./monster/blue_dragon.json`); // Grabs the Blue Dragon json for creatures
		}
		if (defaultjson.length > 1) {
			this.setState({
				monsterlist: defaultjson,
				monstervariant: 0
			});
		}
		else {
			this.setState({
				monsterlist: [],
				monstervariant: 0
			});
		}
		localStorage.setItem('currentmonster', newvalue)
		this.setState({
			monster: defaultjson[0],
			currsearchvalue: defaultjson[0].name
		});
		setTimeout(function (element) {
			self.setState({
				currsearchactive: false
			})
		}, 100);
	}

	componentDidMount() {
		var self = this;
		this.getImageDimensions(
			"https://oldschool.runescape.wiki/images/thumb/e/e4/Man_%28blue%29.png/120px-Man_%28blue%29.png"
		);
		setTimeout(function (element) {
			self.monsterInputChangeClick(localStorage.getItem('currentmonster'))
		}, 50);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		var flagged = false;
		var flaggedoverride = false;
		var self = this;
		var reqAttack = self.state.level_atk;
		var reqStrength = self.state.level_str;
		var reqDefence = self.state.level_def;
		var reqRanged = self.state.level_ranged;
		var reqPrayer = self.state.level_prayer;
		var reqMagic = self.state.level_magic;
		if (this.props.geartotals.req_attack > reqAttack) {
			// New Gear's attack level is higher than what we have set
			reqAttack = this.props.geartotals.req_attack;
			flagged = true;
		}
		if (this.props.geartotals.req_strength > reqStrength) {
			// New Gear's strength level is higher than what we have set
			reqStrength = this.props.geartotals.req_strength;
			flagged = true;
		}
		if (this.props.geartotals.req_defence > reqDefence) {
			// New Gear's defence level is higher than what we have set
			reqDefence = this.props.geartotals.req_defence;
			flagged = true;
		}
		if (this.props.geartotals.req_ranged > reqRanged) {
			// New Gear's ranged level is higher than what we have set
			reqRanged = this.props.geartotals.req_ranged;
			flagged = true;
		}
		if (this.props.geartotals.req_prayer > reqPrayer) {
			// New Gear's prayer level is higher than what we have set
			reqPrayer = this.props.geartotals.req_prayer;
			flagged = true;
		}
		if (this.props.geartotals.req_magic > reqMagic) {
			// New Gear's magic level is higher than what we have set
			reqMagic = this.props.geartotals.req_magic;
			flagged = true;
		}
		if (flagged == true) {
			self.setState({
				level_atk: reqAttack,
				level_str: reqStrength,
				level_def: reqDefence,
				level_ranged: reqRanged,
				level_prayer: reqPrayer,
				level_magic: reqMagic
			});
		}
	}

	renderItemStyleStrBonusText(element, style, overridestat) {
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
		if (style == "speed") {
			styleicon = {
				backgroundImage: `url(${attackspeedicon})`
			};
			styleText = "Attack Speed";
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
			result = result;
		}
		if (this.state.override == false) {
			return (
				<div className='CalcBonusTotalsBonusSectText'>
					<div className='CalcBonusTotalsBonusIcon' style={styleicon}>
						<span class='BonusResultTooltipText'>{styleText}</span>
					</div>
					<div style={styleBonus}>{result + percenttag}</div>
				</div>
			);
		}
		else {
			return (
				<div className='CalcBonusTotalsBonusSectText'>
					<div className='CalcBonusTotalsBonusIcon' style={styleicon}>
						<span class='BonusResultTooltipText'>{styleText}</span>
					</div>
					<div className='CalcNumberOverrideGear'>
						<NumericInput
							className='CalcNumberInput'
							ref={this.myRefs[overridestat]}
							min={-999}
							max={999}
							value={this.state[overridestat]}
							onChange={() => this.changeoverridestat(overridestat)}
						/>
					</div>
				</div>
			)
		}
	}

	renderItemStyleBonusesIcons() {
		return (
			<div id='CalcBonusTotalsLevelsIcons'>
				{this.renderItemStyleBonusIcon(levelsattack)}
				{this.renderItemStyleBonusIcon(levelsstrength)}
				{this.renderItemStyleBonusIcon(levelsdefense)}
				{this.renderItemStyleBonusIcon(levelsranged)}
				{this.renderItemStyleBonusIcon(levelsprayer)}
				{this.renderItemStyleBonusIcon(levelsmagic)}
			</div>
		);
	}

	renderItemStyleBonusIcon(inputurl) {
		var thisStyle = {
			marginBottom: "1.05vmin",
			backgroundImage: `url(${inputurl})`
		};

		return <div id='CalcBonusTotalsLevelsIcon' style={thisStyle}></div>;
	}

	renderItemStyleBonusIconMonster(inputurl) {
		var thisStyle = {
			marginBottom: "1.05vmin",
			marginLeft: "0",
			backgroundImage: `url(${inputurl})`,
			top: "10%",
			left: "10%",
			height: "2.1vmin",
			width: "2.1vmin",
			float: "left"
		};

		return <div id='CalcBonusTotalsLevelsIcon' style={thisStyle}></div>;
	}

	renderSearchBar() {
		var self = this;
		function handleChange(e) {
			var thevalue = e.target.value
			clearTimeout(thetimeout);
			thetimeout = setTimeout(function (el) {
				self.monsterInputChange(thevalue);
			}, 300);
			self.setState({
				currsearchvalue: thevalue
			})
			//	if (e.target.value == "blue_dragon") {
			//		console.log("Fired Event for Blue Dragon");
			//		self.monsterInputChange(e.target.value);
			//	}
			//	if (e.target.value == "abyssal_demon") {
			//		console.log("Fired Event for Abyssal Demon");
			//		self.monsterInputChange(e.target.value);
			//	}
			///	if (e.target.value == "ogre") {
			//		console.log("Fired Event for Ogre");
			//		self.monsterInputChange(e.target.value);
			//	}
			//	if (e.target.value == "tztok-jad") {
			//		console.log("Fired Event for Tztok-Jad");
			//		self.monsterInputChange(e.target.value);
			//	}
		}

		function timeoutClick(e) {
			setTimeout(function (e) {
				self.variantshowSearch()
			}, 50)
		}

		return (
			<div class='CalcMonsterSearchForm'>
				<input
					type='text'
					name='name'
					value={this.state.currsearchvalue}
					autoComplete='off'
					required
					onChange={handleChange}
					onClick={self.variantshowSearch}
				/>
				<label for='name' class='CalcMonsterSearchLabel'>
					<span class='CalcMonsterSearchLabelContent'>Input NPC Name</span>
				</label>
			</div>
		);
	}

	renderMonsterStat(stat, levelicon) {

		if (this.state.overridemonster == false) {
			return (
				<div className='CalcMonsterStatsLevelsSectLine'>
					{this.renderItemStyleBonusIconMonster(levelicon)}
					<div className='CalcMonsterStatsLevelText'>
						{this.state.monster[stat]}
					</div>
				</div>
			)
		}
		else {
			return (
				<div className='CalcMonsterStatsLevelsSectLine'>
					{this.renderItemStyleBonusIconMonster(levelicon)}
					<div className='CalcNumberOverrideMonster'>
						<NumericInput
							className='CalcNumberInput'
							ref={this.myRefs[`monster${stat}`]}
							min={-999}
							max={999}
							value={this.state.monster[stat]}
							onChange={() => this.changeoverridestatmonster(stat)}
						/>
					</div>
				</div>
			)
		}
	}

	renderMonsterStats() {
		var speedstyle = {
			width: "13%"
		};

		return (
			<div className='CalcMonsterStatsBackBack'>
				<div className='CalcMonsterStatsAttackSect'>
					Attack
					{this.renderMonsterStat("aggressivestab", staticonstab)}
					{this.renderMonsterStat("aggressiveslash", staticonslash)}
					{this.renderMonsterStat("aggressivecrush", staticoncrush)}
					{this.renderMonsterStat("aggressivemagic", staticonmagic)}
					{this.renderMonsterStat("aggressiveranged", staticonranged)}
				</div>
				<div className='CalcMonsterStatsDefenseSect'>
					Defence
					{this.renderMonsterStat("defensestab", staticonstab)}
					{this.renderMonsterStat("defenseslash", staticonslash)}
					{this.renderMonsterStat("defensecrush", staticoncrush)}
					{this.renderMonsterStat("defensemagic", staticonmagic)}
					{this.renderMonsterStat("defenseranged", staticonranged)}
				</div>
				<div className='CalcMonsterStatsLevelsSect'>
					Levels
					{this.renderMonsterStat("statsatk", levelsattack)}
					{this.renderMonsterStat("statsstr", levelsstrength)}
					{this.renderMonsterStat("statsdef", levelsdefense)}
					{this.renderMonsterStat("statsmagic", levelsmagic)}
					{this.renderMonsterStat("statsranged", levelsranged)}
				</div>
				<div className='CalcMonsterStatsBottomInfo'>
					<div className="CalcMonsterStatsBottomInfoSectionHP">
						HP: {this.state.monster.hitpoints}
					</div>
					<div className='CalcMonsterStatsBottomInfoSection' style={speedstyle}>
						<div id='CalcBonusTotalsLevelsIcon' style={attackspeedurl}></div>
						<div className='CalcMonsterStatsBottomInfoText'>
							Speed: {this.state.monster.attackspeed}
						</div>
					</div>
					<div className='CalcMonsterStatsBottomInfoSectionAttribute'>
						Type: {this.state.monster.attribute}
					</div>
				</div>
			</div>
		);
	}

	renderMonsterPoison(poison) {
		var poisontext;
		var poisonstyles;
		var poisonurl;
		var self = this;
		if (poison == "poison") {
			if (self.state.monster.poison) {
				poisonstyles = {
					color: "white"
				};
				poisontext = "Not Immune";
			} else {
				poisonstyles = {
					color: "red"
				};
				poisontext = "Immune";
			}
			poisonurl = {
				backgroundImage: `url(${splatpoison})`,
				position: "relative",
				width: "2.2vmin",
				height: "2.2vmin",
				float: "left"
			};
		} else {
			if (self.state.monster.venom) {
				poisonstyles = {
					color: "white"
				};
				poisontext = "Not Immune";
			} else {
				poisonstyles = {
					color: "red"
				};
				poisontext = "Immune";
			}
			poisonurl = {
				backgroundImage: `url(${splatvenom})`,
				position: "relative",
				width: "2.2vmin",
				height: "2.2vmin",
				float: "left"
			};
		}
		return (
			<div className='CalcMonsterStatsBottomInfoSection'>
				<div id='CalcBonusTotalsLevelsIcon' style={poisonurl}></div>
				<div className='CalcMonsterStatsBottomInfoText' style={poisonstyles}>
					{poisontext}
				</div>
			</div>
		);
	}

	renderMonsterMaxHitNoStat() {
		var self = this;
		var imagestyle;
		var maxhitstyle = {
			width: "13%",
			float: "left"
		};
		if (self.state.monster.maxhit != 0) {
			imagestyle = {
				backgroundImage: `url(${combaticonmaxhit})`,
				position: "relative",
				width: "2.2vmin",
				height: "2.2vmin",
				float: "left"
			};
			var maxhit = self.state.monster.maxhit;
			return (
				<div className='CalcMonsterStatsBottomInfoSection' style={maxhitstyle}>
					<div id='CalcBonusTotalsLevelsIcon' style={imagestyle}></div>
					<div className='CalcMonsterStatsBottomInfoText'>{maxhit}</div>
				</div>
			);
		}
	}

	renderMonsterMaxHitMelee() {
		var self = this;
		var imagestyle;
		var maxhitstyle = {
			width: "13%",
			float: "left"
		};
		if (self.state.monster.maxhitmelee != 0) {
			imagestyle = {
				backgroundImage: `url(${levelsattack})`,
				position: "relative",
				width: "2.2vmin",
				height: "2.2vmin",
				float: "left"
			};
			var maxhit = self.state.monster.maxhitmelee;
			return (
				<div className='CalcMonsterStatsBottomInfoSection' style={maxhitstyle}>
					<div id='CalcBonusTotalsLevelsIcon' style={imagestyle}></div>
					<div className='CalcMonsterStatsBottomInfoText'>{maxhit}</div>
				</div>
			);
		}
	}

	renderMonsterMaxHitRanged() {
		var self = this;
		var imagestyle;
		var maxhitstyle = {
			width: "13%",
			float: "left"
		};
		if (self.state.monster.maxhitranged != 0) {
			imagestyle = {
				backgroundImage: `url(${levelsranged})`,
				position: "relative",
				width: "2.2vmin",
				height: "2.2vmin",
				float: "left"
			};
			var maxhit = self.state.monster.maxhitranged;
			return (
				<div className='CalcMonsterStatsBottomInfoSection' style={maxhitstyle}>
					<div id='CalcBonusTotalsLevelsIcon' style={imagestyle}></div>
					<div className='CalcMonsterStatsBottomInfoText'>{maxhit}</div>
				</div>
			);
		}
	}

	renderMonsterMaxHitMagic() {
		var self = this;
		var imagestyle;
		var maxhitstyle = {
			width: "13%",
			float: "left"
		};
		if (self.state.monster.maxhitmagic != 0) {
			imagestyle = {
				backgroundImage: `url(${levelsmagic})`,
				position: "relative",
				width: "2.2vmin",
				height: "2.2vmin",
				float: "left"
			};
			var maxhit = self.state.monster.maxhitmagic;
			return (
				<div className='CalcMonsterStatsBottomInfoSection' style={maxhitstyle}>
					<div id='CalcBonusTotalsLevelsIcon' style={imagestyle}></div>
					<div className='CalcMonsterStatsBottomInfoText'>{maxhit}</div>
				</div>
			);
		}
	}

	renderMonsterIcon() {
		var thisstyle = {
			backgroundImage: `url(${this.state.monster.url})`,
			width: this.state.monster.width * 18.5 + "vmin",
			height: this.state.monster.height * 18.5 + "vmin"
		};
		return <div class='CalcMonsterIconImage' style={thisstyle} />;
	}

	renderMonsterVariants() {
		if (this.state.monsterlist.length > 1) {
			var variantname = this.state.monster.variantname
			var self = this;
			var i = -1;
			return (
				<div className="CalcMonsterVariantsButton">
					<button onClick={this.variantshowMenu}>
						{variantname}
					</button>

					{
						this.state.variantshowMenu
							? (
								<div className="menu">
									{self.state.monsterlist.map(function (el) {
										i++;
										return self.monsterVariant(el, i)
									})}
								</div>
							)
							: (
								null
							)
					}
				</div>
			)
		}
	}

	monsterVariant(monster, i) {
		return (
			<button onClick={() => this.monsterChooseVariant(i)}>{monster.variantname}</button>
		)
	}

	monsterChooseVariant(i) {
		this.setState({
			monster: this.state.monsterlist[i],
			monstervariant: i
		})
	}

	render() {
		var stylegap = {
			paddingBottom: "10%"
		};
		var totalsback = {
			backgroundImage: `url(${GearBonusesTotalsBack})`
		};
		var monsterback = {
			backgroundImage: `url(${MonsterTotalsBack})`
		};
		var WikiIcon = {
			backgroundImage: `url(${wikiicon})`
		};
		var geartotalpass = this.props.geartotals
		if (this.state.override == true) {
			geartotalpass.atk_stab = this.state.atk_stab
			geartotalpass.atk_slash = this.state.atk_slash
			geartotalpass.atk_crush = this.state.atk_crush
			geartotalpass.atk_magic = this.state.atk_magic
			geartotalpass.atk_range = this.state.atk_ranged
			geartotalpass.def_stab = this.state.def_stab
			geartotalpass.def_slash = this.state.def_slash
			geartotalpass.def_crush = this.state.def_crush
			geartotalpass.def_range = this.state.def_ranged
			geartotalpass.def_magic = this.state.def_magic
			geartotalpass.str_magic = this.state.str_magic
			geartotalpass.str_melee = this.state.str_melee
			geartotalpass.str_ranged = this.state.str_ranged
			geartotalpass.str_prayer = this.state.str_prayer
			geartotalpass.speed = this.state.speed
		}

		return (
			<div id='CalcSkeleton'>
				<div id='CalcBonusTotalsBack' style={totalsback}>
					<div className='CalcBonusTotalsBonusSectOverrideBack'>
						<label>
							<OverrideCheckbox
								checked={this.state.override}
								onChange={this.handleCheckboxChange}
							/>
							<span> Override Values</span>
						</label>
					</div>
					<div id='CalcBonusTotalsBonusSect'>
						<div id='CalcBonusTotalsBonusSectAtk'>
							<div style={stylegap}>Attack</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.atk_stab,
									"stab", "atk_stab"
								)}
							</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.atk_slash,
									"slash", "atk_slash"
								)}
							</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.atk_crush,
									"crush", "atk_crush"
								)}
							</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.atk_magic,
									"magic", "atk_magic"
								)}
							</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.atk_ranged,
									"ranged", "atk_ranged"
								)}
							</div>
						</div>
						<div id='CalcBonusTotalsBonusSectDef'>
							<div style={stylegap}>Defence</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.def_stab,
									"stab", "def_stab"
								)}
							</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.def_slash,
									"slash", "def_slash"
								)}
							</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.def_crush,
									"crush", "def_crush"
								)}
							</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.def_magic,
									"magic", "def_magic"
								)}
							</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.def_ranged,
									"ranged", "def_ranged"
								)}
							</div>
						</div>
						<div id='CalcBonusTotalsBonusSectStr'>
							<div style={stylegap}>Strength</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.str_melee,
									"str_melee", "str_melee"
								)}
							</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.str_magic,
									"str_magic", "str_magic"
								)}
							</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.str_ranged,
									"str_ranged", "str_ranged"
								)}
							</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.str_prayer,
									"str_prayer", "str_prayer"
								)}
							</div>
							<div>
								{this.renderItemStyleStrBonusText(
									this.props.geartotals.speed,
									"speed", "speed"
								)}
							</div>
						</div>
					</div>
					<div id='CalcBonusTotalsLevelsIconsBack'>
						{this.renderItemStyleBonusesIcons()}
					</div>
					<div id='CalcBonusTotalsLevelsSect'>
						Levels
						<div id='CalcNumberInputContainer'>
							<NumericInput
								className='CalcNumberInput'
								ref={this.myRefs["level_atk"]}
								min={1}
								max={99}
								value={this.state.level_atk}
								onChange={this.changeStat_atk}
							/>
						</div>
						<div id='CalcNumberInputContainer'>
							<NumericInput
								className='CalcNumberInput'
								ref={this.myRefs["level_str"]}
								min={1}
								max={999}
								value={this.state.level_str}
								onChange={this.changeStat_str}
							/>
						</div>
						<div id='CalcNumberInputContainer'>
							<NumericInput
								className='CalcNumberInput'
								ref={this.myRefs["level_def"]}
								min={1}
								max={99}
								value={this.state.level_def}
								onChange={this.changeStat_def}
							/>
						</div>
						<div id='CalcNumberInputContainer'>
							<NumericInput
								className='CalcNumberInput'
								ref={this.myRefs["level_ranged"]}
								min={1}
								max={99}
								value={this.state.level_ranged}
								onChange={this.changeStat_ranged}
							/>
						</div>
						<div id='CalcNumberInputContainer'>
							<NumericInput
								className='CalcNumberInput'
								ref={this.myRefs["level_prayer"]}
								min={1}
								max={99}
								value={this.state.level_prayer}
								onChange={this.changeStat_prayer}
							/>
						</div>
						<div id='CalcNumberInputContainer'>
							<NumericInput
								className='CalcNumberInput'
								ref={this.myRefs["level_magic"]}
								min={1}
								max={99}
								value={this.state.level_magic}
								onChange={this.changeStat_magic}
							/>
						</div>
					</div>
				</div>
				<div id='CalcMonsterSelectBack' style={monsterback}>
					<div id='CalcMonsterSelectSearch'>{this.renderSearchBar()}</div>
					<div id='CalcMonsterSelectStats'>{this.renderMonsterStats()}</div>
					<div id='CalcMonsterSelectIcon'>{this.renderMonsterIcon()}</div>
					<div className='GearBoxSelectWikiMonster' style={WikiIcon} onClick={e => this.monsterSelectWiki(e)}></div>
					<div id='CalcMonsterSelectVariants'>{this.renderMonsterVariants()}</div>
					<div className='CalcBonusTotalsMonsterSectOverrideBack'>
						<label>
							<OverrideCheckbox
								checked={this.state.overridemonster}
								onChange={this.handleCheckboxChangeMonster}
							/>
							<span> Override Values</span>
						</label>
					</div>
					<div className="MonsterSearchResultsContainer">
						<MonsterSearchResults
							clickedmonster={this.monsterInputChangeClick}
							currsearchactive={this.state.currsearchactive}
							currsearchlist={this.state.currsearchlist}
						/>
					</div>
				</div>
				<div id='CalcTextBoxBack' style={totalsback}>
					<NumberCrunch
						geartotals={geartotalpass}
						level_atk={this.state.level_atk}
						level_str={this.state.level_str}
						level_def={this.state.level_def}
						level_magic={this.state.level_magic}
						level_ranged={this.state.level_ranged}
						level_prayer={this.state.level_prayer}
						monster={this.state.monster}
						potioncurrenttotalmod={this.props.potioncurrenttotalmod}
						prayercurrenttotalmod={this.props.prayercurrenttotalmod}
						stylecurrentdamage={this.props.stylecurrentdamage}
						stylecurrentstyle={this.props.stylecurrentstyle}
						magicspell={this.props.magicspell}
						magicdamage={this.props.magicdamage}
					/>
				</div>
			</div>
		);
	}
}

export default CalcSection;
