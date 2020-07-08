import sendGrid from '@sendgrid/mail';
const { SENDGRID_API_KEY } = process.env;

/**
 * Sends email notifications to admin and users
 *
 * @class - The EmailSender class
 */
class EmailSender {
  /**
   * Sends an email to a recipient
   *
   * @param {String} userEmail - The email address of the recipent
   * @param {String} mailSubject - The subject of the mail
   * @param {String} mailBody - The mail/message body
   */
  static async sendEmail(userEmail, userName, mailSubject, mailBody) {
    const message = {
      from: `Bridge Nigeria <adebayorilerioluwa@gmail.com>`,
      to: userEmail,
      subject: mailSubject,
      html: `<body style="background-color: white"><h3 style="background: white;padding: .5em;">Hey, ${userName}
      <p>Welcome to Bridge Nigeria</p></h3>
      <div style="padding: .5em;">${mailBody}</div>
      <p style="padding: .5em;"><b>**Note if you are not subscribed to Bridge Nigeria, please ignore this mail.</p></body>`,
    };

    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    sendGrid.send(message).then(() => true).catch((err) => {
        console.log(err)
    });
  }

}

export default EmailSender;
