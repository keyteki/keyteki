describe('Quantum Fingertrap', function () {
    describe("Quantum Fingertrap's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['quantum-fingertrap']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should not prompt for any creature if owner and opponent only have less than 2 creatures in play', function () {
            this.player1.useAction(this.quantumFingertrap);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Quantum Fingertrap's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['archimedes', 'quantum-fingertrap']
                },
                player2: {
                    amber: 2,
                    inPlay: ['urchin', 'lamindra', 'redlock']
                }
            });
        });

        it('should not prompt for second creature if controller has a single creature in play', function () {
            this.player1.useAction(this.quantumFingertrap);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.archimedes);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Quantum Fingertrap's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['archimedes', 'dextre', 'quantum-fingertrap']
                },
                player2: {
                    amber: 2,
                    inPlay: ['urchin']
                }
            });
        });

        it('should not prompt for second creature if opponent has a single creature in play', function () {
            this.player1.useAction(this.quantumFingertrap);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.urchin);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Quantum Fingertrap's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: [
                        'brobnar-ambassador',
                        'bulwark',
                        'challe-the-safeguard',
                        'cowfyne',
                        'quantum-fingertrap'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['urchin', 'lamindra', 'redlock']
                }
            });
        });

        it("should allow swapping any creature in controller's battleline", function () {
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.brobnarAmbassador);
            expect(this.player1.player.creaturesInPlay[3]).toBe(this.cowfyne);

            this.player1.useAction(this.quantumFingertrap);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.brobnarAmbassador);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.challeTheSafeguard);
            expect(this.player1).toBeAbleToSelect(this.cowfyne);
            expect(this.player1).not.toBeAbleToSelect(this.brobnarAmbassador);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.cowfyne);

            expect(this.player1.player.creaturesInPlay[0]).toBe(this.cowfyne);
            expect(this.player1.player.creaturesInPlay[3]).toBe(this.brobnarAmbassador);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should allow swapping any creature in opponent's battleline", function () {
            expect(this.player2.player.creaturesInPlay[0]).toBe(this.urchin);
            expect(this.player2.player.creaturesInPlay[1]).toBe(this.lamindra);

            this.player1.useAction(this.quantumFingertrap);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.lamindra);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.challeTheSafeguard);
            expect(this.player1).not.toBeAbleToSelect(this.cowfyne);
            expect(this.player1).not.toBeAbleToSelect(this.brobnarAmbassador);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.urchin);

            expect(this.player2.player.creaturesInPlay[0]).toBe(this.lamindra);
            expect(this.player2.player.creaturesInPlay[1]).toBe(this.urchin);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
