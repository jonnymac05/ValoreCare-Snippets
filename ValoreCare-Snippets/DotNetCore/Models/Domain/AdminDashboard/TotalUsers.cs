using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.AdminDashboard
{
    public class TotalUsers
    {
        public int admins { get; set; }

        public int providers { get; set; }

        public int seekers { get; set; }

        public int bloggers { get; set; }
    }
}