describe('Raider', function () {
    describe("Raider's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['rustmiser'],
                    inPlay: ['raider:flaxia', 'bubbles'],
                    token: 'raider'
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should not give poison to other creature played', function () {
            this.player1.playCreature(this.rustmiser);
            expect(this.rustmiser.hasKeyword('poison')).toBe(false);
            this.player1.endTurn();
        });

        it('should not give poison to other creatures', function () {
            expect(this.bubbles.hasKeyword('poison')).toBe(false);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.bubbles.hasKeyword('poison')).toBe(false);
            this.player1.endTurn();
        });

        it('should gain poison on the owners turn', function () {
            expect(this.raider.hasKeyword('poison')).toBe(true);
            this.player1.fightWith(this.raider, this.krump);
            expect(this.krump.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should gain poison on the owners turn on later turns too', function () {
            expect(this.raider.hasKeyword('poison')).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.raider.hasKeyword('poison')).toBe(true);
            this.player1.endTurn();
        });

        it('should not have poison on the enemy turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.raider.hasKeyword('poison')).toBe(false);
            this.player2.fightWith(this.krump, this.raider);
            expect(this.krump.location).toBe('play area');
            this.player2.endTurn();
        });

        it('should gain poison on the turn played', function () {
            this.player1.moveCard(this.raider, 'discard');
            this.player1.moveCard(this.bubbles, 'discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            this.player1.makeTokenCreature();
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1.player.creaturesInPlay[0].hasKeyword('poison')).toBe(true);
            this.player1.endTurn();
        });
    });
});
