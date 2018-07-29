describe('Bustling Academy', function() {
    integration(function() {
        describe('Bustling Academy\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['naive-student'],
                        dynastyDiscard: ['bustling-academy','kanjo-district']
                    },
                    player2: {
                        inPlay: ['moto-youth','shinjo-scout'],
                        dynastyDiscard:['shiotome-encampment'],
                        hand: []
                    }
                });

                this.ba = this.player1.placeCardInProvince('bustling-academy','province 1');
                this.kd = this.player1.placeCardInProvince('kanjo-district','province 2');
                this.naive = this.player1.findCardByName('naive-student');

                this.shio = this.player2.placeCardInProvince('shiotome-encampment','province 1');
                this.youth = this.player2.placeCardInProvince('moto-youth','province 2');
                this.scout = this.player2.findCardByName('shinjo-scout');
            });

            it('should correctly target cards in provinces', function() {
                this.player1.clickCard(this.ba);
                expect(this.player1).toHavePrompt('Choose a card');
                expect(this.player1).toBeAbleToSelect(this.ba);
                expect(this.player1).toBeAbleToSelect(this.kd);
                expect(this.player1).toBeAbleToSelect(this.shio);
                expect(this.player1).toBeAbleToSelect(this.youth);
            });

            it('should correctly discard the targeted card', function() {
                this.player1.clickCard(this.ba);
                this.player1.clickCard(this.shio);
                expect(this.shio.location).toBe('dynasty discard pile');
            });

            it('should correctly refill the province faceup', function() {
                this.player2.moveCard('shinjo-scout', 'dynasty deck');
                this.player1.clickCard(this.ba);
                this.player1.clickCard(this.shio);
                expect(this.shio.location).toBe('dynasty discard pile');
                expect(this.scout.location).toBe('province 1');
                expect(this.scout.facedown).toBe(false);
            });

            it('should correctly discard itself', function() {
                this.player1.clickCard(this.ba);
                this.player1.clickCard(this.ba);
                expect(this.ba.location).toBe('dynasty discard pile');
            });

            it('should not work if a scholar is not in play', function() {
                this.player1.moveCard('naive-student', 'dynasty discard pile');
                expect(this.naive.location).toBe('dynasty discard pile');
                this.player1.clickCard(this.ba);
                expect(this.player1).toHavePrompt('Initiate an action');
            });
        });
    });
});
