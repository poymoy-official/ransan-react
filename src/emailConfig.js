// src/emailConfig.js

import emailjs from 'emailjs-com';

export const sendEmail = (templateParams) => {
    emailjs.send('service_doxl36j', 'template_vozz7nn', templateParams, 'hPa6DwomUqK9N6LTh')
    .then((response) => {
       console.log('SUCCESS!', response.status, response.text);
    }, (err) => {
       console.error('FAILED...', err);
    });
};
