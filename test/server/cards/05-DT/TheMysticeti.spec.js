describe('The Mysticeti', function () {
    describe("The Mysticeti's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    inPlay: [
                        'ancient-bear',
                        'the-mysticeti',
                        'dust-pixie',
                        'bumblebird',
                        'teliga',
                        'lamindra'
                    ]
                },
                player2: {
                    amber: 1,
                    inPlay: ['murkens', 'nexus', 'tantadlin']
                }
            });
        });

        describe('when there are no creatures in play', function () {
            beforeEach(function () {
                this.player1.moveCard(this.ancientBear, 'discard');
                this.player1.moveCard(this.dustPixie, 'discard');
                this.player1.moveCard(this.bumblebird, 'discard');
                this.player1.moveCard(this.teliga, 'discard');
                this.player1.moveCard(this.lamindra, 'discard');
            });

            it('should not exhaust any creature and continue to be an artifact', function () {
                this.player1.useAction(this.theMysticeti);
                expect(this.player1).not.toBeAbleToSelect(this.theMysticeti);
                expect(this.player1).not.toBeAbleToSelect(this.murkens);
                expect(this.player1).isReadyToTakeAction();
                expect(this.theMysticeti.type).toBe('artifact');
                expect(this.theMysticeti.powerCounters).toBe(0);
            });
        });

        describe('when all creatures in play are exhausted', function () {
            beforeEach(function () {
                this.player1.reap(this.ancientBear);
                this.player1.reap(this.dustPixie);
                this.player1.reap(this.bumblebird);
                this.player1.reap(this.teliga);
            });

            it('should not exhaust any creature and continue to be an artifact', function () {
                this.player1.useAction(this.theMysticeti);
                expect(this.player1).toHavePrompt('Choose 1 or more creatures');
                expect(this.player1).not.toHavePromptButton('Done');

                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                expect(this.player1).toBeAbleToSelect(this.dustPixie);
                expect(this.player1).toBeAbleToSelect(this.bumblebird);
                expect(this.player1).toBeAbleToSelect(this.teliga);
                expect(this.player1).not.toBeAbleToSelect(this.lamindra);
                expect(this.player1).not.toBeAbleToSelect(this.theMysticeti);
                expect(this.player1).not.toBeAbleToSelect(this.murkens);

                this.player1.clickCard(this.teliga);

                expect(this.player1).toHavePromptButton('Done');

                this.player1.clickPrompt('Done');

                expect(this.player1).isReadyToTakeAction();
                expect(this.theMysticeti.type).toBe('artifact');
                expect(this.theMysticeti.powerCounters).toBe(0);
            });
        });

        describe('when some creatures in play are exhausted', function () {
            beforeEach(function () {
                this.player1.reap(this.ancientBear);
                this.player1.reap(this.dustPixie);
            });

            it('should be able to choose exhausted creatures', function () {
                this.player1.useAction(this.theMysticeti);
                expect(this.player1).toHavePrompt('Choose 1 or more creatures');

                this.player1.clickCard(this.ancientBear);
                this.player1.clickCard(this.dustPixie);
                this.player1.clickPrompt('Done');

                expect(this.player1).isReadyToTakeAction();
                expect(this.theMysticeti.type).toBe('artifact');
                expect(this.theMysticeti.powerCounters).toBe(0);
            });

            it('should be able to choose non-exhausted creatures and move it to battleline', function () {
                this.player1.useAction(this.theMysticeti);
                expect(this.player1).toHavePrompt('Choose 1 or more creatures');

                this.player1.clickCard(this.ancientBear);
                this.player1.clickCard(this.bumblebird);
                this.player1.clickCard(this.teliga);
                this.player1.clickPrompt('Done');

                expect(this.bumblebird.exhausted).toBe(true);
                expect(this.teliga.exhausted).toBe(true);

                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                expect(this.player1).toBeAbleToSelect(this.dustPixie);
                expect(this.player1).toBeAbleToSelect(this.bumblebird);
                expect(this.player1).toBeAbleToSelect(this.teliga);

                this.player1.clickCard(this.bumblebird);
                this.player1.clickPrompt('Left');

                expect(this.player1).isReadyToTakeAction();
                expect(this.theMysticeti.type).toBe('creature');
                expect(this.theMysticeti.powerCounters).toBe(6);
                expect(this.theMysticeti.hasKeyword('taunt')).toBe(true);
            });
        });

        describe('when all creatures in play are ready', function () {
            it('should be able to choose all creatures', function () {
                this.player1.useAction(this.theMysticeti);
                expect(this.player1).toHavePrompt('Choose 1 or more creatures');

                this.player1.clickCard(this.ancientBear);
                this.player1.clickCard(this.teliga);
                this.player1.clickCard(this.dustPixie);
                this.player1.clickCard(this.bumblebird);
                this.player1.clickPrompt('Done');

                expect(this.ancientBear.exhausted).toBe(true);
                expect(this.teliga.exhausted).toBe(true);
                expect(this.dustPixie.exhausted).toBe(true);
                expect(this.bumblebird.exhausted).toBe(true);

                this.player1.clickCard(this.dustPixie);
                this.player1.clickPrompt('Left');

                expect(this.player1).isReadyToTakeAction();
                expect(this.theMysticeti.type).toBe('creature');
                expect(this.theMysticeti.powerCounters).toBe(12);
                expect(this.theMysticeti.hasKeyword('taunt')).toBe(true);
            });
        });

        describe('when used by opponent', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.reap(this.nexus);
                this.player2.clickCard(this.theMysticeti);
            });

            it('should add 3 power counters and keep it as an artifact', function () {
                expect(this.player2).toBeAbleToSelect(this.tantadlin);
                this.player2.clickCard(this.tantadlin);
                this.player2.clickPrompt('Done');
                expect(this.tantadlin.exhausted).toBe(true);
                expect(this.theMysticeti.powerCounters).toBe(3);
                expect(this.theMysticeti.controller).toBe(this.player1.player);
                expect(this.theMysticeti.exhausted).toBe(true);
                expect(this.theMysticeti.type).toBe('artifact');
                this.player2.endTurn();
            });
        });
    });
});
