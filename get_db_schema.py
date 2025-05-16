import psycopg2
import os

# Use the DATABASE_URL from the environment variable or paste it directly
DATABASE_URL = "postgresql://postgres.jxqvqaeeszhcwffykaky:admin4521@aws-0-us-east-2.pooler.supabase.com:6543/postgres"

def get_db_schema(conn_url):
    """Connects to the PostgreSQL database and fetches schema information."""
    schema_info = {}
    try:
        conn = psycopg2.connect(conn_url)
        cur = conn.cursor()

        # Get all tables in the public schema
        cur.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)
        tables = [row[0] for row in cur.fetchall()]

        for table_name in tables:
            schema_info[table_name] = {'columns': [], 'primary_keys': [], 'foreign_keys': []}

            # Get columns for the current table
            cur.execute("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = %s
                ORDER BY ordinal_position;
            """, (table_name,))
            columns = cur.fetchall()
            for col in columns:
                schema_info[table_name]['columns'].append({
                    'name': col[0],
                    'type': col[1],
                    'is_nullable': col[2] == 'YES',
                    'default': col[3]
                })

            # Get primary keys for the current table
            cur.execute("""
                SELECT kcu.column_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                    AND tc.table_schema = kcu.table_schema
                WHERE tc.constraint_type = 'PRIMARY KEY'
                  AND tc.table_schema = 'public'
                  AND tc.table_name = %s;
            """, (table_name,))
            pk_columns = [row[0] for row in cur.fetchall()]
            schema_info[table_name]['primary_keys'] = pk_columns

            # Get foreign keys for the current table
            cur.execute("""
                SELECT
                    kcu.column_name,
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                    AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage ccu
                    ON tc.constraint_name = ccu.constraint_name
                    AND tc.table_schema = ccu.table_schema
                WHERE tc.constraint_type = 'FOREIGN KEY'
                  AND tc.table_schema = 'public'
                  AND tc.table_name = %s;
            """, (table_name,))
            fk_info = cur.fetchall()
            for fk in fk_info:
                schema_info[table_name]['foreign_keys'].append({
                    'column': fk[0],
                    'references_table': fk[1],
                    'references_column': fk[2]
                })
        
        cur.close()
        conn.close()
        return schema_info

    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

def print_schema_info(schema):
    if not schema:
        print("Could not retrieve schema information.")
        return

    for table_name, details in schema.items():
        print(f"\n--- Table: {table_name} ---")
        
        print("\n  Columns:")
        for col in details['columns']:
            default_val = f" (Default: {col['default']})" if col['default'] else ""
            nullable_info = "NULL" if col['is_nullable'] else "NOT NULL"
            print(f"    - {col['name']}: {col['type']} {nullable_info}{default_val}")
            
        if details['primary_keys']:
            print(f"\n  Primary Key(s): {', '.join(details['primary_keys'])}")
        
        if details['foreign_keys']:
            print("\n  Foreign Keys:")
            for fk in details['foreign_keys']:
                print(f"    - {fk['column']} -> {fk['references_table']}({fk['references_column']})")
        print("--- End of Table ---")

if __name__ == "__main__":
    retrieved_schema = get_db_schema(DATABASE_URL)
    if retrieved_schema:
        print_schema_info(retrieved_schema)
        print("\n\nComparison with Drizzle schema in 'server/db/schema.ts' can now be performed.")
    else:
        print("Failed to retrieve schema from the database.")

