const MessageService = require('./MessageService');

let services = {};

module.exports = {
    messageService: () => {
        if(services.messageService) {
            return services.messageService;
        }

        services.messageService = new MessageService();

        return services.messageService;
    }
};
