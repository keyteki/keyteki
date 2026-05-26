describe('Destroyed: ability window', function () {
    // This is a stress test on nested destruction window ordering. It tests:
    // - Nested destruction does not remove creatures (Jargogle with Champion's Challenge)
    // - Cannot gain a destroyed: ability after being tagged for destruction (Thoughtcatcher with Parasitic Arachnoid)
    // - If a destroyed window is already open, new destroyed abilities do not interrupt the current ability and are instead added to the resolution queue of the current window (Kaspara with Champion's Challenge)
    describe("Champion's Challenge cascading through Obsidian Forge, Jargogles, Soulkeeper, Dust Imp and Kaspara", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 1,
                    hand: ['soulkeeper', 'champion-s-challenge', 'batdrone'],
                    inPlay: [
                        'jargogle',
                        'jargogle',
                        'skullion',
                        'dust-imp',
                        'parasitic-arachnoid',
                        'obsidian-forge'
                    ]
                },
                player2: {
                    amber: 0,
                    inPlay: ['kaspara', 'shadys', 'thoughtcatcher', 'mender']
                }
            });

            // Place cards under Jargogle
            const jargogles = this.player1.player.cardsInPlay.filter((c) => c.id === 'jargogle');
            this.jargogleWithChampChall = jargogles[0];
            this.jargogleWithBatdrone = jargogles[1];
            for (const [under, parent] of [
                [this.championSChallenge, this.jargogleWithChampChall],
                [this.batdrone, this.jargogleWithBatdrone]
            ]) {
                this.player1.player.removeCardFromPile(under);
                under.parent = parent;
                under.facedown = true;
                parent.childCards.push(under);
            }

            // Add a +1 power counter to put more damage on Kaspara
            this.jargogleWithBatdrone.powerCounters = 1;

            // Attach Soulkeeper to Skullion.
            this.player1.playUpgrade(this.soulkeeper, this.skullion);
            expect(this.skullion.upgrades).toContain(this.soulkeeper);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);

            // Use Obsidian Forge to sacrifice every friendly creature.
            this.player1.useAction(this.obsidianForge);
            this.player1.clickCard(this.jargogleWithChampChall);
            this.player1.clickCard(this.jargogleWithBatdrone);
            this.player1.clickCard(this.skullion);
            this.player1.clickCard(this.dustImp);
            this.player1.clickCard(this.parasiticArachnoid);
            this.player1.clickPrompt('Done');

            // Friendly creatures are tagged for destruction and prompt for order of resolution.
            for (const c of [
                this.jargogleWithChampChall,
                this.jargogleWithBatdrone,
                this.skullion,
                this.dustImp,
                this.parasiticArachnoid
            ]) {
                expect(c.location).toBe('play area');
                expect(c.moribund).toBe(true);
                expect(this.player1).toBeAbleToSelect(c);
            }
        });

        it('keeps every destroyed creature on the board until all Destroyed: abilities (including those triggered by CC) have resolved, batches their amber gains correctly, and lets P1 forge a key with Obsidian Forge once the dust settles', function () {
            // Resolve Jargogle with Batdrone
            expect(this.player1).toHavePrompt(
                'Any interrupts to Parasitic Arachnoid being destroyed or Dust Imp being destroyed, Skullion being destroyed, Jargogle being destroyed, Jargogle being destroyed?'
            );
            this.player1.clickCard(this.jargogleWithBatdrone);
            this.player1.clickPrompt('Left');
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.moribund).toBe(false);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            // Pending destroyed abilities
            expect(this.player1).toBeAbleToSelect(this.jargogleWithChampChall);
            expect(this.player1).toBeAbleToSelect(this.skullion);
            expect(this.player1).toBeAbleToSelect(this.dustImp);

            // Resolve Skullion's Soulkeeper
            expect(this.player1).toHavePrompt(
                'Any interrupts to Parasitic Arachnoid being destroyed or Dust Imp being destroyed, Skullion being destroyed, Jargogle being destroyed?'
            );
            this.player1.clickCard(this.skullion);
            expect(this.player1).not.toBeAbleToSelect(this.kaspara);
            expect(this.player1).toBeAbleToSelect(this.shadys);
            expect(this.player1).toBeAbleToSelect(this.thoughtcatcher);
            expect(this.player1).not.toBeAbleToSelect(this.mender);
            this.player1.clickCard(this.shadys);

            // Shadys' Kaspara grant is pending resolution
            expect(this.player1).toHavePrompt(
                'Any interrupts to Parasitic Arachnoid being destroyed or Shadys being destroyed, Dust Imp being destroyed, Jargogle being destroyed?'
            );
            expect(this.shadys.location).toBe('play area');
            expect(this.shadys.moribund).toBe(true);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).toBeAbleToSelect(this.shadys);
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).toBeAbleToSelect(this.jargogleWithChampChall);

            // Resolve Dust Imp's +2A
            expect(this.player1).toHavePrompt(
                'Any interrupts to Parasitic Arachnoid being destroyed or Shadys being destroyed, Dust Imp being destroyed, Jargogle being destroyed?'
            );
            this.player1.clickCard(this.dustImp);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);

            // Resolve Shadys' Kaspara +1A
            expect(this.player1).toHavePrompt(
                'Any interrupts to Parasitic Arachnoid being destroyed or Shadys being destroyed, Jargogle being destroyed?'
            );
            this.player1.clickCard(this.shadys);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);

            // Resolve Jargogle with Champion's Challenge
            expect(this.player1).toHavePrompt(
                'Any interrupts to Parasitic Arachnoid being destroyed or Jargogle being destroyed?'
            );
            this.player1.clickCard(this.jargogleWithChampChall);
            expect(this.player1).toHavePrompt('Champion’s Challenge');
            expect(this.player1).toHavePrompt('Choose an enemy creature to not destroy');
            expect(this.player1).toBeAbleToSelect(this.kaspara); // 6 power
            expect(this.player1).not.toBeAbleToSelect(this.shadys);
            expect(this.player1).not.toBeAbleToSelect(this.thoughtcatcher);
            expect(this.player1).not.toBeAbleToSelect(this.mender);
            this.player1.clickCard(this.kaspara);

            // Skullion (the only most-powerful friendly) is already moribund,
            // but downstream effects need a target so the selector falls back
            // to allowing the moribund top-power creature(s) to be chosen.
            expect(this.player1).toHavePrompt('Choose a friendly creature to not destroy');
            expect(this.player1).toBeAbleToSelect(this.skullion);
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.moribund).toBe(false); // not yet tagged for destruction
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.jargogleWithChampChall);
            expect(this.player1).not.toBeAbleToSelect(this.jargogleWithBatdrone);
            this.player1.clickCard(this.skullion);

            // All creatures except Kaspara are now tagged for destruction
            expect(this.kaspara.location).toBe('play area');
            expect(this.kaspara.moribund).toBe(false);
            for (const c of [
                this.jargogleWithChampChall,
                this.jargogleWithBatdrone,
                this.parasiticArachnoid,
                this.skullion,
                this.batdrone,
                this.shadys,
                this.thoughtcatcher,
                this.mender
            ]) {
                expect(c.location).toBe('play area');
                expect(c.moribund).toBe(true);
            }

            // Original Jargogle destroy ability has not resolved so all
            // creatures are in play and eligible to be targets in fight
            // for Champion's Challenge
            expect(this.player1).toHavePrompt('Choose a creature to fight with');
            expect(this.player1).toBeAbleToSelect(this.skullion);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.jargogleWithChampChall);
            expect(this.player1).toBeAbleToSelect(this.jargogleWithBatdrone);
            expect(this.player1).toBeAbleToSelect(this.parasiticArachnoid);
            this.player1.clickCard(this.jargogleWithBatdrone);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);

            // All enemy creatures are still in play and targets for the fight
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            expect(this.player1).toBeAbleToSelect(this.kaspara);
            expect(this.player1).toBeAbleToSelect(this.thoughtcatcher);
            expect(this.player1).toBeAbleToSelect(this.shadys);
            expect(this.player1).toBeAbleToSelect(this.mender);
            this.player1.clickCard(this.kaspara); // 7 power, 2 damage

            // Resolve Parasitic Arachnoid's capture 1A
            expect(this.player1).toHavePrompt(
                'Any interrupts to Mender being destroyed or Thoughtcatcher being destroyed, Parasitic Arachnoid being destroyed?'
            );
            expect(this.player1).toBeAbleToSelect(this.parasiticArachnoid);
            expect(this.player1).toBeAbleToSelect(this.thoughtcatcher);
            expect(this.player1).toBeAbleToSelect(this.mender);
            expect(this.player2.amber).toBe(1);
            this.player1.clickCard(this.parasiticArachnoid);
            expect(this.player1).toHavePrompt('Parasitic Arachnoid');
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.thoughtcatcher); // capture 1A
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(0);
            expect(this.thoughtcatcher.amber).toBe(1);

            // Resolve Thoughtcatcher Kaspara +1A
            // Thoughtcatcher does not gain +1 Draw from Parasitic Arachnoid
            // capture due to already being tagged for destruction
            expect(this.player1).toHavePrompt(
                'Any interrupts to Mender being destroyed or Thoughtcatcher being destroyed?'
            );
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.thoughtcatcher);
            expect(this.player1).toBeAbleToSelect(this.mender);
            expect(this.player2.hand.length).toBe(0);
            this.player1.clickCard(this.thoughtcatcher);
            expect.soft(this.player2.hand.length).toBe(0);

            // Auto-resolve Mender Kaspara +1A
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(2);
            expect(this.kaspara.location).toBe('play area');
            expect(this.kaspara.moribund).toBe(false);
            expect(this.kaspara.damage).toBe(3);
            expect(this.kaspara.power).toBe(10);

            // Finalize Obsidian Forge's destruction. All destroyed abilities
            // have resolved and cards have moved to the discard pile
            expect(this.player1).toHavePrompt('Obsidian Forge');
            expect(this.jargogleWithChampChall.location).toBe('discard');
            expect(this.jargogleWithBatdrone.location).toBe('discard');
            expect(this.skullion.location).toBe('discard');
            expect(this.dustImp.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.shadys.location).toBe('discard');
            expect(this.thoughtcatcher.location).toBe('discard');
            expect(this.mender.location).toBe('discard');
            expect(this.championSChallenge.location).toBe('discard');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.obsidianForge.location).toBe('play area');

            // Resolve Obsidian Forge
            expect(this.player1).toHavePrompt('Obsidian Forge');
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('Red');

            // Resolve Kaspara +1A
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.kaspara.location).toBe('discard');
            expect(this.obsidianForge.location).toBe('discard');
            expect(this.player1.player.cardsInPlay).toEqual([]);
            expect(this.player2.player.cardsInPlay).toEqual([]);

            // No Thoughtcatcher draw
            expect(this.player1.hand.length).toBe(0);
            expect.soft(this.player2.hand.length).toBe(0);

            expect(this.player1).isReadyToTakeAction();
        });

        it('autoresolves the cascade end-to-end', function () {
            this.player1.clickPrompt('Autoresolve');

            // Champion's Challenge: spare an enemy / friendly.
            expect(this.player1).toHavePrompt('Champion’s Challenge');
            expect(this.player1).toHavePrompt('Choose an enemy creature to not destroy');
            this.player1.clickCard(this.thoughtcatcher);
            // Skullion (the only most-powerful friendly) is moribund; the
            // selector falls back to allowing it so downstream effects have a
            // target.
            expect(this.player1).toHavePrompt('Choose a friendly creature to not destroy');
            this.player1.clickCard(this.skullion);
            expect(this.player1).toHavePrompt('Choose a creature to fight with');
            this.player1.clickCard(this.jargogleWithBatdrone);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.thoughtcatcher);

            // Batdrone enters from Jargogle's child.
            expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
            this.player1.clickPrompt('Left');

            // Soulkeeper picks an enemy creature to destroy.
            expect(this.player1).toHavePrompt('Soulkeeper');
            this.player1.clickCard(this.thoughtcatcher);

            // Parasitic Arachnoid captures 1A from a creature.
            expect(this.player1).toHavePrompt('Parasitic Arachnoid');
            this.player1.clickCard(this.thoughtcatcher);

            // Obsidian Forge prompts to forge.
            expect(this.player1).toHavePrompt('Obsidian Forge');
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('Red');
            expect(this.obsidianForge.location).toBe('discard');

            expect(this.player1.player.cardsInPlay).toEqual([this.batdrone]);
            expect(this.player2.player.cardsInPlay).toEqual([]);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player2.hand.length).toBe(0);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
