import React from 'react';
import PropTypes from 'prop-types';

class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };

        this.onBurgerClick = this.onBurgerClick.bind(this);
    }

    onBurgerClick() {
        this.setState({ expanded: !this.state.expanded });
    }

    render() {
        let component = this.state.expanded ? (
            <div className='sidebar expanded' key='sidebar-expanded'>
                <div>
                    <a href='#' className='btn btn-noimg pull-right' onClick={this.onBurgerClick}>
                        <span className='glyphicon glyphicon-remove' />
                    </a>
                    {this.props.children}
                </div>
            </div>
        ) : (
            <div className='sidebar collapsed' key='sidebar'>
                <div>
                    <a href='#' className='btn btn-noimg' onClick={this.onBurgerClick}>
                        <span className='glyphicon glyphicon-menu-hamburger' />
                    </a>
                </div>
            </div>
        );

        return <div>{component}</div>;
    }
}

SideBar.displayName = 'SideBar';
SideBar.propTypes = {
    children: PropTypes.node
};

export default SideBar;
