import pyodbc

# Replace the placeholders with your actual info
server = '<your-sql-endpoint>.sql.azuresynapse.net'
database = '<your-database>'
username = '<your-username>'
password = '<your-password>'

# Build the connection string
conn_str = (
    "Driver={ODBC Driver 17 for SQL Server};"
    f"Server=tcp:{server},1433;"
    f"Database={database};"
    "Encrypt=yes;"
    "TrustServerCertificate=no;"
    "Authentication=ActiveDirectoryPassword;"
    f"UID={username};"
    f"PWD={password};"
)

try:
    # Create the connection
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()

    # Test query
    cursor.execute("SELECT TOP 5 name FROM sys.tables")
    rows = cursor.fetchall()

    for row in rows:
        print(row)

    cursor.close()
    conn.close()
    print("Connection successful!")

except Exception as e:
    print("Error:", e)
