using Messenger_App.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Messenger_App.Middleware;
using Messenger_App.ApiModels;
using Microsoft.AspNetCore.Authorization;
namespace Messenger_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public LoginController(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration
            )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
        }
        
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await GetUserByEmailOrUsernameAsync(model.EmailOrUsername);
                // aynur loh
                if (user != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);

                    if (result.Succeeded)
                    {
                        var JWT = new JWT(_configuration);
                        var token = JWT.GenerateJwtToken(user);
                        return Ok(new { Token = token });
                    }
                }

            }

            return Unauthorized(new { Message = "Invalid login credentials" });
        }
        [Authorize]
        [HttpGet]
        [Route("receive-user-id")]
        public async Task<IActionResult> ReceiveUserId()
        {
            var userId = User.FindFirst("Id")?.Value;
            if (userId == null)
                return BadRequest();
            else return Ok(new {  userId });
        }

        private async Task<ApplicationUser> GetUserByEmailOrUsernameAsync(string emailOrUsername)
        {
            var user = await _userManager.FindByEmailAsync(emailOrUsername);

            if (user == null)
            {
                user = await _userManager.FindByNameAsync(emailOrUsername);
            }

            return user;
        }
    }
}
