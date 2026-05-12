describe("Champion's Challenge", function () {
    describe("Champion's Challenge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['punch', 'champion-s-challenge', 'troll', 'bumpsy', 'firespitter']
                },
                player2: {
                    amber: 1,
                    inPlay: ['batdrone', 'dextre', 'ganymede-archivist']
                }
            });
        });

        it('should destroy all but one of the enemy creatures if I have none in play', function () {
            this.player1.play(this.championSChallenge);
            expect(this.player1).toHavePrompt('Champion’s Challenge');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.ganymedeArchivist);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('play area');
            expect(this.batdrone.location).toBe('discard');
            expect(this.ganymedeArchivist.location).toBe('discard');
        });

        it('should fight with my creature and the remaining one if I only have one', function () {
            this.player1.play(this.troll);
            expect(this.troll.exhausted).toBe(true);
            this.player1.play(this.championSChallenge);
            expect(this.player1).toHavePrompt('Champion’s Challenge');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.ganymedeArchivist);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.batdrone.location).toBe('discard');
            expect(this.ganymedeArchivist.location).toBe('discard');
            expect(this.player1).toHavePrompt('Champion’s Challenge');
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('deck');
            expect(this.troll.damage).toBe(3);
            expect(this.troll.exhausted).toBe(true);
        });

        it('should destroy all but one of my creatures and opponents creatures and fight with the remainder', function () {
            this.player1.play(this.bumpsy);
            this.player1.play(this.firespitter);
            this.player1.play(this.championSChallenge);
            this.player1.clickCard(this.ganymedeArchivist);
            this.player1.clickCard(this.firespitter);
            this.player1.clickCard(this.firespitter);
            this.player1.clickCard(this.ganymedeArchivist);
            expect(this.firespitter.location).toBe('play area');
            expect(this.dextre.location).toBe('deck');
            expect(this.batdrone.location).toBe('discard');
            expect(this.ganymedeArchivist.location).toBe('discard');
            expect(this.firespitter.damage).toBe(2);
        });
    });
    describe("Champion's Challenge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: [
                        'punch',
                        'champion-s-challenge',
                        'troll',
                        'bumpsy',
                        'firespitter',
                        'troll'
                    ]
                },
                player2: {
                    amber: 1
                }
            });
        });

        it("should allow me to reap with the remaning creature I have if my opponent's board is empty", function () {
            this.player1.play(this.troll);
            expect(this.troll.exhausted).toBe(true);
            this.player1.play(this.championSChallenge);
            expect(this.player1).toHavePrompt('Champion’s Challenge');
            this.player1.clickCard(this.troll);
            this.player1.reap(this.troll);
            expect(this.player1.amber).toBe(1);
        });
    });
    describe("Champion's Challenge played from Jargogle's Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['jargogle', 'champion-s-challenge'],
                    inPlay: ['blunderbore', 'culf-the-quiet', 'code-monkey']
                },
                player2: {
                    inPlay: ['troll', 'groggins', 'sequis']
                }
            });
        });

        it('should allow selecting a creature destroyed by CC to fight an enemy creature also destroyed by CC', function () {
            this.player1.play(this.jargogle);
            this.player1.clickCard(this.championSChallenge);
            this.jargogle.ready();
            this.player1.fightWith(this.jargogle, this.troll);

            expect(this.player1).toHavePrompt('Champion’s Challenge');
            expect(this.player1).toHavePrompt('Choose an enemy creature to not destroy');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Champion’s Challenge');
            expect(this.player1).toHavePrompt('Choose a friendly creature to not destroy');
            expect(this.player1).toBeAbleToSelect(this.blunderbore);
            expect(this.player1).toBeAbleToSelect(this.culfTheQuiet);
            expect(this.player1).not.toBeAbleToSelect(this.codeMonkey);
            expect(this.player1).not.toBeAbleToSelect(this.jargogle);
            this.player1.clickCard(this.blunderbore);

            // Both sides are destroyed, but no creatures are moved to the discard until Jargogle's destroyed ability finishes resolving, so we should still be able to select the destroyed creatures to fight with
            expect(this.player1).toHavePrompt('Choose a creature to fight with');
            expect(this.player1).toBeAbleToSelect(this.blunderbore);
            expect(this.blunderbore.moribund).toBe(false);
            expect(this.player1).toBeAbleToSelect(this.culfTheQuiet);
            expect(this.culfTheQuiet.moribund).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.codeMonkey);
            expect(this.codeMonkey.moribund).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.jargogle);
            expect(this.jargogle.moribund).toBe(true);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.moribund).toBe(false);
            expect(this.groggins.location).toBe('play area');
            expect(this.groggins.moribund).toBe(true);
            expect(this.sequis.location).toBe('play area');
            expect(this.sequis.moribund).toBe(true);

            // Fight with selected creature into any creature which is already tagged for destruction
            this.player1.clickCard(this.blunderbore);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            this.player1.clickCard(this.troll);

            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Champion's Challenge cascading through Obsidian Forge, Jargogles, Soulkeeper, Dust Imp and Kaspara", function () {
        beforeEach(function () {
            // P1 (active, dis): Obsidian Forge sacs everything friendly. Two
            // Jargogles each have a card under them (CC and a vanilla creature).
            // Skullion wears a Soulkeeper (granting "Destroyed: destroy most
            // powerful enemy"). Dust Imp has its own Destroyed: gain 2A.
            // Houses: dis (OF, soulkeeper, dust-imp, skullion), logos (jargogles,
            // batdrone), brobnar (CC).
            //
            // P2 (geistoid): Kaspara grants every friendly Geistoid creature
            // "Destroyed: each player gains 1A" — including Kaspara herself.
            this.setupTest({
                player1: {
                    house: 'dis',
                    // Give P1 enough amber to actually forge with OF after
                    // sacrificing 4 creatures. Forge cost = 6 (base) +
                    // (6 - 4 sacrificed) modifier = 8. P1 also gains 6A
                    // through the destruction chain (1 from Soulkeeper's
                    // bonus icon at setup, 1 from Shadys via Kaspara, 2
                    // from Dust Imp, 1 each from Mender and Thoughtcatcher
                    // via Kaspara). Starting at 2 lands them on exactly 8
                    // when the may-forge prompt appears.
                    amber: 2,
                    hand: ['soulkeeper', 'champion-s-challenge', 'batdrone'],
                    inPlay: ['jargogle', 'jargogle', 'skullion', 'dust-imp', 'obsidian-forge']
                },
                player2: {
                    // Give P2 a starting amber so Kaspara (power = combined
                    // amber pools) doesn't immediately die from being 0 power.
                    amber: 1,
                    inPlay: ['kaspara', 'shadys', 'thoughtcatcher', 'mender']
                }
            });

            // Disambiguate the two Jargogles.
            const jargogles = this.player1.player.cardsInPlay.filter((c) => c.id === 'jargogle');
            this.jargogleWithCC = jargogles[0];
            this.jargogleWithBatdrone = jargogles[1];

            // Hand-place the Jargogle under-cards (mirrors Timequake.spec setup).
            for (const [under, parent] of [
                [this.championSChallenge, this.jargogleWithCC],
                [this.batdrone, this.jargogleWithBatdrone]
            ]) {
                this.player1.player.removeCardFromPile(under);
                under.parent = parent;
                under.facedown = true;
                parent.childCards.push(under);
            }
        });

        it('keeps every destroyed creature on the board until all Destroyed: abilities (including those triggered by CC) have resolved, batches their amber gains correctly, and lets P1 forge a key with Obsidian Forge once the dust settles', function () {
            // Attach Soulkeeper to Skullion.
            this.player1.playUpgrade(this.soulkeeper, this.skullion);
            expect(this.skullion.upgrades).toContain(this.soulkeeper);
            // Soulkeeper has a 1A bonus icon — playing it during setup gives
            // P1 +1A on top of their starting 2A.
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);

            // Use Obsidian Forge to sacrifice every friendly creature.
            this.player1.useAction(this.obsidianForge);
            this.player1.clickCard(this.jargogleWithCC);
            this.player1.clickCard(this.jargogleWithBatdrone);
            this.player1.clickCard(this.skullion);
            this.player1.clickCard(this.dustImp);
            this.player1.clickPrompt('Done');

            // All four are tagged moribund but still in play — the destroyed
            // ability window is open and we're being asked to order resolutions.
            for (const c of [
                this.jargogleWithCC,
                this.jargogleWithBatdrone,
                this.skullion,
                this.dustImp
            ]) {
                expect(c.location).toBe('play area');
                expect(c.moribund).toBe(true);
                expect(this.player1).toBeAbleToSelect(c);
            }

            // Resolve Jargogle-with-Batdrone first → Batdrone enters play.
            this.player1.clickCard(this.jargogleWithBatdrone);
            this.player1.clickPrompt('Left');
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.moribund).toBe(false);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            // The other Destroyed: triggers are still pending.
            expect(this.player1).toBeAbleToSelect(this.jargogleWithCC);
            expect(this.player1).toBeAbleToSelect(this.skullion);
            expect(this.player1).toBeAbleToSelect(this.dustImp);

            // Resolve Skullion's Soulkeeper-granted Destroyed next → destroy
            // most powerful enemy (Shadys and Thoughtcatcher are tied at 5).
            this.player1.clickCard(this.skullion);
            expect(this.player1).toBeAbleToSelect(this.shadys);
            expect(this.player1).toBeAbleToSelect(this.thoughtcatcher);
            expect(this.player1).not.toBeAbleToSelect(this.mender);
            this.player1.clickCard(this.shadys);

            // Shadys is now moribund but still on the board. Kaspara's
            // Destroyed: grant on Shadys is batched into the same destruction
            // window as the rest of the cascade, so it's now an additional
            // orderable choice rather than something that auto-resolves
            // inside a nested window.
            expect(this.shadys.location).toBe('play area');
            expect(this.shadys.moribund).toBe(true);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toBeAbleToSelect(this.shadys);
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).toBeAbleToSelect(this.jargogleWithCC);

            // Resolve Dust Imp's Destroyed: +2A for P1 first.
            this.player1.clickCard(this.dustImp);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);

            // Now resolve Shadys' Kaspara-granted Destroyed: +1A each.
            this.player1.clickCard(this.shadys);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(2);

            // Jargogle-with-CC is the last remaining P1 ability; it
            // auto-resolves and plays Champion's Challenge. CC has no bonus
            // aember icons, so playing it produces no amber.
            // CC's enemy-to-spare prompt: Kaspara has accumulated power from
            // amber gains (her power = combined amber pools = 4+2 = 6),
            // making her the unique most-powerful enemy and therefore the
            // only valid pick (mostStat with numCards 1 over 6/5/2).
            expect(this.player1).toHavePrompt('Champion’s Challenge');
            expect(this.player1).toHavePrompt('Choose an enemy creature to not destroy');
            expect(this.player1).toBeAbleToSelect(this.kaspara);
            expect(this.player1).not.toBeAbleToSelect(this.shadys); // already moribund
            this.player1.clickCard(this.kaspara);

            // CC's friendly-to-spare prompt. Every other friendly creature is
            // moribund — but they're STILL in cardsInPlay (this is the whole
            // point of batching). The non-moribund Batdrone can't be the
            // spared one because then CC's friendly-destroy would have zero
            // legal targets (every other friendly is moribund and immune to
            // destroy). Skullion is the unique mostStat candidate at 7 power.
            expect(this.player1).toHavePrompt('Choose a friendly creature to not destroy');
            expect(this.player1).toBeAbleToSelect(this.skullion);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.skullion);

            // CC has now batched a destroy for Batdrone (the only non-moribund
            // friendly) and for Thoughtcatcher and Mender (the only
            // non-moribund enemies). Every one of them stays on the board until
            // the destruction window finishes.
            for (const c of [this.batdrone, this.thoughtcatcher, this.mender]) {
                expect(c.location).toBe('play area');
                expect(c.moribund).toBe(true);
            }

            // Mender and Thoughtcatcher each have a Kaspara-granted Destroyed:
            // ability. Both grants are simultaneous P2 triggers that the
            // active player must order — each grants +1A to each player.
            // Batdrone has no Destroyed: ability, so it contributes no
            // triggers — its only intrinsic ability is its Fight action,
            // which never fires here.

            // CC's `then` fight step: every friendly creature is moribund, but
            // they're all still in cardsInPlay so the condition holds and the
            // prompt opens. Spared Skullion is the natural pick. Skullion is
            // already moribund so the fight will not produce a second
            // Destroyed: trigger from its Soulkeeper.
            expect(this.player1).toHavePrompt('Choose a creature to fight with');
            expect(this.player1).toBeAbleToSelect(this.skullion);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.skullion);

            // Fight target prompt: Kaspara is alive; the moribund enemies are
            // still in cardsInPlay so they're also legal targets (they just
            // can't be destroyed again — fight resolves with damage).
            // Pick the moribund Thoughtcatcher: this avoids a cascade where
            // damaging Kaspara would later kill her once the forge drops P1's
            // amber (her power = combined amber pools).
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            expect(this.player1).toBeAbleToSelect(this.kaspara);
            expect(this.player1).toBeAbleToSelect(this.thoughtcatcher);
            this.player1.clickCard(this.thoughtcatcher);

            // Now the two batched Kaspara grants from Mender and Thoughtcatcher
            // both prompt to be ordered. Resolve Thoughtcatcher's first; once
            // it's done, Mender's grant is the only remaining choice and
            // auto-fires immediately.
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.thoughtcatcher);
            expect(this.player1).toBeAbleToSelect(this.mender);
            this.player1.clickCard(this.thoughtcatcher);
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(4);

            // Skullion was moribund so its fight didn't open a new Destroyed:
            // window — no extra amber, no extra Soulkeeper kill. Kaspara takes
            // no damage and her power stays in sync with the amber pools.
            expect(this.kaspara.location).toBe('play area');
            expect(this.kaspara.tokens.damage).toBeFalsy();

            // OF's destruction window is now complete. Every sacrificed card
            // has moved to discard, plus everything CC killed.
            for (const c of [
                this.jargogleWithCC,
                this.jargogleWithBatdrone,
                this.skullion,
                this.dustImp,
                this.batdrone,
                this.shadys,
                this.thoughtcatcher,
                this.mender
            ]) {
                expect(c.location).toBe('discard');
            }
            expect(this.championSChallenge.location).toBe('discard');
            // Soulkeeper falls off when its host dies.
            expect(this.soulkeeper.location).toBe('discard');

            // OF's `then` now opens its "may forge a key" prompt. The cost
            // is 6 (base) + (6 - 4 sacrificed) modifier = 8A. P1 has 8A;
            // they forge and OF self-sacrifices.
            expect(this.player1).toHavePrompt('Obsidian Forge');
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('Red');

            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(0);
            expect(this.obsidianForge.location).toBe('discard');

            // Final state: Kaspara is the only creature left in play and her
            // damage is preserved across all the cascading triggers.
            expect(this.player1.player.cardsInPlay).toEqual([]);
            expect(this.player2.player.cardsInPlay).toEqual([this.kaspara]);

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
