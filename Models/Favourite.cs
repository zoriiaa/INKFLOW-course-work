namespace INKFLOW.Models;
using System.ComponentModel.DataAnnotations.Schema;

public class Favourite
{
    public int Id { get; set; }
    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    [ForeignKey("Product")]
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
}