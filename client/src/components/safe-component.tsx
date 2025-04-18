import React from 'react';

// This component ensures that a component that might return null always returns a React element
export function SafeComponent({ component: Component }: { component: () => React.ReactNode }) {
  const content = Component();
  return content ? <>{content}</> : <></>;
}