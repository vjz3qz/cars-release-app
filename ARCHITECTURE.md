## Database Schema Overview

### Users Table

- **user_id** (Primary Key): Unique identifier for each user.
- **email**: User's email address.
- **password_hash**: Hashed password for security.
- **first_name**: User's first name.
- **last_name**: User's last name.
- **recommending_preceptor_id** (Foreign Key): User ID of the preceptor who recommended this user.
- **crew**: The crew to which this user belongs.
- **role_id** (Foreign Key): Links to the Roles table to identify the user's role.

### Roles Table

- **role_id** (Primary Key): Unique identifier for each role.
- **role_name**: Name of the role (e.g., observer, collector, released, preceptor, admin/CRAT).

### Checklists Table

- **checklist_id** (Primary Key): Unique identifier for each checklist.
- **title**: Title or name of the checklist.
- **description**: Brief description of the checklist.

### Checklist Items Table

- **checklist_id** (Foreign Key): Links to the Checklists table.
- **item_name**: Name of the item in the checklist.
- **item_description**: Description of the item.
- **times_to_complete**: Number of times the item needs to be completed.
- **additional_data_required**: Any additional data required for the item (e.g., vitals, notes, files, etc.).

### Checklist Signoffs Table

- **item_id** (Primary Key): Unique identifier for each checklist signoff.
- **completion_status**: Whether the item is completed (boolean or enum: completed, not completed).
- **completion_date**: Date when the item was completed.
- **user_id** (Foreign Key): The user ID of the provider who is getting signed off on the item.
- **signee_user_id** (Foreign Key): User ID of the user who completed or signed off on the item.
- **additional_data**: JSON, Nullable. Any additional data required for the item (e.g., vitals, notes, files, etc.).

## API Endpoints

### Users

- **GET /users**: Get all users.
- **GET /users/:id**: Get user by ID.
- **POST /users**: Create a new user.
- **PUT /users/:id**: Update user by ID.
- **DELETE /users/:id**: Delete user by ID.

### Roles

- **GET /roles**: Get all roles.
- **GET /roles/:id**: Get role by ID.
- **POST /roles**: Create a new role.
- **PUT /roles/:id**: Update role by ID.
- **DELETE /roles/:id**: Delete role by ID.

### Checklists

- **GET /checklists**: Get all checklists.
- **GET /checklists/:id**: Get checklist by ID.
- **POST /checklists**: Create a new checklist.
- **PUT /checklists/:id**: Update checklist by ID.
- **DELETE /checklists/:id**: Delete checklist by ID.

### Checklist Items

- **GET /checklist-items**: Get all checklist items.
- **GET /checklist-items/:id**: Get checklist item by ID.
- **GET /checklist-items/checklist/:id**: Get all checklist items for a specific checklist.
- **POST /checklist-items**: Create a new checklist item.
- **PUT /checklist-items/:id**: Update checklist item by ID.
- **DELETE /checklist-items/:id**: Delete checklist item by ID.

### Checklist Signoffs

- **GET /checklist-signoffs**: Get all checklist signoffs.
- **GET /checklist-signoffs/:id**: Get checklist signoff by ID.
- **GET /checklist-signoffs/checklist/user/:id**: Get all checklist signoffs for a specific checklist for a user.
- **POST /checklist-signoffs**: Create a new checklist signoff.
- **PUT /checklist-signoffs/:id**: Update checklist signoff by ID.
- **DELETE /checklist-signoffs/:id**: Delete checklist signoff by ID.

LATER

Quizzes, files, evals, worksheets, etc.
