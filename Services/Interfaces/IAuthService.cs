using INKFLOW.DTOs;

namespace INKFLOW.Services.Interfaces;

public interface IAuthService
{
    Task<string?> RegisterAsync(UserRegisterDto registerDto);
    Task<string?> LoginAsync(UserLoginDto loginDto);
    Task<UserProfileDto?> GetProfileAsync(int userId);
    Task<(UserProfileDto? Profile, string? Token, string? Error)> UpdateProfileAsync(int userId, UserProfileUpdateDto updateDto);
}
