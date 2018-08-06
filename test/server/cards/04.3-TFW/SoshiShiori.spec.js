describe('Soshi Shiori', function() {
    integration(function() {
        describe('Soshi Shiori\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-liar','soshi-shiori'],
                        honor: 12
                    },
                    player2: {
                        inPlay: ['ikoma-reservist'],
                        hand: ['writ-of-authority'],
                        honor : 10
                    }
                });
                this.soshi = this.player1.findCardByName('soshi-shiori');
                this.liar = this.player1.findCardByName('bayushi-liar');

                this.reservist = this.player2.findCardByName('ikoma-reservist');
                this.writ = this.player2.findCardByName('writ-of-authority');
                this.noMoreActions();
            });

            it('should correctly trigger after winning a conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-liar'],
                    defenders: ['ikoma-reservist'],
                    jumpTo: 'afterConflict'
                });
                expect(this.player1).toBeAbleToSelect(this.soshi);
            });

            it('should not trigger after losing a conflict', function() {
                this.player2.honor = 15,
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-liar'],
                    defenders: ['ikoma-reservist']
                });
                this.player2.clickCard(this.writ);
                this.player2.clickCard(this.reservist);
                this.player1.pass();
                this.player2.pass();
                expect(this.player1).not.toBeAbleToSelect(this.soshi);
            });

            it('should correctly make the opponent lose 1 honor', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-liar'],
                    defenders: ['ikoma-reservist'],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickCard(this.soshi);
                expect(this.player1).toHavePrompt('Choose a player to lose 1 honor');
                this.player1.clickPrompt('Opponent');
                expect(this.player2.honor).toBe(9);
                expect(this.player1.honor).toBe(12);
            });

            it('should correctly make the player lose 1 honor', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-liar'],
                    defenders: ['ikoma-reservist'],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickCard(this.soshi);
                expect(this.player1).toHavePrompt('Choose a player to lose 1 honor');
                this.player1.clickPrompt('Me');
                expect(this.player1.honor).toBe(11);
                expect(this.player2.honor).toBe(10);
            });
        });
    });
});
