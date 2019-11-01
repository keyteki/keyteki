describe('Sci. Officer Morpheus', function() {
    integration(function() {
        describe('constant reaction', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        inPlay: ['shadow-self', 'sci-officer-morpheus'],
                        hand: ['urchin', 'troll']
                    },
                    player2: {
                        amber: 2,
                        inPlay: ['archimedes', 'dextre', 'faygin', 'gorm-of-omm'],
                        hand: ['relentless-whispers']
                    }
                });
            });

            describe('when in center of battleline', function() {
                beforeEach(function() {
                    this.player1.playCreature(this.urchin);
                });

                it('should trigger the play effect twice', function() {
                    expect(this.player1.amber).toBe(2);
                    expect(this.player2.amber).toBe(0);
                });
            });

            describe('when not in center of battleline', function() {
                beforeEach(function() {
                    this.player1.endTurn();

                    this.player2.clickPrompt('logos');
                    this.player2.endTurn();

                    this.player1.clickPrompt('brobnar');
                    this.player1.playCreature(this.troll);
                    this.player1.endTurn();

                    this.player2.clickPrompt('logos');
                    this.player2.endTurn();

                    this.player1.clickPrompt('shadows');
                    this.player1.playCreature(this.urchin);
                });

                it('should not trigger the play effect twice', function() {
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(1);
                });
            });
        });
    });
});
