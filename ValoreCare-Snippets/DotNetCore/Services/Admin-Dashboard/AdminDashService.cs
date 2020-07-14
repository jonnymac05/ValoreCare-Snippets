using Microsoft.AspNetCore.SignalR;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.AdminDashboard;
using Sabio.Services.Notifications;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services.Admin_Dashboard
{
    public class AdminDashService : IAdminDashService
    {
        IDataProvider _data = null;
        public AdminDashService(IDataProvider data)
        {
            _data = data;

        }

        public TotalUsers GetTotalUsers()
        {
            string procName = "[dbo].[Users_GetTotals]";
            TotalUsers users = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex;
                MapTotalUsers(reader, out users, out startingIndex);
            });
            return users;
        }

        public Dashboard GetDashboard()
        {
            string procName = "[dbo].[AdminDash_Providers]";
            Dashboard dashboard = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
            }, delegate (IDataReader reader, short set)
            {
                int index;
                MapAdminDash(reader, out dashboard, out index);
            });
            return dashboard;
        }

        private static void MapTotalUsers(IDataReader reader, out TotalUsers users, out int startingIndex)
        {
            users = new TotalUsers();
            startingIndex = 0;
            users.admins = reader.GetSafeInt32(startingIndex++);
            users.providers = reader.GetSafeInt32(startingIndex++);
            users.seekers = reader.GetSafeInt32(startingIndex++);
            users.bloggers = reader.GetSafeInt32(startingIndex++);


        }

        private static void MapAdminDash(IDataReader reader, out Dashboard dashboard, out int index)
        {
            dashboard = new Dashboard();
            index = 0;
            dashboard.PayingSeekers = reader.GetSafeInt32(index++);
            dashboard.ActiveSubscriptions = reader.GetSafeInt32(index++);

            TotalUsers totalUsers = new TotalUsers();
            totalUsers = reader.DeserializeObject<TotalUsers>(index++);
            dashboard.TotalUsers = totalUsers;

            List<UserProfile> lastUsers = new List<UserProfile>();
            lastUsers = reader.DeserializeObject<List<UserProfile>>(index++);
            dashboard.LastUsers = lastUsers;

            List<UserProfile> lastProviders = new List<UserProfile>();
            lastProviders = reader.DeserializeObject<List<UserProfile>>(index++);
            dashboard.LastProviders = lastProviders;

            List<UserProfile> lastSeekers = new List<UserProfile>();
            lastSeekers = reader.DeserializeObject<List<UserProfile>>(index++);
            dashboard.LastSeekers = lastSeekers;

            List<DateSignUp> usersAllTime = new List<DateSignUp>();
            usersAllTime = reader.DeserializeObject<List<DateSignUp>>(index++);
            dashboard.UsersAllTime = usersAllTime;

            List<DateSignUp> providersAllTime = new List<DateSignUp>();
            providersAllTime = reader.DeserializeObject<List<DateSignUp>>(index++);
            dashboard.ProvidersAllTime = providersAllTime;

            List<DateSignUp> seekersAllTime = new List<DateSignUp>();
            seekersAllTime = reader.DeserializeObject<List<DateSignUp>>(index++);
            dashboard.SeekersAllTime = seekersAllTime;

            List<DateSignUp> usersThisMonth = new List<DateSignUp>();
            usersThisMonth = reader.DeserializeObject<List<DateSignUp>>(index++);
            dashboard.UsersThisMonth = usersThisMonth;

            List<DateSignUp> providersThisMonth = new List<DateSignUp>();
            providersThisMonth = reader.DeserializeObject<List<DateSignUp>>(index++);
            dashboard.ProvidersThisMonth = providersThisMonth;

            List<DateSignUp> seekersThisMonth = new List<DateSignUp>();
            seekersThisMonth = reader.DeserializeObject<List<DateSignUp>>(index++);
            dashboard.SeekersThisMonth = seekersThisMonth;

            List<DateSignUp> usersThisWeek = new List<DateSignUp>();
            usersThisWeek = reader.DeserializeObject<List<DateSignUp>>(index++);
            dashboard.UsersThisWeek = usersThisWeek;

            List<DateSignUp> providersThisWeek = new List<DateSignUp>();
            providersThisWeek = reader.DeserializeObject<List<DateSignUp>>(index++);
            dashboard.ProvidersThisWeek = providersThisWeek;

            List<DateSignUp> seekersThisWeek = new List<DateSignUp>();
            seekersThisWeek = reader.DeserializeObject<List<DateSignUp>>(index++);
            dashboard.SeekersThisWeek = seekersThisWeek;
        }

    }
}