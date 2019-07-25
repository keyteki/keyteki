import React from 'react';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Site/Link';

class About extends React.Component {
    render() {
        return (
            <div className='col-xs-12 full-height'>
                <Panel title='About The Crucible Online - Help and information'>
                    <a className='btn btn-danger btn-lg pull-right' target='_blank' href='https://github.com/jeremylarner/keyteki/issues'>Report Problems</a>
                    <h3>What is this?</h3>

                    <p>This site was setup to allow you to play Keyforge, a Unique Deck Game from Fantasy Flight Games (FFG) in your browser.</p>

                    <h3>That's pretty cool!  But how does any of this work?</h3>
                    <p>Head on over to the <Link href='/how-to-play'>How To Play guide</Link> for a thorough explanation.</p>


                    <h3>Everyone has a shiny avatar, how do I get one?</h3>
                    <p>This is handled by the good people at <a href='http://gravatar.com' target='_blank'>Gravatar</a>.  Sign up there with the same email address you did there and it should appear on the site after a short while.
                It will also use the avatar on any site that uses gravatar.  Examples include github and jinteki.</p>

                    <h3>This looks a lot like Ringteki and Throneteki... But where's the source code?</h3>
                    <p>Keyteki (the codebase which runs this website) was forked from the Ringteki code, and I owe a huge debt to all the people who contributed to it.</p>
                    <p>However, unlike Throneteki and Ringteki, Keyteki is not Open Source.  The reason for this is that it seems very likely that FFG will produce their own Keyforge digital implementation in the future, and I have no intention to compete with an official platform, or to support anyone else doing that</p>
                    <p>For this reason, I've decided not to make the source code publically available.  If at any point FFG decides they want this website removed, they just need to ask.</p>

                    <h3>Donations</h3>
                    <p>Since I've been asked a few times about where people can donate to the project, I thought I'd put up a small section about it here.</p>
                    <p>You can use this link: <a target='_blank' href='https://paypal.me/keyteki'>Paypal</a> to donate to the project. Note: The account uses my name, but is completely separate from my personal Paypal account.</p>

                    <p>Just to make things clear, I'm not doing this for any personal gain whatsoever, any money raised via this link will be used towards paying the hosting fees for the server and related services such as error tracking. All money in this account will only go towards these expenses.</p>
                    <p>Also, this is not required to continue to use and enjoy the site and will not give anything of substance in return. I will also create an expense report that I will publish, so that you know where your donations are going.</p>

                    <p>If you wish to reward the devs in particular, feel free to thank them when you see them out at events. Sharing a cold beverage is always appreciated!</p>

                    <h3>Special Thanks</h3>
                    <p>I'd like to thank gyffon, cryogen, and the throneteki and ringteki teams as without their help and support this site would never have happened.</p>

                    <h3>Additional Icons</h3>
                    <p>Some icons were included from game-icons.net: Death Note by lorc.</p>

                    <h3>Additional Notes</h3>
                    <p>The Keyforge Unique Deck Game, the artwork and many other things are all copyright Fantasy Flight Games and I make no claims of ownership or otherwise of any of the
                    artwork or trademarks.  This site exists for passionate fans to play a game they enjoy and augment, rather than replace, the in person LCG.  FFG does not endorse, support, and is not
                    involved with, this site in any way.
                    </p>
                </Panel>
            </div>
        );
    }
}

About.displayName = 'About';
About.propTypes = {
};

export default About;
