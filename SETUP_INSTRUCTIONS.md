# Byte2Bite Setup Instructions for Collaborators

## 🚀 Quick Setup Guide

### 1. Get Your Own OpenAI API Key

**Don't use someone else's API key!** Get your own free API key:

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-`)

**Note:** OpenAI gives you free credits when you sign up, so you can test the system without paying.

### 2. Set Up Environment Variables

1. Navigate to `backend/mysite/api/`
2. Copy the example file:
   ```bash
   cp env.example .env
   ```
3. Edit the `.env` file and add your API key:
   ```bash
   OPENAI_API_KEY=sk-your_actual_api_key_here
   ```

### 3. Install Dependencies

**Backend:**

```bash
cd backend/mysite

# If you have a virtual environment, activate it first:
source ../../venv/bin/activate  # On macOS/Linux
# or
# venv\Scripts\activate  # On Windows

# Install dependencies:
pip install -r requirements.txt

# If requirements.txt doesn't exist, install manually:
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-dotenv requests openpyxl pandas
```

**Frontend:**

```bash
cd frontend
npm install
```

### 4. Run Database Migrations

```bash
cd backend/mysite

# Make sure virtual environment is activated:
source ../../venv/bin/activate  # On macOS/Linux
# or
# venv\Scripts\activate  # On Windows

python manage.py makemigrations
python manage.py migrate
```

### 5. Start the Servers

**Backend (Terminal 1):**

```bash
cd backend/mysite
python manage.py runserver
```

**Frontend (Terminal 2):**

```bash
cd frontend
npm run dev
```

### 6. Test the System

1. Open http://localhost:3000
2. Create a business account
3. Upload an image to test inventory detection
4. Check that the API key is working

## 🔧 Troubleshooting

### API Key Issues

- **Error:** "OpenAI API key not configured"

  - **Solution:** Make sure your `.env` file is in `backend/mysite/api/` and contains your API key

- **Error:** "Insufficient funds" or "Invalid API key"
  - **Solution:** Check your OpenAI account balance and verify the API key

### Database Issues

- **Error:** "No module named 'rest_framework'"

  - **Solution:** Install Django REST framework: `pip install djangorestframework`

- **Error:** "No module named 'openpyxl'"

  - **Solution:** Install openpyxl: `pip install openpyxl pandas`

- **Error:** Migration issues
  - **Solution:** Delete `db.sqlite3` and run migrations again

### Virtual Environment Issues

- **Error:** "No module named 'django'"

  - **Solution:** Make sure your virtual environment is activated before installing packages

- **Error:** "Command not found: python"
  - **Solution:** Use `python3` instead of `python` on some systems

### Frontend Issues

- **Error:** "Module not found"
  - **Solution:** Run `npm install` in the frontend directory

## 📋 What You Need

### Required Accounts

- [OpenAI Account](https://platform.openai.com/signup) (Free)
- GitHub account (if cloning from repo)

### Required Software

- Python 3.8+
- Node.js 16+
- Git

### API Limits

- OpenAI free tier: $5 credit (usually enough for testing)
- Rate limits: Check OpenAI dashboard for current limits

## 🔒 Security Notes

- **Never commit your `.env` file** to version control
- **Never share your API key** with others
- **Use environment variables** for all sensitive data
- **Check your OpenAI usage** regularly to avoid unexpected charges

## 📞 Getting Help

If you encounter issues:

1. Check the error messages carefully
2. Verify your API key is correct
3. Ensure all dependencies are installed
4. Check that both servers are running
5. Look at the browser console for frontend errors
6. Make sure your virtual environment is activated

## 🎯 Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can create a business account
- [ ] Can log in successfully
- [ ] Can upload an image for analysis
- [ ] Inventory items are created/updated
- [ ] Can generate inventory reports
- [ ] Can download Excel files

## 🐛 Common Issues & Solutions

### "ModuleNotFoundError: No module named 'openpyxl'"

```bash
# Solution: Install the missing package
pip install openpyxl pandas
```

### "No module named 'rest_framework'"

```bash
# Solution: Install Django REST framework
pip install djangorestframework
```

### "Command not found: python"

```bash
# Solution: Use python3 instead
python3 manage.py runserver
```

### "Permission denied" when activating venv

```bash
# Solution: Check if virtual environment exists
ls -la ../../venv/bin/activate
# If it doesn't exist, create it:
python3 -m venv ../../venv
```

---

**Remember:** Each person should use their own API key. This keeps costs separate and maintains security!
