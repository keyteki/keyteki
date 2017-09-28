import React from 'react';

import Link from './Link.jsx';

class About extends React.Component {
    render() {
        return (
            <div className='col-xs-12 full-height'>
                <div className='panel-title text-center'>
                    About Jigoku Online - Help and information
                </div>
                <div className='panel about-container'>
                    <a className='btn btn-danger btn-lg pull-right' target='_blank' href='https://github.com/gryffon/ringteki/issues'>Report Problems</a>
                    <h3>What is this?</h3>

                    <p>This site was setup to allow you to play Legend of the Five Rings, an LCG from Fantasy Flight Games (FFG) in your browser.</p>

                    <h3>That's pretty cool!  But how does any of this work?</h3>
                    <p>Head on over to the <Link href='/how-to-play'>How To Play guide</Link> for a thorough explanation.</p>


                    <h3>Everyone has a shiny avatar, how do I get one?</h3>
                    <p>This is handled by the good people at <a href='http://gravatar.com' target='_blank'>Gravatar</a>.  Sign up there with the same email address you did there and it should appear on the site after a short while.
                It will also use the avatar on any site that uses gravatar.  Examples include github and jinteki.</p>

                    { /*<h3>The artwork on this site is pretty cool, where's that from?</h3>
                    <p>You're right, it is pretty nice isn't it?</p>

                    <p>The background of the site is by an artist named <a href='http://dumaker.deviantart.com/' target='_blank'>Dumaker</a> and can be found <a href='http://dumaker.deviantart.com/art/Looking-for-the-Iron-Throne-Game-of-Thrones-9-364330141' target='_blank'>here</a>.</p>
                    <p>The in game backgrounds are by <a href='http://www.thomastanart.com/' target='_blank'>Thomas Tan</a>.  He's very talented, you should check out his work!</p>
                    <p>Don't want to be distracted by beautiful art during your games? In-game backgrounds can be disabled from your <Link href='/profile'>Profile</Link>.</p>*/ }

                    <h3>Can I help?</h3>
                    <p>Sure!  The project is all written in Javascript.  The server is node.js and the client is React.js.  The source code can be found in the&nbsp;
                        <a target='_blank' href='http://github.com/gryffon/ringteki'>GitHub Repository</a>.  Check out the code and instructions on there on how to get started and hack away!  See the card implementation
                status list above to have a look at what needs to be done.  If you want to join the dev discord, or ask any other question, send me a note on here, or post in the L5R Facebook group.  I'll likely find it.
                    </p>

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
                I will also put a donation report in with the monthly reports that I'm publishing so that you know where your donations are going.*/ }

                    <h2>Special Thanks</h2>
                    <p>I'd like to thank mtgred, and the whole of the jinteki.net development team(except whoever decided to write the code in clojure, not you. - just kidding!) as without their
                work to use as a guide and as inspiration, this site would not be where it is today.  To say jinteki is an inspiration is an understatement.
                    </p>
                    <p>I'd also like to thank cryogen and his team for their work on creating throneteki, which i've based this particular application off of.</p>

                    <h2>Additional Notes</h2>
                    <p>The Legend of the Five Rings living card game, the artwork and many other things are all copyright Fantasy Flight Games and I make no claims of ownership or otherwise of any of the
                    artwork or trademarks.  This site exists for passionate fans to play a game they enjoy and augment, rather than replace, the in person LCG.  FFG does not endorse, support, and is not
                    involved with, this site in any way.
                    </p>
                </div>
            </div>
        );
    }
}

About.displayName = 'About';
About.propTypes = {
};

export default About;
