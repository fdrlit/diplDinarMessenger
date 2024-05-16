using Messenger_App.Interfaces;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Messenger_App.Models
{
    [Table("applicationuser")]
    public class ApplicationUser : IdentityUser, IIdentifiable
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
        public ICollection<Group> Groups { get; set; }
        public DateTime CreateDate { get; set; }
        public bool IsOnline { get; set; }
        public DateTime lastOnlineDate { get; set; }
        public List<string>? Avatars { get; set; }
    }
}
