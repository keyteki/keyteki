describe('Savvy Politician', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        'Savvy Politician',
                        'Moto Horde',
                        'Moto Horde'
                    ],
                    hand: ['Magnificent Kimono']
                },
                player2: {
                    inPlay: [
                        'Savvy Politician',
                        'Moto Horde'
                    ],
                    provinces: {
                        'province 1': {
                            provinceCard: 'The Art of Peace'
                        },
                        'province 2': {
                            provinceCard: 'Shameful Display'
                        }
                    }
                }
            });
            this.kimono = this.player1.hand[0];
            this.politician1 = this.player1.inPlay[0];
            this.politician2 = this.player2.inPlay[0];
            this.artofpeace = this.player2.provinces['province 1'].provinceCard;
        });

        describe('when the politician is already honored', function() {
            beforeEach(function() {
                this.politician1.honor();
                this.politician2.honor();
            });

            it('should not trigger its ability when winning a conflict with kimono attached', function() {
                this.player1.playAttachment(this.kimono, this.politician1);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['Savvy Politician'],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger its ability when breaking The Art of War', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['Moto Horde', 'Moto Horde'],
                    defenders: ['Savvy Politician'],
                    province: this.artofpeace
                });
                this.noMoreActions();
                // Player 2 prompted for The Art of Peace break trigger
                this.player2.clickCard(this.artofpeace);
                expect(this.player2).not.toBeAbleToSelect(this.politician2);
            });
        });
    });
});
