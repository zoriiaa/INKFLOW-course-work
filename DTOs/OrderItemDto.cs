namespace INKFLOW.DTOs;

public class OrderItemDto
{
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public decimal PriceAtPurchase { get; set; }
        public int Quantity { get; set; }
}