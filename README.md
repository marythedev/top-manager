# top-manager

### Current environmental variables
1. MONGODB_URI = "mongodb+srv://uri"
3. USER_COLLECTION = "users"
4. EMPLOYEE_COLLECTION = "employees"
5. DEPARTMENT_COLLECTION = "departments"

For collections, keep a note that Mongoose automatically looks for the plural, lowercased version of your model name (models are in /models folder). Thus, for example, the model User is for the users collection in the database.