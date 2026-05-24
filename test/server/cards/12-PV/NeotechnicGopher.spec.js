describe('Neotechnic Gopher', function () {
    describe("Neotechnic Gopher's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['neotechnic-gopher', 'flaxia', 'batdrone'],
                    inPlay: ['helper-bot']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should discard a card when played', function () {
            this.player1.playCreature(this.neotechnicGopher);
            expect(this.player1).toHavePrompt('Choose a card to discard');
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1.amber).toBe(2); // No amber gain since hand not empty
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 1 amber when played with no cards in hand', function () {
            this.player1.moveCard(this.flaxia, 'discard');
            this.player1.playCreature(this.neotechnicGopher);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard a card when reaping', function () {
            this.player1.moveCard(this.neotechnicGopher, 'play area');
            this.neotechnicGopher.ready();
            this.player1.reap(this.neotechnicGopher);
            expect(this.player1).toHavePrompt('Choose a card to discard');
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1.amber).toBe(3); // 1 from reap, no bonus since hand not empty
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make opponent draw a card when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.neotechnicGopher);
            this.player1.endTurn();
            let p1HandLength = this.player1.hand.length;
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player1.hand.length).toBe(p1HandLength + 1);
            expect(this.neotechnicGopher.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe("Neotechnic Gopher's hand check after scrap resolution", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    hand: ['neotechnic-gopher', 'tutor-bin-rillo'],
                    deck: ['flaxia', 'batdrone']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump'],
                    deck: ['troll']
                }
            });
        });

        it('should not gain amber when discarded card Scrap draws a card', function () {
            // Hand after playing Gopher: [tutor-bin-rillo]
            this.player1.playCreature(this.neotechnicGopher);
            // Discard the only card in hand
            this.player1.clickCard(this.tutorBinRillo);
            expect(this.tutorBinRillo.location).toBe('discard');
            // Tutor Bin Rillo's Scrap: each player draws a card
            // Player 1 draws flaxia → hand is no longer empty
            expect(this.player1.hand.length).toBe(1);
            // No amber gain because hand is not empty after Scrap resolved
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Neotechnic Gopher's hand check with Hazard Zerp chain", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    hand: ['neotechnic-gopher', 'hazard-zerp', 'flaxia']
                },
                player2: {
                    inPlay: ['krump']
                }
            });
        });

        it('should gain amber when Zerp scrap kills Gopher and hand is empty', function () {
            // Hand after playing Gopher: [hazard-zerp, flaxia]
            this.player1.playCreature(this.neotechnicGopher);
            // Discard hazard-zerp
            this.player1.clickCard(this.hazardZerp);
            expect(this.hazardZerp.location).toBe('discard');
            // Hazard Zerp's Scrap: discard a card, then deal 3 damage
            // Discard flaxia (last card in hand)
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            // Zerp deals 3 damage - target Gopher (power 2, dies)
            this.player1.clickCard(this.neotechnicGopher);
            expect(this.neotechnicGopher.location).toBe('discard');
            // Hand is empty after all scraps resolved → gain 1 amber
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
