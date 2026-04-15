import { Component } from 'react';
import { LIGHT_COLORS } from '../constants/theme';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error.message || 'An unexpected error occurred');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: LIGHT_COLORS.red }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Error</div>
          <div style={{ fontSize: 13, color: LIGHT_COLORS.textSub }}>Something went wrong. Please try refreshing the page.</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
