describe('Friendship', function () {
    describe("Friendship's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 4,
                    token: 'defender',
                    inPlay: ['paraguardian', 'revered-monk', 'chancellor-dexterus'],
                    hand: ['friendship', 'challe-the-safeguard', 'friendship']
                },
                player2: {
                    amber: 3,
                    inPlay: ['batdrone', 'quixo-the-adventurer', 'dr-escotera', 'mother'],
                    discard: []
                }
            });

            this.friendship1 = this.player1.hand[0];
            this.friendship2 = this.player1.hand[2];
            this.player1.playUpgrade(this.friendship1, this.reveredMonk);
            this.chancellorDexterus.tokens.ward = 1;
        });

        describe('two damage is distributed among two creatures', function () {
            it('should split damage evenly without a prompt', function () {
                this.player1.fightWith(this.reveredMonk, this.batdrone);
                expect(this.reveredMonk.damage).toBe(0);
                expect(this.paraguardian.damage).toBe(1);
                expect(this.chancellorDexterus.damage).toBe(1);
                expect(this.chancellorDexterus.warded).toBe(true);
            });
        });

        describe('three damage is distributed among two creatures', function () {
            it('should give an extra prompt to distribute the one extra damage', function () {
                this.player1.fightWith(this.reveredMonk, this.quixoTheAdventurer);
                expect(this.player1).toHavePrompt('Friendship');
                expect(this.player1).not.toBeAbleToSelect(this.quixoTheAdventurer); // enemy creature
                expect(this.player1).toBeAbleToSelect(this.paraguardian);
                expect(this.player1).not.toBeAbleToSelect(this.reveredMonk); // friendly creature that was dealt damage
                expect(this.player1).toBeAbleToSelect(this.chancellorDexterus);
                this.player1.clickCard(this.paraguardian);
                expect(this.reveredMonk.damage).toBe(0);
                expect(this.paraguardian.damage).toBe(2);
                expect(this.chancellorDexterus.damage).toBe(1);
                expect(this.chancellorDexterus.warded).toBe(true);
            });
        });

        describe('four damage is distributed among two creatures', function () {
            it('should split damage evenly without a prompt', function () {
                this.player1.fightWith(this.reveredMonk, this.drEscotera);
                expect(this.reveredMonk.damage).toBe(0);
                expect(this.paraguardian.damage).toBe(2);
                expect(this.chancellorDexterus.damage).toBe(2);
                expect(this.chancellorDexterus.warded).toBe(true);
            });
        });

        describe('five damage is distributed among two creatures', function () {
            it('can destroy a creature, including warded creatures', function () {
                this.player1.fightWith(this.reveredMonk, this.mother);
                expect(this.player1).toHavePrompt('Friendship');
                this.player1.clickCard(this.chancellorDexterus);
                expect(this.reveredMonk.damage).toBe(0);
                expect(this.paraguardian.damage).toBe(2);
                expect(this.chancellorDexterus.location).toBe('discard');
            });
        });

        it('applies damage after armor', function () {
            this.player1.playCreature(this.challeTheSafeguard, true, true);
            this.player1.clickCard(this.chancellorDexterus);
            this.player1.fightWith(this.reveredMonk, this.mother);
            expect(this.player1).toHavePrompt('Friendship');
            expect(this.player1).not.toBeAbleToSelect(this.mother); // enemy creature
            expect(this.player1).toBeAbleToSelect(this.paraguardian);
            expect(this.player1).not.toBeAbleToSelect(this.reveredMonk); // friendly creature that was dealt damage
            expect(this.player1).toBeAbleToSelect(this.challeTheSafeguard);
            this.player1.clickCard(this.paraguardian);
            expect(this.reveredMonk.damage).toBe(0);
            expect(this.paraguardian.damage).toBe(2);
            expect(this.challeTheSafeguard.damage).toBe(1);
            expect(this.chancellorDexterus.damage).toBe(0);
            expect(this.chancellorDexterus.warded).toBe(true);
        });

        describe('when damage is redirected onto a creature upgraded with Friendship', function () {
            it('does not redirect a second time', function () {
                this.player1.playUpgrade(this.friendship2, this.paraguardian);
                this.player1.fightWith(this.reveredMonk, this.drEscotera);
                expect(this.reveredMonk.damage).toBe(0);
                expect(this.paraguardian.damage).toBe(2);
                expect(this.chancellorDexterus.damage).toBe(2);
                expect(this.chancellorDexterus.warded).toBe(true);
            });
        });

        describe('when damage is redirected onto a warded creature', function () {
            it('should bypass ward since damage was already dealt', function () {
                // Ward both neighbors
                this.paraguardian.ward();
                // Chancellor already has ward from beforeEach
                this.player1.fightWith(this.reveredMonk, this.drEscotera);
                // 4 damage split evenly = 2 each
                // Ward should NOT block the redirected damage
                expect(this.reveredMonk.damage).toBe(0);
                expect(this.paraguardian.damage).toBe(2);
                expect(this.paraguardian.warded).toBe(true); // Ward still present
                expect(this.chancellorDexterus.damage).toBe(2);
                expect(this.chancellorDexterus.warded).toBe(true); // Ward still present
            });
        });

        describe('when two adjacent creatures both have Friendship', function () {
            it('should not redirect damage back and forth infinitely', function () {
                this.player1.playUpgrade(this.friendship2, this.chancellorDexterus);
                this.player1.fightWith(this.reveredMonk, this.batdrone);
                expect(this.reveredMonk.damage).toBe(0);
                expect(this.paraguardian.damage).toBe(1);
                expect(this.chancellorDexterus.damage).toBe(1);
            });
        });
    });

    describe("Friendship's ability and splash damage", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 4,
                    token: 'defender',
                    inPlay: [
                        'mother-northelle',
                        'batdrone',
                        'dr-escotera',
                        'daughter',
                        'the-grey-rider'
                    ],
                    hand: ['challe-the-safeguard', 'friendship']
                },
                player2: {
                    amber: 3,
                    inPlay: ['crogg-the-clumsy']
                }
            });

            this.player1.playUpgrade(this.friendship, this.drEscotera);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
        });

        it('splash should be dealt simultaneously with even distribution', function () {
            this.croggTheClumsy.tokens.power = 1;
            this.player2.fightWith(this.croggTheClumsy, this.drEscotera);
            expect(this.motherNorthelle.location).toBe('play area');
            expect(this.daughter.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.theGreyRider.location).toBe('play area');
            expect(this.drEscotera.location).toBe('play area');
            expect(this.croggTheClumsy.location).toBe('play area');
            expect(this.croggTheClumsy.damage).toBe(4);
            this.player2.endTurn();
        });

        it('splash should be dealt simultaneously with odd distribution', function () {
            this.player2.fightWith(this.croggTheClumsy, this.drEscotera);
            expect(this.player2).toHavePrompt('Select a neighbor to receive extra damage');
            expect(this.player2).toBeAbleToSelect(this.batdrone);
            expect(this.player2).toBeAbleToSelect(this.daughter);
            this.player2.clickCard(this.daughter);
            expect(this.motherNorthelle.location).toBe('play area');
            expect(this.daughter.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.theGreyRider.location).toBe('play area');
            expect(this.drEscotera.location).toBe('play area');
            expect(this.croggTheClumsy.location).toBe('play area');
            expect(this.croggTheClumsy.damage).toBe(4);
            this.player2.endTurn();
        });

        describe('when neighbors are warded', function () {
            it('splash should be dealt simultaneously with even distribution', function () {
                this.croggTheClumsy.tokens.power = 1;
                this.batdrone.tokens.ward = 1;
                this.daughter.tokens.ward = 1;
                this.player2.fightWith(this.croggTheClumsy, this.drEscotera);
                expect(this.motherNorthelle.location).toBe('play area');
                expect(this.daughter.location).toBe('discard');
                expect(this.batdrone.location).toBe('discard');
                expect(this.theGreyRider.location).toBe('play area');
                expect(this.drEscotera.location).toBe('play area');
                expect(this.croggTheClumsy.location).toBe('play area');
                expect(this.croggTheClumsy.damage).toBe(4);
                this.player2.endTurn();
            });

            it('splash should be dealt simultaneously with odd distribution', function () {
                this.batdrone.tokens.ward = 1;
                this.daughter.tokens.ward = 1;
                this.player2.fightWith(this.croggTheClumsy, this.drEscotera);
                expect(this.player2).toHavePrompt('Select a neighbor to receive extra damage');
                expect(this.player2).toBeAbleToSelect(this.batdrone);
                expect(this.player2).toBeAbleToSelect(this.daughter);
                this.player2.clickCard(this.daughter);
                expect(this.motherNorthelle.location).toBe('play area');
                expect(this.daughter.location).toBe('discard');
                expect(this.batdrone.location).toBe('discard');
                expect(this.theGreyRider.location).toBe('play area');
                expect(this.drEscotera.location).toBe('play area');
                expect(this.croggTheClumsy.location).toBe('play area');
                expect(this.croggTheClumsy.damage).toBe(4);
                this.player2.endTurn();
            });
        });
    });

    describe("Friendship's ability and poison", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['paraguardian', 'chancellor-dexterus', 'baldric-the-bold'],
                    hand: ['friendship']
                },
                player2: {
                    inPlay: ['mooncurser']
                }
            });

            this.player1.playUpgrade(this.friendship, this.chancellorDexterus);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
        });

        it('should apply poison to the neighbors receiving redirected damage', function () {
            this.player2.fightWith(this.mooncurser, this.chancellorDexterus);
            this.player2.clickCard(this.baldricTheBold);
            expect(this.paraguardian.location).toBe('play area');
            expect(this.chancellorDexterus.location).toBe('play area');
            expect(this.chancellorDexterus.damage).toBe(0);
            expect(this.baldricTheBold.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should apply poison to warded neighbors receiving redirected damage', function () {
            this.baldricTheBold.ward();
            this.player2.fightWith(this.mooncurser, this.chancellorDexterus);
            this.player2.clickCard(this.baldricTheBold);
            expect(this.paraguardian.location).toBe('play area');
            expect(this.chancellorDexterus.location).toBe('play area');
            expect(this.chancellorDexterus.damage).toBe(0);
            expect(this.baldricTheBold.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
