using INKFLOW.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace INKFLOW.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _categoryService.GetCategoriesAsync();
        var result = categories
            .Select(c => new 
            { 
                c.Id, 
                c.Name, 
                c.ParentCategoryId 
            })
            .ToList();

        return Ok(result);
    }
}