using Sabio.Models.Domain.LookUp;
using Sabio.Models.Domain.Provider;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.ProviderFilter
{
    public class ProviderDetails
    {
        public List<BaseUserProfile> UserProfile { get; set; }
        public List<ProviderProfile> ProviderProfile { get; set; }
        public List<ScheduleAvailability> ScheduleAvailability { get; set; }
        public List<Education> EducationDetails { get; set; }
        public List<Experience> ExperienceDetails { get; set; }
        public List<ProviderLicense> Licenses { get; set; }
        public List<ProviderCertification> Certifications { get; set; }
        public List<TwoColumn> ProviderHelp { get; set; }
        public List<TwoColumn> ProviderExpertise { get; set; }
        public List<TwoColumn> ProviderLanguages { get; set; }
        public List<TwoColumn> ProviderCare { get; set; }
        public List<TwoColumn> ProviderConcern { get; set; }
        public List<UserPhone> ProviderPhones { get; set; }
        public List<ProviderLocation> ProviderLocation { get; set; }

    }
}
