using INKFLOW.Services.Interfaces;
using INKFLOW.DTOs;
using Microsoft.AspNetCore.Authorization;
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

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryCreateDto dto)
    {
        var category = await _categoryService.CreateCategoryAsync(dto.Name, dto.ParentCategoryId);
        if (category == null)
            return BadRequest(new { message = "Перевірте назву та батьківську категорію." });

        return Ok(new { category.Id, category.Name, category.ParentCategoryId });
    }
}