import React from 'react';

class Community extends React.Component {
    render() {
        return (
            <div className='col-xs-12 full-height'>
                <div className='panel-title text-center'>
                    The Crucible Online - Community Information
                </div>
                <div className='panel about-container'>
                    <h3>What is this page?</h3>
                    <p>This page is a shoutout to other works/resources in the KeyForge community.</p>

                    <h3>KeyForge Discord</h3>
                    <p>Link: <a href='https://discordapp.com/invite/PcTGhr9' target='_blank'>L5R Discord</a></p>
                    <p>Discord is a text and voice communicaton application. Created by members of the L5R subreddit, it's a robust community of LCG/CCG/RPG players.</p>

                    <h3>UNDER CONSTRUCTION</h3>
                </div>
            </div>
        );
    }
}

Community.displayName = 'Community';
Community.propTypes = {
};

export default Community;
