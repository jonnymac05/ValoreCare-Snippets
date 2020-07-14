using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.AllLookUps;
using Sabio.Models.Domain.LookUp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace Sabio.Services
{
    public class LookUpService : ILookUpService
    {
        IDataProvider _data = null;
        public LookUpService(IDataProvider data)
        {
            _data = data;
        }

        public AllLookUps GetAll()
        {
            AllLookUps item = new AllLookUps();
            string procName = "[dbo].[LookUp_GetAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null,
            singleRecordMapper: delegate (IDataReader reader, short set)
            {

                int index = 0;
                item.DaysOfWeek = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.Roles = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.UserStatus = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.TokenTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.UrlTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.EventStatus = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.BlogTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.EventTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.EntityTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.GenderTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.FilesTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.States = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.JobType = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.Languages = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.TitleTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.ExpertiseTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.Tags = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.HelpNeedTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.CareNeedsTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.ConcernTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.Ratings = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.PaymentTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.CertificateTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.LicenseTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
                item.LocationTypes = reader.DeserializeObject<List<TwoColumn>>(index++);
            }
           );

            return item;
        }
        public List<TwoColumn> GetByTypeName(string type)
        {
            string procName = GetProcName(type);
            List<TwoColumn> list = null;

            _data.ExecuteCmd(procName, inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    TwoColumn twoColumn = MapTwoColumns(reader);

                    if (list == null)
                    {
                        list = new List<TwoColumn>();
                    }

                    list.Add(twoColumn);
                });

            return list;
        }

        public List<TwoColumn> SearchByTypeName(string type, string Query, int PageIndex, int PageSize)
        {
            string procName = GetProcSearchName(type);
            List<TwoColumn> list = null;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection inputCollection)
                {
                    inputCollection.AddWithValue("@PageIndex", PageIndex);
                    inputCollection.AddWithValue("@PageSize", PageSize);
                    inputCollection.AddWithValue("@Query", Query);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    TwoColumn twoColumn = MapTwoColumns(reader);

                    if (list == null)
                    {
                        list = new List<TwoColumn>();
                    }

                    list.Add(twoColumn);
                });

            return list;
        }

        public ProviderTypes GetProviderTypes()
        {
            string procName = "[dbo].[ProviderTypes_Select_V3]";

            ProviderTypes provider = new ProviderTypes();

            _data.ExecuteCmd(procName
                , inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)

                { SwitchTypes(set, reader, provider); });

            return provider;
        }

        private string GetProcSearchName(string type)
        {
            string _type = type;

            switch (_type)
            {
                case "JobType":
                    return "[dbo].[JobType_SearchPaginated]";

            }

            return null;

        }

        private string GetProcName(string type)
        {
            string _type = type;

            switch (_type)
            {
                case "DaysOfWeek":
                    return "[dbo].[DaysOfWeek_SelectAll]";

                case "Roles":
                    return "[dbo].[Roles_SelectAll]";

                case "UserStatus":
                    return "[dbo].[UserStatus_SelectAll]";

                case "TokenTypes":
                    return "[dbo].[TokenTypes_SelectAll]";

                case "TokeTypes":
                    return "[dbo].[TokenTypes_SelectAll]";

                case "UrlTypes":
                    return "[dbo].[UrlTypes_SelectAll]";

                case "EventStatus":
                    return "[dbo].[EventStatus_SelectAll]";

                case "BlogTypes":
                    return "[dbo].[BlogTypes_SelectAll]";

                case "EventTypes":
                    return "[dbo].[EventTypes_SelectAll]";

                case "EntityTypes":
                    return "[dbo].[EntityTypes_SelectAll]";

                case "GenderTypes":
                    return "[dbo].[GenderTypes_SelectAll]";

                case "FilesTypes":
                    return "[dbo].[FileTypes_SelectAll]";

                case "States":
                    return "[dbo].[States_SelectAll]";

                case "JobType":
                    return "[dbo].[JobType_SelectAll]";

                case "Languages":
                    return "[dbo].[Languages_SelectAll]";

                case "TitleTypes":
                    return "[dbo].[TitleTypes_SelectAll]";

                case "ExpertiseTypes":
                    return "[dbo].[ExpertiseTypes_SelectAll]";

                case "Tags":
                    return "[dbo].[Tags_SelectAll]";

                case "HelpNeedTypes":
                    return "[dbo].[HelpNeedTypes_SelectAll]";

                case "CareNeedsTypes":
                    return "[dbo].[CareNeedsTypes_SelectAll]";

                case "ConcernTypes":
                    return "[dbo].[ConcernTypes_SelectAll]";

                case "Ratings":
                    return "[dbo].[Ratings_SelectAll]";

                case "PaymentTypes":
                    return "[dbo].[PaymentTypes_SelectAll]";

                case "CertificateTypes":
                    return "[dbo].[CertificateTypes_SelectAll]";

                case "LicenseTypes":
                    return "[dbo].[LicenseTypes_SelectAll]";

                case "LocationTypes":
                    return "[dbo].[LocationTypes_SelectAll]";

                case "NotificationTypes":
                    return "[dbo].[NotificationTypes_SelectAll]";



                case "VirtualType":
                    return "[dbo].[VirtualType_SelectAll]";

            }

            return null;

        }

        private static void SwitchTypes(short set, IDataReader reader, ProviderTypes provider)
        {
            switch (set)
            {
                case 0:
                    TwoColumn languages = MapTwoColumns(reader);

                    if (provider.Languages == null)
                    {
                        provider.Languages = new List<TwoColumn>();
                    }

                    provider.Languages.Add(languages);
                    break;

                case 1:
                    TwoColumn daysOfWeek = MapTwoColumns(reader);

                    if (provider.DaysOfWeek == null)
                    {
                        provider.DaysOfWeek = new List<TwoColumn>();
                    }

                    provider.DaysOfWeek.Add(daysOfWeek);
                    break;

                case 2:
                    TwoColumn concernTypes = MapTwoColumns(reader);

                    if (provider.ConcernTypes == null)
                    {
                        provider.ConcernTypes = new List<TwoColumn>();
                    }

                    provider.ConcernTypes.Add(concernTypes);
                    break;

                case 3:

                    TwoColumn expertiseTypes = MapTwoColumns(reader);

                    if (provider.ExpertiseTypes == null)
                    {
                        provider.ExpertiseTypes = new List<TwoColumn>();
                    }

                    provider.ExpertiseTypes.Add(expertiseTypes);
                    break;

                case 4:
                    TwoColumn licenseTypes = MapTwoColumns(reader);

                    if (provider.LicenseTypes == null)
                    {
                        provider.LicenseTypes = new List<TwoColumn>();
                    }

                    provider.LicenseTypes.Add(licenseTypes);
                    break;

                case 5:
                    TwoColumn careNeedsTypes = MapTwoColumns(reader);

                    if (provider.CareNeedsTypes == null)
                    {
                        provider.CareNeedsTypes = new List<TwoColumn>();
                    }

                    provider.CareNeedsTypes.Add(careNeedsTypes);
                    break;
                case 6:
                    TwoColumn certificateTypes = MapTwoColumns(reader);

                    if (provider.CertificateTypes == null)
                    {
                        provider.CertificateTypes = new List<TwoColumn>();
                    }

                    provider.CertificateTypes.Add(certificateTypes);
                    break;
                case 7:
                    TwoColumn helpNeedTypes = MapTwoColumns(reader);

                    if (provider.HelpNeedTypes == null)
                    {
                        provider.HelpNeedTypes = new List<TwoColumn>();
                    }

                    provider.HelpNeedTypes.Add(helpNeedTypes);
                    break;
                case 8:
                    TwoColumn states = MapTwoColumns(reader);

                    if (provider.States == null)
                    {
                        provider.States = new List<TwoColumn>();
                    }

                    provider.States.Add(states);
                    break;
                case 9:
                    TwoColumn providerTypes = MapTwoColumns(reader);

                    if (provider.LocationTypes == null)
                    {
                        provider.LocationTypes = new List<TwoColumn>();
                    }

                    provider.LocationTypes.Add(providerTypes);
                    break;
            }
        }

        private static TwoColumn MapTwoColumns(IDataReader reader)
        {
            TwoColumn twoColumn = new TwoColumn();
            int startingIndex = 0;

            twoColumn.Id = reader.GetSafeInt32(startingIndex++);
            twoColumn.Name = reader.GetSafeString(startingIndex++);
            return twoColumn;
        }
    }
}
