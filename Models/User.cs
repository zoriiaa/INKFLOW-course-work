using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace INKFLOW.Models;
[Index(nameof(Email), IsUnique = true)]

public class User
{
    public int Id { get; set; }
    [MaxLength(255)]
    public string Email{ get; set; } = string.Empty;
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Role { get; set; } = "User"; 
}