# 🌐 Hosting Guide - Agile Quiz

This guide will help you host your quiz online so anyone can access it via a URL and QR code.

## 🎯 Best Option: GitHub Pages (100% Free)

GitHub Pages is the easiest and most reliable free hosting option.

### Step-by-Step Instructions

#### 1. Create a GitHub Account
- Go to [github.com](https://github.com)
- Sign up for a free account if you don't have one

#### 2. Create a New Repository
- Click the "+" icon in the top right
- Select "New repository"
- Name it `agile-quiz` (or any name you prefer)
- Make it **Public**
- Don't initialize with README (we already have one)
- Click "Create repository"

#### 3. Upload Your Files

**Option A: Using Git (Command Line)**

Open PowerShell in the `agile-quiz` folder and run:

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Agile Quiz Game"

# Rename branch to main
git branch -M main

# Add your GitHub repository (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/agile-quiz.git

# Push to GitHub
git push -u origin main
```

**Option B: Using GitHub Website (No Command Line)**

1. Go to your new repository on GitHub
2. Click "uploading an existing file"
3. Drag and drop all files from the `agile-quiz` folder
4. Click "Commit changes"

#### 4. Enable GitHub Pages

1. In your repository, click **Settings**
2. Scroll down to **Pages** (in the left sidebar)
3. Under "Source", select **main** branch
4. Click **Save**
5. Wait 1-2 minutes for deployment

#### 5. Get Your URL

Your quiz will be live at:
```
https://YOUR-USERNAME.github.io/agile-quiz/
```

The QR code will automatically update to point to this URL!

---

## 🚀 Alternative: Netlify (Easiest - No Git Required)

Perfect if you don't want to use Git.

### Step-by-Step Instructions

1. **Go to Netlify**
   - Visit [netlify.com](https://www.netlify.com/)
   - Click "Sign up" (you can use GitHub, GitLab, or email)

2. **Deploy Your Site**
   - After signing in, you'll see "Add new site"
   - Select "Deploy manually"
   - Drag and drop the entire `agile-quiz` folder
   - Wait 10-30 seconds

3. **Get Your URL**
   - Netlify will give you a random URL like: `https://random-name-12345.netlify.app`
   - You can customize this in Site Settings → Domain Management

4. **Custom Domain (Optional)**
   - Click "Domain settings"
   - Click "Options" → "Edit site name"
   - Change to something like: `agile-quiz-2026.netlify.app`

---

## ⚡ Alternative: Vercel (Fast & Professional)

Great for developers who want advanced features.

### Step-by-Step Instructions

1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Navigate to Your Quiz Folder**
   ```powershell
   cd C:\Users\STAR\.gemini\antigravity\scratch\agile-quiz
   ```

3. **Deploy**
   ```powershell
   vercel
   ```

4. **Follow the Prompts**
   - Login/Sign up when prompted
   - Confirm the settings
   - Your site will be deployed instantly!

5. **Get Your URL**
   - Vercel will show you the URL
   - It will look like: `https://agile-quiz.vercel.app`

---

## 🌊 Alternative: Surge.sh (Super Simple CLI)

Fastest deployment via command line.

### Step-by-Step Instructions

1. **Install Surge**
   ```powershell
   npm install -g surge
   ```

2. **Navigate to Your Quiz Folder**
   ```powershell
   cd C:\Users\STAR\.gemini\antigravity\scratch\agile-quiz
   ```

3. **Deploy**
   ```powershell
   surge
   ```

4. **Follow the Prompts**
   - Create an account (email + password)
   - Confirm the folder path
   - Choose a domain (or use the suggested one)

5. **Get Your URL**
   - Surge will show you the URL
   - It will look like: `https://agile-quiz.surge.sh`

---

## 📱 Testing Your Hosted Quiz

After hosting, test these features:

1. ✅ Open the URL in your browser
2. ✅ Check that the QR code appears on the welcome screen
3. ✅ Scan the QR code with your phone - it should open the quiz
4. ✅ Complete the quiz and verify the score displays correctly
5. ✅ Try the share button to share your results
6. ✅ Test on different devices (phone, tablet, desktop)

---

## 🎨 Updating Your Hosted Quiz

### For GitHub Pages
```powershell
# Make your changes to the files
git add .
git commit -m "Updated quiz questions"
git push
# Wait 1-2 minutes for changes to appear
```

### For Netlify (Manual Deploy)
- Just drag and drop the updated folder again
- It will replace the old version

### For Vercel
```powershell
vercel --prod
```

### For Surge
```powershell
surge
```

---

## 🔗 Sharing Your Quiz

Once hosted, you can share your quiz by:

1. **Direct Link** - Send the URL via email, chat, social media
2. **QR Code** - The quiz generates its own QR code automatically
3. **Embed** - Add it to your website with an iframe:
   ```html
   <iframe src="https://your-quiz-url.com" width="100%" height="800px"></iframe>
   ```

---

## 💡 Pro Tips

1. **Custom Domain** - Most platforms let you add a custom domain (e.g., `quiz.yourdomain.com`)
2. **Analytics** - Add Google Analytics to track how many people take your quiz
3. **HTTPS** - All these platforms provide free HTTPS automatically
4. **Performance** - Your quiz loads instantly because it's just HTML/CSS/JS
5. **No Costs** - All these options are 100% free for static sites

---

## 🆘 Troubleshooting

**QR Code not showing?**
- Make sure you have an internet connection (it uses an external API)
- Check the browser console for errors

**Quiz not working after hosting?**
- Clear your browser cache
- Check that all files (HTML, CSS, JS) were uploaded
- Open browser developer tools to check for errors

**Changes not appearing?**
- Wait a few minutes for deployment
- Clear browser cache (Ctrl + Shift + R)
- Try incognito/private mode

---

## 🎉 You're Done!

Your quiz is now live and accessible to anyone in the world! Share the URL and let people test their Agile knowledge! 🚀

---

**Need Help?** Check the platform-specific documentation:
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Surge Docs](https://surge.sh/help/)
