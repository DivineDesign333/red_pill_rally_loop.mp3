# Contributing to Deployment Dashboard

Thank you for your interest in contributing to the Deployment Dashboard!

## How to Contribute

### Reporting Issues
- Use the GitHub Issues tab to report bugs or request features
- Provide detailed information about the issue
- Include steps to reproduce if reporting a bug

### Making Changes

1. **Fork the Repository**
   ```bash
   git clone https://github.com/DivineDesign333/red_pill_rally_loop.mp3.git
   cd red_pill_rally_loop.mp3
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow existing code style
   - Test your changes locally
   - Update documentation if needed

4. **Test Locally**
   ```bash
   cd dashboard
   python3 -m http.server 8000
   # Open http://localhost:8000 in browser
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Include ARIA labels for accessibility
- Keep inline styles minimal (prefer CSS files)

### CSS
- Use meaningful class names
- Follow BEM naming convention when possible
- Ensure responsive design

### JavaScript
- Use ES6+ features
- Add comments for complex logic
- Handle errors gracefully

## Testing

Before submitting a PR:
1. Test dashboard locally
2. Verify responsive design (mobile, tablet, desktop)
3. Check browser console for errors
4. Test with both light and dark mode

## Documentation

Update documentation when:
- Adding new features
- Changing configuration
- Modifying API endpoints
- Updating deployment process

Files to update:
- `README.md` - Main project documentation
- `SETUP_GUIDE.md` - Setup instructions
- `DEPLOYMENT.md` - Deployment procedures
- `dashboard/README.md` - Dashboard-specific docs

## Pull Request Process

1. Ensure your PR has a clear title and description
2. Reference any related issues
3. Include screenshots for UI changes
4. Wait for review and address feedback
5. PR will be merged once approved

## Questions?

Feel free to open an issue for:
- Questions about the code
- Clarification on features
- Help with setup

Thank you for contributing! 🚀
