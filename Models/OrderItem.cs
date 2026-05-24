namespace INKFLOW.Models;
using System.ComponentModel.DataAnnotations.Schema;

public class OrderItem
{
    public int Id { get; set; }
    [ForeignKey("Order")]
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public Product Product { get; set; } = null!;
    [ForeignKey("Product")]
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal PriceAtTime { get; set; }
    
}