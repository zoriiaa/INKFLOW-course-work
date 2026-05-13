using INKFLOW.DTOs;
using INKFLOW.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
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
    public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
    {
        var token = await _authService.LoginAsync(loginDto);

        if (token == null)
        {
            return Unauthorized("Неправильний Email або пароль");
        }

        return Ok(new { token });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var profile = await _authService.GetProfileAsync(userId.Value);
        return profile == null ? NotFound() : Ok(profile);
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UserProfileUpdateDto updateDto)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var result = await _authService.UpdateProfileAsync(userId.Value, updateDto);
        if (result.Error != null) return BadRequest(result.Error);

        return Ok(new { profile = result.Profile, token = result.Token });
    }
}
