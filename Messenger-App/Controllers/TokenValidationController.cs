using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

[ApiController]
[Route("api/[controller]")]
public class TokenValidationController : ControllerBase
{
    [HttpGet("validate")]
    [Authorize] // Requires authentication
    public IActionResult ValidateToken()
    {        
        // If the control reaches here, the token is valid
        return Ok(new { message = "Token is valid" });
    }
}