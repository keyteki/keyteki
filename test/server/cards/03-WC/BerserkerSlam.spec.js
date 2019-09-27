describe('Berserker Slam', function() {
    integration(function() {
        describe('Play ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 4,
                        house: 'brobnar',
                        hand: ['berserker-slam'],
                        inPlay: ['forgemaster-og','bingle-bangbang','troll']
                    },
                    player2: {
                        amber: 4,
                        inPlay: ['nexus','urchin','dodger']
                    }
                });
            });

            it('cannot target non-flank creatures', function() {
                this.player1.play(this.berserkerSlam);
                expect(this.player1).toBeAbleToSelect(this.forgemasterOg);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.nexus);
                expect(this.player1).toBeAbleToSelect(this.dodger);
                expect(this.player1).not.toBeAbleToSelect(this.bingleBangbang);
                expect(this.player1).not.toBeAbleToSelect(this.urchin);
            });
            it('makes self lose 1 aember if destroy own flank creature', function() {
                this.player1.play(this.berserkerSlam);
                expect(this.player1).toBeAbleToSelect(this.forgemasterOg);
                expect(this.player1).not.toBeAbleToSelect(this.bingleBangbang);
                expect(this.player1).not.toBeAbleToSelect(this.urchin);
                this.player1.clickCard(this.forgemasterOg);
                expect(this.forgemasterOg.location).toBe('discard');
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(4);
            });
            it('makes opponent lose 1 aember if destroy opponents flank creature', function() {
                this.player1.play(this.berserkerSlam);
                expect(this.player1).toBeAbleToSelect(this.nexus);
                this.player1.clickCard(this.nexus);
                expect(this.nexus.location).toBe('discard');
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(3);
            });
            it('doesnt lose our aember if doesnt destroy our flank creature', function() {
                this.player1.play(this.berserkerSlam);
                expect(this.player1).toBeAbleToSelect(this.troll);
                this.player1.clickCard(this.troll);
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(4);
                expect(this.troll.tokens.damage).toBe(4);
            });
            it('doesnt lose opponents aember if doesnt destroy opponents flank creature', function() {
                this.player1.play(this.berserkerSlam);
                expect(this.player1).toBeAbleToSelect(this.dodger);
                this.player1.clickCard(this.dodger);
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(4);
                expect(this.dodger.tokens.damage).toBe(4);
            });
        });
    });
});
