using FileServer.Models;
using Messenger_App.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace Messenger_App.DB
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<Message> Messages { get; set; }
        public DbSet<DeletedMessages> DeletedMessages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<FileServer.Models.File> Files { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }

    }
}
