import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary — catches rendering errors in the component tree
 * and displays a graceful fallback UI instead of a blank screen.
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in development; in production, send to an error service
    if (import.meta.env.DEV) {
      console.error('[Sahaay Error Boundary]', error, errorInfo);
    }
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: '100vh',
            background: '#050812',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'Inter, sans-serif',
            color: '#E2E8F0',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(255,77,109,0.1)',
              border: '1px solid rgba(255,77,109,0.3)',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
            <h1
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #00F5D4, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Something went wrong
            </h1>
            <p style={{ opacity: 0.6, marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Sahaay encountered an unexpected error. Your data is safe — please reload and try again.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  opacity: 0.7,
                }}
              >
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  Error details (dev mode)
                </summary>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              style={{
                background: 'linear-gradient(135deg, #00F5D4, #7C3AED)',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 2rem',
                color: '#050812',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                marginRight: '1rem',
              }}
              aria-label="Try again — reset the application"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                padding: '0.75rem 2rem',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
              aria-label="Reload the entire page"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
