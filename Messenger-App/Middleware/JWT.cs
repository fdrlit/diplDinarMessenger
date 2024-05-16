using Messenger_App.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Messenger_App.Middleware
{
    public class JWT
    {
        private readonly IConfiguration _configuration;

        public JWT(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new[]
            {
                new Claim("Id", user.Id), // 3 4
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
