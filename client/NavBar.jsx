import React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';

import Link from './Link.jsx';

import * as actions from './actions';

class InnerNavBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    
    onMenuItemMouseOver(menuItem) {
        this.setState({
            showPopup : menuItem
        });
    }

    onMenuItemMouseOut() {
        this.setState({
            showPopup: undefined
        });
    }

    render() {
        var leftMenuToRender = [];
        var rightMenuToRender = [];

        _.each(this.props.leftMenu, item => {
            var active = item.path === this.props.currentPath ? 'active' : '';

            leftMenuToRender.push(<li key={item.name} className={active}><Link href={item.path}>{item.name}</Link></li>);
        });

        _.each(this.props.rightMenu, item => {
            var active = item.path === this.props.currentPath ? 'active' : '';

            rightMenuToRender.push(<li key={item.name} className={active}><Link href={item.path}>{item.name}</Link></li>);
        });

        var numGames = !_.isUndefined(this.props.numGames) ? <li><span>{this.props.numGames + ' Games'}</span></li> : null;

        var contextMenu = _.map(this.props.context, menuItem => {
            return (
                <li key={menuItem.text}><a href='javascript:void(0)' onMouseOver={this.onMenuItemMouseOver.bind(this, menuItem)}
                                           onMouseOut={this.onMenuItemMouseOut.bind(this)} 
                                           onClick={menuItem.onClick ? event => {
                                               event.preventDefault();
                                               menuItem.onClick();
                                           } : null}>{menuItem.text}</a></li>
            );
        });

        return (
            <nav className='navbar navbar-inverse navbar-fixed-top'>
                <div className='container'>
                    <div className='navbar-header'>
                        <button className='navbar-toggle collapsed' type='button' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>
                            <span className='sr-only'>Toggle Navigation</span>
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                        </button>
                        <Link href='/' className='navbar-brand'>{this.props.title}</Link>
                    </div>
                    <div id='navbar' className='collapse navbar-collapse'>
                        <ul className='nav navbar-nav'>
                            {leftMenuToRender}
                        </ul>
                        <ul className='nav navbar-nav navbar-right'>
                            {contextMenu}
                            {numGames}
                            {rightMenuToRender}
                        </ul>
                    </div>
                    {this.state.showPopup ? this.state.showPopup.popup : null}
                </div>
            </nav>);
    }
}

InnerNavBar.displayName = 'Decks';
InnerNavBar.propTypes = {
    context: React.PropTypes.array,
    currentPath: React.PropTypes.string,
    leftMenu: React.PropTypes.array,
    numGames: React.PropTypes.number,
    rightMenu: React.PropTypes.array,
    title: React.PropTypes.string
};

function mapStateToProps(state) {
    return {
        context: state.navigation.context
    };
}

const NavBar = connect(mapStateToProps, actions)(InnerNavBar);

export default NavBar;

