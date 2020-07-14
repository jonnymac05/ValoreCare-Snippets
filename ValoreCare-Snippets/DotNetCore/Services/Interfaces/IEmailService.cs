using Sabio.Models.Domain;
using Sabio.Models.Domain.EvidentUsers;
using Sabio.Models.Requests.Appointments;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IEmailService
    {
        Task ConfirmationEmailAsync(string email, Guid token);

        Task ContactUsEmail(ContactUsMessage message);

        Task ConfirmAppointmentEmail(Appointment appointment);

        //Testing Webhooks Remove below before production
        Task webhookNotificationFailureTest(string email, EvidentNotificationFailure json);

        Task AppointmentQuestion(AppointUpdateInfo model);
        Task ResetPassword(string email, Guid token);
    };



}
