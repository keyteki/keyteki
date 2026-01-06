describe('Shield Tentacle', function () {
    describe("Shield Tentacle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: [
                        'legendary-keyraken',
                        'legendary-keyraken',
                        'shield-tentacle',
                        'a-ghost-in-the-sun',
                        'namel-s-confession'
                    ]
                },
                player2: {
                    amber: 4,
                    hand: ['harland-mindlock', 'wail-of-the-damned', 'shadow-of-dis'],
                    inPlay: ['legendary-keyraken']
                }
            });
            this.legendaryKeyraken0 = this.player1.hand[0];
            this.legendaryKeyraken1 = this.player1.hand[1];
            this.legendaryKeyraken2 = this.player2.inPlay[0];
            this.aGhostInTheSun.maverick = 'keyraken';
            this.aGhostInTheSun.printedHouse = 'keyraken';
        });

        it('archives when played without friendly legendary keyraken in play', function () {
            this.player1.playCreature(this.shieldTentacle);
            expect(this.shieldTentacle.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('stays in play when played when friendly legendary keyraken is in play', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.shieldTentacle);
            expect(this.shieldTentacle.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('archives when friendly legendary keyraken leaves play', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.shieldTentacle);
            expect(this.shieldTentacle.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.wailOfTheDamned);
            this.player2.clickCard(this.legendaryKeyraken0);
            expect(this.shieldTentacle.location).toBe('archives');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not archive when second friendly legendary keyraken leaves play', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.legendaryKeyraken1);
            this.player1.playCreature(this.shieldTentacle);
            expect(this.shieldTentacle.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.wailOfTheDamned);
            this.player2.clickCard(this.legendaryKeyraken0);
            expect(this.shieldTentacle.location).toBe('play area');
            this.player2.moveCard(this.wailOfTheDamned, 'hand');
            this.player2.play(this.wailOfTheDamned);
            this.player2.clickCard(this.legendaryKeyraken1);
            expect(this.shieldTentacle.location).toBe('archives');
            expect(this.player2).isReadyToTakeAction();
        });

        it('archives when friendly legendary keyraken is taken control by opponent', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.shieldTentacle);
            expect(this.shieldTentacle.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.harlandMindlock);
            this.player2.clickCard(this.legendaryKeyraken0);
            this.player2.clickPrompt('Right');
            expect(this.shieldTentacle.location).toBe('archives');
            expect(this.player2).isReadyToTakeAction();
        });

        it('archives when put into play without friendly legendary keyraken in play', function () {
            this.player2.player.keys = { red: true, blue: false, yellow: false };
            this.player1.scrap(this.shieldTentacle);
            this.player1.play(this.aGhostInTheSun);
            this.player1.clickCard(this.shieldTentacle);
            expect(this.shieldTentacle.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not archive when blanked by shadow of dis', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.shieldTentacle);
            expect(this.shieldTentacle.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.endTurn();
            this.player1.clickPrompt('redemption');
            expect(this.shieldTentacle.location).toBe('play area');
            this.player1.play(this.namelSConfession);
            this.player1.clickCard(this.legendaryKeyraken0); // destroy
            expect(this.legendaryKeyraken0.location).toBe('discard');
            expect(this.shieldTentacle.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.shieldTentacle.location).toBe('archives');
            expect(this.player2).isReadyToTakeAction();
        });

        it('deals 3 damage to legendary keyraken when destroyed', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.shieldTentacle);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.legendaryKeyraken.tokens.damage).toBe(undefined);
            this.player2.play(this.wailOfTheDamned);
            this.player2.clickCard(this.shieldTentacle);
            expect(this.shieldTentacle.location).toBe('discard');
            expect(this.legendaryKeyraken.tokens.damage).toBe(3);
            expect(this.player2).isReadyToTakeAction();
        });

        it('has deploy and taunt', function () {
            this.player1.playCreature(this.legendaryKeyraken0);
            this.player1.playCreature(this.shieldTentacle);
            expect(this.shieldTentacle.hasKeyword('deploy')).toBe(true);
            expect(this.shieldTentacle.hasKeyword('taunt')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
