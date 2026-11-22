namespace INKFLOW.DTOs;
using System.ComponentModel.DataAnnotations;

public class ProductCreateDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    [Range(typeof(decimal), "0", "99999999")]
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; } 
    
    public int CategoryId { get; set; }
    public int BrandId { get; set; }
    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
    public float? Thickness { get; set; }
    public float? Density { get; set; }
    public string? Color { get; set; }
    public string? Hardness { get; set; }
    public string? Size { get; set; }
    public string? Specification { get; set; }
}
