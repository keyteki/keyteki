import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Modal = (props) => {
    return (
        <div
            id={props.id}
            className='modal fade'
            data-backdrop={props.noClickToClose ? 'static' : null}
            tabIndex='-1'
            role='dialog'
        >
            <div className='modal-dialog' role='document'>
                <div
                    className={classNames('modal-content', props.className)}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='modal-header'>
                        <button
                            type='button'
                            className='close'
                            data-dismiss='modal'
                            aria-label='Close'
                        >
                            <span aria-hidden='true'>×</span>
                        </button>
                        <h4 className='modal-title'>{props.title}</h4>
                    </div>
                    <div className={classNames('modal-body', props.bodyClassName)}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
};

Modal.displayName = 'Modal';
Modal.propTypes = {
    bodyClassName: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    noClickToClose: PropTypes.bool,
    title: PropTypes.string
};

export default Modal;
