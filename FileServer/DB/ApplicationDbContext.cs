using FileServer.Models;
using Microsoft.EntityFrameworkCore;

namespace FileServer.DB
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<Models.File> Files { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }

    }
}
