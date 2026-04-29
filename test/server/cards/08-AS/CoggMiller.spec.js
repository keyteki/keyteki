describe('Cogg Miller', function () {
    describe("Cogg Miller's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['cogg-miller', 'wretched-doll'],
                    hand: ['mark-of-dis', 'gub']
                },
                player2: {
                    inPlay: ['dust-pixie', 'ritual-of-balance'],
                    hand: ['the-circle-of-life', 'way-of-the-wolf']
                }
            });
        });

        it('allows for not destroying an artifact', function () {
            this.player1.fightWith(this.coggMiller, this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.wretchedDoll);
            expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            this.player1.clickPrompt('Done');
            expect(this.wretchedDoll.location).toBe('play area');
            expect(this.ritualOfBalance.location).toBe('play area');
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.player2.player.hand.length).toBe(2);
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('allows destroying an enemy artifact and archiving a card of theirs', function () {
            this.player1.fightWith(this.coggMiller, this.dustPixie);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.location).toBe('discard');
            expect(this.wretchedDoll.location).toBe('play area');
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(1);
            if (this.theCircleOfLife.location === 'hand') {
                expect(this.wayOfTheWolf.location).toBe('archives');
            } else {
                expect(this.wayOfTheWolf.location).toBe('hand');
                expect(this.theCircleOfLife.location).toBe('archives');
            }
            expect(this.player1).isReadyToTakeAction();
        });

        it('allows destroying an enemy artifact and archiving a card of theirs', function () {
            this.player1.fightWith(this.coggMiller, this.dustPixie);
            this.player1.clickCard(this.wretchedDoll);
            expect(this.wretchedDoll.location).toBe('discard');
            expect(this.ritualOfBalance.location).toBe('play area');
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player2.player.hand.length).toBe(2);
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player2.player.archives.length).toBe(0);
            if (this.markOfDis.location === 'hand') {
                expect(this.gub.location).toBe('archives');
            } else {
                expect(this.gub.location).toBe('hand');
                expect(this.markOfDis.location).toBe('archives');
            }
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
