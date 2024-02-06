-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a function to create a table and a matching function dynamically
create or replace function create_table_and_search_function(table_name text) 
returns void language plpgsql as $$
declare
    create_table_sql text;
    create_function_sql text;
begin
    -- Construct the SQL to create a new table
    create_table_sql := format('create table %I ('
                               'id uuid primary key, '
                               'content text, '
                               'metadata jsonb, '
                               'embedding vector (1536));', 
                               table_name);
    -- Execute the create table SQL
    execute create_table_sql;

-- Corrected version of the create_function_sql assignment
create_function_sql := format('create or replace function match_%I_documents('
                              'query_embedding vector (1536), '
                              'filter jsonb default ''{}'' '
                              ') returns table ('
                              'id uuid, '
                              'content text, '
                              'metadata jsonb, '
                              'similarity float '
                              ') language plpgsql as $function$ '
                              'begin '
                              'return query select '
                              '%I.id, %I.content, %I.metadata, '
                              '1 - (%I.embedding <=> query_embedding) as similarity '
                              'from %I '
                              'where %I.metadata @> filter '
                              'order by %I.embedding <=> query_embedding; '
                              'end; $function$', 
                              table_name, table_name, table_name, table_name, table_name, table_name, table_name, table_name);

    -- Execute the create function SQL
    execute create_function_sql;
end;
$$;

-- Replace 'unitedhealthcare' with your desired table name
select create_table_and_search_function('unitedhealthcare');
select create_table_and_search_function('aetna');