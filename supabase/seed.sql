-- Seed data for users table
INSERT INTO
    users (first_name, last_name, email, password, role_id)
VALUES
    (
        'M',
        'Johnson',
        'mjohnson@rescue1.org',
        'password789',
        1
    ),
    (
        'J',
        'Smith',
        'jsmith@rescue1.org',
        'password456',
        2
    ),
    ('R', 'Doe', 'rdoe@rescue1.org', 'password123', 3),
    (
        'P',
        'Anderson',
        'panderson@rescue1.org',
        'password456',
        4
    ),
    (
        'Varun',
        'Pasupuleti',
        'vpasupuleti@rescue1.org',
        'password123',
        5
    );

-- Seed data for roles table
INSERT INTO
    roles (name)
VALUES
    ('Observer'),
    ('Collector'),
    ('Released'),
    ('Preceptor'),
    ('Admin');

-- Seed data for checklists table
INSERT INTO
    checklists (title, details)
VALUES
    ('Checklist 1', 'Details for Checklist 1'),
    ('Checklist 2', 'Details for Checklist 2'),
    ('Checklist 3', 'Details for Checklist 3');

-- Seed data for checklist_items table
INSERT INTO
    checklist_items (
        name,
        details,
        times_to_complete,
        additional_details_required
    )
VALUES
    ('Item 1', 'Details for Item 1', 2, true),
    ('Item 2', 'Details for Item 2', 3, false),
    ('Item 3', 'Details for Item 3', 1, true);

-- Seed data for checklist_signoffs table
INSERT INTO
    checklist_signoffs (
        checklist_item_id,
        completion_status,
        user_id,
        signee_id,
        last_updated_at,
        additional_details
    )
VALUES
    (
        1,
        true,
        1,
        2,
        current_timestamp,
        '{"details": "Additional details for signoff 1"}'
    ),
    (
        2,
        false,
        3,
        4,
        current_timestamp,
        '{"details": "Additional details for signoff 2"}'
    ),
    (
        3,
        true,
        5,
        1,
        current_timestamp,
        '{"details": "Additional details for signoff 3"}'
    );