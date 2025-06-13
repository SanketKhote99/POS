# Shopping Cart Application

A modern React + Redux shopping cart application with special offers functionality, built with shadcn/ui components and proper Redux architecture.

## ✨ Enhanced Features

### 🏗️ **Better Redux Architecture**
- **Organized Store**: Separate slices for cart, UI, and products
- **Typed Selectors**: Custom hooks with TypeScript support
- **Granular Loading States**: Individual loading states per product and operation
- **Better State Management**: Cleaner action creators and reducers

### 🎯 **Improved Loading States**
- **Specific Button Loading**: Only the clicked button shows loading spinner
- **Other Buttons Disabled**: Non-active buttons are disabled during operations
- **Clear Visual Feedback**: Users know exactly which action is processing
- **No Confusion**: Eliminates uncertainty about which button was clicked

### 🔧 **Redux Store Structure**
\`\`\`
store/
├── store.ts              # Main store configuration
├── slices/
│   ├── cartSlice.ts      # Cart state and logic
│   ├── uiSlice.ts        # UI states and loading
│   └── productsSlice.ts  # Product management
└── hooks/
    ├── useAppDispatch.ts # Typed dispatch hook
    └── useAppSelector.ts # Typed selector hook
\`\`\`

### 🎨 **Component Architecture**
- **Separation of Concerns**: Each component has a single responsibility
- **Reusable Components**: Modular design for easy maintenance
- **Props Interface**: Clear TypeScript interfaces for all components
- **Custom Hooks**: Typed Redux hooks for better DX

## 🚀 **Key Improvements**

### 1. **Smart Loading States**
- ✅ Only clicked button shows loading spinner
- ✅ Other buttons are disabled but not loading
- ✅ Clear visual feedback for user actions
- ✅ No confusion about which operation is running

### 2. **Better Redux Organization**
- ✅ Separate slices for different concerns
- ✅ Typed selectors with custom hooks
- ✅ Action creators with proper typing
- ✅ Middleware configuration for better debugging

### 3. **Component Modularity**
- ✅ ProductList component for product display
- ✅ CartItemList component for cart items
- ✅ OrderSummary component for totals
- ✅ SpecialOffers component for offers display

### 4. **Enhanced User Experience**
- ✅ Toast notifications for all actions
- ✅ Skeleton loading for initial state
- ✅ Proper error handling with user feedback
- ✅ Responsive design with clean UI

## 🎯 **Special Offers (Unchanged)**

1. **Cheese BOGO**: Buy one cheese, get second free
2. **Soup + Bread**: Buy soup, get half price bread  
3. **Butter Discount**: Get 1/3 off butter

## 🧪 **Enhanced Testing**

- **Redux Slice Tests**: Comprehensive testing for all slices
- **Selector Tests**: Testing for all Redux selectors
- **Component Tests**: UI interaction testing
- **Loading State Tests**: Specific loading behavior testing

## 🚀 **Getting Started**

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests with coverage
npm test -- --coverage

# Build for production
npm run build
\`\`\`

## 📱 **Redux DevTools**

The application is configured with Redux DevTools for debugging:
- Time-travel debugging
- Action replay
- State inspection
- Performance monitoring

## 🔮 **Future Enhancements**

- **Persistence**: Redux Persist for cart state
- **Middleware**: Custom middleware for analytics
- **Async Actions**: Redux Thunk for API calls
- **Optimistic Updates**: Better UX with optimistic UI updates

## 📄 **License**

MIT License - Perfect for learning and production use!
