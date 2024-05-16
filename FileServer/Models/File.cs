using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FileServer.Models
{
    [Table("File")]
    public class File
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string FilePath { get; set; }
        [Required]
        public string FileType { get; set; }
        [Required]
        public string FileHash { get; set; }
        [Required]
        public long FileSize { get; set; }
    }
}
