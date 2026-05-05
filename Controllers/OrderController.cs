using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using INKFLOW.Services.Interfaces;
using System.Security.Claims;
using AutoMapper;
using INKFLOW.DTOs;
using INKFLOW.Services;

namespace INKFLOW.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IMapper _mapper;

    public OrderController(IOrderService  orderService, IMapper mapper)
    {
        _orderService = orderService;
        _mapper = mapper;
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
        
        var order = await _orderService.CreateOrderAsync(int.Parse(userIdStr));
        
        if(order == null) return BadRequest("Кошик порожній");

        return Ok(new 
        { 
            message = "Замовлення оформлено!", 
            orderId = order.Id, 
            totalAmount = order.TotalPrice 
        });
    }
    
    [HttpGet("my-orders")]
    public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetMyOrders()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized("Ви не залогінені!");

        var userId = int.Parse(userIdClaim.Value);
        
        var orders = await _orderService.GetUserOrdersAsync(userId);
    
        var ordersDto = _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
        return Ok(ordersDto);
    }
}