using INKFLOW.DTOs;

namespace INKFLOW.Services.Interfaces;

public interface IAuthService
{
    Task<bool> RegisterAsync(UserRegisterDto registerDto);
    Task<string?> LoginAsync(UserLoginDto loginDto);
}