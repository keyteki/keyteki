import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Modal extends React.Component {
    render() {
        return (
            <div id={ this.props.id } className='modal fade' tabIndex='-1' role='dialog'>
                <div className='modal-dialog' role='document'>
                    <div className={ classNames('modal-content', this.props.className) } onClick={ e => e.stopPropagation() }>
                        <div className='modal-header'>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>×</span></button>
                            <h4 className='modal-title'>{ this.props.title }</h4>
                        </div>
                        <div className={ classNames('modal-body', this.props.bodyClassName) }>
                            { this.props.children }
                        </div>
                    </div>
                </div>
            </div>);
    }
}

Modal.displayName = 'Modal';
Modal.propTypes = {
    bodyClassName: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string
};

export default Modal;
