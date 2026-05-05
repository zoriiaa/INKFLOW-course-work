namespace INKFLOW.DTOs;

public class CartResponseDto
{
    public List<CartItemDto> Items { get; set; } = new();
    public decimal GrandTotal => Items.Sum(x => x.TotalPrice);
}