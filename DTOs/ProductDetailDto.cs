namespace INKFLOW.DTOs;

public class ProductDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public string? BrandName { get; set; }
    public string? CategoryName { get; set; }
    
    
    public float? Thickness { get; set; }
    public float? Density { get; set; }
    public string? Color { get; set; }
    public int Stock { get; set; }
}