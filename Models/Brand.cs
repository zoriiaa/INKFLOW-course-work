using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace INKFLOW.Models;
[Index(nameof(Name), IsUnique = true)]

public class Brand
{
    public int Id { get; set; }
    [MaxLength(100)]
    public string Name{ get; set; } = string.Empty;
}