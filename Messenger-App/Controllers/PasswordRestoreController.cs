using Messenger_App.ApiModels;
using Messenger_App.Interfaces;
using Messenger_App.Models;
using Messenger_App.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Encodings.Web;
using System.Web;

namespace Messenger_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordRestoreController : Controller
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;

        public PasswordRestoreController(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            IEmailSender emailSender
            )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
            _emailSender = emailSender;
        }
        [HttpPost("restore")]
        [AllowAnonymous]
        public async Task<IActionResult> RestorePassword([FromBody] PasswordRestoreModel model)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            var user = await _userManager.FindByIdAsync(model.id);
            var result = await _userManager.ResetPasswordAsync(user, model.code, model.newPassword);

            if (result.Succeeded)
            {
                return Ok();
            } else
            {
                return Unauthorized();
            }
        }
        [HttpPost("getLinkOnEmail")]
        [AllowAnonymous]
        public async Task<IActionResult> IsEmailConfirmed([FromBody] PasswordRestoreRequestModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.FindByNameAsync(model.emailOrUsername);

            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(model.emailOrUsername);
            }

            if (user == null)
            {
                return BadRequest(new { message = "user not found" });
            }

            if (!user.EmailConfirmed)
            {
                return BadRequest(new { message = "email not confirmed"});
            }

            var userId = user.Id;

            try
            {
                var code = await _userManager.GeneratePasswordResetTokenAsync(user);

                await _emailSender.SendEmailAsync(user.Email, "Восстановление пароля",
                    $"Для установления нового пароля перейдите по ссылке: <a href='{model.clientUrl + "?token=" + WebUtility.UrlEncode(code) + "&id=" + userId}'>Восстановить пароль</a>.");
                return Ok(new { Message = "message sent" });
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

    }
}
