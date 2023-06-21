describe('Envoy of Ekwirrĕ', function () {
    describe("Envoy of Ekwirrĕ's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['troll', 'envoy-of-ekwirrĕ', 'umbra', 'pelf'],
                    hand: ['umbra', 'blood-of-titans']
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra']
                }
            });
        });

        it('when using should prompt to pick a creature to swap everything with', function () {
            // confirm the starting order is correct
            expect(this.player1.player.cardsInPlay[0]).toBe(this.troll);
            expect(this.player1.player.cardsInPlay[1]).toBe(this.envoyOfEkwirrĕ);
            expect(this.player1.player.cardsInPlay[2]).toBe(this.umbra);

            // Load up the creatures.
            this.troll.tokens.amber = 5;
            this.troll.tokens.damage = 3;
            this.envoyOfEkwirrĕ.tokens.amber = 2;
            this.envoyOfEkwirrĕ.tokens.damage = 1;

            // trigger the action
            this.player1.reap(this.envoyOfEkwirrĕ);
            this.player1.clickCard(this.troll);
            // positions have swapped
            expect(this.player1.player.cardsInPlay[0]).toBe(this.envoyOfEkwirrĕ);
            expect(this.player1.player.cardsInPlay[1]).toBe(this.troll);
            expect(this.player1.player.cardsInPlay[2]).toBe(this.umbra);

            // Tokens have swapped.
            expect(this.troll.tokens.amber).toBe(2);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.envoyOfEkwirrĕ.tokens.amber).toBe(5);
            expect(this.envoyOfEkwirrĕ.tokens.damage).toBe(3);
        });

        it('should kill the swapped creature if there is too much damage', function () {
            this.troll.tokens.amber = 5;
            this.troll.tokens.damage = 6;
            this.envoyOfEkwirrĕ.tokens.amber = 2;
            this.envoyOfEkwirrĕ.tokens.damage = 1;

            this.player1.reap(this.envoyOfEkwirrĕ);
            this.player1.clickCard(this.troll);

            expect(this.envoyOfEkwirrĕ.location).toBe('discard');
            expect(this.troll.tokens.amber).toBe(2);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.player2.amber).toBe(6);
        });

        it('it should not prompt if there is only 1 creature in play', function () {
            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.umbra, 'deck');
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.reap(this.envoyOfEkwirrĕ);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should swap various counters', function () {
            this.troll.ward();
            this.troll.addToken('doom', 1);
            this.envoyOfEkwirrĕ.addToken('growth', 4);

            this.player1.reap(this.envoyOfEkwirrĕ);
            this.player1.clickCard(this.troll);

            expect(this.troll.tokens.growth).toBe(4);
            expect(this.envoyOfEkwirrĕ.tokens.ward).toBe(1);
            expect(this.envoyOfEkwirrĕ.tokens.doom).toBe(1);
        });

        it('should swap upgrades', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.playUpgrade(this.bloodOfTitans, this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');

            this.player1.reap(this.envoyOfEkwirrĕ);
            this.player1.clickCard(this.troll);

            expect(this.troll.power).toBe(8);
            expect(this.envoyOfEkwirrĕ.power).toBe(10);
        });
    });
});
