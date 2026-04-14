using INKFLOW.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace INKFLOW.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet] 
    public async Task<IActionResult> GetCatalog([FromQuery] int? categoryId, [FromQuery] int? brandId)
    {
        var products = await _productService.GetCatalogAsync(categoryId, brandId);
        return Ok(products);
    }

    [HttpGet("{id}")] 
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }
}
