using INKFLOW.DTOs;
using INKFLOW.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace INKFLOW.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
    {
        var result = await _authService.RegisterAsync(registerDto);
        if (!result)
        {
            return BadRequest("Користувач з таким Email вже існує");
        }
        return Ok("Реєстрація успішна!");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login ([FromBody] UserLoginDto loginDto)
    {
        var token = await _authService.LoginAsync(loginDto);

        if (token == null)
        {
            return Unauthorized("Неправильний Email або пароль");
        }
        return Ok(new{token});
    }
}