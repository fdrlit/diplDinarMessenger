using Messenger_App.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Messenger_App.Models
{
    [Table("Group")]
    public class Group : IIdentifiable
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public DateTime CreateDate { get; set; }
        public string Name { get; set; }
        public ICollection<ApplicationUser> Users { get; set; }
    } 
}
