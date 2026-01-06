describe('Crushing Tentacle', function () {
    describe("Crushing Tentacle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: [
                        'legendary-keyraken',
                        'legendary-keyraken',
                        'crushing-tentacle',
                        'crushing-tentacle',
                        'a-ghost-in-the-sun',
                        'namel-s-confession'
                    ]
                },
                player2: {
                    hand: ['harland-mindlock', 'wail-of-the-damned', 'shadow-of-dis'],
                    inPlay: ['legendary-keyraken']
                }
            });
            this.legendaryKeyraken0 = this.player1.hand[0];
            this.legendaryKeyraken1 = this.player1.hand[1];
            this.legendaryKeyraken2 = this.player2.inPlay[0];
            this.crushingTentacle0 = this.player1.hand[2];
            this.crushingTentacle1 = this.player1.hand[3];
            this.aGhostInTheSun.maverick = 'keyraken';
            this.aGhostInTheSun.printedHouse = 'keyraken';
        });

        it('archives when played without friendly legendary keyraken in play', function () {
            this.player1.playCreature(this.crushingTentacle0);
            expect(this.crushingTentacle0.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('stays in play when played when friendly legendary keyraken is in play', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.crushingTentacle0);
            expect(this.crushingTentacle0.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('archives when friendly legendary keyraken leaves play', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.crushingTentacle0);
            expect(this.crushingTentacle0.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.wailOfTheDamned);
            this.player2.clickCard(this.legendaryKeyraken0);
            expect(this.crushingTentacle0.location).toBe('archives');
            expect(this.player2).isReadyToTakeAction();
        });

        it('archives when two copies are warded, exhausted, and friendly legendary keyraken leaves play', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.crushingTentacle0);
            this.player1.playCreature(this.crushingTentacle1);
            this.crushingTentacle0.warded = true;
            this.crushingTentacle1.warded = true;
            expect(this.crushingTentacle0.exhausted).toBe(true);
            expect(this.crushingTentacle1.exhausted).toBe(true);
            expect(this.crushingTentacle0.location).toBe('play area');
            expect(this.crushingTentacle1.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.wailOfTheDamned);
            this.player2.clickCard(this.legendaryKeyraken0);
            expect(this.crushingTentacle0.location).toBe('archives');
            expect(this.crushingTentacle1.location).toBe('archives');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not archive when second friendly legendary keyraken leaves play', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.legendaryKeyraken1);
            this.player1.playCreature(this.crushingTentacle0);
            expect(this.crushingTentacle0.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.wailOfTheDamned);
            this.player2.clickCard(this.legendaryKeyraken0);
            expect(this.crushingTentacle0.location).toBe('play area');
            this.player2.moveCard(this.wailOfTheDamned, 'hand');
            this.player2.play(this.wailOfTheDamned);
            this.player2.clickCard(this.legendaryKeyraken1);
            expect(this.crushingTentacle0.location).toBe('archives');
            expect(this.player2).isReadyToTakeAction();
        });

        it('archives when friendly legendary keyraken is taken control by opponent', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.crushingTentacle0);
            expect(this.crushingTentacle0.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.harlandMindlock);
            this.player2.clickCard(this.legendaryKeyraken0);
            this.player2.clickPrompt('Right');
            expect(this.crushingTentacle0.location).toBe('archives');
            expect(this.player2).isReadyToTakeAction();
        });

        it('archives when put into play without friendly legendary keyraken in play', function () {
            this.player2.player.keys = { red: true, blue: false, yellow: false };
            this.player1.scrap(this.crushingTentacle0);
            this.player1.play(this.aGhostInTheSun);
            this.player1.clickCard(this.crushingTentacle0);
            expect(this.crushingTentacle0.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not archive when blanked by shadow of dis', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.crushingTentacle0);
            expect(this.crushingTentacle0.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.endTurn();
            this.player1.clickPrompt('redemption');
            expect(this.crushingTentacle0.location).toBe('play area');
            this.player1.play(this.namelSConfession);
            this.player1.clickCard(this.legendaryKeyraken0); // destroy
            expect(this.legendaryKeyraken0.location).toBe('discard');
            expect(this.crushingTentacle0.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.crushingTentacle0.location).toBe('archives');
            expect(this.player2).isReadyToTakeAction();
        });

        it('deals 3 damage to legendary keyraken when destroyed', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.crushingTentacle0);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.legendaryKeyraken.tokens.damage).toBe(undefined);
            this.player2.play(this.wailOfTheDamned);
            this.player2.clickCard(this.crushingTentacle0);
            expect(this.crushingTentacle0.location).toBe('discard');
            expect(this.legendaryKeyraken.tokens.damage).toBe(3);
            expect(this.player2).isReadyToTakeAction();
        });

        it('has assault 3', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.crushingTentacle0);
            expect(this.crushingTentacle0.hasKeyword('assault')).toBe(true);
            expect(this.crushingTentacle0.getKeywordValue('assault')).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    // This test covers a specific edge case where multiple tentacles are in play, some are warded, and when the Legendary Keyraken leaves play the terminal condition was not archiving the warded tentacles.
    describe('Crushing Tentacle with all tentacle types', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: [
                        'legendary-keyraken',
                        'crushing-tentacle',
                        'crushing-tentacle',
                        'grappling-tentacle',
                        'lashing-tentacle',
                        'shield-tentacle',
                        'slippery-tentacle',
                        'tenacious-tentacle',
                        'defend-the-keyraken'
                    ]
                },
                player2: {
                    hand: ['wail-of-the-damned']
                }
            });
            this.legendaryKeyraken0 = this.player1.hand[0];
            this.crushingTentacle0 = this.player1.hand[1];
            this.crushingTentacle1 = this.player1.hand[2];
        });

        it('archives all tentacles when some are warded via defend the keyraken and legendary keyraken is destroyed', function () {
            // Play the Legendary Keyraken first
            this.player1.playCreature(this.legendaryKeyraken0);

            // Play all tentacles
            this.player1.playCreature(this.crushingTentacle0);
            this.player1.playCreature(this.crushingTentacle1);
            this.player1.playCreature(this.grapplingTentacle);
            this.player1.playCreature(this.lashingTentacle);
            this.player1.playCreature(this.shieldTentacle);
            this.player1.playCreature(this.slipperyTentacle);
            this.player1.playCreature(this.tenaciousTentacle);

            // All tentacles should be in play
            expect(this.crushingTentacle0.location).toBe('play area');
            expect(this.crushingTentacle1.location).toBe('play area');
            expect(this.grapplingTentacle.location).toBe('play area');
            expect(this.lashingTentacle.location).toBe('play area');
            expect(this.shieldTentacle.location).toBe('play area');
            expect(this.slipperyTentacle.location).toBe('play area');
            expect(this.tenaciousTentacle.location).toBe('play area');

            // Ward the first 3 tentacles
            this.player1.play(this.defendTheKeyraken);
            this.player1.clickCard(this.crushingTentacle1);
            expect(this.crushingTentacle0.warded).toBe(true);
            expect(this.crushingTentacle1.warded).toBe(true);
            expect(this.grapplingTentacle.warded).toBe(true);

            // End turn and have opponent destroy the Legendary Keyraken
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.wailOfTheDamned);
            this.player2.clickCard(this.legendaryKeyraken0);

            // All tentacles should be archived
            expect(this.legendaryKeyraken0.location).toBe('discard');
            expect(this.crushingTentacle0.location).toBe('archives');
            expect(this.crushingTentacle1.location).toBe('archives');
            expect(this.grapplingTentacle.location).toBe('archives');
            expect(this.lashingTentacle.location).toBe('archives');
            expect(this.shieldTentacle.location).toBe('archives');
            expect(this.slipperyTentacle.location).toBe('archives');
            expect(this.tenaciousTentacle.location).toBe('archives');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
