## Endpoints
(These might change as the project develops)

- POST /login 
- POST /register
- PUT /edit -> edit profile details
- GET /home -> The base directory
- POST /create -> create folder
- PUT /update -> update folder name
- DELETE /delete -> Delete folder (cascade delete all its contents as well)
- POST /upload -> Upload file in current folder
- DELETE /delete-file -> Delete file
- GET /folder/folderId -> Get the contents of a particular folder [need to see how to send a folder and its parents in a single response]