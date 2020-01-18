
const DOUBT_SPEECHCON = `<say-as interpret-as="interjection">ay ay ay</say-as>`;
const HOLA_SPEECHCON = `<say-as interpret-as="interjection">hola</say-as>`;
const QUETAL_SPEECHCON = `<say-as interpret-as="interjection">¿qué tal?</say-as>`;
const GENIAL_SPEECHCON = `<say-as interpret-as="interjection">genial</say-as>`;

module.exports = {
    es: {
        translation: {
            WELCOME_MESSAGE_FIRST_TIME: 'Te damos la bienvenida a {{skill_name}}. Con esta skill podrás usar Alexa para leer tus correos de Hotmail u Outlook.com. ',
            WELCOME_MESSAGE_CTA: 'Puedes decirme: Alexa, ¿tengo nuevos correos? o, Alexa, lee mis correos. ',
            ACCOUNT_LINKING_REQUIRED: 'Primero tienes que vincular tu cuenta de Outlook u Hotmail con Alexa. Sigue las instrucciones que te he enviado a la app de Alexa. Cuando hayas terminado puedes decir: Alexa, abre voice mail o, Alexa, pide a voice mail que controle mi emails.',
            WHAT_DO_YOU_WANT_TO_DO: ['¿Qué quieres hacer?', '¿En qué puedo ayudarte?'],
            WELCOME_MESSAGE: 'Te damos la bienvenida a {{skill_name}}. Qué quieres hacer?',
            WELCOME_BACK_MESSAGE: 'Te volvemos a dar la bienvenida, {{user_name}}',
            NO_UNREAD_EMAILS: ['no tienes ningún nuevo correo. ', 'no tienes nuevas emails.'],
            UNREAD_EMAIL: ['tienes 1 correo sin leer. ', 'tienes 1 correo no leído. '],
            UNREAD_EMAILS: ['tienes {{unread_emails}} correos sin leer. ', 'tienes {{unread_emails}} correos no leídos. '],
            HELP_MSG: ' Puedes pedirme el consejo del día. También puedo darte uno sobre alimentación o ejercicio. ',
            REFLECTOR_MSG: 'Acabas de activar {{intent}}',
            FALLBACK_MSG: 'Lo siento, no te he entendido. ',
            ERROR_MSG: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez. '
        }
    }
}