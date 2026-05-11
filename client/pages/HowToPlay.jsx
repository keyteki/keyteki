import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@heroui/react';

import Link from '../Components/Navigation/Link';
import Panel from '../Components/Site/Panel';
import manualCommands from '../manualCommands';

const HowToPlay = () => {
    const { t } = useTranslation();

    return (
        <div className='min-h-full w-full'>
            <Panel title={t('How To Play on The Crucible Online')}>
                <Button
                    className='mb-3 ml-auto inline-flex'
                    variant='primary'
                    onPress={() =>
                        window.open(
                            'https://github.com/keyteki/keyteki/issues',
                            '_blank',
                            'noopener,noreferrer'
                        )
                    }
                >
                    <Trans>Report Problems</Trans>
                </Button>
                <h3>
                    <Trans>Introduction</Trans>
                </h3>
                <p>
                    <Trans i18nKey='howtoplay.thisguide'>
                        This guide is aimed at players familiar with Keyforge: the Unique Deck Game
                        who want to start playing online using the The Crucible Online platform. If
                        you are new to this cardgame in general, there is a{' '}
                        <a
                            href='https://www.youtube.com/watch?v=D7qt2H9Im2Q'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            helpful tutorial video
                        </a>
                        , a{' '}
                        <a
                            href='https://images-cdn.fantasyflightgames.com/filer_public/99/15/99157338-aa49-47b1-9ab9-90e99ba1db51/kf_quickstart_web_good.pdf'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Quickstart guide
                        </a>
                        , and a{' '}
                        <a
                            href='https://images-cdn.fantasyflightgames.com/filer_public/7f/d1/7fd1d910-f915-4b2c-9941-9457a8ab693a/keyforge_rulebook_v11-compressed.pdf'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Rulebook
                        </a>{' '}
                        to help you out.
                    </Trans>
                </p>

                <h3>
                    <Trans>Topics</Trans>
                </h3>

                <ul className='mb-3 m-0 list-none p-0 font-semibold'>
                    <li>
                        <a href='#decks'>
                            <Trans>Adding Decks</Trans>
                        </a>
                    </li>
                    <li>
                        <a href='#profile'>
                            <Trans>Profile Options</Trans>
                        </a>
                    </li>
                    <li>
                        <a href='#bugs'>
                            <Trans>Bugs and Automation</Trans>
                        </a>
                    </li>
                    <li>
                        <a href='#mmode'>
                            <Trans>Manual Mode</Trans>
                        </a>
                    </li>
                    <li>
                        <a href='#commands'>
                            <Trans>Manual Commands</Trans>
                        </a>
                    </li>
                    <li>
                        <a href='#conceding'>
                            <Trans>About Stats, Conceding and Leaving Games</Trans>
                        </a>
                    </li>
                </ul>

                <h3 id='decks'>
                    <Trans>Adding Decks</Trans>
                </h3>
                <p>
                    <Trans i18nKey='howtoplay.addingdecks'>
                        Clicking the <Link href='/decks'>Decks</Link> link will let you import decks
                        from the master vault.
                    </Trans>
                </p>

                <h3 id='profile'>
                    <Trans>Profile Options</Trans>
                </h3>
                <p>
                    <Trans i18nKey='howtoplay.profile'>
                        Clicking your <Link href='/profile'>Profile</Link> at the top right of the
                        page allows you to tailor certain aspects of gameplay to your wishes.
                    </Trans>
                </p>

                <h3 id='bugs'>
                    <Trans>Bugs and Automation</Trans>
                </h3>
                <p>
                    <Trans i18nKey='howtoplay.bugs'>
                        If you happen upon a card that you believe is not working as it should, it
                        would help immensely if you would submit an issue on{' '}
                        <a
                            target='_blank'
                            href='https://github.com/keyteki/keyteki/issues'
                            rel='noopener noreferrer'
                        >
                            GitHub
                        </a>
                        . Other comments and/or feedback can be left on GitHub as well.
                    </Trans>
                </p>

                <h3 id='mmode'>
                    <Trans>Manual Mode</Trans>
                </h3>
                <p>
                    <Trans i18nKey='howtoplay.manualmode1'>
                        Most of the cards should be implemented, but if things go wrong, or someone
                        misclicks, or you really hate automation, you can switch on Manual Mode by
                        clicking the wrench in the bottom right.
                    </Trans>
                </p>
                <p>
                    <Trans i18nKey='howtoplay.manualmode2'>
                        In manual mode, clicking cards will bring up a menu which allows you to
                        easily change the game state. Most of the functions in these menus mirror
                        the Manual Commands listed below, but there are a couple of things which can
                        only be done in menus.
                    </Trans>
                </p>

                <h3 id='commands'>
                    <Trans>Manual Commands</Trans>
                </h3>
                <p>
                    <Trans i18nKey='howtoplay.commands'>
                        The following manual commands have been implemented in order to allow for a
                        smoother gameplay experience:
                    </Trans>
                </p>
                <ul className='list-disc list-inside ml-4 space-y-1'>
                    {manualCommands.map((cmd) => (
                        <li key={cmd.usage}>
                            <code className='font-mono text-sm bg-default-200 text-default-700 px-1 py-0.5 rounded'>
                                {cmd.usage}
                            </code>{' '}
                            - <Trans i18nKey={cmd.i18nKey}>{cmd.description}</Trans>
                        </li>
                    ))}
                </ul>

                <h3 id='conceding'>
                    <Trans>About Stats, Conceding and Leaving Games</Trans>
                </h3>
                <p>
                    <Trans i18nKey='howtoplay.about'>
                        The Crucible Online does not rank and/or match players by skill level in any
                        way. There are three categories (beginner, casual and competitive) to be
                        chosen when creating a game which gives an indication of what to expect, but
                        it doesn&apos;t enforce anything. Even though personal stats are not being
                        tracked, most players still very much appreciate a formal concede by
                        clicking the ‘Concede’ button and typing ‘gg’ before leaving a game. The
                        reality of quick and anonymous online games dictates this won’t always
                        happen though, as evidenced by regular complaining in the main lobby about
                        people leaving without conceding. Our advice is to just move on to the next
                        game since in the end, conceding or not doesn’t really impact anything.
                        Happy gaming!
                    </Trans>
                </p>
            </Panel>
        </div>
    );
};

HowToPlay.displayName = 'How To Play';

export default HowToPlay;
