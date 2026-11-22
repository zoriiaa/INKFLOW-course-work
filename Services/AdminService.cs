using INKFLOW.Data;
using INKFLOW.DTOs;
using INKFLOW.Models;
using INKFLOW.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace INKFLOW.Services;

public class AdminService : IAdminService
{
    private readonly AppDbContext _context;

    public AdminService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<object>> GetAllUsersAsync()
    {
        return await _context.Users
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.Role,
                u.CreatedAt
            })
            .Cast<object>()
            .ToListAsync();
    }

    public async Task<bool> ChangeRoleAsync(int id, ChangeRoleDto dto)
    {
        if (dto.Role != "User" && dto.Role != "Admin") return false;
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        user.Role = dto.Role;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<Order>> GetAllOrdersAsync()
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.User)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
    }

    public async Task<bool> ChangeOrderStatusAsync(int id, ChangeOrderStatusDto dto)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return false;

        if (!Enum.TryParse<OrderStatus>(dto.Status, out var newStatus))
            return false;

        order.Status = newStatus;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteOrderAsync(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return false;

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<MonthlyRevenueDto>> GetMonthlyRevenueAsync()
    {
        return await _context.Orders
            .Where(order => order.Status != OrderStatus.Скасовано)
            .GroupBy(order => new { order.OrderDate.Year, order.OrderDate.Month })
            .Select(group => new MonthlyRevenueDto
            {
                Year = group.Key.Year,
                Month = group.Key.Month,
                Revenue = group.Sum(order => order.TotalPrice)
            })
            .OrderByDescending(item => item.Year)
            .ThenByDescending(item => item.Month)
            .ToListAsync();
    }

    public async Task<List<TopProductSalesDto>> GetTopProductsAsync()
    {
        return await _context.OrderItems
            .Where(item => item.Order.Status != OrderStatus.Скасовано)
            .GroupBy(item => new { item.ProductId, item.Product.Name })
            .Select(group => new TopProductSalesDto
            {
                ProductId = group.Key.ProductId,
                ProductName = group.Key.Name,
                QuantitySold = group.Sum(item => item.Quantity),
                Revenue = group.Sum(item => item.PriceAtTime * item.Quantity)
            })
            .OrderByDescending(item => item.QuantitySold)
            .ThenBy(item => item.ProductName)
            .Take(5)
            .ToListAsync();
    }

    public async Task<List<OrdersByStatusDto>> GetOrdersByStatusAsync()
    {
        var counts = await _context.Orders
            .GroupBy(order => order.Status)
            .Select(group => new { Status = group.Key, Count = group.Count() })
            .ToListAsync();

        var countsByStatus = counts.ToDictionary(item => item.Status, item => item.Count);
        return Enum.GetValues<OrderStatus>()
            .Select(status => new OrdersByStatusDto
            {
                Status = status.ToString(),
                Count = countsByStatus.GetValueOrDefault(status)
            })
            .OrderBy(item => item.Status)
            .ToList();
    }
}