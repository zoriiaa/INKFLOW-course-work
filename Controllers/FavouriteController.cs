using AutoMapper;
using INKFLOW.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using INKFLOW.DTOs;
using INKFLOW.Models;

namespace INKFLOW.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FavouriteController : ControllerBase
{
    private readonly IFavouriteService _favouriteService;
    private readonly IMapper _mapper;

    public FavouriteController(IFavouriteService favouriteService, IMapper mapper)
    {
        _favouriteService = favouriteService;
        _mapper = mapper;
    }

    [HttpPost("{productId}")]
    public async Task<IActionResult> Add(int productId)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        await _favouriteService.AddToFavouritesAsync(userId.Value, productId);
        return Ok(new {message = "Товар успішно додано в обрані"});
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> Remove(int productId)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        await _favouriteService.RemoveFromFavouritesAsync(userId.Value, productId);
        return Ok(new {message = "Товар видалено з обраних :("});
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductCardDto>>> GetMyFavourites()
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var products = await _favouriteService.GetUserFavouritesAsync(userId.Value);
        
        var result = _mapper.Map<IEnumerable<ProductCardDto>>(products);
        return Ok(result);
    }
}
