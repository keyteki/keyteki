import React from 'react';

import Panel from '../Components/Site/Panel';

const Privacy = () => {
    return (
        <div className='col-xs-12 full-height'>
            <Panel title='Privacy Policy'>
                <h3>Background</h3>

                <p>Even though this is only a site to play a card game online, we still take your privacy and the security of your data seriously.  This policy outlines what data we store about you, why we store it and what we do with it.</p>

                <h3>What data we store</h3>
                <p>When you sign up for the site (which is required to play or spectate on games), we collect a username, your email address, a password and the IP address of the computer you're using when you sign up.</p>
                <p>When you play games on the site, we collect information about the games you play(what faction/agenda you're using, the deck you are using to play with - but not its contents, who you are playing against and the outcome of the game).</p>
                <p>If you chat in the lobby, your messages are stored.</p>

                <h3>Why we collect it</h3>
                <p>We collect a username to identify you on the site and so that people know who they are playing against.</p>
                <p>Your email address is used:
                    <ul>
                        <li>in order to verify that you are a real person and not an automated program(or 'bot').</li>
                        <li>to enchance the security and general environment of the site by allowing us to restrict people to one account per email address, or to prevent a user using the site.</li>
                        <li>to provide your avatar picture via a service called Gravatar.  Your email address is cryptographically hashed and sent to Gravatar's servers for them to provide your profile image or a default placeholder.</li>
                        <li>to allow you to reset your password if you forget it</li>
                        <li>to send you critical updates about the site from time to time (We have to date never sent one of these)</li>
                    </ul>
                </p>
                <p>The IP address of the computer you use is collected in order to protect the security and integrity of the site and allow us to prevent abuse of the site.</p>
                <p>Your lobby messages are stored so that we can display them to other users of the site and to detect patterns of abusive behaviour.  Your messages may also be moderated to remove offensive content, or deleted altogether at our discretion.</p>
            </Panel>
        </div>
    );
};

Privacy.displayName = 'Privacy';

export default Privacy;
