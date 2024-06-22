import nodemailer from "nodemailer";

export const sendEmail = async (recipients: string, url: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "jeff.sawayn17@ethereal.email",
      pass: "9Yp4MfRcJSR1r7wWrn",
    },
  });

  const info = await transporter.sendMail({
    from: "testing@gmail.com",
    to: recipients,
    subject: "Confirm Email",
    text: "Confirm Email, click link here!",
    html: `<a href=${url}>Click Here!, </a> to confirm your email`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log(nodemailer.getTestMessageUrl(info));
};
