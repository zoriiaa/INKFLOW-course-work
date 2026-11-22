namespace INKFLOW.DTOs;
using System.ComponentModel.DataAnnotations;

public class UserRegisterDto
{
    [Required]
    public string Username { get; set; } = string.Empty;
    [Required(AllowEmptyStrings = false)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
}