# Quick Startup
1. Clone the repo

2. Create virtual env and install dependencies
```bash
cd Event-Ticket-System
python -m venv venv
source venv/bin/activate
pip install flask flask-cors flask-sqlalchemy flask_jwt_extended python-dotenv passlib requests pymysql
```

3. Create Database in mysql named ``"event_ticketing"``
- Use the database structure from [tables.sql](Database/tables.sql)
- Use the sample data from [sampledata.sql](Database/sampledata.sql)

4. Make a .env file for your local database password in the root folder
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_ticketing

```

5. Start app

*linux*
```bash
export FLASK_APP=backend/app.py
flask run
```
*windows*
```powershell
$env:FLASK_APP = "backend/app,py"
flash run
```
