using Sabio.Models.Domain.LookUp;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.ProviderFilter
{
    
    public class ProviderFilter
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mi { get; set; }
        public string AvatarUrl { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public List<PhoneNumber> Phone { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Bio { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
        #nullable enable
        public List<Certification>? Certifications { get; set; }
        public List<TwoColumn>? Expertise { get; set; }
        public List<License>? Licenses { get; set; }
        public List<TwoColumn>? Languages { get; set; }
        public List<Loc>? Locations { get; set; }
        public List<TwoColumn>? CareNeeds { get; set; }
        public List<TwoColumn>? Concerns { get; set; }
        public List<Rating>? Ratings { get; set; }
        public decimal? AverageRating { get; set; }
        public List<TwoColumn>? HelperNeeds { get; set; }
        public List<Experience>? ExperienceDetails { get; set; }
        public double? Distance { get; set; }
        #nullable restore

    }

}