using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace LucyBell.Server.Services
{
	public interface IEmailService
	{
		Task SendEmailAsync(string to, string subject, string body);
	}

	public class EmailService : IEmailService
	{
		private readonly IConfiguration configuration;

		public EmailService(IConfiguration configuration)
		{
			this.configuration = configuration;
		}

		public async Task SendEmailAsync(string to, string subject, string body)
		{
			var smtpConfig = configuration.GetSection("SMTP");

			using var smtpClient = new SmtpClient(smtpConfig["Host"])
			{
				Port = int.Parse(smtpConfig["Port"]),
				Credentials = new NetworkCredential(smtpConfig["SenderEmail"], smtpConfig["Password"]),
				EnableSsl = bool.Parse(smtpConfig["EnableSSL"])
			};

			var mailMessage = new MailMessage
			{
				From = new MailAddress(smtpConfig["SenderEmail"]),
				Subject = subject,
				Body = body,
				IsBodyHtml = true
			};

			mailMessage.To.Add(to);

			await smtpClient.SendMailAsync(mailMessage);
		}
	}
}
