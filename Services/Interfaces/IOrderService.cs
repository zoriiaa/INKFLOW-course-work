namespace INKFLOW.Services.Interfaces;
using INKFLOW.Models;

public interface IOrderService
{
    Task<Order?> CreateOrderAsync(int userId);
    Task<List<Order>> GetUserOrdersAsync(int userId);
}