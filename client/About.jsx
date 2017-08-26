import React from 'react';

import Link from './Link.jsx';

class About extends React.Component {
    render() {
        return (
            <div>
                <a className='btn btn-danger btn-lg pull-right' href='https://github.com/gryffon/ringteki/issues'>Report Problems</a>
                <h2>Help and Information</h2>

                <h3>What is this?</h3>

                <p>This site was setup to allow you to play the Legend of the Five Rings, an LCG from Fantasy Flight Games (FFG) in your browser.</p>

                <h3>That's pretty cool!  How do I play?</h3>
                <p>That's kind of you to say.  Start by registering for an account or logging in if you already have one.  You must be logged in to play games or spectate on them.
                Once you're logged in, go to the <Link href='/decks'>decks page.</Link>  You can create a deck by going to <a href='http://www.fiveringsdb.com' target='_blank'>L5R DB</a>,
                 clicking on the button to download your deck to a TXT file and copy/pasting it into the deck builder.  Then either join or create a game and you're good to go.</p>


                <h3>Everyone has a shiny avatar, how do I get one?</h3>
                <p>This is handled by the good people at <a href='http://gravatar.com' target='_blank'>Gravatar</a>.  Sign up there with the same email address you did there and it should appear on the site after a short while.
                It will also use the avatar on any site that uses gravatar.  Examples include github and jinteki.</p>

                <h3>Action windows</h3>
                <p>Players will be prompted about whether they have actions or not during game <a href='https://thronesdb.com/rulesreference#Action_Windows'>action windows</a>. By default, however, not all action windows are enabled. For example: you will be prompted by default after challenge attackers are declared, but not before the end of the dominance pahse. You can choose which action windows to be prompted for in your <a href='/profile'>user profile</a> as well as override that while in-game by clicking on the small green triangle above the various dialog windows.</p>

                <h3>Why doesn't xyz work?</h3>
                <p>While the site has come on a lot recently, there are still some missing cards and things that aren't implemented. See <a href='http://bit.ly/ringteki'>This Link</a> for a list of the cards and their current implementation
                status.  If it says 'Done' on that list, it should work and if it doesn't then it's a bug.</p>
                <p>If you do encounter a bug or issue which is not related to a missing or not implemented card
                then please do report it.  There is an <a href='http://github.com/gryffon/ringteki'>Issue Tracker</a> on the GitHub page where you can make your report.  Please include as
                much information as possible, including what the problem is, what you were expecting, what you did leading up to it, and if possible include a screenshot.  We are a very small
                development team and if bugs are not reported, it is unlikely they will get fixed.</p>

                <h3>Manual Commands</h3>
                <p>The following manual commands have been implemented in order to allow for a smoother gameplay experience:
                </p>
                <ul>
                    <li>/bestow x - Adds x gold to the selected card. You must have enough gold to add.</li>
                    <li>/cancel-prompt - Clear the current prompt and resume the game flow.  Use with caution and only when the prompt is 'stuck' and you are unable to continue</li>
                    <li>/discard x - Discards x cards randomly from your hand</li>
                    <li>/draw x - Draws x cards from your deck to your hand</li>
                    <li>/give-control - Give control of a card to your opponent.  Use with caution</li>
                    <li>/add-fate x - Add 'x' fate to a card.</li>
                    <li>/rem-fate x - Remove 'x' fate to a card.</li>
                </ul>

                { /*<h3>Can I help?</h3>
                <p>Sure!  The project is all written in Javascript.  The server is node.js and the client is React.js.  The source code can be found in the&nbsp;
                    <a href='http://github.com/gryffon/ringteki'>GitHub Repository</a>.  Check out the code and instructions on there on how to get started and hack away!  See the card implementation
                status list above to have a look at what needs to be done.  If you want to join the dev discord, or ask any other question, send me a note on here, over at&nbsp;
                    <a href='http://www.twitter.com/cryogen'>Twitter</a> or post in the L5R Facebook group.  I'll likely find it.
                </p> */ }
                { /*<h4>Donations</h4>
                I was always reluctant to accept donations but since I've been asked a few times I thought I'd put up a small section about it here.

                <form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>
                    <input type='hidden' name='cmd' value='_s-xclick' />
                    <input type='hidden' name='hosted_button_id' value='5SB6UZEGFSD58' />
                    <input type='image' src='https://www.paypalobjects.com/en_GB/i/btn/btn_donate_SM.gif' name='submit' alt='PayPal – The safer, easier way to pay online!' />
                    <img alt='' src='https://www.paypalobjects.com/en_GB/i/scr/pixel.gif' width='1' height='1' />
                </form>

                Just to make things clear, I'm not doing this for any personal gain whatsoever, I'm happy to run the servers at my own expense, but any money raised via this link will be used towards paying the hosting fees for the server and related services (error tracking, load balancing etc).
                If, after the annnual bills for that are paid up, there is any money left over, I'll put it towards the following years expenses.
                Also, this is not required to continue to use and enjoy the site and will not give anything in return (other than my sincerce gratitude and potentially better hardware for the site to run on).
                I will also put a donation report in with the monthly reports that I'm publishing so that you know where your donations are going.

                */ }

                <h2>Special Thanks</h2>
                <p>I'd like to thank mtgred, and the whole of the jinteki.net development team(except whoever decided to write the code in clojure, not you. - just kidding!) as without their
                work to use as a guide and as inspiration, this site would not be where it is today.  To say jinteki is an inspiration is an understatement.
                </p>
                <p>I'd also like to thank cryogen for his work on creating throneteki, which i've based this particular application off of.</p>

                <h2>Additional Notes</h2>
                <p>The Legend of the Five Rings living card game, the artwork and many other things are all copyright Fantasy Flight Games and I make no claims of ownership or otherwise of any of the
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
