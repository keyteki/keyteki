import React from 'react';

import Link from './Link.jsx';

class About extends React.Component {
    render() {
        return (
            <div>
                <h2>Help and Information</h2>
                <h3>What is this?</h3>
                <p>This site was setup to allow you to play A Game Of Thrones 2.0, an LCG from Fantasy Flight Games (FFG) in your browser.</p>
                <h3>That's pretty cool!  How do I play?</h3>
                <p>That's kind of you to say.  Start by registering for an account or logging in if you already have one.  You must be logged in to play games or spectate on them. 
                Once you're logged in, go to the <Link href='/decks'>decks page.</Link>  You can create a deck by going to <a href='http://www.thronesdb.com' target='_blank'>Thrones DB</a>,
                 clicking on the button to download your deck to a TXT file and copy/pasting it into the deck builder.  Then either join or create a game and you're good to go.</p>

                <h3>Nothing works!</h3>
                <p>I'm sorry you're not having a good time.  This site is still in its infancy and there are a lot of cards to implement and bugs to sqish.  Most things can be worked around 
                by using manual commands (see below) or dragging cards around.  See <a href='http://bit.ly/throneteki'>This Link</a> for a list of the cards and their current implementation 
                status.  If it says 'Done' on that list, it should work and if it doesn't then it's a bug.</p>
                <p>If you do encounter a bug or issue which is not related to a missing or not implemented card
                then please do report it.  There is an <a href='http://github.com/cryogen/throneteki'>Issue Tracker</a> on the GitHub page where you can make your report.  Please include as
                much information as possible, including what the problem is, what you were expecting, what you did leading up to it, and if possible include a screenshot.  We are a very small
                development team and if bugs are not reported, it is unlikely they will get fixed.</p>

                <h3>Manual Commands</h3>
                <p>The following manual commands have been implemented in order to allow for a smoother gameplay experience:
                    <ul>
                        <li>/draw x - Draws x cards from your deck to your hand</li>
                        <li>/power x - Sets the power of a card to x</li>
                        <li>/discard x - Discards x cards randomly from your hand</li>
                        <li>/pillage - Discards the top card from your deck</li>
                        <li>/strength x - Sets the strength of a card to x</li>
                        <li>/cancel-prompt - Clear the current prompt and resume the game flow.  Use with caution and only when the prompt is 'stuck' and you are unable to continue</li>
                    </ul>
                </p>

                <h3>Can I help?</h3>
                <p>Sure!  The project is all written in Javascript.  The server is node.js and the client is React.js.  The source code can be found in the&nbsp; 
                <a href='http://github.com/cryogen/throneteki'>GitHub Repository</a>.  Check out the code and instructions on there on how to get started and hack away!  See the card implementation
                status list above to have a look at what needs to be done.  If you want to join the dev discord, or ask any other question, send me a note on here, over at&nbsp;
                <a href='http://www.twitter.com/cryogen'>Twitter</a> or post in the AGoT Facebook group.  I'll likely find it.
                </p>

                <h2>Special Thanks</h2>
                <p>I'd like to thank mtgred, and the whole of the jinteki.net development team(except whoever decided to write the code in clojure, not you. - just kidding!) as without their
                work to use as a guide and as inspiration, this site would not be where it is today.  To say jinteki is an inspiration is an understatement.
                </p>

                <h2>Additional Notes</h2>
                <p>The Game of Thrones living card game, the artwork and many other things are all copyright Fantasy Flight Games and I make no claims of ownership or otherwise of any of the 
                artwork or trademarks.  This site exists for passionate fans to play a game they enjoy and augment, rather than replace, the in person LCG.  FFG does not endorse, support, and is not
                involved with, this site in any way.
                </p> 
            </div>
        );
    }
}

About.displayName = 'About';
About.propTypes = {
};

export default About;
