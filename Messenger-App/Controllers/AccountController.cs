using Messenger_App.ApiModels;
using Messenger_App.DB;
using Messenger_App.Middleware;
using Messenger_App.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text.Json;

namespace Messenger_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        public AccountController
            (
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context,
            IConfiguration configuration,
            HttpClient httpClient
            )
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
            _httpClient = httpClient;
        }

        [Authorize]
        [HttpGet]
        [Route("receiveUserInfo")]
        public async Task<IActionResult> ReceiveUserInfo()
        {
            var userId = User.FindFirst("Id")?.Value;
            var user = _context.Users.Where(u => u.Id == userId).FirstOrDefault();
            var result = new
            {
                user.FirstName,
                user.LastName,
                user.Bio,
                user.UserName,
                AvatarUrl = user.Avatars != null ? user.Avatars[user.Avatars.Count - 1] : null,
            };

            var jsonResult = JsonConvert.SerializeObject(result);
            return Ok(jsonResult);
        }

        [Authorize]
        [HttpGet]
        [Route("isUserNameAvailable")]
        public async Task<IActionResult> IsUserNameAvailable(string userName)
        {
            var userExists = _context.Users.Any(u => u.UserName == userName);

            return Ok(!userExists);
        }

        [Authorize]
        [HttpPost]
        [Route("UpdateUserInfo")]
        public async Task<IActionResult> UpdateUserInfo([FromBody] UpdateUserInfoModel model)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            var userId = User.FindFirst("Id")?.Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Bio = model.Bio;
            user.UserName = model.UserName;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok();
        }
        [Authorize]
        [HttpPost]
        [Route("UpdateUserAvatar")]
        public async Task<IActionResult> UpdateUserInfo()
        {
            var userId = User.FindFirst("Id")?.Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            var file = Request.Form.Files[0];
            var fileServerUrl = "https://localhost:7253/uploadFile";
            using (var formData = new MultipartFormDataContent())
            using (var stream = file.OpenReadStream())
            {
                formData.Add(new StreamContent(stream), "avatar", file.FileName);

                // Отправляем запрос на другой сервер
                var response = await _httpClient.PostAsync(fileServerUrl, formData);

                // Проверяем успешность запроса
                response.EnsureSuccessStatusCode();

                // Читаем ответ от сервера
                var responseContent = await response.Content.ReadAsStringAsync();

                using (JsonDocument doc = JsonDocument.Parse(responseContent))
                {
                    if (doc.RootElement.TryGetProperty("hash", out JsonElement hashElement))
                    {
                        string hash = hashElement.GetString();
                        if (user.Avatars == null)
                            user.Avatars = new List<string>();
                        user.Avatars.Add(hash);
                        _context.Users.Update(user);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        // Поле hash отсутствует в JSON
                    }
                }

                return Ok();
            }
        }
    }
}