using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using INKFLOW.Services.Interfaces;
using System.Security.Claims;
using INKFLOW.Services;

namespace INKFLOW.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService  orderService)
    {
        _orderService = orderService;
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
}