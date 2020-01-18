module.exports = {
    updateStatus: function(handlerInput){
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        if (requestEnvelope.session['new'] || !sessionAttributes['loaded']){
            if (!sessionAttributes.status){
                sessionAttributes.status = { last_access: new Date().toISOString(), count: 0 };
            } else {
                const cnt = sessionAttributes.status.count + 1;
                sessionAttributes.status = { last_access: new Date().toISOString(), count: cnt };
            }
        }
    }
}