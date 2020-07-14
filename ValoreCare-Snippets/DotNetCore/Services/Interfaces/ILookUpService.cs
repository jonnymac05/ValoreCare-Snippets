using Sabio.Models.Domain.AllLookUps;
using Sabio.Models.Domain.LookUp;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface ILookUpService
    {
        AllLookUps GetAll();
        List<TwoColumn> GetByTypeName(string type);

        ProviderTypes GetProviderTypes();

        List<TwoColumn> SearchByTypeName(string type, string Query, int PageIndex, int PageSize);
    }
}