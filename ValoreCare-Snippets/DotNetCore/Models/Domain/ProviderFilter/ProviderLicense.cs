using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.ProviderFilter
{
    public class ProviderLicense
    {
        public int Id { get; set; }
		public int ProviderId { get; set; }
        public int LicenseTypeId { get; set; }
        public string LicenseUrl { get; set; }
    }
}
