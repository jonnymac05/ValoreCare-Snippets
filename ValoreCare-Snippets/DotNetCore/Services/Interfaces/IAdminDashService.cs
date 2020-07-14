using Sabio.Models.Domain.AdminDashboard;

namespace Sabio.Services.Admin_Dashboard
{
    public interface IAdminDashService
    {
        Dashboard GetDashboard();
        TotalUsers GetTotalUsers();
    }
}