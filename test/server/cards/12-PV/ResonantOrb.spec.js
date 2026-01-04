describe('Resonant Orb', function () {
    describe("Resonant Orb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['resonant-orb'],
                    discard: ['dust-pixie', 'anger', 'dew-faerie']
                },
                player2: {
                    inPlay: ['krump', 'troll']
                }
            });
        });

        it('should destroy an enemy creature and put the discarded creature into play', function () {
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.dustPixie, 'deck');
            this.player1.reap(this.resonantOrb);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.resonantOrb);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Right');
            expect(this.krump.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay).toContain(this.dustPixie);
            expect(this.anger.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should repeat the effect if the second discarded card is also a creature', function () {
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.dewFaerie, 'deck');
            this.player1.moveCard(this.dustPixie, 'deck');
            this.player1.reap(this.resonantOrb);
            expect(this.dustPixie.location).toBe('discard');
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Right');
            expect(this.krump.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay).toContain(this.dustPixie);
            expect(this.dewFaerie.location).toBe('discard');
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Right');
            expect(this.troll.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay).toContain(this.dewFaerie);
            expect(this.anger.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing if first discarded card is not a creature', function () {
            this.player1.moveCard(this.dustPixie, 'deck');
            this.player1.moveCard(this.anger, 'deck');
            this.player1.reap(this.resonantOrb);
            expect(this.anger.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
