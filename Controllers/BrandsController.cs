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

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateBrand(int id, [FromBody] BrandCreateDto dto)
    {
        var result = await _brandsService.UpdateBrandAsync(id, dto.Name);
        return result switch
        {
            CatalogMutationResult.Success => Ok(new { message = "Бренд оновлено." }),
            CatalogMutationResult.NotFound => NotFound(new { message = "Бренд не знайдено." }),
            CatalogMutationResult.Conflict => Conflict(new { message = "Бренд із такою назвою вже існує." }),
            _ => BadRequest(new { message = "Некоректна назва бренду." })
        };
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBrand(int id)
    {
        var result = await _brandsService.DeleteBrandAsync(id);
        return result switch
        {
            CatalogMutationResult.Success => Ok(new { message = "Бренд видалено." }),
            CatalogMutationResult.NotFound => NotFound(new { message = "Бренд не знайдено." }),
            CatalogMutationResult.HasDependencies => BadRequest(new { message = "Неможливо видалити бренд, поки до нього прив'язані товари." }),
            _ => BadRequest()
        };
    }
}