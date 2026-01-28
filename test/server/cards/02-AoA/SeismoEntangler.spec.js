describe('Seismo-Entangler', function () {
    describe("Seismo-Entangler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['seismo-entangler', 'dextre']
                },
                player2: {
                    house: 'logos',
                    inPlay: ['bumpsy', 'batdrone']
                }
            });
        });
        it('should prompt to choose a house', function () {
            this.player1.clickCard(this.seismoEntangler);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Seismo-Entangler');
            expect(this.player1.currentButtons).toContain('brobnar');
            expect(this.player1.currentButtons).toContain('dis');
            expect(this.player1.currentButtons).toContain('logos');
            expect(this.player1.currentButtons).toContain('mars');
            expect(this.player1.currentButtons).toContain('sanctum');
            expect(this.player1.currentButtons).toContain('shadows');
            expect(this.player1.currentButtons).toContain('untamed');
        });
        it('should not prevent its own creatures from reaping with logos', function () {
            this.player1.clickCard(this.seismoEntangler);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Seismo-Entangler');
            this.player1.clickPrompt('logos');
            this.player1.clickCard(this.dextre);
            expect(this.player1).toHavePromptButton('Reap with this creature');
        });
        it('should prevent its opponent from reaping with logos', function () {
            this.player1.clickCard(this.seismoEntangler);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Seismo-Entangler');
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickCard(this.batdrone);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
        });

        it('should not prevent its opponent from reaping with brobnar', function () {
            this.player1.clickCard(this.seismoEntangler);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Seismo-Entangler');
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.bumpsy);
            expect(this.player2).toHavePromptButton('Reap with this creature');
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'logos',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'seismo-entangler', 'batdrone']
                },
                player2: {
                    amber: 0,
                    hand: [],
                    inPlay: ['hunting-witch']
                }
            });
            this.player1.makeMaverick(this.tachyonManifold, 'logos');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.clickCard(this.seismoEntangler);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickPrompt('untamed');
            this.player1.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.clickCard(this.huntingWitch);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
        });
    });

    describe('when Decadence uses a creature of a different house', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['seismo-entangler', 'batdrone']
                },
                player2: {
                    house: 'saurian',
                    hand: ['decadence'],
                    inPlay: ['dextre', 'senator-shrix']
                }
            });
        });

        it('should allow a non-saurian creature to reap when used via Decadence', function () {
            this.player1.clickCard(this.seismoEntangler);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickPrompt('saurian');
            this.player1.endTurn();

            this.player2.clickPrompt('saurian');
            this.player2.play(this.decadence);
            this.player2.clickPrompt('Exalt, ready and use');
            this.player2.clickCard(this.dextre);
            // Dextre is logos, not saurian, so should be able to reap
            expect(this.player2).toHavePromptButton('Reap with this creature');
            this.player2.clickPrompt('Reap with this creature');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should prevent a saurian creature from reaping when used via Decadence', function () {
            this.player1.clickCard(this.seismoEntangler);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickPrompt('saurian');
            this.player1.endTurn();

            this.player2.clickPrompt('saurian');
            this.player2.play(this.decadence);
            this.player2.clickPrompt('Exalt, ready and use');
            this.player2.clickCard(this.senatorShrix);
            // Senator Shrix is saurian, so should NOT be able to reap - auto-selects fight
            expect(this.player2).toHavePrompt('Choose a creature to attack');
            this.player2.clickCard(this.batdrone);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
