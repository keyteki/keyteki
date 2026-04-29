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
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
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
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
