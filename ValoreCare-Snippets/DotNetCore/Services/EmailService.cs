using Amazon.Runtime.Internal;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.AppSettings;
using Sabio.Models.Domain.EvidentUsers;
using Sabio.Models.Requests.Appointments;
using Sabio.Services.Interfaces;
using SendGrid;
using SendGrid.Helpers.Mail;
using SendGrid.Helpers.Mail.Model;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class EmailService : IEmailService
    {
        private AppKeys _appKeys;
        private IWebHostEnvironment _env;
        private IAuthenticationService<int> _authService;
        private IConfiguration _config;
        public EmailService(IOptions<AppKeys> appKeys, IWebHostEnvironment env, IAuthenticationService<int> authService, IConfiguration config)
        {
            _appKeys = appKeys.Value;
            _env = env;
            _authService = authService;
            _config = config;
        }
        private async Task SendEmail(SendGridMessage msg)
        {
            var apiKey = _appKeys.SendGridApiKey;
            var client = new SendGridClient(apiKey);
            var response = await client.SendEmailAsync(msg);
        }

       
        public async Task ConfirmationEmailAsync(string email, Guid token)
        {

            string domain = _config.GetSection("Domain").Value + "/auth/confirm/" + token;
            string HtmlContentPath = "/EmailTemplates/ConfirmationEmail.html";
            string filePath = _env.WebRootPath + HtmlContentPath;
            string htmlContent = System.IO.File.ReadAllText(filePath).Replace("{{confirmLink}}", domain);
       
            SendGridMessage message = new SendGridMessage()
            {  
                From = new EmailAddress("admin@valorecare.com"),
                Subject = "Welcome to ValoreCare",
                HtmlContent = htmlContent,
            };
            message.AddTo(email);
            await SendEmail(message);

        }
        //Sends an email to admin from the contact us form
        public async Task ContactUsEmail(ContactUsMessage userMessage)
        {

            //AdminEmail set to adminValoreCare@dispostable.com

            string email = _appKeys.EvidentIdCredentials.AdminEmail;

            SendGridMessage message = new SendGridMessage()
            {
                From = new EmailAddress(userMessage.Email),
                Subject = $"Contact Us Message from {userMessage.Name}",
                PlainTextContent = userMessage.Message,
            };
            message.AddTo(email);
            await SendEmail(message);
        }
        //Below Items are test emails that will be sent once the webhook is complete. These can be deleted before going to production


        public async Task webhookNotificationFailureTest(string email, EvidentNotificationFailure json)
        {
            string jsonSubject = JsonConvert.SerializeObject(json);
            string domain = _config.GetSection("Domain").Value + "api/users/confirm?token=" + jsonSubject;
            string HtmlContentPath = "/EmailTemplates/ConfirmationEmail.html";
            string filePath = _env.WebRootPath + HtmlContentPath;
            string htmlContent = System.IO.File.ReadAllText(filePath).Replace("{{confirmLink}}", domain);

            SendGridMessage message = new SendGridMessage()
            {
                From = new EmailAddress("admin@valorecare.com"),
                Subject = jsonSubject,
                HtmlContent = htmlContent,
            };
            message.AddTo(email);
            await SendEmail(message);

        }
        public async Task ConfirmAppointmentEmail(Appointment appointment)
        {
            string HtmlContentPath = "/EmailTemplates/AppointmentConfirmed.html";
            string filePath = _env.WebRootPath + HtmlContentPath;
            string providerName = $"{appointment.Provider.FirstName} {appointment.Provider.LastName}";
            string appointmentStartDate = appointment.StartTime.ToString("dddd, dd MMMM yyyy hh:mm tt");
            string appointmentEndDate = appointment.EndTime.ToString("dddd, dd MMMM yyyy hh:mm tt");
            string htmlContent = System.IO.File.ReadAllText(filePath).Replace("{{ProviderName}}", providerName ).Replace("{{AppointmentStartDate}}", appointmentStartDate).Replace("{{AppointmentEndDate}}", appointmentEndDate);


            SendGridMessage message = new SendGridMessage()
            {
                From = new EmailAddress("admin@valorecare.com"),
                Subject = "ValoreCare Appointment Confirmed",
                HtmlContent = htmlContent,
            };
            message.AddTo(appointment.SeekerEmail);
            await SendEmail(message);
        }

        public async Task ResetPassword(string email, Guid token)
        {

            string domain = _config.GetSection("Domain").Value + "/auth/reset/" + token; //------------NEED to update url to password reset page
            string HtmlContentPath = "/EmailTemplates/ResetPasswordEmail.html";
            string filePath = _env.WebRootPath + HtmlContentPath;
            string htmlContent = System.IO.File.ReadAllText(filePath).Replace("{{resetLink}}", domain);

            SendGridMessage message = new SendGridMessage()
            {
                From = new EmailAddress("admin@valorecare.com"),
                Subject = "ValoreCare",
                HtmlContent = htmlContent,
            };
            message.AddTo(email);
            await SendEmail(message);

        }


        public async Task AppointmentQuestion(AppointUpdateInfo model)
        {
            SendGridMessage message = new SendGridMessage()
            {
                From = new EmailAddress(model.From),
                Subject = model.Subject,
                HtmlContent = model.Message,
            };
            message.AddTo(model.To);
            await SendEmail(message);
        }

    }
}
