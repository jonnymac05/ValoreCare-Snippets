using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.ProviderFilter
{
    public class ProviderCertification
    {
        public int Id { get; set; }
        public int ProviderId { get; set; }
        public int CertificationTypeId { get; set; }
        public string CertificationUrl { get; set; }
    }
}
