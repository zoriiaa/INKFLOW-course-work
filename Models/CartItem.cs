namespace INKFLOW.Models;
using System.ComponentModel.DataAnnotations;

public class CartItem
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    [Range(1, 100)]
    public int Quantity { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
}