# Style at Home - Luxury E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js 15, featuring luxury fashion products, advanced admin management, and secure payment processing.

## 🚀 Features

### Core E-commerce
- **Product Management**: Full CRUD operations with CSV import/export
- **Shopping Cart**: Persistent cart with local storage
- **User Authentication**: NextAuth.js with email/password
- **Order Management**: Complete order lifecycle tracking
- **Admin Dashboard**: Advanced analytics and management tools

### Payment Processing
- **Stripe Integration**: Secure payment processing
- **Checkout Flow**: Streamlined checkout experience
- **Webhook Handling**: Real-time payment status updates
- **Order Confirmation**: Automatic order creation on payment success

### SEO & Performance
- **Dynamic Sitemap**: Auto-generated XML sitemap
- **Meta Tags**: Open Graph and Twitter Card support
- **Robots.txt**: Search engine optimization
- **Image Optimization**: Next.js Image component with lazy loading
- **Performance**: Optimized for Core Web Vitals

### Admin Features
- **Advanced Product Manager**: Bulk operations, variants, inventory
- **Analytics Dashboard**: Sales metrics and user insights
- **User Management**: Customer account administration
- **Order Processing**: Status updates and fulfillment tracking

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **State Management**: Zustand
- **Database**: MongoDB Atlas

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd style-at-home
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   
   # NextAuth
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   
   # Stripe (see STRIPE_SETUP.md)
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Set up Stripe** (see `STRIPE_SETUP.md` for detailed instructions)

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

```
style-at-home/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin panel
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Payment flow
│   ├── product/           # Product pages
│   └── shop/              # Product catalog
├── components/            # Reusable components
├── lib/                   # Utilities and configurations
├── models/                # Mongoose schemas
├── public/                # Static assets
└── types/                 # TypeScript definitions
```

## 💳 Payment Setup

The platform uses Stripe for secure payment processing. Follow the detailed setup guide in `STRIPE_SETUP.md` to:

1. Create a Stripe account
2. Configure API keys
3. Set up webhooks
4. Test the integration
5. Deploy to production

## 🔍 SEO Features

- **Dynamic Metadata**: Product-specific meta tags
- **Sitemap Generation**: Auto-updated XML sitemap
- **Open Graph**: Social media sharing optimization
- **Structured Data**: Product schema markup
- **Performance**: Optimized loading and Core Web Vitals

## 📊 Admin Dashboard

Access the admin panel at `/admin` with admin credentials:

- **Products**: Advanced product management with bulk operations
- **Orders**: Order processing and status management
- **Users**: Customer account administration
- **Analytics**: Sales metrics and business insights

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- Set up MongoDB Atlas for database
- Configure Stripe webhooks for production
- Update environment variables
- Build and deploy

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data

### Database Management
- Products are stored in MongoDB with full CRUD operations
- Orders are created automatically via Stripe webhooks
- User sessions are managed by NextAuth.js

## 📈 Business Value

This platform provides:

- **Revenue Ready**: Complete payment processing
- **SEO Optimized**: Search engine visibility
- **Scalable**: Built for growth
- **Professional**: Enterprise-grade features
- **Secure**: Industry-standard security practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the setup guides
- Open an issue on GitHub

---

**Built with ❤️ using Next.js 15 and modern web technologies**
