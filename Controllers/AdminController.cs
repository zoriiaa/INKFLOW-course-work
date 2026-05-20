using INKFLOW.DTOs;
using INKFLOW.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;

namespace INKFLOW.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly IOrderService _orderService;
    private readonly IMapper _mapper;

    public AdminController(IAdminService adminService, IOrderService orderService, IMapper mapper)
    {
        _adminService = adminService;
        _orderService = orderService;
        _mapper = mapper;
    }
    
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }
    
    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleDto dto)
    {
        var result = await _adminService.ChangeRoleAsync(id, dto);
        if (!result) return NotFound(new { message = "Користувача не знайдено" });

        return Ok(new { message = $"Роль змінено на {dto.Role}" });
    }
    
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _adminService.GetAllOrdersAsync();
        var result = _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
        return Ok(result);
    }
    
    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> ChangeOrderStatus(int id, [FromBody] ChangeOrderStatusDto dto)
    {
        var result = await _adminService.ChangeOrderStatusAsync(id, dto);
        if (!result) return NotFound(new { message = "Замовлення не знайдено або невідомий статус" });

        return Ok(new { message = $"Статус оновлено: {dto.Status}" });
    }
}