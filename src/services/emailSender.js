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
      from: `Bridge Nigeria <${process.env.SENDGRID_EMAIL}>`,
      to: userEmail,
      subject: mailSubject,
      html: `<body style="background-color: white"><h3 style="background: white;padding: .5em;">Hey, ${userName}
      <p>Welcome to Bridge Nigeria</p></h3>
      <div style="padding: .5em;">${mailBody}</div>
      <p style="padding: .5em;"><b>**Note if you are not subscribed to Bridge Nigeria, please ignore this mail.</p></body>`,
    };

    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    sendGrid
      .send(message)
      .then(() => true)
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * Sends an email to a recipient
   *
   * @param {String} userEmail - The email address of the recipent
   * @param {String} mailSubject - The subject of the mail
   * @param {String} mailBody - The mail/message body
   */
  static async sendApplyJobEmail({
    posterEmail,
    posterName,
    taskTitle,
    taskDescription,
    taskDueDate,
    taskBudget,
    applicantName,
    applicantProposal,
    applicantMail,
  }) {
    const message = {
      fromname: applicantMail,
      from: `Bridge Nigeria <${process.env.SENDGRID_EMAIL}>`,
      to: posterEmail,
      replyto: applicantMail,
      subject: 'Bridge: A new offer for a task you posted',
      html: `<body style="background-color: white">
                <div><img src="https://res.cloudinary.com/bridgeng/image/upload/v1595895603/logo_szykxr.png" width="104" height="40" alt="bridge logo"></div>
                <h4>Hello, ${posterName}</h4>
                <div style="background: white; padding: .5em;">
                  <div style="padding: .5em; width: 43.5em; border: 1px solid #007cfe; border-radius: 12px;">
                    <!-- task container -->
                    <div style="margin: 8px 8px -6px 8px; font-style: italic; font-weight: 900;  display: inline; color: #007cfe;">Task you posted :</div>
                        <div style="float: right; margin-right: 11px;"> <img src="https://res.cloudinary.com/bridgeng/image/upload/v1595895603/logo_szykxr.png" width="39" height="14" alt="bridge"> </div>
                      <div style="margin: 8px; border: 1px solid #007cfe6e; border-radius: 12px;padding: 10px;">
                        <!-- title -->
                        <div style="padding: 0px 30px;">
                          <h4 style="color: #6c6464;">${taskTitle}</h4>
                        </div>
                        <!-- job details -->
                        <div style="padding: 8px 10px; background-color: #007cfe2b; border-radius: 8px;">
                          <p style="color: #555151;">${taskDescription}</p>
                        </div>
                        <ul style="padding: 0; list-style-type: none;">
                          <li style="display: flex; margin: 5px 0px;">
                            <img style="margin-right: 5px;" width="20" height="18" src="https://res.cloudinary.com/bridgeng/image/upload/v1595895859/2-2-time-free-download-png_k7ygxt.png" alt="time">
                            <span style="color: #555151;">due date: ${taskDueDate}</span>
                          </li>
                          <li style="display: flex; margin: 5px 0px;">
                            <img style="margin-right: 5px;" width="15" height="16" src="https://res.cloudinary.com/bridgeng/image/upload/v1595896066/icons8-card-wallet-100_han02q.png" alt="wallet">
                            <span style="color: #555151;">your budget: ${taskBudget}</span>
                          </li>
                        </ul>
                        <!-- other details -->
                        
                      </div>
                          <!-- offer starts -->
                    <div style="color: #007cfe;
                    font-style: italic;
                    font-weight: 700;
                    margin-left: 7px;">offer by ${applicantName}</div>
                    <div style="padding: 8px 7px; margin-left: 16px; margin-top: 7px; border-left: 1px solid #007cfe;">${applicantProposal}</div>
                    <div style="margin: 20px 5px 0px; font-style: italic;">Approve this offer? Reply the user by clicking on this e-mail -> <a style="font-weight: bolder;" href="mailto:${applicantMail}?subject=offer accepted from Bridge&body=Your Offer has accepted for this task : '${taskTitle}'">${applicantMail}</a> </div>
                  </div>
                </div>
                <p style="padding: .5em;"><b>**Note if you are not subscribed to Bridge Nigeria, please ignore this mail.</b> To know more about bridge <a href="https://www.getbridge.xyz">click here</a></p>
              </body>`,
    };

    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    sendGrid
      .send(message)
      .then(() => true)
      .catch(err => {
        return {
          error: err,
        };
      });
  }
}

export default EmailSender;
