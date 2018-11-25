const MessageService = require('./MessageService');

let services = {};

module.exports = {
    messageService: db => {
        if(services.messageService) {
            return services.messageService;
        }

        services.messageService = new MessageService(db);

        return services.messageService;
    }
};
