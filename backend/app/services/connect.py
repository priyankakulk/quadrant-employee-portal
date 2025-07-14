import pyodbc

server = 'gateway-server-db.database.windows.net'
database = 'gatewayDB'
username = 'gateway'
password = 'sql#12345'
driver = '{ODBC Driver 18 for SQL Server}'

def get_connection():
    conn_str = (
        f"Driver={driver};"
        f"Server=tcp:{server},1433;"
        f"Database={database};"
        f"Uid={username};"
        f"Pwd={password};"
        f"Encrypt=yes;"
        f"TrustServerCertificate=no;"
        f"Connection Timeout=30;"
    )
    return pyodbc.connect(conn_str)