namespace INKFLOW.DTOs;

public class ProductDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int BrandId { get; set; }
    public string? BrandName { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }

    public float? Thickness { get; set; }
    public float? Density { get; set; }
    public string? Color { get; set; }
    public int Stock { get; set; }
    public string? Hardness { get; set; }
    public string? Size { get; set; }
    public string? Specification { get; set; }
}