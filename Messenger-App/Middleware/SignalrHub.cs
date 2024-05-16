using Messenger_App.DB;
using Messenger_App.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;

namespace Messenger_App.Middleware
{
    public class SignalrHub : Hub
    {
        public static Dictionary<string, string> UsersList = new Dictionary<string, string>();
        private readonly ApplicationDbContext _context;
        public SignalrHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public static string GetConnectionId(string userId)
        {
            if (UsersList.ContainsKey(userId))
            {
                return UsersList[userId];
            }
            else return null;
        }

        public override async Task OnConnectedAsync()
        {

            var token = Context.GetHttpContext().Request.Query["access_token"];
            if (!string.IsNullOrEmpty(token))
            {
                var handler = new JwtSecurityTokenHandler();
                var tokenS = handler.ReadToken(token) as JwtSecurityToken;

                if (tokenS != null)
                {
                    var userId = tokenS.Claims.FirstOrDefault(claim => claim.Type == "Id")?.Value;
                    var user = _context.Users.Where(u => u.Id == userId).FirstOrDefault();
                    if (user != null)
                    {
                        user.IsOnline = true;
                        user.lastOnlineDate = DateTime.UtcNow;
                        await _context.SaveChangesAsync();
                    }
                    // Добавляем пользователя в UsersList
                    if (!string.IsNullOrEmpty(userId))
                    {
                        UsersList[userId] = Context.ConnectionId;
                    }
                }
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = UsersList.FirstOrDefault(x => x.Value == Context.ConnectionId).Key;

            if (!string.IsNullOrEmpty(userId))
            {
                UsersList.Remove(userId);
            }
            var user = _context.Users.Where(u => u.Id == userId).FirstOrDefault();
            if (user != null)
            {
                user.IsOnline = false;
                user.lastOnlineDate = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}