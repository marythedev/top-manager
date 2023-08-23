# Top-manager

### Environmental variables
1. MONGODB_URI = mongodb+srv://uri
2. USER_COLLECTION = users
3. TASK_COLLECTION = tasks
4. PROJECT_COLLECTION = projects
5. EMAIL=serve.email@email.com
6. PASSWORD=apppassfor"serve.email"
7. TO_EMAIL=support.email@email.com

For collections, keep a note that Mongoose automatically looks for the plural, lowercased version of your model name (models are in /models folder). Thus, for example, the model User is for the users collection in the database.

As for emails,
-EMAIL is the email that will send a Contact Us email to the support email address. Currently it's configured to also send a copy of the email to itself. For security reasons, it's better to create a separate email specifically for this reason.
-PASSWORD is the [app password](https://support.google.com/accounts/answer/185833?hl=en) of the EMAIL google account. It's needed for authorization to send emails from this app's contact form on behalf of EMAIL address.
-TO_EMAIL is the receiver email address. It could be configured to any address that will receive Contact Us support emails.