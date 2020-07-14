using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.ProviderFilter
{
    public class ScheduleAvailability
    {
        public int Id { get; set; }
        public int ProviderId { get; set; }
        public int DayOfWeek { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
    }
}
