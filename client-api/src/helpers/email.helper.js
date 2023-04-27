const nodemailer = require("nodemailer");


// create reusable transporter object using the default SMTP transport

// ##### Fake host for testing and development purposes.
// #### FYI:
// ### when new real account and data added, 
// ### it is a must that auth object is done through env file for security purposes. do not provide your data in here

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'mable69@ethereal.email',
        pass: '91EACsBe2TT5NU3C1k'
    }
});

//send email with info
const send = (emailInfo) => {

    return new Promise(async(resolve, reject) => {
        try {
            // send mail with defined transport object
            let result = await transporter.sendMail(emailInfo);

            console.log("Message sent: %s", result.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

            resolve(result)
        } catch (err) {
            console.log(err)
        }
    })

}

//generate email and call send function

const emailProcessor = ({ email, pin, type }) => {
    let emailInfo = '';
    switch (type) {
        case "request-new-pass":
            emailInfo = {

                from: '"BuildingMGM" <fmable69@ethereal.email>', // sender address
                to: email, // list of receivers
                subject: "Password reset Pin", // Subject line
                text: "Here is your password reset Pin" + pin + " This pin will expire in 1 day", // plain text body
                html: `<b>Hello </b>
                    Here is your pin number
                    <b>${pin} </b>
                    <p> This pin will expire in 1 day</p>`, // html body
            }

            send(emailInfo)
            break;
        case 'password-update-success':
            emailInfo = {

                from: '"BuildingMGM" <fmable69@ethereal.email>', // sender address
                to: email, // list of receivers
                subject: "Password updated", // Subject line
                text: "Your new password has been updated", // plain text body
                html: `<b>Hello </b>

            <p>Your new password has been updated</p>`, // html body
            }

            send(emailInfo)
        default:
            break;
    }


}

module.exports = { emailProcessor }