using INKFLOW.Services.Interfaces;
using INKFLOW.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace INKFLOW.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    private readonly IBrandsService _brandsService;

    public BrandsController(IBrandsService brandsService)
    {
        _brandsService = brandsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetBrands()
    {
        var brands = await _brandsService.GetBrandsAsync();
        return Ok(brands);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateBrand([FromBody] BrandCreateDto dto)
    {
        var brand = await _brandsService.CreateBrandAsync(dto.Name);
        if (brand == null)
            return Conflict(new { message = "Бренд із такою назвою вже існує." });

        return Ok(brand);
    }
}