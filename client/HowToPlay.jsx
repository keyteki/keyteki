import React from 'react';

import Link from './Link.jsx';

class HowToPlay extends React.Component {
    render() {
        return (
            <div className='col-xs-12 full-height'>
                <div className='panel-title text-center'>
                    How To Play on The Crucible Online
                </div>
                <div className='panel about-container'>
                    <a className='btn btn-danger btn-lg pull-right' target='_blank' href='https://github.com/jeremylarner/keyteki/issues'>Report Problems</a>

                    <p>This guide is aimed at players familiar with Keyforge: the Unique Deck Game who want to start playing online using the The Crucible Online platform. If you are new to this cardgame in general, there is a <a href='https://www.youtube.com/watch?v=D7qt2H9Im2Q' target='_blank'>helpful tutorial video</a>, a <a href='https://images-cdn.fantasyflightgames.com/filer_public/99/15/99157338-aa49-47b1-9ab9-90e99ba1db51/kf_quickstart_web_good.pdf' target='_blank'>Quickstart guide</a>, and a <a href='https://images-cdn.fantasyflightgames.com/filer_public/45/78/4578fac4-728a-4e3e-9160-40b5af5ac3f9/keyforge_rulebook_web_good.pdf' target='_blank'>Rulebook</a> to help you out.</p>

                    <h3>Topics</h3>

                    <ul className='htp-main-list'>
                        <li><a href='#decks'>Adding Decks</a></li>
                        <li><a href='#profile'>Profile Options</a></li>
                        <li><a href='#bugs'>Bugs and Automation</a></li>
                        { /*<li><a href='#interactions'>Specific Card Interactions</a></li>
                        <ul className='htp-sub-list'>
                            <li><a href='#riddle'>Varys' Riddle vs Summer Harvest</a></li>
                        </ul> */ }
                        <li><a href='#mmode'>Manual Mode</a></li>
                        <li><a href='#commands'>Manual Commands</a></li>
                        <li><a href='#conceding'>About Stats, Conceding and Leaving Games</a></li>
                    </ul>

                    <h3 id='decks'>Adding Decks</h3>
                    <p>Until the game officially launches, it will not be possible to play with your own deck.  There are a number of decks which are available to all players, and you can choose to play with any of those. You are now ready to start playing. Head over to the <Link href='/play'>Play</Link> section to create, join or watch games.</p>

                    { /*<p>If you are new to Thrones 2.0, you can find an introductory Stark deck <a target='_blank' href='http://thronesdb.com/deck/view/358860'>here</a>, and an introductory Lannister/Tyrell deck <a target='_blank' href='http://thronesdb.com/deck/view/358861'>here</a>. Both decks only feature cards from the Core Set. If you are new and using any of these decks to play be sure to check the ‘Beginner’ category when creating your game, so you don’t necessarily get destroyed by an up to date power deck. If that happens anyway, just keep practicing and you’ll get the hang of it soon enough.</p>*/ }

                    <h3 id='profile'>Profile Options</h3>
                    <p>Clicking your <Link href='/profile'>Profile</Link> at the top right of the page allows you to tailor certain aspects of gameplay to your wishes.</p>

                    <h3 id='bugs'>Bugs and automation</h3>
                    <p>The Crucible Online is currently in beta and still a work in progress. If you happen upon a card that you believe is not working as it should, it would help immensely if you would submit an issue on <a target='_blank' href='https://github.com/jeremylarner/keyteki/issues'>GitHub</a>. Other comments and/or feedback can be left on GitHub as well.</p>

                    { /*<h3 id='interactions'>Specific Card Interactions</h3>*/ }

                    <h3 id='mmode'>Manual Mode</h3>
                    <p>Most of the cards should be implemented, but if things go wrong, or someone misclicks, or you really hate automation, you can switch on
                    Manual Mode by clicking the wrench in the bottom right.</p>
                    <p>In manual mode, clicking cards and rings will bring up a menu which allows you to easily change the game state. Most of the functions in
                    these menus mirror the Manual Commands listed below, but there are a couple of things which can only be done in menus.</p>

                    <h3 id='commands'>Manual Commands</h3>
                    <p>The following manual commands have been implemented in order to allow for a smoother gameplay experience:
                    </p>
                    <ul>
                        <li>/cancel-prompt - Clear the current prompt and resume the game flow.  Use with caution and only when the prompt is 'stuck' and you are unable to continue</li>
                        <li>/discard x - Discards x cards randomly from your hand</li>
                        <li>/draw x - Draws x cards from your deck to your hand</li>
                        <li>/give-control - Give control of a card to your opponent.  Use with caution</li>
                        <li>/manual - Activate or deactivate manual mode (see above).</li>
                    </ul>

                    <h3 id='conceding'>About Stats, Conceding, and Leaving Games</h3>
                    <p>The Crucible Online does not rank and/or match players by skill level in any way. There are three categories (beginner, casual and competitive) to be chosen when creating a game which gives an indication of what to expect, but it doesn't enforce anything. Even though personal stats are not being tracked, most players still very much appreciate a formal concede by clicking the ‘Concede’ button and typing ‘gg’ before leaving a game. The reality of quick and anonymous online games dictates this won’t always happen though, as evidenced by regular complaining in the main lobby about people leaving without conceding. Our advice is to just move on to the next game since in the end, conceding or not doesn’t really impact anything. Happy gaming!</p>
                </div>
            </div>
        );
    }
}

HowToPlay.displayName = 'How To Play';
HowToPlay.propTypes = {
};

export default HowToPlay;
