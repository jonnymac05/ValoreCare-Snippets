using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.ProviderFilter
{
    public class Experience
    {
        public string JobTitle { get; set; }
        public string CompanyName { get; set; }
        public int IsCurrent { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Description { get; set; }
    }
}
