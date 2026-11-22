using System.ComponentModel.DataAnnotations;

namespace INKFLOW.DTOs;

public class BrandCreateDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
