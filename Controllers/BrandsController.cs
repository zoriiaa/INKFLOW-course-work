using INKFLOW.Services.Interfaces;
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
}