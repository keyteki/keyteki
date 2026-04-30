describe('Haunting Measures', function () {
    describe("Haunting Measures' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['haunting-measures'],
                    discard: ['troll', 'lamindra', 'bumpsy', 'krump', 'anger', 'helichopper']
                },
                player2: {}
            });
            this.player1.moveCard(this.helichopper, 'deck');
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.bumpsy, 'deck');
            this.player1.moveCard(this.lamindra, 'deck');
            this.player1.moveCard(this.troll, 'deck');
        });

        it('discards top 6 and may return a non-Geistoid card to hand', function () {
            this.player1.play(this.hauntingMeasures);
            expect(this.troll.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.anger.location).toBe('discard');
            expect(this.helichopper.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.anger);
            expect(this.player1).not.toBeAbleToSelect(this.helichopper);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Haunting Measures with cards already in discard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['haunting-measures'],
                    discard: [
                        'troll',
                        'lamindra',
                        'bumpsy',
                        'krump',
                        'anger',
                        'helichopper',
                        'mugwump',
                        'crunch'
                    ]
                },
                player2: {}
            });
            this.player1.moveCard(this.helichopper, 'deck');
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.bumpsy, 'deck');
            this.player1.moveCard(this.lamindra, 'deck');
            this.player1.moveCard(this.troll, 'deck');
        });

        it('cannot return cards that were already in discard before play', function () {
            this.player1.play(this.hauntingMeasures);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.helichopper);
            expect(this.player1).not.toBeAbleToSelect(this.mugwump);
            expect(this.player1).not.toBeAbleToSelect(this.crunch);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            expect(this.mugwump.location).toBe('discard');
            expect(this.crunch.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Haunting Measures with empty deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['haunting-measures']
                },
                player2: {}
            });
            for (const card of [...this.player1.player.deck]) {
                this.player1.moveCard(card, 'discard');
            }
        });

        it('does nothing when there are no cards to discard from deck', function () {
            this.player1.play(this.hauntingMeasures);
            expect(this.hauntingMeasures.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Haunting Measures with Geistoid cards on top', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['haunting-measures'],
                    discard: [
                        'echofly',
                        'shadys',
                        'paranormal-palisade',
                        'ghost-town',
                        'dammater',
                        'wraith-construct'
                    ]
                },
                player2: {}
            });
            this.player1.moveCard(this.wraithConstruct, 'deck');
            this.player1.moveCard(this.dammater, 'deck');
            this.player1.moveCard(this.ghostTown, 'deck');
            this.player1.moveCard(this.paranormalPalisade, 'deck');
            this.player1.moveCard(this.shadys, 'deck');
            this.player1.moveCard(this.echofly, 'deck');
        });

        it('cannot return Geistoid cards to hand', function () {
            this.player1.play(this.hauntingMeasures);
            expect(this.echofly.location).toBe('discard');
            expect(this.player1).not.toBeAbleToSelect(this.echofly);
            expect(this.player1).not.toBeAbleToSelect(this.shadys);
            expect(this.player1).not.toBeAbleToSelect(this.paranormalPalisade);
            expect(this.player1).not.toBeAbleToSelect(this.ghostTown);
            expect(this.player1).not.toBeAbleToSelect(this.dammater);
            expect(this.player1).not.toBeAbleToSelect(this.wraithConstruct);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
