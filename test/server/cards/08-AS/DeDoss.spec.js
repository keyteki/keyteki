describe('De-Doss', function () {
    describe("De-Doss's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['de-doss', 'archimedes'],
                    inPlay: ['titan-guardian', 'helper-bot', 'hexpion']
                },
                player2: {
                    hand: ['blood-of-titans', 'harmal-atoon', 'krump', 'deusillus', 'deusillus2'],
                    inPlay: ['dr-xyloxxzlphrex'],
                    discard: ['blypyp']
                }
            });
        });

        it('prevents opponent from playing larger creatures, but not self', function () {
            this.player1.playUpgrade(this.deDoss, this.helperBot);
            this.player1.playCreature(this.archimedes);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.krump);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Discard this card');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not prevent opponent from playing equal power creatures', function () {
            this.player1.playUpgrade(this.deDoss, this.titanGuardian);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.krump);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Discard this card');
            this.player2.playCreature(this.harmalAtoon);
            expect(this.player2).isReadyToTakeAction();
        });

        it('handles changes in power', function () {
            this.player1.playUpgrade(this.deDoss, this.titanGuardian);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.playUpgrade(this.bloodOfTitans, this.titanGuardian);
            this.player2.playCreature(this.krump);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should consider only the power of the parent creature, not the creature putting the other creature into play', function () {
            this.drXyloxxzlphrex.tokens.power = 2;
            this.player1.playUpgrade(this.deDoss, this.hexpion);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.reap(this.drXyloxxzlphrex);
            this.player2.clickCard(this.blypyp);
            this.player2.clickPrompt('Right');
            expect(this.blypyp.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });

        it('blocks gigantic creatures', function () {
            this.player1.playUpgrade(this.deDoss, this.hexpion);
            this.player1.endTurn();

            this.player2.clickPrompt('saurian');
            this.player2.clickCard(this.deusillus2); // top half
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.clickCard(this.deusillus); // bottom half
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe("De-Doss's ability vs upgrade creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['de-doss'],
                    inPlay: ['daughter']
                },
                player2: {
                    hand: ['shield-u-later'],
                    inPlay: ['cxo-taber']
                }
            });
        });

        it('should not prevent opponent from playing creatures as upgrades', function () {
            this.player1.playUpgrade(this.deDoss, this.daughter);
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.playUpgrade(this.shieldULater, this.cxoTaber);
            expect(this.cxoTaber.upgrades).toContain(this.shieldULater);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
