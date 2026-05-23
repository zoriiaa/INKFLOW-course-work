namespace INKFLOW.DTOs;
using System.ComponentModel.DataAnnotations;

public class UserRegisterDto
{
    public string Username { get; set; } = string.Empty;
    [Required(AllowEmptyStrings = false)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
}