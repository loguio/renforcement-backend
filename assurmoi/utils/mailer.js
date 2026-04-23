const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Fonction générale pour envoyer un email
async function sendMail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
    console.log("Email envoyé: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
}

// Fonction spécifique pour envoyer un email de connexion (exemple avec un lien de connexion)
async function sendLoginMail(to, loginLink) {
  const subject = "Votre lien de connexion";
  const text = `Cliquez sur ce lien pour vous connecter: ${loginLink}`;
  const html = `<p>Cliquez sur ce lien pour vous connecter: <a href="${loginLink}">Se connecter</a></p>`;

  return await sendMail(to, subject, text, html);
}

module.exports = {
  sendMail,
  sendLoginMail,
};
