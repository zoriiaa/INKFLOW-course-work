namespace INKFLOW.DTOs;

public class ProductFilterDto
{
    public int MinPrice { get; set; }
    public int MaxPrice { get; set; }
    public int BrandId { get; set; }
    public int CategoryId { get; set; }
}