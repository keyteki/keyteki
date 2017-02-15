jasmine.getEnv().addReporter({
    specStarted: function(result) {
        console.log(result.fullName);
    }
});
