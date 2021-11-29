const functions = require('firebase-functions')
const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'ledpixeltable@gmail.com',
        pass: '2043ws2812b'
    }
});

exports.Mail = functions.firestore.document("formcontact/{id}").onCreate((snap, context) => {
    const name = snap.data().name;
    const email = snap.data().email;
    const phone = snap.data().phone;
    const message = snap.data().message;
    return sendMail(name, email, phone, message);
});


function sendMail(name, email, phone, message) {
    return transporter.sendMail({
        from: '"LED Table Pixel Enterprise" <ledpixeltable@gmail.com>',
        to: 'ledpixeltable@gmail.com',
        subject: 'Formulario de contacto',
        html: `
        <h1>User Information</h1>
        <ul>
            <li>Username: ${name}</li>
            <li>User Email: ${email}</li>
            <li>Phone: ${phone}</li>
        </ul>
        <p>${message}</p>
        `
    })
}