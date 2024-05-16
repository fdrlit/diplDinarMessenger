using Messenger_App.DB;
using Messenger_App.Interfaces;
using Messenger_App.Middleware;
using Messenger_App.Models;
using Messenger_App.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.Net.Mail;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("MainConnection")));

builder.Services.AddTransient<IEmailSender, EmailSender>(provider =>
{
    var smtpClient = new SmtpClient("smtp.yandex.com")
    {
        Port = 587,
        Credentials = new NetworkCredential("iwannadie103@yandex.ru", "znkdsomskequxjtf"),
        EnableSsl = true
    };
    return new EmailSender(smtpClient, builder.Configuration);
});

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.Password.RequireDigit = false;   // Требование цифры
        options.Password.RequireLowercase = false;   // Требование строчной буквы
        options.Password.RequireUppercase = false;   // Требование заглавной буквы
        options.Password.RequireNonAlphanumeric = false;   // Требование спецсимвола
        options.Password.RequiredLength = 8;   // Минимальная длина пароля

    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
builder.Services.AddHttpClient();
builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder
            .WithOrigins("https://localhost:44478")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.MapHub<SignalrHub>("/hub");

app.UseCors("AllowSpecificOrigin");
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapFallbackToFile("index.html"); ;

app.Run();
