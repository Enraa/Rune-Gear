import React from "react";
import styled from "styled-components"

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

class NumberCrunch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			attacktype: "melee",
			showyourwork: false
		}
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
	}

	handleCheckboxChange(e) {
		var currentchecked = this.state.showyourwork;
		console.log(!currentchecked);
		this.setState({
			showyourwork: e.target.checked
		})
		var self = this;
	}

	countVoid(type) {
		var seteffects = this.props.geartotals.seteffect;
		var successcount = 0;
		seteffects.forEach(function (element) {
			if (element == "void" || element == type) {
				successcount++;
			}
		});
		if (successcount >= 4) {
			return true;
		} else {
			return false;
		}
	}

	calculateMaxMelee(modifiedlevel) {
		var usedlevel = parseInt(this.props.level_str);
		if (modifiedlevel != undefined) {
			usedlevel = modifiedlevel;
		}
		var maxhit;
		var currentstancemod = 0;
		var currentvoidmod = 1.0;
		var effective_level;
		if (this.props.stylecurrentstyle == "aggressive") {
			currentstancemod = 3;
		}
		if (this.props.stylecurrentstyle == "controlled") {
			currentstancemod = 1;
		}
		if (this.countVoid("voidmelee") == true) {
			currentvoidmod = 1.1;
		}

		var currentstrlevel =
			usedlevel *
			this.props.potioncurrenttotalmod.strength.percentage +
			parseInt(this.props.potioncurrenttotalmod.strength.level);
		effective_level = Math.floor(
			(Math.floor(currentstrlevel * this.props.prayercurrenttotalmod.strength) +
				currentstancemod +
				8) *
			currentvoidmod
		);
		maxhit =
			((this.props.geartotals.str_melee + 64) / 640) * effective_level + 0.5;
		return maxhit;
	}

	calculateMaxRanged(modifiedlevel) {
		var usedlevel = parseInt(this.props.level_ranged);
		if (modifiedlevel != undefined) {
			usedlevel = modifiedlevel;
		}
		var maxhit;
		var currentstancemod = 0;
		var currentvoidmod = 1.0;
		var effective_level;
		if (this.props.stylecurrentstyle == "accurate") {
			currentstancemod = 3;
		}
		if (this.countVoid("voidrange") == true) {
			currentvoidmod = 1.1;
		}

		var currentstrlevel =
			usedlevel *
			this.props.potioncurrenttotalmod.ranged.percentage +
			parseInt(this.props.potioncurrenttotalmod.ranged.level);
		effective_level = Math.floor(
			(Math.floor(currentstrlevel * this.props.prayercurrenttotalmod.rangeddamage) +
				currentstancemod +
				8) *
			currentvoidmod
		);
		maxhit =
			((this.props.geartotals.str_ranged + 64) / 640) * effective_level + 0.5;
		return maxhit;
	}

	calculateMaxMagic() {
		// To implement later
	}

	calculateAccMeleePlayer(type, modifiedlevel) {
		var usedlevel = parseInt(this.props.level_atk);
		if (modifiedlevel != undefined) {
			usedlevel = modifiedlevel;
		}
		var currentstancemod = 0;
		var currentvoidmod = 1.0;
		var effective_level;
		var attackaccuracy;
		if (this.props.stylecurrentstyle == "accurate") {
			currentstancemod = 3;
		}
		if (this.props.stylecurrentstyle == "controlled") {
			currentstancemod = 1;
		}
		if (this.countVoid("voidmelee") == true) {
			currentvoidmod = 1.1;
		}

		var currentatklevel =
			usedlevel *
			this.props.potioncurrenttotalmod.attack.percentage +
			parseInt(this.props.potioncurrenttotalmod.attack.level);

		effective_level = Math.floor(
			(Math.ceil(currentatklevel * this.props.prayercurrenttotalmod.attack) +
				currentstancemod +
				8) *
			currentvoidmod
		);
		attackaccuracy = effective_level * (this.props.geartotals[type] + 64);
		return attackaccuracy;
	}

	calculateAccRangedPlayer(modifiedlevel) {
		var usedlevel = parseInt(this.props.level_ranged);
		if (modifiedlevel != undefined) {
			usedlevel = modifiedlevel;
		}
		var currentstancemod = 0;
		var currentvoidmod = 1.0;
		var effective_level;
		var attackaccuracy;
		if (this.props.stylecurrentstyle == "accurate") {
			currentstancemod = 3;
		}
		if (this.countVoid("voidranged") == true) {
			currentvoidmod = 1.1;
		}

		var currentatklevel =
			usedlevel *
			this.props.potioncurrenttotalmod.ranged.percentage +
			parseInt(this.props.potioncurrenttotalmod.ranged.level);
		effective_level = Math.floor(
			(Math.ceil(currentatklevel * this.props.prayercurrenttotalmod.ranged) +
				currentstancemod +
				8) *
			currentvoidmod
		);
		attackaccuracy =
			effective_level * (this.props.geartotals["atk_ranged"] + 64);
		return attackaccuracy;
	}

	calculateAccMagicPlayer() {
		var currentstancemod = 0;
		var currentvoidmod = 1.0;
		var effective_level;
		var attackaccuracy;
		if (this.props.stylecurrentstyle == "accurate") {
			currentstancemod = 3;
		}
		if (this.props.stylecurrentstyle == "longrange") {
			currentstancemod = 1;
		}
		if (this.countVoid("voidmagic") == true) {
			currentvoidmod = 1.3;
		}

		var currentatklevel =
			this.props.level_magic *
			this.props.potioncurrenttotalmod.magic.percentage +
			parseInt(this.props.potioncurrenttotalmod.magic.level);
		effective_level = Math.floor(
			(Math.ceil(currentatklevel * this.props.prayercurrenttotalmod.magic) +
				currentstancemod +
				8) *
			currentvoidmod
		);
		attackaccuracy =
			effective_level * (this.props.geartotals["atk_magic"] + 64);
		return attackaccuracy;
	}

	calculateDefMeleePlayer(type) {
		var currentstancemod = 0;
		var currentvoidmod = 1.0;
		var effective_level;
		var defenceaccuracy;

		var currentatklevel =
			this.props.level_atk *
			this.props.potioncurrenttotalmod.defense.percentage +
			this.props.potioncurrenttotalmod.defense.level;
		effective_level = Math.floor(
			(Math.ceil(currentatklevel * this.props.prayercurrenttotalmod.attack) +
				currentstancemod +
				8) *
			currentvoidmod
		);
		defenceaccuracy = effective_level * this.props.geartotals[type] + 64;
		return defenceaccuracy;
	}

	calculateDefRangedPlayer() {
		var currentstancemod = 0;
		var currentvoidmod = 1.0;
		var effective_level;
		var defenceaccuracy;

		var currentatklevel =
			this.props.level_atk *
			this.props.potioncurrenttotalmod.defense.percentage +
			this.props.potioncurrenttotalmod.defense.level;
		effective_level = Math.floor(
			(Math.ceil(currentatklevel * this.props.prayercurrenttotalmod.attack) +
				currentstancemod +
				8) *
			currentvoidmod
		);
		defenceaccuracy =
			effective_level * this.props.geartotals["def_ranged"] + 64;
		return defenceaccuracy;
	}

	calculateDefMagicPlayer() {
		var currentstancemod = 0;
		var currentvoidmod = 1.0;
		var effective_level;
		var defenceaccuracy;

		var currentdeflevel =
			this.props.level_atk *
			this.props.potioncurrenttotalmod.defense.percentage +
			this.props.potioncurrenttotalmod.defense.level;
		var currentmagiclevel =
			this.props.level_magic *
			this.props.potioncurrenttotalmod.magic.percentage +
			this.props.potioncurrenttotalmod.magic.level;
		var currentatklevel = Math.floor(
			currentdeflevel * 0.3 + currentmagiclevel * 0.7
		);
		effective_level = Math.floor(
			(Math.ceil(currentatklevel * this.props.prayercurrenttotalmod.magic) +
				currentstancemod +
				8) *
			currentvoidmod
		);
		defenceaccuracy = effective_level * this.props.geartotals["def_magic"] + 64;
		return defenceaccuracy;
	}

	calculateAccMonster(type, stance) {
		var attacklevel = 8;
		var attackaccuracy = 0;
		if (type == "melee") {
			attacklevel = attacklevel + this.props.monster.statsatk;
			attackaccuracy = attacklevel * (this.props.monster[stance] + 64);
		}
		if (type == "ranged") {
			attacklevel = attacklevel + this.props.monster.statsranged;
			attackaccuracy =
				attacklevel * (this.props.monster["aggressiveranged"] + 64);
		}
		if (type == "magic") {
			attacklevel = attacklevel + this.props.monster.statsmagic;
			attackaccuracy =
				attacklevel * (this.props.monster["aggressivemagic"] + 64);
		}
		return attackaccuracy;
	}

	calculateDefMonster(type, stance) {
		var defenselevel = 8;
		var defenseaccuracy = 0;
		if (type == "melee") {
			defenselevel = defenselevel + parseInt(this.props.monster.statsdef);
			defenseaccuracy =
				defenselevel * (parseInt(this.props.monster[stance]) + 64);
		}
		if (type == "ranged") {
			defenselevel = defenselevel + parseInt(this.props.monster.statsdef);
			defenseaccuracy =
				defenselevel * (parseInt(this.props.monster["defenseranged"]) + 64);
		}
		if (type == "magic") {
			defenselevel =
				defenselevel +
				Math.floor(
					parseFloat(this.props.monster.statsmagic) * 0.7 +
					parseFloat(this.props.monster.statsdef) * 0.3
				);
			defenseaccuracy =
				defenselevel * (parseInt(this.props.monster["defensemagic"]) + 64);
		}
		return defenseaccuracy;
	}

	calculateDPS(chance, maxhit) {
		var attackrolls = 100 / parseInt(this.props.geartotals["speed"]); // This is the amount of times we can attack per second.
		attackrolls = attackrolls * (chance / 100); // We will probably hit or miss this many attacks.
		var totaldamage = (attackrolls * (maxhit / 2)) / 60; // Multiply attackrolls by half of the max hit since it's even distribution. Then divide by 60.
		return totaldamage;
	}

	probabilityRoll(attackroll, defenseroll) {
		var curraccuracy;
		if (attackroll > defenseroll) {
			curraccuracy = 1.0 - (defenseroll + 2) / (2 * (attackroll + 1));
		} else {
			curraccuracy = attackroll / (2 * (defenseroll + 1));
		}
		return curraccuracy; // This should return a value between 0 and 1. This is the % chance to hit.
	}

	showyourwork(maxhit, monsterdefense, atkcurrentroll, playercurrentDPS, playeraccuracyroll) {
		// Hide this if we aren't allowed
		var showyourworkstate;

		// Calculate Max Hit
		var visiblelevel = "Strength";
		var visiblelevelstrength = "melee strength"
		var potionmod = " ";
		var prayermod = " ";
		var stancemod = " ";
		var voidmod = " ";
		var strmod = "str_melee"
		var workingnum = this.props.level_str;
		var maxhittext = " ";
		if (this.props.stylecurrentdamage == "ranged") {
			workingnum = this.props.level_ranged;
			visiblelevel = "Ranged";
			visiblelevelstrength = "ranged strength"
			strmod = "str_ranged"
			if (this.props.potioncurrenttotalmod.ranged.percentage != 1.0) {
				potionmod = `Calculate your potion boost (${this.props.level_ranged} * ${this.props.potioncurrenttotalmod.ranged.percentage} + ${this.props.potioncurrenttotalmod.ranged.level}). `
				workingnum = Math.floor(workingnum * this.props.potioncurrenttotalmod.ranged.percentage) + parseInt(this.props.potioncurrenttotalmod.ranged.level)
			}
			if (this.props.prayercurrenttotalmod.ranged != 1.0) {
				prayermod = `Multiply by your prayer bonus (${workingnum}*${this.props.prayercurrenttotalmod.rangeddamage}).`;
				workingnum = Math.floor(workingnum * this.props.prayercurrenttotalmod.rangeddamage)
			}
			if (this.props.stylecurrentstyle == "accurate") {
				stancemod = "Add your stance bonus. +3 for Accurate"
				workingnum = workingnum + 3
			}
			workingnum = workingnum + 8;
			if (this.countVoid("voidranged") == true) {
				voidmod = "Multiply by 1.1 for the Void bonus."
				workingnum = Math.floor(workingnum * 1.1)
			}
			maxhittext = `(${this.props.geartotals[strmod]}+64)/640 * ${workingnum} + 0.5 = ${maxhit}`
		}
		else {
			if (this.props.potioncurrenttotalmod.strength.percentage != 1.0) {
				potionmod = `Calculate your potion boost (${this.props.level_str} * ${this.props.potioncurrenttotalmod.strength.percentage} + ${this.props.potioncurrenttotalmod.strength.level}). `
				workingnum = Math.floor(workingnum * this.props.potioncurrenttotalmod.strength.percentage) + parseInt(this.props.potioncurrenttotalmod.strength.level)
			}
			if (this.props.prayercurrenttotalmod.strength != 1.0) {
				prayermod = `Multiply by your prayer bonus (${workingnum}*${this.props.prayercurrenttotalmod.strength}).`;
				workingnum = Math.floor(workingnum * this.props.prayercurrenttotalmod.strength)
			}
			if (this.props.stylecurrentstyle == "aggressive") {
				stancemod = "Add your stance bonus. +3 for Aggressive"
				workingnum = workingnum + 3
			}
			else if (this.props.stylecurrentstyle == "controlled") {
				stancemod = "Add your stance bonus. +1 for Controlled"
				workingnum = workingnum + 1
			}
			workingnum = workingnum + 8;
			if (this.countVoid("voidmelee") == true) {
				voidmod = "Multiply by 1.1 for the Void bonus."
				workingnum = Math.floor(workingnum * 1.1)
			}
			maxhittext = `(${this.props.geartotals[strmod]}+64)/640 * ${workingnum} + 0.5  =  ${maxhit}`
		}

		// Calculate Accuracy Attack Roll
		var visiblelevelacctype = "Attack";
		var visiblelevelacc = this.props.stylecurrentdamage.slice(0, 1).toUpperCase() + this.props.stylecurrentdamage.slice(1)
		var potionmodacc = " ";
		var prayermodacc = " ";
		var stancemodacc = " ";
		var voidmodacc = " ";
		var strmodacc = `atk_${this.props.stylecurrentdamage}`
		var stramount = this.props.geartotals[strmodacc]
		var workingnumacc = this.props.level_atk;
		var maxhittextacc = " ";
		if (this.props.stylecurrentdamage == "ranged") {
		}
		else {
			if (this.props.potioncurrenttotalmod.attack.percentage != 1.0) {
				potionmodacc = `Calculate your potion boost (${workingnumacc} * ${this.props.potioncurrenttotalmod.attack.percentage} + ${this.props.potioncurrenttotalmod.attack.level}). `
				workingnumacc = Math.floor(workingnumacc * this.props.potioncurrenttotalmod.attack.percentage) + parseInt(this.props.potioncurrenttotalmod.attack.level)
			}
			if (this.props.prayercurrenttotalmod.attack != 1.0) {
				prayermodacc = `Multiply by your prayer bonus (${workingnumacc}*${this.props.prayercurrenttotalmod.attack}). Round up.`;
				workingnumacc = Math.ceil(workingnumacc * this.props.prayercurrenttotalmod.attack)
			}
			if (this.props.stylecurrentstyle == "accurate") {
				stancemodacc = "Add your stance bonus. +3 for Accurate"
				workingnumacc = workingnumacc + 3
			}
			else if (this.props.stylecurrentstyle == "controlled") {
				stancemodacc = "Add your stance bonus. +1 for Controlled"
				workingnumacc = workingnumacc + 1
			}
			workingnumacc = workingnumacc + 8;
			if (this.countVoid("voidmelee") == true) {
				voidmodacc = "Multiply by 1.1 for the Void bonus."
				workingnumacc = Math.floor(workingnumacc * 1.1)
			}
			maxhittextacc = `${workingnumacc} * (${stramount}+64) = ${playeraccuracyroll}`
		}

		// Calculate Enemy Defence Roll
		var effectivedefencelevel = this.props.monster.statsdef;
		var monsterdef = `defense${this.props.stylecurrentdamage}`;
		var stramountdef = this.props.monster[monsterdef]
		var deftext = " ";
		if (this.props.stylecurrentdamage == "ranged") {
		}
		else {
			deftext = `${effectivedefencelevel} * (${stramountdef}+64) = ${monsterdefense}`
		}

		// Calculate the higher of the two rolls for our formula
		var rolltext = " ";
		var rolltextcalc = " ";
		if (playeraccuracyroll > monsterdefense) {
			rolltext = `As Attack roll is bigger, calculate the accuracy roll by doing 1 - ((DefenceRoll+2) / (2*(AttackRoll+1))).`
			rolltextcalc = `1 - ((${monsterdefense} + 2) / (2 * (${playeraccuracyroll} + 1))) = ${(atkcurrentroll / 100).toFixed(3)}`
		}
		else {
			rolltext = `As Defence roll is bigger, calculate the accuracy roll by doing AttackRoll divided by (2*(DefenceRoll+1)).`
			rolltextcalc = `${playeraccuracyroll} / (2 * (${monsterdefense} + 1)) = ${(atkcurrentroll / 100).toFixed(3)}`
		}

		// Calculate our effective DPS
		var effectiveDPStext = " ";
		var effectiveswingcount = " ";
		var effectiveswingcountacc = " ";
		var swingsperminute = 60 / (this.props.geartotals.speed * 0.6)
		var swingsperminuteaccuracy = swingsperminute * (atkcurrentroll / 100)
		var damageperminute = (maxhit / 2) * swingsperminuteaccuracy
		var maxhitdivided = " ";
		if (this.props.stylecurrentdamage == "ranged") {
		}
		else {
			effectiveswingcount = `60 / ${(this.props.geartotals.speed * 0.6).toFixed(1)} = ${swingsperminute}`
			effectiveswingcountacc = `${swingsperminute} * ${(atkcurrentroll / 100).toFixed(3)} = ${swingsperminuteaccuracy}`
			maxhitdivided = `(${maxhit} / 2) * ${swingsperminuteaccuracy} = ${damageperminute}`
			effectiveDPStext = `${damageperminute} / 60 = ${playercurrentDPS}`
		}

		if (this.state.showyourwork == true) {
			return (
				<div style={showyourworkstate}>
					<div className="NumberCruncherShowWorkMaxHitEffectiveLevel">
						<div>To caclulate Max Hit, start with the base {visiblelevel} level.</div>
						<div>{potionmod}</div>
						<div>{prayermod}</div>
						<div>{stancemod}</div>
						<div>Add +8 to the number.</div>
						<div>{voidmod}</div>
						<div>Your effective level value is {workingnum}.</div>
					</div>
					<div className="NumberCruncherShowWorkMaxHitTotal">
						<div>Your max hit is calculated by the {visiblelevelstrength} bonus + 64, then divided by 640. Multiply this by {workingnum} and then add 0.5. Round the result down.</div>
						<div className="NumberCruncherShowWorkCalculation">{maxhittext}</div>
					</div>
					<div className="NumberCruncherShowWorkAccuracy">
						<div>To calculate your accuracy, start with your {visiblelevelacctype} level.</div>
						<div>{potionmodacc}</div>
						<div>{prayermodacc}</div>
						<div>{stancemodacc}</div>
						<div>Add +8 to the number.</div>
						<div>{voidmodacc}</div>
					</div>
					<div>
						<div>Your Attack roll is {workingnumacc} multiplied by your {visiblelevelacc} bonus + 64 in parenthesis.</div>
						<div className="NumberCruncherShowWorkCalculation">{maxhittextacc}</div>
					</div>
					<div className="NumberCruncherShowWorkAttackRoll">
						<div>To calculate the enemy's defence roll, start with their Defence level and use the above formula.</div>
						<div className="NumberCruncherShowWorkCalculation">{deftext}</div>
					</div>
					<div className="NumberCruncherShowWorkRollOut">
						<div>{rolltext}</div>
						<div className="NumberCruncherShowWorkCalculation">{rolltextcalc}</div>
					</div>
					<div className="NumberCruncherShowWorkAttackRoll">
						<div>You have a {atkcurrentroll}% chance to hit with every swing.</div>
					</div>
					<div className="NumberCruncherShowWorkEffectiveDPS">
						<div>You will swing once every {(this.props.geartotals.speed * 0.6).toFixed(1)} seconds. Divide 60 by this number to calculate the number of swings.</div>
						<div className="NumberCruncherShowWorkCalculation">{effectiveswingcount}</div>
					</div>
					<div className="NumberCruncherShowWorkAttackRoll">
						<div>Multiply your result by your roll chance to determine how many of these attacks you'll hit.</div>
						<div className="NumberCruncherShowWorkCalculation">{effectiveswingcountacc}</div>
					</div>
					<div className="NumberCruncherShowWorkAttackRoll">
						<div>There is an equal chance to hit from 0 to your max hit of {maxhit}. Divide this in half to find the mean and multiply it by your hit attacks.</div>
						<div className="NumberCruncherShowWorkCalculation">{maxhitdivided}</div>
					</div>
					<div className="NumberCruncherShowWorkAttackRoll">
						<div>Finally, divide this result by 60 to get your damage per second.</div>
						<div className="NumberCruncherShowWorkCalculation">{effectiveDPStext}</div>
					</div>
				</div>
			)
		}
		else return null;
	}

	bonusversustext(propmaxhit, propmonsterdefense, propatkcurrentroll, playercurrentDPS) {
		var returnedtext = null;
		var returnedtextacc = null;
		var returnedmaxhit = null;
		var reroll;
		var newmaxhit;
		var accmelee = `atk_${this.props.stylecurrentdamage}`
		var defmonster = `defense${this.props.stylecurrentdamage}`
		var attribute = null;
		var testattribute = null;
		var dragonreturnedtext = null;
		var dragonreturnedmaxhit = null;
		var dragonreturnedtextacc = null;
		var dragonreroll = null;
		var dragonnewmaxhit = null;
		var dragontestattribute = null;
		var undeaddragonreturnedtext = null;
		var undeaddragonreturnedmaxhit = null;
		var undeaddragonreturnedtextacc = null;
		var undeaddragonreroll = null;
		var undeaddragonnewmaxhit = null;
		var undeaddragontestattribute = null;
		if (this.props.monster.attribute != null) {
			attribute = this.props.monster.attribute.toLowerCase()
		}
		var stylecolor = {
			color: "gray"
		}
		var dragonstylecolor = {
			color: "gray"
		}
		var undeaddragonstylecolor = {
			color: "gray"
		}
		// Melee Damage Calculations
		if ((this.props.stylecurrentdamage.toLowerCase() == "slash") || (this.props.stylecurrentdamage.toLowerCase() == "stab") || (this.props.stylecurrentdamage.toLowerCase() == "crush")) {
			// Slayer Helm Calculations. This will be overridden by the Salve Amulet(ei) below
			if ((this.props.geartotals.seteffect.includes("slayerhelmi") == true) || (this.props.geartotals.seteffect.includes("slayerhelm") == true) || (this.props.geartotals.seteffect.includes("blackmask") == true)) {
				// This is +20% Ranged
				returnedmaxhit = "Max Hit versus Slayer Target: "
				returnedtextacc = "Accuracy versus Slayer Target: "
				returnedtext = "DPS versus Slayer Target: "
				reroll = this.calculateAccMeleePlayer(accmelee, parseInt(this.props.level_atk) * 1.167);
				newmaxhit = Math.floor(this.calculateMaxMelee(parseInt(this.props.level_str) * 1.167));
				testattribute = "slayer"
			}
			// This is melee damage of some sort. Every Salve Amulet will work here. Note however that any blackmask effect WILL override this particular evaluation. 
			if (((this.props.geartotals.seteffect.includes("salveamulet") == true) || (this.props.geartotals.seteffect.includes("salveamulet-i") == true)) && (!((this.props.geartotals.seteffect.includes("slayerhelmi") == true) || (this.props.geartotals.seteffect.includes("slayerhelm") == true) || (this.props.geartotals.seteffect.includes("blackmask") == true)))) {
				// This is +15% Attack and Strength
				returnedmaxhit = "Max Hit versus Undead: "
				returnedtextacc = "Accuracy versus Undead: "
				returnedtext = "DPS versus Undead: "
				reroll = this.calculateAccMeleePlayer(accmelee, parseInt(this.props.level_atk) * 1.15);
				newmaxhit = Math.floor(this.calculateMaxMelee(parseInt(this.props.level_str) * 1.15));
				testattribute = "undead"
			}
			if ((this.props.geartotals.seteffect.includes("salveamulet-e") == true) || (this.props.geartotals.seteffect.includes("salveamulet-ei") == true)) {
				// This is +20% Attack and Strength
				returnedmaxhit = "Max Hit versus Undead: "
				returnedtextacc = "Accuracy versus Undead: "
				returnedtext = "DPS versus Undead: "
				reroll = this.calculateAccMeleePlayer(accmelee, parseInt(this.props.level_atk) * 1.20);
				newmaxhit = Math.floor(this.calculateMaxMelee(parseInt(this.props.level_str) * 1.20));
				testattribute = "undead"
			}
		}
		// Ranged Damage Calculations
		if ((this.props.stylecurrentdamage.toLowerCase() == "ranged")) {
			// Slayer Helm Calculations. This will be overridden by the Salve Amulet(ei) below
			if ((this.props.geartotals.seteffect.includes("slayerhelmi") == true) || (this.props.geartotals.seteffect.includes("blackmaski") == true)) {
				// This is +20% Ranged
				returnedmaxhit = "Max Hit versus Slayer Target: "
				returnedtextacc = "Accuracy versus Slayer Target: "
				returnedtext = "DPS versus Slayer Target: "
				reroll = this.calculateAccRangedPlayer(parseInt(this.props.level_ranged) * 1.167);
				newmaxhit = Math.floor(this.calculateMaxRanged(parseInt(this.props.level_ranged) * 1.167));
				testattribute = "slayer"
			}
			// This is ranged damage of some sort. Only Salve Amulets i and ei will work. Note that the 15% is lower than 16.67% above, so this will NOT evaluate if slayerhelmi is found
			if ((this.props.geartotals.seteffect.includes("salveamulet-i") == true) && (!(this.props.geartotals.seteffect.includes("slayerhelmi") == true) || (this.props.geartotals.seteffect.includes("blackmaski") == true))) {
				// This is +15% Ranged
				returnedmaxhit = "Max Hit versus Undead: "
				returnedtextacc = "Accuracy versus Undead: "
				returnedtext = "DPS versus Undead: "
				reroll = this.calculateAccRangedPlayer(parseInt(this.props.level_ranged) * 1.15);
				newmaxhit = Math.floor(this.calculateMaxRanged(parseInt(this.props.level_ranged) * 1.15));
				testattribute = "undead"
			}
			// This is ranged damage of some sort and can override the blackmask calculation
			if ((this.props.geartotals.seteffect.includes("salveamulet-ei") == true)) {
				// This is +20% Ranged
				returnedmaxhit = "Max Hit versus Undead: "
				returnedtextacc = "Accuracy versus Undead: "
				returnedtext = "DPS versus Undead: "
				reroll = this.calculateAccRangedPlayer(parseInt(this.props.level_ranged) * 1.20);
				newmaxhit = Math.floor(this.calculateMaxRanged(parseInt(this.props.level_ranged) * 1.20));
				testattribute = "undead"
			}
			// This is ranged damage versus dragons but NO salve amulet
			if (this.props.geartotals.seteffect.includes("dragonhuntercrossbow")) {
				// This is +30% Ranged
				dragonreturnedmaxhit = "Max Hit versus Dragons: "
				dragonreturnedtextacc = "Accuracy versus Dragons: "
				dragonreturnedtext = "DPS versus Dragons: "
				dragonreroll = this.calculateAccRangedPlayer(parseInt(this.props.level_ranged) * 1.30);
				dragonnewmaxhit = Math.floor(this.calculateMaxRanged(parseInt(this.props.level_ranged) * 1.30));
				dragontestattribute = "dragon"
			}
			// This is ranged damage versus undead dragons
			if ((this.props.geartotals.seteffect.includes("dragonhuntercrossbow")) && ((testattribute == "undead"))) {
				// This is +30% Ranged
				undeaddragonreturnedmaxhit = "Max Hit versus Undead Dragons: "
				undeaddragonreturnedtextacc = "Accuracy versus Undead Dragons: "
				undeaddragonreturnedtext = "DPS versus Undead Dragons: "
				undeaddragonreroll = this.calculateAccRangedPlayer(parseInt(this.props.level_ranged) * 1.30 * 1.20);
				undeaddragonnewmaxhit = Math.floor(this.calculateMaxRanged(parseInt(this.props.level_ranged) * 1.30 * 1.20));
				undeaddragontestattribute = "dragon"
			}
		}

		// Figure out if this is relevant
		if ((attribute != null) && (testattribute != null)) {
			if (attribute.search(testattribute) != -1) {
				stylecolor = {
					color: "white"
				}
			}
			if ((attribute.search(dragontestattribute) != -1) && (undeaddragontestattribute != null) && (attribute.search(testattribute)) != -1) {
				undeaddragonstylecolor = {
					color: "white"
				}
			}
			else if (testattribute == "slayer") {
				stylecolor = {
					color: "white"
				}
			}
		}
		if ((attribute != null) && (dragontestattribute != null)) {
			if (attribute.search(dragontestattribute) != -1) {
				dragonstylecolor = {
					color: "white"
				}
			}
		}
		if ((attribute != null) && (undeaddragontestattribute != null)) {
			if ((attribute.search(dragontestattribute) != -1) && (undeaddragontestattribute != null) && (attribute.search(testattribute)) != -1) {
				undeaddragonstylecolor = {
					color: "white"
				}
			}
		}

		var atkcurrentroll =
			Math.round(
				this.probabilityRoll(reroll, propmonsterdefense) *
				100 *
				10
			) / 10;
		var returnedvalue =
			Math.round(this.calculateDPS(atkcurrentroll, newmaxhit) * 100) / 100;
		var playerTTK = Math.ceil(this.props.monster.hitpoints / returnedvalue)
		var playerswingcount = Math.ceil((this.props.monster.hitpoints / returnedvalue) / (0.6 * this.props.geartotals.speed) * atkcurrentroll / 100)

		var dragonatkcurrentroll =
			Math.round(
				this.probabilityRoll(dragonreroll, propmonsterdefense) *
				100 *
				10
			) / 10;
		var dragonreturnedvalue =
			Math.round(this.calculateDPS(dragonatkcurrentroll, dragonnewmaxhit) * 100) / 100;
		var dragonplayerTTK = Math.ceil(this.props.monster.hitpoints / dragonreturnedvalue)
		var dragonplayerswingcount = Math.ceil((this.props.monster.hitpoints / dragonreturnedvalue) / (0.6 * this.props.geartotals.speed) * dragonatkcurrentroll / 100)

		var undeaddragonatkcurrentroll =
			Math.round(
				this.probabilityRoll(undeaddragonreroll, propmonsterdefense) *
				100 *
				10
			) / 10;
		var undeaddragonreturnedvalue =
			Math.round(this.calculateDPS(undeaddragonatkcurrentroll, undeaddragonnewmaxhit) * 100) / 100;
		var undeaddragonplayerTTK = Math.ceil(this.props.monster.hitpoints / undeaddragonreturnedvalue)
		var undeaddragonplayerswingcount = Math.ceil((this.props.monster.hitpoints / undeaddragonreturnedvalue) / (0.6 * this.props.geartotals.speed) * undeaddragonatkcurrentroll / 100)

		if (undeaddragonreturnedtext != null) {
			return (
				<div>
					<div className="numberCruncherBonusVersus" style={stylecolor}>
						<div>{returnedmaxhit + newmaxhit}</div>
						<div>{returnedtextacc + atkcurrentroll + "%"}</div>
						<div>{returnedtext + returnedvalue}, Time to Kill: {playerTTK}s</div>
						<div>You will hit about {playerswingcount} times.</div>
					</div>
					<div className="numberCruncherBonusVersus" style={dragonstylecolor}>
						<div>{dragonreturnedmaxhit + dragonnewmaxhit}</div>
						<div>{dragonreturnedtextacc + dragonatkcurrentroll + "%"}</div>
						<div>{dragonreturnedtext + dragonreturnedvalue}, Time to Kill: {dragonplayerTTK}s</div>
						<div>You will hit about {dragonplayerswingcount} times.</div>
					</div>
					<div className="numberCruncherBonusVersus" style={undeaddragonstylecolor}>
						<div>{undeaddragonreturnedmaxhit + undeaddragonnewmaxhit}</div>
						<div>{undeaddragonreturnedtextacc + undeaddragonatkcurrentroll + "%"}</div>
						<div>{undeaddragonreturnedtext + undeaddragonreturnedvalue}, Time to Kill: {undeaddragonplayerTTK}s</div>
						<div>You will hit about {undeaddragonplayerswingcount} times.</div>
					</div>
				</div>
			)
		}
		else if ((dragonreturnedtext != null) && (returnedtext == null)) {
			return (
				<div>
					<div className="numberCruncherBonusVersus" style={dragonstylecolor}>
						<div>{dragonreturnedmaxhit + dragonnewmaxhit}</div>
						<div>{dragonreturnedtextacc + dragonatkcurrentroll + "%"}</div>
						<div>{dragonreturnedtext + dragonreturnedvalue}, Time to Kill: {dragonplayerTTK}s</div>
						<div>You will hit about {dragonplayerswingcount} times.</div>
					</div>
				</div>
			)
		}
		else if ((dragonreturnedtext != null) && (returnedtext != null)) {
			return (
				<div>
					<div className="numberCruncherBonusVersus" style={stylecolor}>
						<div>{returnedmaxhit + newmaxhit}</div>
						<div>{returnedtextacc + atkcurrentroll + "%"}</div>
						<div>{returnedtext + returnedvalue}, Time to Kill: {playerTTK}s</div>
						<div>You will hit about {playerswingcount} times.</div>
					</div>
					<div className="numberCruncherBonusVersus" style={dragonstylecolor}>
						<div>{dragonreturnedmaxhit + dragonnewmaxhit}</div>
						<div>{dragonreturnedtextacc + dragonatkcurrentroll + "%"}</div>
						<div>{dragonreturnedtext + dragonreturnedvalue}, Time to Kill: {dragonplayerTTK}s</div>
						<div>You will hit about {dragonplayerswingcount} times.</div>
					</div>
				</div>
			)
		}
		else if (returnedtext != null) {
			return (
				<div>
					<div className="numberCruncherBonusVersus" style={stylecolor}>
						<div>{returnedmaxhit + newmaxhit}</div>
						<div>{returnedtextacc + atkcurrentroll + "%"}</div>
						<div>{returnedtext + returnedvalue}, Time to Kill: {playerTTK}s</div>
						<div>You will hit about {playerswingcount} times.</div>
					</div>
				</div>
			)
		}
		else {
			return null
		}
	}

	render() {
		// Calculate Player's DPS and Max Hit
		var playeraccuracyroll;
		var monsterdefense;
		var playermaxhittext;
		var maxhit;
		if (this.props.stylecurrentdamage == "ranged") {
			maxhit = Math.floor(this.calculateMaxRanged());
			playeraccuracyroll = this.calculateAccRangedPlayer();
			monsterdefense = this.calculateDefMonster("ranged", "defenseranged");
			playermaxhittext = "Max Hit (Ranged): " + maxhit
		}
		else if (this.props.stylecurrentdamage == "magic") {
			maxhit = Math.floor(this.calculateMaxMagic());
			playermaxhittext = "Max Hit (Magic): " + maxhit
		}
		else {
			maxhit = Math.floor(this.calculateMaxMelee());
			var accmelee = `atk_${this.props.stylecurrentdamage}`
			var defmonster = `defense${this.props.stylecurrentdamage}`
			playermaxhittext = "Max Hit (Melee): " + maxhit
			monsterdefense = this.calculateDefMonster("melee", defmonster);
			playeraccuracyroll = this.calculateAccMeleePlayer(accmelee);
		}
		var atkcurrentroll =
			Math.round(
				this.probabilityRoll(playeraccuracyroll, monsterdefense) *
				100 *
				10
			) / 10;
		var playercurrentDPS =
			Math.round(this.calculateDPS(atkcurrentroll, maxhit) * 100) / 100;
		var playerTTK = Math.ceil(this.props.monster.hitpoints / playercurrentDPS)
		var playerswingcount = Math.ceil((this.props.monster.hitpoints / playercurrentDPS) / (0.6 * this.props.geartotals.speed) * atkcurrentroll / 100)

		return (
			<div className="NumberCruncherMainTextBack">
				<div className='numberCruncherShowYourWorkToggle'>
					<label>
						<OverrideCheckbox
							checked={this.state.showyourwork}
							onChange={this.handleCheckboxChange}
						/>
						<span> Show Your Work</span>
					</label>
				</div>
				<div className="NumberCruncherMainText">
					<div>{playermaxhittext}</div>
					<div>Accuracy ({this.props.stylecurrentdamage.slice(0, 1).toUpperCase() + this.props.stylecurrentdamage.slice(1)}): {atkcurrentroll}%</div>
					<div>Current DPS: {playercurrentDPS}, Time to Kill: {playerTTK}s</div>
					<div>You will hit about {playerswingcount} times.</div>
					{this.bonusversustext(maxhit, monsterdefense, atkcurrentroll, playercurrentDPS)}
					{this.showyourwork(maxhit, monsterdefense, atkcurrentroll, playercurrentDPS, playeraccuracyroll)}
				</div>
			</div>
		);
	}
}

export default NumberCrunch;
