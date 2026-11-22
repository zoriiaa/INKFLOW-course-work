using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace INKFLOW.Models;
[Index(nameof(CategoryId))]
[Index(nameof(BrandId))]

public class Product
{
    
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    [MaxLength(200)]
    public string Name{ get; set; } = string.Empty;
    public string? Description{ get; set; } = string.Empty;
    [Precision(10, 2)]
    public decimal Price { get; set; }
    public string? Color { get; set; } 
    public int Stock { get; set; }
    
    public float? Thickness { get; set; }
    public float? Density { get; set; }
    public string? Specification { get; set; }
    public string? Size { get; set; }
    public string? Hardness { get; set; }
    
    public Brand? Brand { get; set; }
    public int BrandId { get; set; }
    public Category? Category { get; set; }
    public int CategoryId { get; set; }
    
}