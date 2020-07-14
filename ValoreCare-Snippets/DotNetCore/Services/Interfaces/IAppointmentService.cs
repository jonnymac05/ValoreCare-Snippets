using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Appointments;
using Sabio.Models.Requests.ScheduleAvailbility;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Services.Interfaces
{
   public interface IAppointmentService
    {
        Appointment Get(int id);
        string GetEmail(int id);
        Appointment GetAppointmentForEmail(int appointmentId);
        Paged<Appointment> Paginate(int pageIndex, int pageSize);
        Paged<Appointment> SelectBySeekerAndProviderId(int seekerId, int userId, int pageIndex, int pageSize);
        Paged<Appointment> SelectBySeekerId(int seekerId, int pageIndex, int pageSize);
        Paged<Appointment> SelectByProviderId(int providerId, int pageIndex, int pageSize);
        Paged<Appointment> SelectByConfirmedByProviderId(int providerId, int pageIndex, int pageSize);
        Paged<Appointment> SelectByNotConfirmedByProviderId(int providerId, int pageIndex, int pageSize);

        Paged<Appointment> SelectProviderBySeekerId(int seekerId, int pageIndex, int pageSize);
        int Add(AppointmentAddRequest model, int userId);
        void Update(AppointmentUpdateRequest model, int userId);
        void Delete(int id);
        ScheduleAvailablityByDate GetAvailability(int userId, DateTime scheduleDate);
        Paged<Appointment> SelectValidAppointmentsBySeekerId(int seekerId, int pageIndex, int pageSize);
    }
}
