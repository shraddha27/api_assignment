The candidate must perform this test with NodeJS + RDBMS (for database only).
1. User CRUD operations (user can only create and update category and product) 2. Category Master with CRUD operations
3. Product Master with CRUD operations. A product belongs to a category.
4. Bulk upload for products (it has to be used for large sets of data without getting 504) 5. Download the report for the product in CSV or XLSX format (it has to be used for downloading large sets of data without getting 504)
a. Column needed: category name, product name, product price, product uniqueld
The product list API must have
⚫ It should have pagination on the server side.
⚫ It should have an order of ascending and descending on product price. • Implement search on the category name and product name
NOTE:
Fields for
⚫
You have to use the RDBMS database only.
• You have to attched postman collection for the API
User: email, password (encrypted)
Category: name, uniqueld(auto-generated by system)
Product: name, product image, product price, uniqueld(auto-generated by system), (product belongs to category)