import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import Input from '../Form/Input';
import * as actions from '../../redux/actions';

import { withTranslation, Trans } from 'react-i18next';

export class ImportDeck extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
            deckString: ''
        };

        this.onImportDeck = this.onImportDeck.bind(this);
        this.onDeckStringChange = this.onDeckStringChange.bind(this);
    }

    componentDidUpdate(props) {
        if (props.deckSaved) {
            this.props.navigate('/decks');

            return;
        }
    }

    onImportDeck() {
        this.setState({ error: '' });
        const regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
        let uuid = this.state.deckString.match(regex);
        if (uuid && uuid[0] !== '00000000-0000-0000-0000-000000000000') {
            this.props.saveDeck({ uuid: uuid[0] });
        } else {
            this.setState({
                error: 'The URL you entered is invalid.  Please check it and try again.'
            });
        }
    }

    onDeckStringChange(event) {
        this.setState({ deckString: event.target.value });
    }

    render() {
        let t = this.props.t;

        return (
            <div>
                <div className='col-md-8 col-md-offset-2 profile full-height'>
                    {this.state.error && <AlertPanel type='error' message={t(this.state.error)} />}
                    {this.props.apiSuccess === false && (
                        <AlertPanel type='error' message={t(this.props.apiMessage)} />
                    )}
                    <Panel title={t('Import Deck')}>
                        <Trans i18nKey='importdeck.enterlink'>
                            <p>
                                Enter the deck link from the{' '}
                                <a
                                    href='https://keyforgegame.com'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    keyforge website.
                                </a>
                            </p>
                            <p>
                                Either search for a deck, or find one from the &quot;My Decks&quot;
                                section of the website. Find the URL of the deck and paste it in to
                                the box below.
                            </p>
                            <p>The URL looks like this: </p>
                        </Trans>
                        <p>
                            <code>
                                https://www.keyforgegame.com/deck-details/00000000-0000-0000-0000-000000000000
                            </code>
                        </p>
                        <Input
                            name='importUrl'
                            fieldClass='col-xs-9'
                            placeholder={t('link')}
                            type='text'
                            onChange={this.onDeckStringChange}
                            value={this.state.deckString}
                            autoFocus
                        >
                            <div className='col-xs-1'>
                                <button className='btn btn-default' onClick={this.onImportDeck}>
                                    {t('Import')}{' '}
                                    {this.props.apiLoading && (
                                        <span className='spinner button-spinner' />
                                    )}
                                </button>
                            </div>
                        </Input>
                    </Panel>
                </div>
            </div>
        );
    }
}

ImportDeck.displayName = 'ImportDeck';
ImportDeck.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    deckSaved: PropTypes.bool,
    i18n: PropTypes.object,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    saveDeck: PropTypes.func,
    t: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.SAVE_DECK ? state.api.SAVE_DECK.loading : undefined,
        apiMessage: state.api.SAVE_DECK ? state.api.SAVE_DECK.message : undefined,
        apiSuccess: state.api.SAVE_DECK ? state.api.SAVE_DECK.success : undefined,
        deckSaved: state.cards.deckSaved,
        loading: state.api.loading,
        socket: state.lobby.socket
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(ImportDeck));
