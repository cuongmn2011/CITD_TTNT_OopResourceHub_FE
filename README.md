# OOP Resource Hub - React Version

Modern React.js web application for learning Object-Oriented Programming concepts and resources. Converted from vanilla HTML/CSS/JS to Next.js with React 18.

## 🚀 Features

- **Sidebar Navigation** - Collapsible categories with nested topics
- **Search Modal** - Global search with fuzzy matching and keyboard shortcuts (Ctrl+K)
- **Font Awesome Icons** - Professional iconography throughout the interface
- **Syntax Highlighting** - Code snippets with highlight.js
- **Responsive Design** - Tailwind CSS with mobile-first approach
- **API Integration** - RESTful API communication with error handling

## 🛠 Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome 6
- **Code Highlighting**: highlight.js
- **HTTP Client**: Axios
- **Language**: JavaScript (ES6+)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Backend API server running on `http://127.0.0.1:8000`

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🏗 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind
│   ├── layout.js            # Root layout component  
│   └── page.js              # Main application page
├── components/
│   ├── Sidebar.js           # Navigation sidebar
│   ├── MainContent.js       # Content display area
│   ├── SectionCard.js       # Individual section cards
│   └── SearchModal.js       # Global search modal
├── hooks/
│   ├── useAppData.js        # Data fetching and state
│   └── useSearch.js         # Search functionality
└── services/
    └── apiService.js        # API communication layer
```

## 🔌 API Integration

The app connects to a FastAPI backend serving OOP learning resources:

- **Categories**: `/api/v1/categories/`
- **Topics**: `/api/v1/topics/`  
- **Sections**: `/api/v1/sections/topic/{id}`

### API Configuration
Update `src/services/apiService.js` to change the API base URL:
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1'
```

## 🎨 Styling

Uses Tailwind CSS with custom design tokens:
- **Primary Color**: `#6366F1` (Indigo)
- **Sidebar**: Dark theme with `#0F172A` background
- **Typography**: Inter font family
- **Spacing**: Consistent 8px grid system

## 🔍 Search Features

- **Fuzzy Matching**: Finds "Kế thừa" when typing "keth"
- **Vietnamese Support**: Tone-insensitive search
- **Real-time Results**: 100ms debounced input
- **Grouped Results**: Categories, Topics, and Sections
- **Keyboard Navigation**: Arrow keys and Enter selection

## 🚦 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

## 🔧 Customization

### Adding New Components
1. Create component in `src/components/`
2. Export from component file
3. Import and use in pages or other components

### Styling Guidelines
- Use Tailwind utility classes
- Custom CSS in `globals.css` for complex styles
- Follow mobile-first responsive design
- Maintain consistent spacing and typography

## 🐛 Troubleshooting

### Common Issues

**API Connection Failed**
- Ensure backend server is running on port 8000
- Check CORS configuration in backend
- Verify network connectivity

**Build Errors**
- Clear `.next` folder and rebuild
- Check Node.js version compatibility
- Verify all dependencies are installed

**Search Not Working**
- Check browser console for errors
- Verify API data structure
- Test search hook functionality

## 📄 License

MIT License - feel free to use for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Submit pull request

---

**Original**: Vanilla HTML/CSS/JS OOP Resource Hub  
**Converted to**: Modern React.js with Next.js framework  
**Maintained**: All original functionality with improved UX