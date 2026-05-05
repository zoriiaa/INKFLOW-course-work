namespace INKFLOW.Models;

public enum OrderStatus
{
    Виконано,
    Комплектується,
    Скасовано
}
public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime OrderDate { get; set; } =  DateTime.UtcNow;
    public decimal TotalPrice { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Комплектується;

    public List<OrderItem> OrderItems { get; set; } = new();
}