namespace INKFLOW.Models;

public class Product
{
    
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string Name{ get; set; } = string.Empty;
    public string Description{ get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Color { get; set; } 
    public int Stock { get; set; }
    public float? Thickness { get; set; }
    public float? Density { get; set; }
    
    public Brand? Brand { get; set; }
    public int BrandId { get; set; }
    public Category? Category { get; set; }
    public int CategoryId { get; set; }
    
}