import React from 'react';

import Link from './Link.jsx';

class Community extends React.Component {
    render() {
        return (
            <div className='col-xs-12 full-height'>
                <div className='panel-title text-center'>
                    Jigoku Online - Community Information
                </div>
                <div className='panel about-container'>
                    <h3>What is this page?</h3>
                    <p>This page is a shoutout to other works/resources in the L5R community.</p>

                    <h3>L5R Discord</h3>
                    <p>Link: <a href='https://discord.gg/zPvBePb' target='_blank'>L5R Discord</a></p>
                    <p>Discord is a text and voice communicaton application. Created by members of the L5R subreddit, it's a robust community of LCG/CCG/RPG players.</p>

                    <h3>FiveRingsDB</h3>
                    <p>Link: <a href='https://fiveringsdb.com//' target='_blank'>FiveRingsDB</a></p>
                    <p>Card database and deck builder. Contains card rulings as well. Deck list are able to be directly imported into the Deckbuilder here.</p>

                    <h3>Troll5R</h3>
                    <p>Link: <a href='https://www.facebook.com/Troll5R/' target='_blank'>Troll5R</a></p>
                    <p>Winners of the podcast wars. A couple of L5R old-timers/playtesters who talk at length on just about anything.</p>

                    <h3>The Lotus Pavilion</h3>
                    <p>Link: <a href='http://thelotuspavilion.com/' target='_blank'>The Lotus Pavilion</a></p>
                    <p>Browser-based tournament software that originated for AGOT 2.0. Has an excellent pedigree.</p>
                </div>
            </div>
        );
    }
}

Community.displayName = 'Community';
Community.propTypes = {
};

export default Community;
