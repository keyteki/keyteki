describe('Gargantodon', function() {
    integration(function() {
        describe('when played', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 3,
                        house: 'saurian',
                        inPlay: ['eyegor', 'rustgnawer'],
                        hand: ['gargantodon']
                    },
                    player2: {
                        amber: 4,
                        hand: ['urchin', 'magda-the-rat'],
                        inPlay: ['dextre', 'troll']
                    }
                });

                this.player1.play(this.gargantodon);
            });

            it('should enter play stunned', function() {
                expect(this.gargantodon.stunned).toBe(true);
            });

            describe('when fighting', function() {
                beforeEach(function() {
                    this.gargantodon.stunned = false;
                    this.player1.endTurn();

                    this.player2.clickPrompt('brobnar');
                    this.player2.endTurn();

                    this.player1.clickPrompt('saurian');
                    this.player1.fightWith(this.gargantodon, this.troll);
                });

                it('should only deal 4 damage', function() {
                    expect(this.troll.tokens.damage).toBe(4);
                });
            });

            describe('when an amber is stolen', function() {
                beforeEach(function() {
                    this.player1.endTurn();

                    this.player2.clickPrompt('shadows');
                    this.player2.play(this.urchin);
                });

                it('should prompt for a creature to capture instead', function() {
                    expect(this.player2).toBeAbleToSelect(this.troll);
                    expect(this.player2).not.toBeAbleToSelect(this.gargantodon);
                });

                describe('and a creature it selected', function() {
                    beforeEach(function() {
                        this.player2.clickCard(this.troll);
                    });

                    it('should capture amber on the selected creature', function() {
                        expect(this.troll.tokens.amber).toBe(1);
                    });

                    it('should stop amber being stolen', function() {
                        expect(this.player1.amber).toBe(2);
                        expect(this.player2.amber).toBe(4);
                    });
                });
            });

            describe('when more than one amber is stolen', function() {
                beforeEach(function() {
                    this.player1.endTurn();

                    this.player2.clickPrompt('shadows');
                    this.player2.play(this.magdaTheRat);
                    this.player2.clickCard(this.troll);
                });

                it('should capture amber on the selected creature', function() {
                    expect(this.troll.tokens.amber).toBe(2);
                });

                it('should stop amber being stolen', function() {
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(4);
                });
            });
        });
    });
});
