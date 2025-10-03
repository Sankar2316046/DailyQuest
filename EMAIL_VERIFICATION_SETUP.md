# Email Verification Setup Guide

## 🚀 **Email Verification Flow Implemented**

Your app now has a complete email verification flow:

1. **User signs up** → Modal appears asking to check email
2. **User clicks verification link** → Redirected to `/verify` page
3. **Email verified** → User data inserted, redirected to `/landing` page

## 🔧 **Supabase Configuration Required**

### **Step 1: Configure Site URL**
In your Supabase Dashboard:
1. Go to **Authentication → Settings**
2. Set **Site URL** to: `http://localhost:3000` (for development)
3. For production, set to your actual domain

### **Step 2: Configure Redirect URLs**
In the same Authentication Settings:
1. Add these redirect URLs:
   - `http://localhost:3000/verify` (development)
   - `http://localhost:3000/auth/callback` (optional)
   - Your production domain equivalents

### **Step 3: Enable Email Confirmations**
Make sure **Enable email confirmations** is turned ON in Authentication Settings.

### **Step 4: Email Templates (Optional)**
You can customize the email templates in **Authentication → Email Templates**.

## 🧪 **Testing the Flow**

1. **Sign up** with a real email address
2. **Check your email** for the verification link
3. **Click the link** - should redirect to `/verify` page
4. **After verification** - should redirect to `/landing` page
5. **Try creating categories** - should work now!

## 📋 **Features Added**

✅ **Email Verification Modal** - Appears after signup
✅ **Resend Email Functionality** - Users can request new verification email
✅ **Verification Page** - Handles email verification process
✅ **Auto-redirect** - To landing page after successful verification
✅ **User Data Insertion** - Automatically adds user to database after verification
✅ **Error Handling** - Proper error messages and fallbacks

## 🚨 **Important Notes**

- **Email verification is required** for security
- **Users cannot access dashboard** until email is verified
- **User data is inserted** into `users` table only after verification
- **Test with real emails** as email providers may block test emails

## 🐛 **Troubleshooting**

### **"Invalid verification link"**
- Check that the verification URL is correct
- Make sure you're clicking the link from the email

### **"User not found after verification"**
- Check that your `users` table exists
- Verify RLS policies allow user insertion

### **"Redirect not working"**
- Check browser console for errors
- Verify the `/landing` page exists

The email verification flow is now fully implemented and ready to use! 🎉
