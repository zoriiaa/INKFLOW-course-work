namespace INKFLOW.DTOs;

public class ProductCardDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public string? BrandName { get; set; }  
    public string? CategoryName { get; set; }
}