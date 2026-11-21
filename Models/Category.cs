using System.ComponentModel.DataAnnotations;

namespace INKFLOW.Models;

public class Category
{
    public int Id { get; set; }
    [MaxLength(100)]
    public string Name{ get; set; } = string.Empty;
    public int? ParentCategoryId { get; set; }
    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();
}