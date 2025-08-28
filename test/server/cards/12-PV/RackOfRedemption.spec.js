describe('Rack of Redemption', function () {
    describe("Rack of Redemption's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'redemption',
                    hand: ['vial-of-mutation'],
                    inPlay: [
                        'rack-of-redemption',
                        'doomsayer',
                        'intrepid-exemplar',
                        'ruthless-avenger'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['flaxia', 'fandangle', 'troll']
                }
            });
        });

        it('should give amber to owner of first destroyed Mutant each turn', function () {
            this.player1.fightWith(this.doomsayer, this.flaxia);
            expect(this.doomsayer.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            this.player1.fightWith(this.intrepidExemplar, this.troll);
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.fandangle, this.ruthlessAvenger);
            expect(this.fandangle.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not give amber if no Mutant is destroyed', function () {
            this.player1.fightWith(this.ruthlessAvenger, this.troll);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow player to choose which creature gives amber', function () {
            this.player1.fightWith(this.doomsayer, this.fandangle);
            expect(this.player1).toBeAbleToSelect(this.doomsayer);
            expect(this.player1).toBeAbleToSelect(this.fandangle);
            this.player1.clickCard(this.doomsayer);
            expect(this.player1.amber).toBe(2);
            expect(this.fandangle.location).toBe('discard');
            expect(this.doomsayer.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should know about destructions from before it was put into play', function () {
            this.player1.moveCard(this.rackOfRedemption, 'hand');
            this.player1.fightWith(this.doomsayer, this.troll);
            this.player1.play(this.rackOfRedemption);
            this.player1.fightWith(this.intrepidExemplar, this.troll);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should give amber if creature with mutation counter is destroyed', function () {
            this.player1.play(this.vialOfMutation);
            this.player1.clickCard(this.ruthlessAvenger);
            this.player1.clickCard(this.fandangle);
            this.player1.clickPrompt('Done');
            this.player1.fightWith(this.ruthlessAvenger, this.troll);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
