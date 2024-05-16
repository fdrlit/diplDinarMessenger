using Messenger_App.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Messenger_App.Models
{
    [Table("Message")]
    public class Message : IIdentifiable
    {
        [Key]
        public string Id { get; set; }
        public string RecipientId { get; set; }
        public string RecipientType { get; set; }
        [Required]
        public DateTime CreateDate { get; set; }
        [Required]
        public string EncryptedText { get; set; }
        public virtual ApplicationUser Sender { get; set; }

        public string? ReplyMessageId { get; set; }
        public List<string>? Files { get; set; }
        public List<string>? Images { get; set; }
        public bool ReadStatus{ get; set; }
    }
}