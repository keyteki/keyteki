describe('Lightbearer Kelvin', function () {
    describe("Lightbearer Kelvin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    inPlay: ['lightbearer-kelvin'],
                    discard: ['dust-pixie', 'lost-in-the-woods']
                },
                player2: {
                    amber: 4,
                    inPlay: ['urchin'],
                    discard: ['ember-imp', 'nerve-blast']
                }
            });
        });

        it('should discard bottom card of own deck and put creature into play', function () {
            this.player1.moveCard(this.dustPixie, 'deck bottom');
            this.player1.fightWith(this.lightbearerKelvin, this.urchin);
            this.player1.clickPrompt('My Deck');
            expect(this.dustPixie.location).toBe('discard');
            this.player1.clickPrompt('Right');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.dustPixie.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard bottom card of opponent deck and put creature into play', function () {
            this.player2.moveCard(this.emberImp, 'deck bottom');
            this.player1.fightWith(this.lightbearerKelvin, this.urchin);
            this.player1.clickPrompt("Opponent's deck");
            expect(this.emberImp.location).toBe('discard');
            this.player1.clickPrompt('Right');
            expect(this.emberImp.location).toBe('play area');
            expect(this.emberImp.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard bottom card of own deck and not put non-creature into play', function () {
            this.player1.moveCard(this.lostInTheWoods, 'deck bottom');
            this.player1.fightWith(this.lightbearerKelvin, this.urchin);
            this.player1.clickPrompt('My Deck');
            expect(this.lostInTheWoods.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Lightbearer Kelvin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['lightbearer-kelvin', 'commander-remiel', 'bulwark'],
                    discard: ['reservist-jones']
                },
                player2: {
                    amber: 6,
                    inPlay: ['urchin']
                }
            });
        });

        it('should allow deploy', function () {
            this.player1.moveCard(this.reservistJones, 'deck bottom');
            this.player1.fightWith(this.lightbearerKelvin, this.urchin);
            this.player1.clickPrompt('My Deck');
            expect(this.reservistJones.location).toBe('discard');
            expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
            this.player1.clickPrompt('Deploy Right');
            expect(this.player1).toHavePrompt('Select a card to deploy to the right of');
            expect(this.player1).toBeAbleToSelect(this.lightbearerKelvin);
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            this.player1.clickCard(this.lightbearerKelvin);
            expect(this.reservistJones.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay[1]).toBe(this.reservistJones);
            expect(this.reservistJones.amber).toBe(0);
            expect(this.player2.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
