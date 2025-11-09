@echo off
echo ========================================
echo    LaRama Database Setup Assistant    
echo ========================================
echo.

echo This script will help you set up your LaRama product database.
echo Make sure PostgreSQL is running before proceeding.
echo.

echo [1/3] Testing database connection...
psql -U postgres -d LaRama_db_advances -c "SELECT version();" >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo ✅ Database connection successful!
    echo.
    
    echo [2/3] Loading LaRama products...
    psql -U postgres -d LaRama_db_advances -f seed_products.sql
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Products loaded successfully!
        echo.
        
        echo [3/3] Verifying product data...
        psql -U postgres -d LaRama_db_advances -c "SELECT category, COUNT(*) as count FROM products WHERE is_active = true GROUP BY category ORDER BY category;"
        
        echo.
        echo ========================================
        echo     🎉 Setup Complete! 🎉
        echo ========================================
        echo.
        echo Your LaRama store is ready with:
        echo • Beautiful handcrafted purses
        echo • Decorative letter art  
        echo • Elegant neckties
        echo • Spiritual prayer beads
        echo • Stylish phone cases
        echo.
        echo Next steps:
        echo 1. Start the backend: npm run dev (in laRama_backend folder)
        echo 2. Start the frontend: npm run dev (in laRama_frontend folder)  
        echo 3. Visit: http://localhost:5173/products
        echo.
    ) else (
        echo ❌ Failed to load products. Check the error above.
    )
) else (
    echo ❌ Cannot connect to database. Please check:
    echo • PostgreSQL is running
    echo • Database 'LaRama_db_advances' exists  
    echo • Username/password are correct
    echo.
    echo To create the database, run:
    echo psql -U postgres -c "CREATE DATABASE LaRama_db_advances;"
)

echo.
echo Press any key to exit...
pause >nul