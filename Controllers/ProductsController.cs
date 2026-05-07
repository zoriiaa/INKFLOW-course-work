using INKFLOW.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using INKFLOW.DTOs;

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
    public async Task<IActionResult> GetCatalog(
        [FromQuery] int? categoryId,
        [FromQuery] int? brandId,
        [FromQuery] string? searchTerm,
        [FromQuery] int pageNumber=1,
        [FromQuery] int pageSize=25)
        
        {
            var products = await _productService.GetCatalogAsync(categoryId, brandId,searchTerm, pageNumber, pageSize);
            return Ok(products);
        }

    [HttpGet("{id}")] 
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpPost("admin/create")] 
    public async Task<IActionResult> CreateProduct(ProductCreateDto dto)
    {
        
        await _productService.CreateProductAsync(dto);
        return Ok(new { message = "Товар успішно додано в базу!" });
    }

    [HttpDelete("admin/{id}")] 
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var deleted = await _productService.DeleteProductAsync(id);
        if (!deleted) return NotFound("Такого товару нема");
        return Ok(new { message = "Видалили!" });
    }
}
