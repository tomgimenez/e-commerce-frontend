# LoreVault - Fantasy Books E-Commerce Platform

## 📚 About the Market

LoreVault is a modern e-commerce platform specializing in fantasy literature. We offer an extensive collection of fantasy books spanning iconic franchises and beloved authors including:

- **Lord of the Rings & The Hobbit** by J.R.R. Tolkien
- **Harry Potter** series by J.K. Rowling
- **A Song of Ice and Fire** by George R.R. Martin
- **The Wheel of Time** by Robert Jordan
- **Percy Jackson** series by Rick Riordan
- **Mistborn** series by Brandon Sanderson
- **The Stormlight Archive** by Brandon Sanderson
- And many more fantasy classics and contemporary works

Our platform provides a seamless shopping experience with advanced filtering, product recommendations, secure payment processing, and an intuitive admin dashboard for inventory management.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A running backend API server

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce-frontend
   ```

2. **Set up environment variables**
   ```bash
   cp .env.template .env
   ```
   Update `.env` with your backend API URL and other configuration

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Verify backend connectivity**
   Ensure your backend API is running on the configured port before starting the development server

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: Custom hooks with Context API and Zustand
- **UI Components**: Shadcn/ui

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## 🌐 Deployment

### Prerequisites for Deployment

- Node.js runtime environment
- Access to your hosting platform (Vercel, Netlify, AWS, etc.)
- Environment variables configured for production

### Deployment Options

#### Option 1: Vercel (Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" and import your GitHub repository
   - Vercel automatically detects Vite and configures the build

3. **Configure environment variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add your `VITE_API_BASE_URL` and other required variables

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at a Vercel-generated URL

#### Option 2: Netlify

1. **Create a production build locally**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Or via GitHub**
   - Connect your GitHub repository in Netlify dashboard
   - Set build command: `npm run build`
   - Set publish directory: `dist`

#### Option 3: Docker Deployment

1. **Create a Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and push Docker image**
   ```bash
   docker build -t lorevault-frontend:latest .
   docker tag lorevault-frontend:latest <your-registry>/lorevault-frontend:latest
   docker push <your-registry>/lorevault-frontend:latest
   ```

3. **Deploy to Docker hosting** (AWS ECS, Google Cloud Run, etc.)

#### Option 4: Traditional Server Deployment (AWS EC2, DigitalOcean, etc.)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload files to server**
   ```bash
   scp -r dist/* user@server:/var/www/lorevault/
   ```

3. **Configure web server** (Nginx example)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/lorevault;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Start/reload web server**
   ```bash
   sudo systemctl restart nginx
   ```

### Environment Variables for Production

Ensure these variables are set in your production environment:

```
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_APP_NAME=LoreVault
```

### Health Checks

After deployment, verify your application:

- Test the homepage: `https://yourdomain.com`
- Check admin dashboard access: `https://yourdomain.com/admin`
- Verify API connectivity by loading products
- Test authentication and checkout flow

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

For feature requests or bug reports, please create an issue in the repository.