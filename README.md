# top-manager

### Environmental variables
1. MONGODB_URI = mongodb+srv://uri
2. USER_COLLECTION = users
3. TASK_COLLECTION = tasks
4. PROJECT_COLLECTION = projects

For collections, keep a note that Mongoose automatically looks for the plural, lowercased version of your model name (models are in /models folder). Thus, for example, the model User is for the users collection in the database.