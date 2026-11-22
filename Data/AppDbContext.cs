namespace INKFLOW.Data;
using INKFLOW.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext: DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Brand> Brands { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Favourite> Favourites { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.Property(o => o.Status)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.ToTable(t => t.HasCheckConstraint(
                "CK_Orders_Status",
                "\"Status\" IN ('Виконано', 'Комплектується', 'Скасовано')"));
        });
        
        modelBuilder.Entity<Product>().ToTable(t =>
        {
            t.HasCheckConstraint("CK_Products_Price", "\"Price\" >= 0");
            t.HasCheckConstraint("CK_Products_Stock", "\"Stock\" >= 0");
        });

        modelBuilder.Entity<CartItem>().ToTable(t =>
            t.HasCheckConstraint("CK_CartItems_Quantity", "\"Quantity\" > 0"));

        modelBuilder.Entity<OrderItem>().ToTable(t =>
            t.HasCheckConstraint("CK_OrderItems_Quantity", "\"Quantity\" > 0"));

        modelBuilder.Entity<User>().ToTable(t =>
            t.HasCheckConstraint("CK_Users_Role", "\"Role\" IN ('User', 'Admin')"));

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Brand)
            .WithMany()
            .HasForeignKey(p => p.BrandId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany()
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Category>()
            .HasOne(c => c.ParentCategory)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}