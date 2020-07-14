using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.AdminDashboard
{
    public class Dashboard
    {
        public int PayingSeekers { get; set; }

        public int ActiveSubscriptions { get; set; }

        public TotalUsers TotalUsers { get; set; }

        public List<UserProfile> LastUsers { get; set; }

        public List<UserProfile> LastProviders { get; set; }

        public List<UserProfile> LastSeekers { get; set; }

        public List<DateSignUp> UsersAllTime { get; set; }
        public List<DateSignUp> ProvidersAllTime { get; set; }
        public List<DateSignUp> SeekersAllTime { get; set; }

        public List<DateSignUp> UsersThisMonth { get; set; }

        public List<DateSignUp> ProvidersThisMonth { get; set; }
        public List<DateSignUp> SeekersThisMonth { get; set; }
        public List<DateSignUp> UsersThisWeek { get; set; }

        public List<DateSignUp> ProvidersThisWeek { get; set; }
        public List<DateSignUp> SeekersThisWeek { get; set; }
    }
}