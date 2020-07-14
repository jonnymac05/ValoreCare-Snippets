using Sabio.Models.Domain.LookUp;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.ProviderFilter
{
    public class Rating: TwoColumn
    {
        public int SeekerId { get; set; }
    }
}
