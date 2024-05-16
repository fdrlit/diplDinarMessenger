using Messenger_App.Interfaces;
using System.Net.Mail;
using System.Text;

namespace Messenger_App.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly SmtpClient _smtpClient;
        private readonly IConfiguration _configuration;

        public EmailSender(SmtpClient smtpClient, IConfiguration configuration)
        {
            _smtpClient = smtpClient;
            _configuration = configuration;

        }
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var mailMessage = new MailMessage()
            {
                From = new MailAddress(_configuration["Email:From"]),
                Subject = subject,
                Body = message,
                IsBodyHtml = true
            };
            mailMessage.To.Add(email);
            await _smtpClient.SendMailAsync(mailMessage);
        }
    }
}
