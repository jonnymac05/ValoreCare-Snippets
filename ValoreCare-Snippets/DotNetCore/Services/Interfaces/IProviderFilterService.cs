using Sabio.Models;
using Sabio.Models.Domain.ProviderFilter;

namespace Sabio.Services
{
    public interface IProviderFilterService
    {
        Paged<ProviderFilter> QueryProviders(int pageIndex, int pageSize, float latitude, float longitude, string json, int radius);
        ProviderDetails SelectByProviderId(int id);
    }
}