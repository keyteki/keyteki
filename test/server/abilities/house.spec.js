describe('House belonging', function () {
    describe('latest ability that changes house overrides the others', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['troll', 'brain-stem-antenna', 'poltergeistoids']
                },
                player2: {
                    hand: ['orator-hissaro', 'censor-philo', 'badge-of-unity', 'refit'],
                    inPlay: ['lord-invidius']
                }
            });

            this.player1.makeMaverick(this.brainStemAntenna, 'brobnar');
            this.player1.makeMaverick(this.poltergeistoids, 'brobnar');
            this.player2.makeMaverick(this.badgeOfUnity, 'mars');
            this.player2.makeMaverick(this.lordInvidius, 'mars');
            this.player2.makeMaverick(this.oratorHissaro, 'mars');
            this.player2.makeMaverick(this.censorPhilo, 'mars');
            this.player2.makeMaverick(this.refit, 'mars');
        });

        it('latest house-change effect takes precedence over earlier ones', function () {
            // Poltergeistoids makes Troll belong to Geistoid
            this.player1.scrap(this.troll);
            this.player1.play(this.poltergeistoids);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.getHouses()).toEqual(['geistoid']);

            // Brain Stem Antenna attaches but has no Mars creature trigger yet
            this.player1.playUpgrade(this.brainStemAntenna, this.troll);
            expect(this.troll.getHouses()).toEqual(['geistoid']);
            this.player1.endTurn();

            // Lord Invidius changes Troll to Dis
            this.player2.clickPrompt('mars');
            this.player2.reap(this.lordInvidius);
            this.player2.clickCard(this.troll);
            this.player2.clickPrompt('Right');
            expect(this.troll.getHouses()).toEqual(['dis']);

            // Orator Hissaro triggers Brain Stem Antenna; Hissaro's effect is newest, so Saurian wins
            this.player2.play(this.oratorHissaro);
            this.player2.clickCard(this.troll); // Brain Stem Antenna
            expect(this.troll.getHouses()).toEqual(['saurian']);

            // Censor Philo triggers Brain Stem Antenna, making Mars the newest
            this.player2.play(this.censorPhilo);
            expect(this.troll.getHouses()).toEqual(['mars']);

            // Badge of Unity adds Star Alliance alongside the current house
            this.player2.playUpgrade(this.badgeOfUnity, this.troll);
            expect(this.troll.getHouses()).toEqual(['mars', 'staralliance']);

            // Refit moves Poltergeistoids back onto Troll, making Geistoid the newest
            this.player2.play(this.refit);
            this.player2.clickCard(this.poltergeistoids);
            this.player2.clickCard(this.lordInvidius);
            expect(this.troll.getHouses()).toEqual(['mars', 'staralliance']);
            this.player2.moveCard(this.refit, 'hand');
            this.player2.play(this.refit);
            this.player2.clickCard(this.poltergeistoids);
            this.player2.clickCard(this.troll);
            expect(this.troll.getHouses()).toEqual(['geistoid', 'staralliance']);

            // Removing Poltergeistoids reverts to previous newest, Mars
            this.player2.moveCard(this.refit, 'hand');
            this.player2.play(this.refit);
            this.player2.clickCard(this.poltergeistoids);
            this.player2.clickCard(this.lordInvidius);
            expect(this.troll.getHouses()).toEqual(['mars', 'staralliance']);
            this.player2.endTurn();

            // End of turn expires Hissaro and Antenna, leaving Lord Invidius as newest
            expect(this.troll.getHouses()).toEqual(['dis', 'staralliance']);
            this.player1.clickPrompt('brobnar');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
