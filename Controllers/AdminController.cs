using INKFLOW.Data;
using INKFLOW.DTOs;
using INKFLOW.Models;
using INKFLOW.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace INKFLOW.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IOrderService _orderService;
    private readonly IMapper _mapper;

    public AdminController(AppDbContext context, IOrderService orderService, IMapper mapper)
    {
        _context = context;
        _orderService = orderService;
        _mapper = mapper;
    }
    
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.Role,
                u.CreatedAt
            })
            .ToListAsync();

        return Ok(users);
    }
    
    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound("Користувача не знайдено");

        user.Role = dto.Role;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Роль змінено на {dto.Role}" });
    }
    
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Include(o => o.User)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        var result = _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
        return Ok(result);
    }
    
    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> ChangeOrderStatus(int id, [FromBody] ChangeOrderStatusDto dto)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound("Замовлення не знайдено");

        if (!Enum.TryParse<OrderStatus>(dto.Status, out var newStatus))
            return BadRequest("Невідомий статус");

        order.Status = newStatus;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Статус оновлено: {dto.Status}" });
    }
    
   
}