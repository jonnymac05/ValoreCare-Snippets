using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.ProviderFilter
{
    public class ProviderProfile
    {
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Bio { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
    }
}
