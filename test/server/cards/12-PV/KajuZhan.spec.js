describe('Kaju Zhan', function () {
    describe("Kaju Zhan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['blast-shielding'],
                    inPlay: ['kaju-zhan']
                },
                player2: {
                    inPlay: ['groupthink-tank', 'ember-imp', 'titan-guardian']
                }
            });
        });

        it('should ignore defender armor while attacking', function () {
            this.player1.fightWith(this.kajuZhan, this.groupthinkTank);
            expect(this.groupthinkTank.location).toBe('discard');
        });

        it('should ignore attacker armor while attacking', function () {
            this.player1.playUpgrade(this.blastShielding, this.kajuZhan);
            this.player1.fightWith(this.kajuZhan, this.groupthinkTank);
            expect(this.kajuZhan.tokens.damage).toBe(4);
        });

        it('should ignore taunt while attacking', function () {
            this.player1.fightWith(this.kajuZhan, this.emberImp);
            expect(this.emberImp.location).toBe('discard');
        });

        it('should put an enemy creature on top of its owner deck after fighting', function () {
            this.player1.fightWith(this.kajuZhan, this.titanGuardian);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.groupthinkTank);
            expect(this.player1).not.toBeAbleToSelect(this.kajuZhan);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('deck');
            expect(this.player2.player.deck[0]).toBe(this.emberImp);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
