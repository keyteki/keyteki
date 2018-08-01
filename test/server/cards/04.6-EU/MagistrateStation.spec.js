describe('Magistrate Station', function() {
    integration(function() {
        describe('Magistrate Station\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer','doji-hotaru'],
                        provinces: ['magistrate-station']
                    },
                    player2: {
                        inPlay: ['eager-scout']
                    }
                });
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.hotaru = this.player1.findCardByName('doji-hotaru');
                this.station = this.player1.findCardByName('magistrate-station');
                this.station.facedown = false;

                this.scout = this.player2.findCardByName('eager-scout');
            });

            it('should only target bowed honored characters', function() {
                this.hotaru.honor();
                this.hotaru.bow();
                this.whisperer.bow();
                this.scout.dishonor();
                this.scout.bow();
                this.player1.clickCard(this.station);
                expect(this.player1).toBeAbleToSelect(this.hotaru);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.scout);
            });


            it('should ready chosen character', function() {
                this.hotaru.honor();
                this.hotaru.bow();
                this.player1.clickCard(this.station);
                this.player1.clickCard(this.hotaru);
                expect(this.hotaru.bowed).toBe(false);
            });
        });
    });
});
