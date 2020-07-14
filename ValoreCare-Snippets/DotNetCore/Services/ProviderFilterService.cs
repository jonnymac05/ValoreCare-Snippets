using Newtonsoft.Json.Linq;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.LookUp;
using Sabio.Models.Domain.Provider;
using Sabio.Models.Domain.ProviderFilter;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Text.RegularExpressions;
using Certification = Sabio.Models.Domain.ProviderFilter.Certification;
using License = Sabio.Models.Domain.ProviderFilter.License;
using ProviderProfile = Sabio.Models.Domain.ProviderFilter.ProviderProfile;
using ScheduleAvailability = Sabio.Models.Domain.ProviderFilter.ScheduleAvailability;

namespace Sabio.Services
{
    public class ProviderFilterService : IProviderFilterService
    {
        IDataProvider _data = null;

        public ProviderFilterService(IDataProvider data)
        {
            _data = data;
        }

        public ProviderDetails SelectByProviderId(int id)
        {
            string procName = "[dbo].[ProviderDetails_SelectById_V4]";
            ProviderDetails details = new ProviderDetails();

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {

                parameterCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int index = 0;
                details.UserProfile = reader.DeserializeObject<List<BaseUserProfile>>(index++);
                details.ProviderProfile = reader.DeserializeObject<List<ProviderProfile>>(index++);
                details.ScheduleAvailability = reader.DeserializeObject<List<ScheduleAvailability>>(index++);
                details.EducationDetails = reader.DeserializeObject<List<Education>>(index++);
                details.ExperienceDetails = reader.DeserializeObject<List<Experience>>(index++);
                details.Licenses = reader.DeserializeObject<List<ProviderLicense>>(index++);
                details.Certifications = reader.DeserializeObject<List<ProviderCertification>>(index++);
                details.ProviderCare = reader.DeserializeObject<List<TwoColumn>>(index++);
                details.ProviderConcern = reader.DeserializeObject<List<TwoColumn>>(index++);
                details.ProviderHelp = reader.DeserializeObject<List<TwoColumn>>(index++);
                details.ProviderExpertise = reader.DeserializeObject<List<TwoColumn>>(index++);
                details.ProviderLanguages = reader.DeserializeObject<List<TwoColumn>>(index++);
                details.ProviderPhones = reader.DeserializeObject<List<UserPhone>>(index++);
                details.ProviderLocation = reader.DeserializeObject<List<ProviderLocation>>(index++);
            }
            );

            return details;
        }

        public Paged<ProviderFilter> QueryProviders(int pageIndex, int pageSize, float latitude, float longitude, string json, int radius)
        {
            Paged<ProviderFilter> pagedResult = null;

            List<ProviderFilter> result = null;

            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[UserProfiles_Filter_V2]", inputParamMapper: delegate (SqlParameterCollection parameterCollection)
             {
                 parameterCollection.AddWithValue("@PageIndex", pageIndex);
                 parameterCollection.AddWithValue("@PageSize", pageSize);
                 parameterCollection.AddWithValue("@Latitude", latitude);
                 parameterCollection.AddWithValue("@Longitude", longitude);
                 parameterCollection.AddWithValue("@JSON", json);
                 parameterCollection.AddWithValue("@Radius", radius);
             },
              singleRecordMapper: delegate (IDataReader reader, short set)
              {
                  ProviderFilter providerfilter = new ProviderFilter();
                  int index = 0;

                  providerfilter.Id = reader.GetSafeInt32(index++);
                  providerfilter.UserId = reader.GetSafeInt32(index++);
                  providerfilter.FirstName = reader.GetSafeString(index++);
                  providerfilter.LastName = reader.GetSafeString(index++);
                  providerfilter.Mi = reader.GetSafeString(index++);
                  providerfilter.AvatarUrl = reader.GetSafeString(index++);
                  providerfilter.DateCreated = reader.GetSafeDateTime(index++);
                  providerfilter.DateModified = reader.GetSafeDateTime(index++);
                  providerfilter.Phone = reader.DeserializeObject<List<PhoneNumber>>(index++);
                  providerfilter.Title = reader.GetSafeString(index++);
                  providerfilter.Summary = reader.GetSafeString(index++);
                  providerfilter.Bio = reader.GetSafeString(index++);
                  providerfilter.Price = reader.GetSafeDecimal(index++);
                  providerfilter.IsActive = reader.GetSafeBool(index++);
                  providerfilter.Certifications = reader.DeserializeObject<List<Certification>>(index++);
                  providerfilter.Expertise = reader.DeserializeObject<List<TwoColumn>>(index++);
                  providerfilter.Licenses = reader.DeserializeObject<List<License>>(index++);
                  providerfilter.Languages = reader.DeserializeObject<List<TwoColumn>>(index++);
                  providerfilter.Locations = reader.DeserializeObject<List<Loc>>(index++);
                  providerfilter.CareNeeds = reader.DeserializeObject<List<TwoColumn>>(index++);
                  providerfilter.Concerns = reader.DeserializeObject<List<TwoColumn>>(index++);
                  providerfilter.Ratings = reader.DeserializeObject<List<Rating>>(index++);
                  providerfilter.AverageRating = reader.GetSafeDecimal(index++);
                  providerfilter.HelperNeeds = reader.DeserializeObject<List<TwoColumn>>(index++);
                  providerfilter.ExperienceDetails = reader.DeserializeObject<List<Experience>>(index++);
                  providerfilter.Distance = reader.GetSafeDouble(index++);

                  if (totalCount == 0)
                  {
                      totalCount = reader.GetSafeInt32(index++);
                  }


                  if (result == null)
                  {
                      result = new List<ProviderFilter>();
                  }

                  result.Add(providerfilter);
              }
            );
            if (result != null)
            {
                pagedResult = new Paged<ProviderFilter>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }
    }
}
