Database migrations are a way to manage and apply changes to a database schema over time in
a structured and version-controlled manner. They allow developers to modify the database, such as 
adding or removing tables, columns, and constraints, without losing existing data. Migrations are useful
because they ensure consistency across different environments, enable easy rollback in case of errors, and
streamline collaboration among developers by maintaining a clear history of schema changes. Tools like Prisma
Migrate automate this process, making it easier to track and apply changes efficiently.

GraphQL differs from REST in how it handles CRUD operations by allowing clients to request only the data they 
need, reducing over-fetching and under-fetching issues common in REST APIs. Unlike REST, which relies on multiple 
endpoints for different resources, GraphQL uses a single endpoint (/graphql) and enables clients to specify exactly 
what data they require. This makes it more flexible and efficient, especially for complex applications. Additionally, 
GraphQL eliminates the need for API versioning, as changes can be managed within the schema itself. While REST requires 
multiple requests to fetch related data, 
GraphQL allows for batch requests, retrieving multiple resources in a
single query, improving performance and reducing network overhead.
