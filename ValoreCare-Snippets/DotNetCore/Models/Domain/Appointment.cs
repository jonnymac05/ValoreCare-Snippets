using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class Appointment
    {
        public int Id { get; set; }
        public BaseUserProfile Seeker {get; set;}
        public BaseUserProfile Provider { get; set; }
        public DateTime StartTime {get; set; }
        public DateTime EndTime { get; set; }
        public decimal Price { get; set; }
        public bool IsConfirmed { get; set; }
        public bool IsCancelled { get; set; }
        public string CancellationReason { get; set; }
        public string email { get; set; }
        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public string SeekerEmail { get; set; }
        public string ProviderEmail { get; set; }
    }
}
