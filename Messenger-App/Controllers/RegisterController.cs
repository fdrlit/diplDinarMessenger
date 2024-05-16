using Messenger_App.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Messenger_App.ApiModels;
using Messenger_App.Middleware;
using System.Text.Encodings.Web;
using Messenger_App.Services;
using Microsoft.AspNetCore.Authorization;
using System.Net.NetworkInformation;
using System.Security.Cryptography;
using Messenger_App.DB;
using Messenger_App.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Messenger_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public RegisterController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _context = context;
            _configuration = configuration;
        }
        private async Task<string> GenerateNewIdAsync<T>(DbSet<T> dbSet) where T : class, IIdentifiable
        {
            var lastItem = await dbSet.OrderByDescending(e => e.Id).FirstOrDefaultAsync();
            long maxId = lastItem != null ? long.Parse(lastItem.Id) : 0;
            return (maxId + 1).ToString();
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {

            if (ModelState.IsValid)
            {
                if (await _userManager.FindByEmailAsync(model.Email) != null)
                    return BadRequest(new { Message = "email already exists" });

                if (await _userManager.FindByNameAsync(model.Username) != null)
                    return BadRequest(new { Message = "username already exists" });
                var lastMsg = _context.Users.OrderByDescending(m => m.CreateDate).FirstOrDefault();
                string maxId;
                if (lastMsg == null)
                {
                    maxId = "0";
                } else maxId = lastMsg.Id;
                var user = new ApplicationUser
                {
                    Id = (long.Parse(maxId) + 1).ToString(),
                    UserName = model.Username,
                    Email = model.Email,
                    CreateDate = DateTime.UtcNow
                };
                var result = await _userManager.CreateAsync(user, model.Password);
                
                if (result.Succeeded)
                {
                    var JWT = new JWT(_configuration);
                    var token = JWT.GenerateJwtToken(user);
                    return Ok(new { Token = token });
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
                
            }

            return BadRequest(ModelState);
        }
    }
}
