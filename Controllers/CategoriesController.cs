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

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryCreateDto dto)
    {
        var result = await _categoryService.UpdateCategoryAsync(id, dto.Name, dto.ParentCategoryId);
        return result switch
        {
            CatalogMutationResult.Success => Ok(new { message = "Категорію оновлено." }),
            CatalogMutationResult.NotFound => NotFound(new { message = "Категорію не знайдено." }),
            _ => BadRequest(new { message = "Перевірте назву та батьківську категорію." })
        };
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var result = await _categoryService.DeleteCategoryAsync(id);
        return result switch
        {
            CatalogMutationResult.Success => Ok(new { message = "Категорію видалено." }),
            CatalogMutationResult.NotFound => NotFound(new { message = "Категорію не знайдено." }),
            CatalogMutationResult.HasDependencies => BadRequest(new { message = "Неможливо видалити категорію, до якої прив'язані товари або підкатегорії." }),
            _ => BadRequest()
        };
    }
}