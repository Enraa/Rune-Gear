import React from "react";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import "./css/App.css";

import controlledbarstyle from "./tex/barstylecontrolled.png";

class MonsterSearchResults extends React.Component {
    constructor(props) {
        super(props)
        this.clickedMonster = this.clickedMonster.bind(this);
    }

    clickedMonster(e) {
        console.log(e.target);
        var monsterfilename = e.target.name.value

        this.props.clickedmonster(monsterfilename)
    }

    render() {
        var self = this;
        var backgroundimage = {
            backgroundImage: `url(${controlledbarstyle})`,
        }
        if (this.props.currsearchlist.length > 0 && this.props.currsearchactive == true) {
            console.log("Fired");
            return (
                <CSSTransitionGroup
                    transitionAppearTimeout={50}
                    transitionEnterTimeout={0}
                    transitionLeaveTimeout={0}
                    transitionName="monsterlist-transition"
                    transitionAppear={true}
                    unmountOnExit={true}
                >
                    {this.props.currsearchlist.map(function (el) {
                        return (
                            <div
                                className='MonsterSearchResultsItem'
                                name={el.filename}
                                key={el.filename}
                                onClick={() => self.props.clickedmonster(el.filename)}
                                style={backgroundimage}
                            >
                                {el.name}
                            </div>
                        );
                    })
                    }
                </CSSTransitionGroup>
            )
        }
        else {
            return null
        }
    }
}

export default MonsterSearchResults;