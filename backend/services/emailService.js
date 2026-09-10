const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// ============================================================
// SEND TEAM INVITATION EMAIL
// ============================================================

const sendTeamInvitationEmail = async ({
  receiverEmail,
  receiverName,
  senderName,
  teamName,
  problemTitle,
  matchScore,
  reason
}) => {
  if (!receiverEmail) {
    throw new Error('Receiver email is required');
  }

  const mailOptions = {
    from: `"JanSethu" <${process.env.EMAIL_USER}>`,
    to: receiverEmail,
    subject: `You have a new JanSethu team invitation`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 24px; color: #374151;">

        <h2 style="color: #8B5E5E;">
          🎓 JanSethu Team Invitation
        </h2>

        <p>
          Hello <strong>${receiverName || 'Student'}</strong>,
        </p>

        <p>
          <strong>${senderName || 'A student'}</strong>
          has invited you to join their team on JanSethu.
        </p>

        <div style="background: #FFF5F2; padding: 18px; border-radius: 12px; margin: 20px 0;">

          <p>
            <strong>Team:</strong>
            ${teamName || 'Team'}
          </p>

          <p>
            <strong>Problem:</strong>
            ${problemTitle || 'Problem'}
          </p>

          <p>
            <strong>AI Match:</strong>
            ${Math.round(Number(matchScore) || 0)}%
          </p>

          ${
            reason
              ? `
                <p>
                  <strong>Why you were recommended:</strong><br/>
                  ${reason}
                </p>
              `
              : ''
          }

        </div>

        <p>
          Please open JanSethu to review the invitation and choose whether to
          <strong>Accept</strong> or <strong>Decline</strong>.
        </p>

        <p style="color: #6B7280; font-size: 13px;">
          AI only recommends suitable students. You always have the final choice
          whether to join the team.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;"/>

        <p style="font-size: 13px; color: #9CA3AF;">
          This is an automated notification from JanSethu.
        </p>

      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};


// ============================================================
// SEND TEAM INVITATION RESPONSE EMAIL
// ============================================================

const sendTeamInvitationResponseEmail = async ({
  senderEmail,
  senderName,
  receiverName,
  teamName,
  problemTitle,
  response
}) => {
  if (!senderEmail) {
    throw new Error('Sender email is required');
  }

  const isAccepted = response === 'Accepted';

  const mailOptions = {
    from: `"JanSethu" <${process.env.EMAIL_USER}>`,
    to: senderEmail,

    subject: isAccepted
      ? `🎉 ${receiverName || 'A student'} accepted your JanSethu team invitation`
      : `Team invitation declined by ${receiverName || 'a student'}`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 24px; color: #374151;">

        <h2 style="color: #8B5E5E;">
          ${isAccepted
            ? '🎉 Team Invitation Accepted'
            : '📩 Team Invitation Response'}
        </h2>

        <p>
          Hello <strong>${senderName || 'Student'}</strong>,
        </p>

        <p>
          <strong>${receiverName || 'A student'}</strong>
          has
          <strong>
            ${isAccepted ? 'accepted' : 'declined'}
          </strong>
          your team invitation on JanSethu.
        </p>

        <div style="background: ${isAccepted ? '#F0FDF4' : '#FFF5F5'}; padding: 18px; border-radius: 12px; margin: 20px 0;">

          <p>
            <strong>Team:</strong>
            ${teamName || 'Team'}
          </p>

          <p>
            <strong>Problem:</strong>
            ${problemTitle || 'Problem'}
          </p>

          <p>
            <strong>Student:</strong>
            ${receiverName || 'Student'}
          </p>

          <p>
            <strong>Response:</strong>
            ${isAccepted ? 'Accepted ✅' : 'Declined ❌'}
          </p>

        </div>

        ${
          isAccepted
            ? `
              <p>
                ${receiverName || 'The student'} is now a member of your team.
              </p>

              <p style="color: #6B7280; font-size: 13px;">
                You can now collaborate with them through JanSethu.
              </p>
            `
            : `
              <p style="color: #6B7280; font-size: 13px;">
                The student has chosen not to join the team at this time.
              </p>
            `
        }

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;"/>

        <p style="font-size: 13px; color: #9CA3AF;">
          This is an automated notification from JanSethu.
        </p>

      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  sendTeamInvitationEmail,
  sendTeamInvitationResponseEmail
};