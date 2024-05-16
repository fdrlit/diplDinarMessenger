using Messenger_App.ApiModels;
using Messenger_App.Interfaces;
using Messenger_App.Models;
using Messenger_App.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace Messenger_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailConfirmController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        
        public EmailConfirmController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration, IEmailSender emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailSender = emailSender;
        }

        [HttpGet("isemailconfirmed")]
        [Authorize]
        public async Task<IActionResult> IsEmailConfirmed()
        {
            var userId = User.FindFirst("Id")?.Value;
            var user = await _userManager.FindByIdAsync(userId);

            return Ok(new { emailConfirmed = user.EmailConfirmed });
        }
        
        [AllowAnonymous] 
        [HttpPost]
        public async Task<IActionResult> ConfirmEmail(EmailConfirmModel model)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);

                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var callbackUrl = Url.Action("ConfirmEmail", "EmailConfirm", new { userId = user.Id, code, successCallBackUrl = model.successCallbackUrl, errorCallBackUrl = model.errorCallbackUrl }, protocol: HttpContext.Request.Scheme);
                await _emailSender.SendEmailAsync(user.Email, "Подтвердите свою электронную почту",
                    $"Пожалуйста, подтвердите свою учетную запись, <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>нажав здесь</a>.");
                return Ok( new { Message = "message sent"});
            } catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }

        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> ConfirmEmail(string userId, string code, string successCallBackUrl, string errorCallBackUrl)
        {
            if (userId == null || code == null)
            {
                return Redirect(errorCallBackUrl);
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Redirect(errorCallBackUrl);
            }

            var result = await _userManager.ConfirmEmailAsync(user, code);
            if (result.Succeeded)
            {
                // Успешное подтверждение
                return Redirect(successCallBackUrl);
            }
            else
            {
                // Обработка ошибок подтверждения
                return Redirect(errorCallBackUrl);
            }

        }

        [HttpPost("resend")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserEmail(EmailConfirmByIdModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = User.FindFirst("Id")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var callbackUrl = Url.Action("ConfirmEmail", "EmailConfirm", new { userId = user.Id, code, model.successCallbackUrl, model.errorCallbackUrl }, protocol: HttpContext.Request.Scheme);

            await _emailSender.SendEmailAsync(user.Email, "Подтвердите свою электронную почту",
                $"Пожалуйста, подтвердите свою учетную запись, <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>нажав здесь</a>.");

            return Ok("Письмо с подтверждением отправлено");
        }

    }
}
