import React from 'react';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Site/Link';

class About extends React.Component {
    render() {
        return (
            <div className='col-xs-12 full-height'>
                <Panel title='About The Crucible Online - Help and information'>
                    <a className='btn btn-danger btn-lg pull-right' target='_blank' href='https://github.com/keyteki/keyteki/issues'>Report Problems</a>
                    <h3>What is this?</h3>

                    <p>This site was setup to allow you to play Keyforge, a Unique Deck Game from Fantasy Flight Games (FFG) in your browser.</p>

                    <h3>That's pretty cool!  But how does any of this work?</h3>
                    <p>Head on over to the <Link href='/how-to-play'>How To Play guide</Link> for a thorough explanation.</p>

                    <h3>Everyone has a shiny avatar, how do I get one?</h3>
                    <p>This is handled by the good people at <a href='http://gravatar.com' target='_blank'>Gravatar</a>.  Sign up there with the same email address you did there and it should appear on the site after a short while.
                It will also use the avatar on any site that uses gravatar.  Examples include github and jinteki.</p>

                    <h3>Why do my best cards always get discarded? / Why do I/my opponent draw 6 brobnar cards every turn?</h3>
                    <p>This is question that gets asked a lot (usually less politely!).  The shuffle code is fine.  It uses a Fisher-Yates algorithm which is the best card shuffling algorithm available.  Real randomness can be quite jarring when you're used to imperfect human shuffling.  But why believe me? Believe the numbers:</p>
                    <p>The discard random card code has been run through a test routine 1 million times, here are the results for a hand size of 6:</p>
                    <pre>
                        1: 166,840<br />
                        2: 166,344<br />
                        3: 166,767<br />
                        4: 166,594<br />
                        5: 166,546<br />
                        6: 166,908<br />
                    </pre>
                    <p>That said, if you can prove there is a bug, please do raise an issue on GitHub!</p>

                    <h3>Special Thanks</h3>
                    <p>I'd like to thank gyffon, cryogen, and the throneteki and ringteki teams as without their help and support this site would never have happened.</p>

                    <h3>Additional Icons</h3>
                    <p>Some icons were included from game-icons.net:
                    Death Note by <a target='_blank' href='http://lorcblog.blogspot.com/'>lorc</a>. <a target='_blank' href='https://creativecommons.org/licenses/by/3.0/'>CC-BY 3.0</a></p>

                    <h3>Additional Notes</h3>
                    <p>The Keyforge Unique Deck Game, the artwork and many other things are all copyright Fantasy Flight Games and I make no claims of ownership or otherwise of any of the
                    artwork or trademarks.  This site exists for passionate fans to play a game they enjoy and augment, rather than replace, the in person LCG.  FFG does not endorse, support, and is not
                    involved with, this site in any way.
                    </p>
                </Panel>
            </div >
        );
    }
}

About.displayName = 'About';
About.propTypes = {
};

export default About;
