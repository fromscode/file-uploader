## Endpoints
(These might change as the project develops)

- POST /login 
    returns:
        1. 400 Bad Request (validation error)
        2. 401 if invalid username or password
        3. 200 otherwise in case of successfull login
- POST /register
    returns:
        1. 400 Bad Request (validation error)
        2. 409 Conflict (if username or email already exists)
        3. 201 Created (otherwise if successfull registration)
- PUT /edit -> edit profile details
- GET /home -> The base directory
- POST /create -> create folder
- PUT /update -> update folder name
- DELETE /delete -> Delete folder (cascade delete all its contents as well)
- POST /upload -> Upload file in current folder
- DELETE /delete-file -> Delete file
- GET /folder/folderId -> Get the contents of a particular folder [need to see how to send a folder and its parents in a single response]


## Current proposed db structure:

- USER (username, email, password)

- Folders (name, parent, user):
    parent is the parent folder,
    user is the foreign key linking a folder to its creator (All folders created by all users will be stored in a single table)
    a folder with no parent is the directory of a user

- Files (name, url, folder, user):
    folder is a foreign key linking a file to its parent folder
    user is a foreign key linking a file to the user who created it. (All file urls will be stored inside a single table)