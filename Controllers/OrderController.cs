using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using INKFLOW.Services.Interfaces;
using AutoMapper;
using INKFLOW.DTOs;

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
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();
        
        var order = await _orderService.CreateOrderAsync(userId.Value);
        
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
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized("Ви не залогінені!");
        
        var orders = await _orderService.GetUserOrdersAsync(userId.Value);
    
        var ordersDto = _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
        return Ok(ordersDto);
    }
}
