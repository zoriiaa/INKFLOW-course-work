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
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        user.Role = dto.Role;
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
}