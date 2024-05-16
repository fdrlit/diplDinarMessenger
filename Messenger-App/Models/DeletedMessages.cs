using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Messenger_App.Models
{
    [Table("DeletedMessages")]
    public class DeletedMessages
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public virtual ApplicationUser User { get; set; }
        public virtual Message Message { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
