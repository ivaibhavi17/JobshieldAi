interface ErrorBannerProps {
  children: string
}

function ErrorBanner({ children }: ErrorBannerProps) {
  return <div className="inline-notice inline-notice--error" role="alert">{children}</div>
}

export default ErrorBanner
