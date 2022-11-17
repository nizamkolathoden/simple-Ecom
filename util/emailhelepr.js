const nodemailer = require('nodemailer')

const mailHelper = async(options)=>{
      // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

  const message = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
    html: `<a href=${options.message}>Click Here</a>`, // html body
  }

  // send mail with defined transport object
  let info = await transporter.sendMail(message);
}

module.exports = mailHelper