using INKFLOW.Data;
using INKFLOW.Models;
using Microsoft.EntityFrameworkCore;
using INKFLOW.Services.Interfaces;

namespace INKFLOW.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> CreateOrderAsync(int userId)
    {
        var cartItems = await _context.CartItems
            .Where(c => c.UserId == userId)
            .Include(c => c.Product)
            .ToListAsync();

        if (!cartItems.Any()) return null;

        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            Status = OrderStatus.Комплектується, 
            TotalPrice = cartItems.Sum(ci => ci.Quantity * ci.Product.Price),
            OrderItems = cartItems.Select(ci => new OrderItem
            {
                ProductId = ci.ProductId,
                Quantity = ci.Quantity,
                PriceAtTime = ci.Product.Price 
            }).ToList()
        };

        _context.Orders.Add(order);
        _context.CartItems.RemoveRange(cartItems);
        await _context.SaveChangesAsync();

        return order;
    }
    
    public async Task<List<Order>> GetUserOrdersAsync(int userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
    }
}