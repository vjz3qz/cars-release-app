begin;

select
    plan (5);

-- five statements to run
SELECT
    has_table ('users', 'users table should exist');

SELECT
    has_table ('roles', 'roles table should exist');

SELECT
    has_table ('checklists', 'checklists table should exist');

SELECT
    has_table (
        'checklist_items',
        'checklist_items table should exist'
    );

SELECT
    has_table (
        'checklist_signoffs',
        'checklist_signoffs table should exist'
    );

select
    *
from
    finish ();

rollback;